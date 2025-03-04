"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import useSWR from "swr";

import { Order } from "@/lib/models/OrderModel";
import { useSession } from "next-auth/react";

const MyOrders = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // Determine the endpoint based on admin status
  const endpoint = session?.user?.isAdmin
    ? "/api/orders/customers"
    : "/api/orders/mine";

  // Fetch orders based on the endpoint
  const { data: orders, error, isLoading } = useSWR(endpoint);

  if (error) return <>An error has occurred</>;
  if (isLoading) return <>Loading...</>;
  if (!orders) return <>No orders...</>;

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr className="text-orange-500">
            <th>Sl.No.</th>
            <th>ID</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order, index: number) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>{order._id.substring(20, 24)}</td>
              <td className="whitespace-nowrap">
                {order.createdAt.substring(0, 10)}
              </td>
              <td>${order.totalPrice}</td>
              <td>
                {order.isPaid && order.paidAt
                  ? `${order.paidAt.substring(0, 10)}`
                  : "not paid"}
              </td>
              <td>
                {order.isDelivered && order.deliveredAt
                  ? `${order.deliveredAt.substring(0, 10)}`
                  : "not delivered"}
              </td>
              <td>
                <Link className="btn btn-primary" href={`/order/${order._id}`} passHref>
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrders;
