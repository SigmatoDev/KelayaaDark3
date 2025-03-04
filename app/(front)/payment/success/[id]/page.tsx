"use client";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { CircleCheckBigIcon } from "lucide-react";
import useCartService from "@/lib/hooks/useCartStore";
import useSWRMutation from "swr/mutation";

const SuccessPage = () => {
  const router = useRouter();
  const params = useParams();
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    clear,
  } = useCartService();
  const { paymentIntentId } = params;
  console.log("paymentIntentId", paymentIntentId);

  // Ref to prevent duplicate API calls
  const hasPlacedOrderRef = useRef(false);

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
          paymentIntentId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        clear();
        toast.success("Order placed successfully");
        return router.push(`/order/${data?.order?._id}`);
      } else {
        toast.error(data.message);
      }
    }
  );

  useEffect(() => {
    if (paymentIntentId && !hasPlacedOrderRef.current) {
      hasPlacedOrderRef.current = true; // Mark as called
      placeOrder();
    }
  }, [paymentIntentId, placeOrder]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <CircleCheckBigIcon className="text-green-500 text-6xl mb-6" />
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Thank you for your purchase! Your payment was processed successfully.
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
