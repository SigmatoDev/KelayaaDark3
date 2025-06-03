"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useState } from "react";

import { OrderItem } from "@/lib/models/OrderModel";
import { useRouter } from "next/navigation";

interface IOrderDetails {
  orderId: string;
}

// Define a helper function to get the color class based on status
const getStatusColorClass = (status: string) => {
  return status === "processing"
    ? "text-yellow-600"
    : status === "shipped"
      ? "text-blue-600"
      : status === "out-for-delivery"
        ? "text-indigo-600"
        : status === "completed"
          ? "text-green-600"
          : status === "cancelled"
            ? "text-red-600"
            : "text-gray-700";
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const OrderDetails = ({ orderId }: IOrderDetails) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [status, setStatus] = useState("processing");
  const [note, setNote] = useState("");

  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url, { arg }: { arg: { status: string; note?: string } }) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: arg.status, note: arg.note }),
      });
      const data = await res.json();
      res.ok
        ? toast.success("Order status updated successfully")
        : toast.error(data.message);
    }
  );

  const { data, error } = useSWR(`/api/orders/${orderId}`, fetcher);

  // Get last status from history or fallback to current data.status
  const lastStatus =
    data?.statusHistory && data.statusHistory.length > 0
      ? data.statusHistory[data.statusHistory.length - 1].status
      : data?.status || "";

  if (error) return error.message;
  if (!data)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
      </div>
    );

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data;

  console.log("items", items);

  const sortedStatusHistory = (data?.statusHistory || [])
    .slice()
    .sort(
      (
        a: { changedAt: string | number | Date },
        b: { changedAt: string | number | Date }
      ) => {
        return (
          new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
        );
      }
    );

  const existingStatuses = (data?.statusHistory || []).map(
    (entry: { status: any }) => entry.status
  );

  return (
    <div className="px-4 py-6">
      <button
        onClick={() => router.push("/admin/orders")}
        className="flex items-center text-sm mb-2 font-medium border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md px-3 py-1"
      >
        ← Back
      </button>

      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">
          Order <span className="text-blue-600">#{data?.orderNumber}</span>
        </h1>
        {data?.status === "completed" && (
          <span className="inline-flex items-center gap-2 ml-4 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>{" "}
            Completed
          </span>
        )}
        {data?.status === "processing" ||
          (data?.status === "pending" && (
            <span className="inline-flex items-center gap-2 ml-4 bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
              Processing
            </span>
          ))}
        {data?.status === "cancelled" && (
          <span className="inline-flex items-center gap-2 ml-4 bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full font-medium">
            ❌ Cancelled
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Left Section */}
        <div className="md:col-span-3 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
            <p className="text-gray-700">{shippingAddress.fullName}</p>
            <div className="text-sm text-gray-700 leading-relaxed">
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {shippingAddress.address}
              </p>
              <p>
                <span className="font-semibold">Landmark:</span>{" "}
                {shippingAddress.landmark || "N/A"}
              </p>
              <p>
                <span className="font-semibold">City:</span>{" "}
                {shippingAddress.city},{" "}
                <span className="font-semibold">State:</span>{" "}
                {shippingAddress.state}
              </p>
              <p>
                <span className="font-semibold">Postal Code:</span>{" "}
                {shippingAddress.postalCode}
              </p>
              <p>
                <span className="font-semibold">Country:</span>{" "}
                {shippingAddress.country || "INDIA"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Full Address:</span>{" "}
                {[
                  shippingAddress.address,
                  shippingAddress.landmark,
                  shippingAddress.city,
                  shippingAddress.state,
                  shippingAddress.postalCode,
                  shippingAddress.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="font-medium">Payment_Mode:</span>
                <span className="ml-2">{paymentMethod}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Payment_ID:</span>
                <span className="text-gray-500 ml-2 font-semibold">
                  {data?.paymentResult?.transactionId || "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Transaction_ID:</span>
                <span className="text-gray-500 ml-2 font-semibold">
                  {data?.unique_txn_id || "N/A"}
                </span>
              </div>
            </div>

            <div className="mt-4">
              {isPaid ? (
                <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Paid
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full">
                  ! Pending
                </span>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Item
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item: OrderItem) => (
                    <tr key={item._id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {item.name}
                            <span className="ml-2 inline-flex items-center text-xs text-gray-600">
                              {item.product?.productType === "Rings" &&
                              item.product?.ring_size?.trim() ? (
                                <>
                                  <span className="text-xs font-semibold text-gray-700">
                                    Ring Size:
                                  </span>
                                  <span className="ml-1">
                                    {item.product.ring_size}
                                  </span>
                                </>
                              ) : item.product?.size?.trim() ? (
                                <>
                                  <span className="text-xs font-semibold text-gray-700">
                                    Size:
                                  </span>
                                  <span className="ml-1">
                                    {item.product.size}
                                  </span>
                                </>
                              ) : null}
                            </span>
                            {/* Displaying Product Category */}
                            {item.product ? (
                              <span className="ml-3 text-xs text-gray-500">
                                | Category:{" "}
                                <span className="font-semibold text-gray-700">
                                  {item?.product.productCategory ||
                                    item?.product.productType}
                                </span>
                              </span>
                            ) : null}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-3">{item.qty}</td>
                      <td className="px-4 py-3">
                        ₹
                        {(item?.materialType === "Beads"
                          ? item.pricePerLine
                          : item.price
                        )?.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section: Order Summary */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex justify-between">
              <span>Items</span>
              <span>₹{itemsPrice}</span>
            </li>
            <li className="flex justify-between">
              <span>Tax</span>
              <span>₹{taxPrice}</span>
            </li>
            <li className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shippingPrice}</span>
            </li>
            <hr />
            <li className="flex justify-between font-semibold text-base pt-2">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </li>
          </ul>

          {session?.user?.isAdmin && (
            <>
              <div className="mt-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Update Order Status
                </label>
                {/* Status select dropdown */}

                <select
                  id="status"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setNote(""); // Clear note when status changes
                  }}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2
    ${
      status === "processing"
        ? "text-yellow-600"
        : status === "shipped"
          ? "text-blue-600"
          : status === "out-for-delivery"
            ? "text-indigo-600"
            : status === "completed"
              ? "text-green-600"
              : status === "cancelled"
                ? "text-red-600"
                : "text-gray-700"
    }`}
                >
                  <option
                    value="processing"
                    disabled={existingStatuses.includes("processing")}
                    className={`${
                      existingStatuses.includes("processing")
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-yellow-600"
                    }`}
                  >
                    Processing
                  </option>
                  <option
                    value="shipped"
                    disabled={existingStatuses.includes("shipped")}
                    className={`${
                      existingStatuses.includes("shipped")
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600"
                    }`}
                  >
                    Shipped
                  </option>
                  <option
                    value="out-for-delivery"
                    disabled={existingStatuses.includes("out-for-delivery")}
                    className={`${
                      existingStatuses.includes("out-for-delivery")
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-indigo-600"
                    }`}
                  >
                    Out for Delivery
                  </option>
                  <option
                    value="completed"
                    disabled={existingStatuses.includes("completed")}
                    className={`${
                      existingStatuses.includes("completed")
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-green-600"
                    }`}
                  >
                    Completed
                  </option>
                  <option
                    value="cancelled"
                    disabled={existingStatuses.includes("cancelled")}
                    className={`${
                      existingStatuses.includes("cancelled")
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600"
                    }`}
                  >
                    Cancelled
                  </option>
                </select>
              </div>

              <label className="block mt-4 text-sm font-medium text-gray-700">
                Optional Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Optional note about status update"
                className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
              />

              {/* Update Status button */}
              <button
                onClick={() => deliverOrder({ status, note })}
                disabled={
                  isDelivering ||
                  status === data.status ||
                  existingStatuses.includes(status)
                }
                className={`btn w-full mt-4 flex items-center justify-center gap-2 ${
                  !isDelivering &&
                  status !== data.status &&
                  !existingStatuses.includes(status)
                    ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {isDelivering && (
                  <span className="loading loading-spinner"></span>
                )}
                Update Status
              </button>
            </>
          )}

          {sortedStatusHistory?.length > 0 && (
            <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Order Status History</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                {sortedStatusHistory.map((entry: any, idx: number) => (
                  <li key={idx} className="border-b pb-2 last:border-none">
                    <div className="flex justify-between">
                      <span
                        className={`font-medium capitalize ${getStatusColorClass(
                          entry.status
                        )}`}
                      >
                        {entry.status.replace(/-/g, " ")}
                      </span>
                      <span className="text-gray-500">
                        {new Date(entry.changedAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="mt-1 text-gray-600 italic">
                        “{entry.note}”
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
