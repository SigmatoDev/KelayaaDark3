"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import useCartService from "@/lib/hooks/useCartStore";
import { loadScript } from "@/lib/loadRazorpay"; // we'll create this small helper below
import toast from "react-hot-toast";

const Form = () => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"Razorpay" | "CashOnDelivery">("Razorpay");

  const {
    savePaymentMethod,
    paymentMethod,
    shippingAddress,
    items,
    totalPrice,
  } = useCartService();

  useEffect(() => {
    if (!shippingAddress) {
      return router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod as any);
  }, [paymentMethod, router, shippingAddress]);

  const handleCOD = () => {
    savePaymentMethod("CashOnDelivery");
    router.push("/place-order"); // directly place order
  };

  const handleRazorpayPayment = async () => {
    try {
      // Load Razorpay script
      const razorpayLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!razorpayLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // Create Razorpay order from backend
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }), // amount in rupees
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error("Failed to create Razorpay order");
      }

      const { id: order_id } = data.order;

      const options: any = {
        key: "rzp_test_tvPxFRf40bmLkn", // Add NEXT_PUBLIC_ here
        amount: totalPrice * 100,
        currency: "INR",
        name: "Kelayaa Jewellery",
        description: "Thank you for shopping with us",
        order_id,
        handler: async function (response: any) {
          const paymentIntentId = response.razorpay_payment_id;
          savePaymentMethod("Razorpay");
          router.push(`/payment/success/${paymentIntentId}`);
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        notes: {
          platform: "Kelayaa",
        },
        theme: {
          color: "#EC4999",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error("Razorpay error:", error);
      toast.error(error?.message || "Something went wrong during Razorpay payment.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPaymentMethod === "CashOnDelivery") {
      handleCOD();
    } else if (selectedPaymentMethod === "Razorpay") {
      handleRazorpayPayment();
    }
  };

  return (
    <div>
      <CheckoutSteps current={2} />

      <div className="card mx-auto my-6 max-w-sm bg-base-300 shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-center mb-4">Choose Payment Method</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Razorpay"
                  checked={selectedPaymentMethod === "Razorpay"}
                  onChange={() => setSelectedPaymentMethod("Razorpay")}
                  className="radio radio-primary"
                />
                <span className="font-medium text-sm">Pay Online (Credit/Debit Card, UPI, NetBanking)</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="CashOnDelivery"
                  checked={selectedPaymentMethod === "CashOnDelivery"}
                  onChange={() => setSelectedPaymentMethod("CashOnDelivery")}
                  className="radio radio-primary"
                />
                <span className="font-medium text-sm">Cash on Delivery (COD)</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn bg-gradient-to-r from-pink-500 to-red-500 text-white w-full font-semibold"
            >
              {selectedPaymentMethod === "CashOnDelivery" ? "Place Order" : "Pay Now"}
            </button>

            <button
              type="button"
              className="btn w-full"
              onClick={() => router.back()}
            >
              Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
