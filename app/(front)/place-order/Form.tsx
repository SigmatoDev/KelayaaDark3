"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWRMutation from "swr/mutation";

import useLayoutService from "@/lib/hooks/useLayout";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import useCartService from "@/lib/hooks/useCartStore";
import { useSession } from "next-auth/react";
import { PencilIcon } from "lucide-react";

const Form = () => {
  const router = useRouter();
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    clear,
    setLastOrderId,
    paymentStatus,
    setPaymentStatus,
    gstDetails,
    personalInfo,
    totalPriceAfterCheckout,
  } = useCartService();
  const { data: session } = useSession();
  const { theme } = useLayoutService();

  // mutate data in the backend by calling trigger function
  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    `/api/orders/mine`,
    async (url) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod,
          shippingAddress,
          items,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          gstDetails, // ✅ Include GST details
          personalInfo, // ✅ Include personal info
          user: session?.user?.id,
        }),
      });

      const data = await res.json();
      console.log("orders", data);
      if (res.ok) {
        setLastOrderId(data?.order?._id);
        clear();
      } else {
        toast.error(data.message);
      }
    }
  );

  useEffect(() => {
    if (!paymentMethod) {
      return router.push("/payment");
    }
    if (items.length === 0) {
      return router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, router]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>Loading...</>;

  // Handle placing the order
  const handlePlaceOrder = async () => {
    // Reset the payment status before proceeding
    setPaymentStatus("pending");

    // Step 1: Redirect to the Stripe payment page
    router.push("/stripe"); // Adjust this route according to your Stripe page

    // Step 2: Poll for payment status and trigger the order placement only if successful
    const checkPaymentStatus = setInterval(() => {
      if (paymentStatus === "success") {
        console.log("success");
        // If payment was successful, place the order
        placeOrder(); // Trigger the order creation API call
        clearInterval(checkPaymentStatus); // Stop polling after success
      } else if (paymentStatus === "failed") {
        // Handle failed payment
        toast.error("Payment failed, please try again.");
        clearInterval(checkPaymentStatus); // Stop polling after failure
      }
    }, 2000); // Check payment status every 2 seconds

    // Cleanup interval when the component unmounts or payment status changes
    return () => clearInterval(checkPaymentStatus);
  };

  return (
    <div>
      <CheckoutSteps current={4} />

      <div className="my-4 grid md:grid-cols-4 md:gap-5">
        <div className="overflow-x-auto md:col-span-3">
          <div className="card shadow-md">
            <div className="card-body">
              <h2 className="card-title">Shipping Address</h2>
              <p>{`${shippingAddress.firstName} ${shippingAddress.lastName}`}</p>
              <p>
                {shippingAddress.streetAddress1}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}{" "}
              </p>
              <div>
                <Link className="btn" href="/shipping">
                  Edit
                </Link>
              </div>
            </div>
          </div>

          <div className="card mt-4 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Payment Method</h2>
              <p>{paymentMethod}</p>
              <div>
                <Link className="btn" href="/payment">
                  Edit
                </Link>
              </div>
            </div>
          </div>

          <div className="card mt-4 mb-3 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Items</h2>
              <table className="table">
                <thead>
                  <tr
                    className={`${theme === "dark" ? "text-orange-500" : ""}`}
                  >
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.productCode}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </td>
                      <td>
                        <span>{item.qty}</span>
                      </td>
                      <td>₹ {item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link
                  className="btn bg-gradient-to-r from-pink-500 to-red-500 text-white"
                  href="/cart"
                >
                 <PencilIcon className="w-5 h-5"/> Edit
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card shadow-md">
            <div className="card-body">
              <h2 className="card-title text-orange-500">Order Summary</h2>
              <ul className="space-y-3">
                <li>
                  <div className=" flex justify-between">
                    <div>Items Price</div>
                    <div>₹{totalPriceAfterCheckout}</div>
                  </div>
                </li>
                <li>
                  <div className=" flex justify-between">
                    <div>Tax</div>
                    <div>₹{taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className=" flex justify-between">
                    <div>Shipping</div>
                    <div>₹{shippingPrice}</div>
                  </div>
                </li>
                <hr />
                <li>
                  <div className=" flex justify-between">
                    <div>Grand Total</div>
                    <div className="text-green-500">₹{totalPrice}</div>
                  </div>
                </li>

                <li>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="w-full mt-6 py-3 text-[16px] rounded-md text-white font-semibold bg-gradient-to-r from-pink-500 to-red-500"
                  >
                    {isPlacing && (
                      <span className="loading loading-spinner"></span>
                    )}
                    Place Order
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
