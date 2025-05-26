"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import useCartService from "@/lib/hooks/useCartStore";
import useSWRMutation from "swr/mutation";
import { SparklesIcon } from "lucide-react";

interface TransactionDetails {
  paymentDetails?: [];
  errorContext: {
    errorCode: string;
    source: string;
    description: string;
  };
}

const StatusPage = () => {
  const params = useParams();
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { data: session, status } = useSession(); // ✅ renamed session status
  const hasPlacedOrder = useRef(false); // 🛡️ guards against double call

  const paymentIntentId = params?.paymentIntentId as string;
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState(null); // Optional: Store payment details

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

  const [isPlacing, setIsPlacing] = useState(true);

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

  const fetchStatus = async () => {
    try {
      const response = await axios.post("/api/phonepe/status", {
        merchantOrderId: params?.id, // This should be the merchantOrderId
      });

      console.log("id-----", params?.id);

      const paymentStatus = response.data.status;
      const transactionId = response.data?.transactionId;

      const fullPaymentData = {
        status: paymentStatus,
        transactionId: transactionId,
      };

      console.log("PaymentResult to be saved:", fullPaymentData);

      setTransactionStatus(paymentStatus);
      setTransactionDetails(response?.data?.result);
      if (paymentStatus === "COMPLETED") {
        if (!hasPlacedOrder.current) {
          hasPlacedOrder.current = true;
          await placeOrder({ paymentResult: fullPaymentData });
        }
      } else {
        toast.error(
          `Payment failed or not completed. Status: ${paymentStatus}`
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Something went wrong. Please contact the website owner.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      fetchStatus();
    }
  }, [params?.id]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg text-gray-700">Loading...</p>
            </div>
          ) : transactionStatus === "FAILED" ? (
            <>
              <SparklesIcon className="text-red-400 w-16 h-16 mx-auto animate-bounce" />

              <h2 className="text-3xl font-extrabold text-red-600 text-center animate-fadeIn">
                Payment Failed
              </h2>

              <p className="text-lg text-gray-700 text-center mt-2 animate-fadeIn">
                Unfortunately, we couldn’t complete your payment.
                <br />
                Please check your payment method or try again later.
              </p>

              {transactionDetails?.errorContext && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4 text-sm text-red-700">
                  <p>
                    <strong>Error Code:</strong>{" "}
                    {transactionDetails.errorContext.errorCode}
                  </p>
                  <p>
                    <strong>Details:</strong>{" "}
                    {transactionDetails.errorContext.description}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-6 animate-fadeIn">
                <button
                  onClick={() => router.push("/cart")}
                  className="w-full py-3 bg-gradient-to-r from-red-400 to-rose-500 text-white font-semibold rounded-md hover:opacity-90"
                >
                  Return to Cart
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full py-3 border border-rose-300 text-red-400 font-semibold rounded-md hover:bg-rose-50"
                >
                  Continue Browsing
                </button>
              </div>
            </>
          ) : transactionStatus === "PENDING" ? (
            <>
              <SparklesIcon className="text-yellow-400 w-16 h-16 mx-auto animate-spin" />
              <h2 className="text-3xl font-extrabold text-yellow-600 animate-fadeIn">
                Payment Pending
              </h2>
              <p className="text-lg text-gray-700 animate-fadeIn">
                Your payment is currently being processed.
                <br /> We'll update your order status shortly.
              </p>
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => router.push("/")}
                  className="w-full py-3 border border-yellow-300 text-yellow-500 font-semibold rounded-md hover:bg-yellow-50 animate-fadeIn"
                >
                  Go Back Home
                </button>
              </div>
            </>
          ) : transactionStatus === "COMPLETED" ? (
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
          ) : (
            <>
              <h2 className="text-xl text-gray-700 font-semibold text-center">
                Awaiting payment confirmation...
              </h2>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default StatusPage;
