"use client";

import Link from "next/link";
import useSWR from "swr";

import { Order } from "@/lib/models/OrderModel";

export default function Orders() {
  const { data: orders, error, isLoading } = useSWR(`/api/admin/orders`);

  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";

  return (
    <div>
      <h1 className="text-2xl">Orders</h1>
      <div className="overflow-x-auto">
        <table className="table mt-2">
          <thead>
            <tr className="text-orange-500">
              <th>Sl.No.</th>
              <th>ORDER_ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERY STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order, index: number) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>..{order._id.substring(20, 24)}</td>
                <td>{order.user?.name || "Deleted user"}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>₹{order.totalPrice}</td>
                <td>
                  <span
                    className={`${
                      order.isPaid ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {order.isPaid
                      ? `Paid`
                      : "not paid"}
                    {/* {order.isPaid
                      ? `${order.updatedAt.substring(0, 10)}`
                      : "not paid"} */}
                  </span>
                </td>
                <td>
                  <span
                    className={`${
                      order.isDelivered ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {order.isDelivered && order.deliveredAt
                      ? `${order.deliveredAt.substring(0, 10)}`
                      : "not delivered"}
                  </span>
                </td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/order/${order._id}`}
                    passHref
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
