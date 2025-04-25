"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { FaCheckCircle, FaClock } from "react-icons/fa";

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  items: Array<{
    materialType: string;
    pricePerLine: ReactNode;
    product: string; // Product ID
    name: string;
    slug: string;
    qty: number;
    image: string; // Make sure this exists in the item data
    price: number; // Ensure price exists in your response structure
  }>;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  status: string;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/mine");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        console.log("Fetched orders:", data); // Debug log
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Heading title="Order History" description="View and track your orders" />
      <Separator className="my-6" />

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No orders found</h3>
          <p className="text-gray-500 mt-2">
            Start shopping to see your orders here!
          </p>
          <Link
            href="/products"
            className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardContent className="p-6">
                <div className="flex flex-col justify-between gap-6">
                  {/* Order Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/order/${order.orderNumber}`}
                        className="text-lg font-medium hover:text-primary"
                      >
                        Order #{order._id}
                      </Link>
                      <StatusBadge
                        status={
                          order.isDelivered
                            ? "delivered"
                            : order.isPaid
                              ? "processing"
                              : "pending"
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="relative w-16 h-16">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.qty} ×
                              {item?.product?.materialType === "Beads"
                                ? new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                  }).format(item?.product?.pricePerLine)
                                : new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                  }).format(item?.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total and Actions */}
                  {/* <div className="flex flex-col justify-between items-end">
                    <div className="text-right">
                      <p className="text-sm font-medium">Total Amount</p>
                      <p className="text-lg font-bold">
                        ₹{order.totalPrice.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <Link
                      href={`/order/${order._id}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      View Details
                    </Link>
                  </div> */}
                </div>

                {/* Order Status Timeline */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between max-w-2xl">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full ${order.isPaid ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        <FaCheckCircle className="text-white" />
                      </div>
                      <p className="text-sm mt-2">Order Placed</p>
                      {order.paidAt && (
                        <p className="text-xs text-gray-500">
                          {new Date(order.paidAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div
                      className={`flex-1 h-0.5 ${order.isPaid ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full ${order.isDelivered ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        <FaClock className="text-white" />
                      </div>
                      <p className="text-sm mt-2">Delivered</p>
                      {order.deliveredAt && (
                        <p className="text-xs text-gray-500">
                          {new Date(order.deliveredAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
