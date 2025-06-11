"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRupeeSign, FaRedo, FaShoppingBag } from "react-icons/fa";

declare global {
  interface Window {
    PhonePeCheckout?: {
      transact: (tokenUrl: any) => void;
    };
  }
}

export default function RetryPaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [phonePeLoaded, setPhonePeLoaded] = useState(false);

  useEffect(() => {
    if (orderId) {
      axios
        .get(`/api/retry-order/${orderId}`)
        .then((res) => {
          setOrder(res.data.order);
        })
        .catch(() => {
          toast.error("Failed to fetch order.");
        })
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  const handlePhonePePayment = async (): Promise<void> => {
    try {
      const res = await fetch("/api/phonepe/initiatePayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: order.totalAmount }),
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

      window.PhonePeCheckout.transact({ tokenUrl: paymentRequest });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong during payment.");
    }
  };

  return (
    <>
      <Script
        src="https://mercury.phonepe.com/web/bundle/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setPhonePeLoaded(true)}
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1e1e1e] dark:to-[#2c2c2c] transition-colors">
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full shadow">
              <FaShoppingBag className="text-purple-600 dark:text-purple-300 text-2xl" />
            </div>
            <h1 className="text-2xl font-bold mt-4 text-gray-800 dark:text-gray-100">
              Retry Payment
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Order #{order?.orderNumber}
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          ) : !order ? (
            <p className="text-center text-red-500">
              Invalid or expired order.
            </p>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Items in your order:
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 pl-4 list-disc">
                  {order.items.map((item: any, i: number) => (
                    <li key={i}>
                      {item.name} (Qty: {item.qty})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 flex items-center justify-between text-base font-semibold text-gray-800 dark:text-white">
                <span>Total:</span>
                <span className="flex items-center gap-1">
                  <FaRupeeSign />
                  {order.totalAmount}
                </span>
              </div>

              <button
                onClick={handlePhonePePayment}
                disabled={!phonePeLoaded}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition
                  ${
                    phonePeLoaded
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
              >
                <FaRedo className="text-lg" />
                {phonePeLoaded ? "Pay with Card/UPI" : "Loading PhonePe..."}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
