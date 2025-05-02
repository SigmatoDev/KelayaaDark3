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
  const [paymentResult, setPaymentResult] = useState(null); // Add state to store paymentResult

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

  const [isPlacing, setIsPlacing] = useState(true);

  const fetchPaymentDetails = async (paymentId: string) => {
    try {
      const res = await fetch(
        `/api/razorpay/payment-details?paymentId=${paymentId}`
      );
      const data = await res.json();
      return data?.payment || data;
    } catch (err) {
      console.error("Failed to fetch payment details:", err);
      return null;
    }
  };

  const { trigger: placeOrder } = useSWRMutation(
    `/api/orders`,
    async (url, { arg }: { arg: { paymentResult: any } }) => {
      const { paymentResult } = arg;

      if (!session?.user) {
        toast.error("User session not found.");
        return;
      }

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: session.user.id,
            status: "pending",
            items: items.map((item) => ({
              productId: item._id,
              name: item.name,
              slug: item.slug,
              image: item.image,
              price:
                item?.materialType === "Beads" ? item.pricePerLine : item.price,
              qty: item.qty,
            })),
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalAmount: totalPrice,
            shippingAddress,
            billingDetails: {
              sameAsShipping: true,
              ...shippingAddress,
            },
            gstDetails: {
              hasGST: gstDetails.hasGST ?? false,
              companyName: gstDetails.companyName || "",
              gstNumber: gstDetails.gstNumber || "",
            },
            paymentStatus: "completed",
            paymentMethod,
            paymentIntentId,
            paymentResult,
            personalInfo: {
              ...personalInfo,
              createAccountAfterCheckout: false,
            },
          }),
        });

        const data = await res.json();

        if (res.ok) {
          clear();
          setOrderId(data?.order?._id);
          toast.success("Order placed successfully!");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          toast.error(data.message || "Order failed");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong.");
      } finally {
        setIsPlacing(false);
      }
    }
  );

  useEffect(() => {
    let isMounted = true;

    const verifyAndPlaceOrder = async () => {
      if (
        !paymentIntentId ||
        hasPlacedOrderRef.current ||
        status !== "authenticated"
      )
        return;

      hasPlacedOrderRef.current = true; // Immediately block future calls

      const paymentDetails = await fetchPaymentDetails(paymentIntentId);

      if (paymentDetails?.status === "captured" && paymentDetails.captured) {
        const paymentResult = {
          id: paymentDetails.id,
          status: paymentDetails.status,
          email_address: paymentDetails.email,
        };

        await placeOrder({ paymentResult });
      } else {
        toast.error("Payment not verified. Please contact support.");
        if (isMounted) setIsPlacing(false);
      }
    };

    verifyAndPlaceOrder();

    return () => {
      isMounted = false; // cleanup to avoid state updates after unmount
    };
  }, [paymentIntentId, status]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-pink-100 px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center space-y-6 animate-fadeIn">
        {isPlacing ? (
          <>
            <div className="flex justify-center items-center">
              <GemIcon className="animate-pulse text-pink-400 w-16 h-16" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mt-4 animate-pulse">
              Verifying Your Precious Order...
            </h2>
            <p className="text-sm text-gray-500 animate-fadeIn">
              Our experts are carefully processing your jewellery checkout ✨
            </p>
          </>
        ) : (
          <>
            <SparklesIcon className="text-pink-400 w-16 h-16 mx-auto animate-bounce" />
            <h2 className="text-3xl font-extrabold text-pink-600 animate-fadeIn">
              Payment Successful!
            </h2>
            <p className="text-lg text-gray-700 animate-fadeIn">
              Thank you for trusting us. Your order has been placed with
              elegance.
            </p>

            <div className="flex flex-col gap-3 mt-6">
              {orderId && (
                <button
                  onClick={() => router.push(`/my-orders`)}
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
