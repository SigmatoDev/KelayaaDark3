"use client";
import { useRouter } from "next/navigation";

interface OrderConfirmationProps {
  orderNumber: string;
}

export default function OrderConfirmation({ orderNumber }: OrderConfirmationProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Order Placed!</h2>
          <p className="text-gray-600 mb-4">
            Your custom design order has been successfully placed.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Order Number: <span className="font-medium">{orderNumber}</span>
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push(`/account/orders/${orderNumber}`)}
              className="w-full px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg hover:opacity-90 transition"
            >
              Track Order
            </button>
            <button
              onClick={() => router.push("/account/orders")}
              className="w-full px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 