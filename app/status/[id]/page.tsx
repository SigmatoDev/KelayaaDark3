"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut, useSession } from "next-auth/react";
import useCartService from "@/lib/hooks/useCartStore";
import useSWRMutation from "swr/mutation";
import { SparklesIcon } from "lucide-react";
import OrderConfirmation from "@/components/OrderConfirmation/page";

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
  const [orderData, setOrderData] = useState<any>(null);

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
    async (url, { arg }: { arg: { paymentResult: any; paymentMode: any } }) => {
      const { paymentResult, paymentMode } = arg;

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
            status:
              paymentResult?.status === "COMPLETED" ? "processing" : "failed",

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
              gstMobileNumber: gstDetails.gstMobileNumber,
              gstEmail: gstDetails.gstEmail,
            },
            paymentStatus: paymentResult?.status,
            paymentMethod: paymentMode,
            paymentIntentId,
            paymentResult,
            personalInfo: {
              ...personalInfo,
              userType: session.user.userType,
              createAccountAfterCheckout: false,
            },
            unique_txn_id: params?.id,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setOrderId(data?.order?._id);
          setOrderData(data?.order);
          // toast.success("Order placed successfully!");
          // setTimeout(() => {
          //   router.push("/");
          // }, 1000);
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

  const deleteGuestUser = async () => {
    try {
      if (session?.user?.userType === "guest") {
        await fetch("/api/auth/guest-user-delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber: session.user.mobileNumber,
            userId: session.user._id,
          }),
        });
        console.log("Guest user deleted after order.");
      }
    } catch (err) {
      console.error("Failed to delete guest user:", err);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await axios.post("/api/phonepe/status", {
        merchantOrderId: params?.id, // This should be the merchantOrderId
      });

      console.log("id-----", params?.id);

      const paymentStatus = response.data.status;
      const transactionId = response.data?.transactionId;
      const paymentModes = response.data?.paymentMode;

      const fullPaymentData = {
        status: paymentStatus,
        transactionId: transactionId,
      };

      console.log("PaymentResult to be saved:", fullPaymentData);

      setTransactionStatus(paymentStatus);
      setTransactionDetails(response?.data?.result);
      const alreadyPlaced = sessionStorage.getItem(
        `order_placed_${params?.id}`
      );

      if (!alreadyPlaced) {
        sessionStorage.setItem(`order_placed_${params?.id}`, "true");
        await placeOrder({
          paymentResult: fullPaymentData,
          paymentMode: paymentModes,
        });

        if (paymentStatus === "COMPLETED") {
          toast.success("Order placed successfully!");
          clear();

          if (session?.user.userType === "guest") {
            await deleteGuestUser();
            sessionStorage.clear();

            setTimeout(() => {
              document.cookie.split(";").forEach((c) => {
                document.cookie = c
                  .replace(/^ +/, "")
                  .replace(
                    /=.*/,
                    `=;expires=${new Date(0).toUTCString()};path=/`
                  );
              });
              signOut({ redirect: false });
            }, 1000);
          }
        } else {
          toast.error("Order failed. Payment was not successful.");
          if (session?.user.userType === "guest") {
            await deleteGuestUser();
            sessionStorage.clear();

            setTimeout(() => {
              document.cookie.split(";").forEach((c) => {
                document.cookie = c
                  .replace(/^ +/, "")
                  .replace(
                    /=.*/,
                    `=;expires=${new Date(0).toUTCString()};path=/`
                  );
              });
              signOut({ redirect: false });
            }, 1000);
          }
        }
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
        <div className="bg-white p-8 my-3 sm:my-6 rounded-lg shadow-lg w-full max-w-md">
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
                    <strong>Status:</strong>{" "}
                    {transactionDetails.errorContext.errorCode}
                  </p>
                  {/* <p>
                    <strong>Details:</strong>{" "}
                    {transactionDetails.errorContext.description}
                  </p> */}
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
            orderData ? (
              <OrderConfirmation order={orderData} />
            ) : (
              <div className="text-center text-gray-600">
                Fetching order details...
              </div>
            )
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
