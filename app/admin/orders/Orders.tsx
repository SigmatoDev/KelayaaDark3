"use client";

import Link from "next/link";
import useSWR from "swr";
import { useState, useMemo } from "react";
import { Order } from "@/lib/models/OrderModel";

type SortKey = "createdAt" | "totalPrice" | "deliveredAt";
type SortOrder = "asc" | "desc";

export default function Orders() {
  const { data: orders, error, isLoading } = useSWR(`/api/admin/orders`);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    const sorted = [...orders].sort((a: Order, b: Order) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (sortKey === "createdAt" || sortKey === "deliveredAt") {
        aVal = new Date(aVal || "").getTime();
        bVal = new Date(bVal || "").getTime();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [orders, sortKey, sortOrder]);

  const getSortArrow = (key: SortKey) => {
    if (sortKey === key) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return "↑↓";
  };

  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";

  return (
    <div>
      <h1 className="text-2xl">Orders</h1>
      <div className="overflow-x-auto">
        <table className="table mt-2">
          <thead>
            <tr className="text-gray-500 bg-gray-100 text-sm text-center">
              <th>Sl.No.</th>
              <th>ORDER_ID</th>
              <th>USER</th>
              <th
                className={`cursor-pointer ${
                  sortKey === "createdAt" ? "font-semibold text-black" : ""
                }`}
                onClick={() => handleSort("createdAt")}
              >
                ORDER_DATE {getSortArrow("createdAt")}
              </th>
              <th
                className={`cursor-pointer ${
                  sortKey === "totalPrice" ? "font-semibold text-black" : ""
                }`}
                onClick={() => handleSort("totalPrice")}
              >
                TOTAL AMOUNT {getSortArrow("totalPrice")}
              </th>
              <th>PAYMENT STATUS</th>
              <th>ORDER STATUS</th>
              <th
                className={`cursor-pointer ${
                  sortKey === "deliveredAt" ? "font-semibold text-black" : ""
                }`}
                onClick={() => handleSort("deliveredAt")}
              >
                DELIVERED_DATE {getSortArrow("deliveredAt")}
              </th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {sortedOrders.map((order: Order, index: number) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order?.orderNumber}</td>
                <td className="text-left">
                  <div className="font-medium text-gray-800">
                    {order.personalInfo?.email}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.personalInfo?.mobileNumber}
                  </div>
                </td>
                <td>
                  {new Date(order?.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td>₹{order.totalPrice.toLocaleString("en-IN")}</td>
                <td>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium ${
                      order.isPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {order.isPaid ? (
                      <>
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
                      </>
                    ) : (
                      "X Pending"
                    )}
                  </span>
                </td>
                <td>
                  <span
                    className={` rounded-md px-2 py-1 text-xs ${
                      order?.status === "pending" ||
                      order?.status === "processing"
                        ? "bg-purple-100 text-purple-800"
                        : order?.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : order?.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100"
                    }`}
                  >
                    {order?.status === "pending" ||
                    order?.status === "processing"
                      ? "Processing"
                      : order?.status === "cancelled"
                        ? "Cancelled"
                        : order?.status === "completed"
                          ? "Delivered"
                          : "Unknown"}
                  </span>
                </td>
                <td>
                  {order?.isDelivered
                    ? new Date(order.updatedAt).toLocaleDateString("en-IN")
                    : "-"}
                </td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/admin/customer-order/${order._id}`}
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
