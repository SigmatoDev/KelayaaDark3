"use client";

import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { GemIcon, SparklesIcon } from "lucide-react"; 
import useCartService from "@/lib/hooks/useCartStore";
import useSWRMutation from "swr/mutation";

const SuccessPage = () => {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession(); // ✅ Added status check

  const paymentIntentId = params?.paymentIntentId as string;
  const [orderId, setOrderId] = useState<string | null>(null);

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    clear,
    personalInfo,
    gstDetails,
  } = useCartService();

  const hasPlacedOrderRef = useRef(false);

  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    `/api/orders`,
    async (url) => {
      if (!session?.user?.id) {
        toast.error("User session not found. Please login again.");
        return;
      }

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: session.user.id,
            orderNumber: "ORDER_" + Date.now(),
            status: "pending",
            items: items.map((item) => ({
              product: item._id,
              name: item.name,
              slug: item.slug,
              image: item.image,
              price: item.price,
              qty: item.qty, // ✅ correct field now
            })),
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalAmount: totalPrice,
            shippingAddress,
            billingDetails: {
              sameAsShipping: true,
              firstName: shippingAddress.firstName,
              lastName: shippingAddress.lastName,
              address: shippingAddress.address,
              landmark: shippingAddress.landmark,
              country: shippingAddress.country,
              state: shippingAddress.state,
              city: shippingAddress.city,
              postalCode: shippingAddress.postalCode,
            },
            gstDetails: {
              hasGST: gstDetails.hasGST ?? false, // ✅ Default if not present
              companyName: gstDetails.companyName || "",
              gstNumber: gstDetails.gstNumber || "",
            },
            paymentStatus: "completed",
            paymentMethod,
            paymentIntentId,
            personalInfo: {
              email: personalInfo.email,
              mobileNumber: personalInfo.mobileNumber,
              createAccountAfterCheckout: false,
            },
          }),
        });

        const data = await res.json();

        if (res.ok) {
          clear();
          setOrderId(data?.order?._id);
          toast.success("Order placed successfully!");
        } else {
          console.error("Order Placement Error:", data);
          toast.error(data.message || "Order failed");
        }
      } catch (err: any) {
        console.error("API Error:", err.message);
        toast.error("Something went wrong. Please try again.");
      }
    }
  );

  useEffect(() => {
    if (paymentIntentId && !hasPlacedOrderRef.current && status === "authenticated") {
      hasPlacedOrderRef.current = true;
      placeOrder();
    }
  }, [paymentIntentId, placeOrder, status]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-pink-100 px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center space-y-6 animate-fadeIn">

        {isPlacing ? (
          <>
            <div className="flex justify-center items-center">
              <GemIcon className="animate-pulse text-pink-400 w-16 h-16" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mt-4 animate-pulse">Verifying Your Precious Order...</h2>
            <p className="text-sm text-gray-500 animate-fadeIn">
              Our experts are carefully processing your jewellery checkout ✨
            </p>
          </>
        ) : (
          <>
            <SparklesIcon className="text-pink-400 w-16 h-16 mx-auto animate-bounce" />
            <h2 className="text-3xl font-extrabold text-pink-600 animate-fadeIn">Payment Successful!</h2>
            <p className="text-lg text-gray-700 animate-fadeIn">
              Thank you for trusting us. Your order has been placed with elegance.
            </p>

            <div className="flex flex-col gap-3 mt-6">
              {orderId && (
                <button
                  onClick={() => router.push(`/order/${orderId}`)}
                  className="w-full py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold rounded-md hover:opacity-90 animate-fadeIn"
                >
                  View My Order
                </button>
              )}
              <button
                onClick={() => router.push("/")}
                className="w-full py-3 border border-rose-300 text-pink-400 font-semibold rounded-md hover:bg-rose-50 animate-fadeIn"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
