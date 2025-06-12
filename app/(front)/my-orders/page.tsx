"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Order {
  paymentStatus: string;
  _id: string;
  orderNumber: string;
  createdAt: string;
  items: Array<{
    materialType: string;
    pricePerLine: number;
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
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered orders
  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/mine");
        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        console.log("Fetched orders:", data); // Debug log

        // Proper date sorting (newest first)
        const sortedOrders = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
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

      <div className="my-4 flex flex-col sm:flex-row items-center gap-2 w-full sm:max-w-md">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search by Order Number or Product Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10" // add right padding to avoid overlap
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredOrders?.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No orders found</h3>
          <p className="text-gray-500 mt-2">
            Start shopping to see your orders here!
          </p>
          <Link
            href="/search"
            className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders?.map((order) => (
            <Link href={`/my-orders/${order._id}`} key={order._id}>
              {/* Mobile Layout (Flipkart Style) */}
              <div className="block md:hidden p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition cursor-pointer mb-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Product Image */}
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={order.items[0]?.image || "/placeholder.png"}
                      alt={order.items[0]?.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {order.items.length === 1
                        ? order.items[0].name
                        : `${order.items.length} items`}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Order #{order.orderNumber} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p
                      className={`text-xs font-medium mt-1 ${
                        order.isDelivered
                          ? "text-green-600"
                          : order.isPaid
                            ? "text-purple-600"
                            : "text-red-500"
                      }`}
                    >
                      {order.isDelivered
                        ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                        : order.isPaid
                          ? "Processing"
                          : "Payment Failed"}
                    </p>
                  </div>

                  {/* Chevron Icon */}
                  <div className="text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Desktop Layout (Full Details) */}
              <div className="hidden md:block transition-all duration-300 hover:bg-gray-50 hover:shadow-lg cursor-pointer rounded-xl mb-4">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    {/* Row 1: Order Info */}
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <p className="text-lg font-semibold">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Row 2: Items */}
                      <div className="flex flex-wrap gap-4">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 w-full sm:w-auto"
                          >
                            <div className="relative w-16 h-16">
                              <Image
                                src={item.image || "/placeholder.png"}
                                alt={item.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.qty} ×{" "}
                                {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                }).format(
                                  item?.product?.materialType === "Beads"
                                    ? item?.product?.pricePerLine
                                    : item.price
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex-col space-y-2 items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          Payment:
                          <StatusBadge
                            status={order.isPaid ? "completed" : "failed"}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          Order Status:
                          <StatusBadge
                            status={
                              order.isDelivered
                                ? "delivered"
                                : order.isPaid
                                  ? "processing"
                                  : "failed"
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Chevron Icon aligned vertically centered */}
                  </CardContent>
                </Card>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
