"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  qty: number;
  materialType?: string;
  pricePerLine?: number;
}

interface OrderConfirmationProps {
  order: {
    _id: string;
    createdAt: string;
    items: OrderItem[];
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalAmount: number;
  };
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order }) => {
  const router = useRouter();
  const deliveryDate = new Date(
    new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString();

  return (
    <div className="text-center">
      <div className="flex justify-center">
        <div className="bg-green-100 text-green-600 rounded-full p-3">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      <h2 className="text-3xl font-bold text-green-600 mt-4">
        Payment Successful!
      </h2>
      <p className="text-gray-700 mt-1 text-md">
        Thank you for your order. We’ve emailed your receipt.
      </p>

      <div className="mt-6 text-sm text-gray-600 border rounded-md p-4 bg-gray-50 text-left">
        <div className="flex justify-between mb-2">
          <span>Order ID:</span>
          <span className="font-medium text-gray-800">{order._id}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Order Date:</span>
          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Est. Delivery:</span>
          <span>{deliveryDate}</span>
        </div>
      </div>

      <div className="mt-6 text-left">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Order Summary
        </h3>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex gap-4 items-center border-b pb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md border"
              />
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="text-sm text-gray-600">Qty: {item.qty}</span>
                <span className="text-sm text-gray-600">
                  ₹
                  {item.materialType === "Beads"
                    ? item.pricePerLine
                    : item.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-700 border-t pt-4 space-y-1">
          <p>Items Total: ₹{order.itemsPrice}</p>
          <p>Shipping: ₹{order.shippingPrice}</p>
          <p>Tax: ₹{order.taxPrice}</p>
          <p className="font-semibold text-lg mt-2">
            Grand Total: ₹{order.totalAmount}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={() => router.push("/my-orders")}
          className="w-full py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold rounded-md hover:opacity-90"
        >
          View My Orders
        </button>
        <button
          onClick={() => router.push("/")}
          className="w-full py-3 border border-emerald-300 text-green-500 font-semibold rounded-md hover:bg-emerald-50"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
