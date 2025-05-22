"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import useCartService from "@/lib/hooks/useCartStore";
import { loadScript } from "@/lib/loadRazorpay";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { initiatePayment } from "@/app/actions/initiatePayment";
import Script from "next/script";

declare global {
  interface Window {
    PhonePeCheckout?: {
      transact: (tokenUrl: any) => void;
    };
  }
}

const Form = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [phonePeLoaded, setPhonePeLoaded] = useState(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "Razorpay" | "PhonePe" | "CashOnDelivery"
  >("Razorpay");

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
    router.push("/place-order");
  };

  const handleRazorpayPayment = async () => {
    try {
      const razorpayLoaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!razorpayLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Failed to create Razorpay order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalPrice * 100,
        currency: "INR",
        name: "Kelayaa Jewellery",
        description: "Thank you for shopping with us",
        order_id: data.order.id,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/checkout/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            savePaymentMethod("Razorpay");
            router.push(`/payment/success/${verifyData.paymentIntentId}`);
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: session?.user?.name,
          email: session?.user?.email,
          contact: session?.user?.mobileNumber,
        },
        theme: { color: "#EC4999" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      toast.error(error?.message || "Razorpay payment failed.");
    }
  };

  const handlePhonePePayment = async (): Promise<void> => {
    try {
      const res = await fetch("/api/phonepe/initiatePayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });

      const data: {
        fullResponse?: {
          orderId: string;
          state: string;
          redirectUrl: string;
          expireAt: number;
        };
        transactionId?: string;
      } = await res.json();

      const paymentRequest = data.fullResponse?.redirectUrl;

      if (!paymentRequest) {
        alert("Payment initiation failed: No redirect URL.");
        return;
      }

      if (!window.PhonePeCheckout) {
        alert("PhonePe SDK not loaded yet.");
        return;
      }
      // router.push(paymentRequest);
      // Call PhonePe SDK with redirect URL (token-based payment)
      window.PhonePeCheckout.transact({ tokenUrl: paymentRequest });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong during payment.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPaymentMethod === "CashOnDelivery") handleCOD();
    // else if (selectedPaymentMethod === "Razorpay") handleRazorpayPayment();
    else if (selectedPaymentMethod === "PhonePe") handlePhonePePayment();
  };

  return (
    <div>
      <Script
        src="https://mercury.phonepe.com/web/bundle/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setPhonePeLoaded(true)}
      />
      <CheckoutSteps current={2} />
      <div className="card mx-auto my-6 max-w-sm bg-[#eaeaea] shadow-md">
        <div className="card-body">
          <h1 className="card-title text-center mb-4">Choose Payment Method</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              {/* <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Razorpay"
                  checked={selectedPaymentMethod === "Razorpay"}
                  onChange={() => setSelectedPaymentMethod("Razorpay")}
                  className="radio radio-primary"
                />
                <span className="text-sm font-medium">
                  Pay Online (Razorpay)
                </span>
              </label> */}

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="PhonePe"
                  checked={selectedPaymentMethod === "PhonePe"}
                  onChange={() => setSelectedPaymentMethod("PhonePe")}
                  className="radio radio-primary"
                />
                <span className="font-medium text-sm">PhonePe UPI</span>
              </label>

              {/* COD option disabled but you can add back if needed */}
            </div>

            <button
              type="submit"
              disabled={!phonePeLoaded}
              className="btn bg-gradient-to-r from-pink-500 to-red-500 text-white w-full font-semibold"
            >
              {selectedPaymentMethod === "CashOnDelivery"
                ? "Place Order"
                : selectedPaymentMethod === "PhonePe"
                  ? "Pay with PhonePe"
                  : "Pay with PhonePe"}
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
