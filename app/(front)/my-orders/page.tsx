"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

// ⬇️ Order interface
interface Order {
  paymentStatus: string;
  _id: string;
  orderNumber: string;
  createdAt: string;
  items: Array<{
    materialType: string;
    pricePerLine: number;
    product: any;
    name: string;
    slug: string;
    qty: number;
    image: string;
    price: number;
  }>;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  status: string;
}

// ⬇️ Status UI Helper
const getOrderStatusUI = (status: string, date: string) => {
  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  switch (status) {
    case "completed":
      return {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-green-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="10" fill="#00b852" />
            <path
              d="M16 9l-5.5 5.5L8 12"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        label: "Delivered",
        color: "text-green-600",
        dateLabel: `on ${formattedDate}`,
      };

    case "processing":
      return {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-yellow-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
        label: "Processing",
        color: "text-yellow-600",
        dateLabel: `placed on ${formattedDate}`,
      };

    case "shipped":
      return {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 10h18l-2 8H5l-2-8z" />
            <circle cx="7.5" cy="18.5" r="1.5" />
            <circle cx="16.5" cy="18.5" r="1.5" />
          </svg>
        ),
        label: "Shipped",
        color: "text-blue-600",
        dateLabel: `on ${formattedDate}`,
      };

    case "out-for-delivery":
      return {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 17V5h13l-1 6h-5v6" />
            <circle cx="7.5" cy="17.5" r="1.5" />
            <circle cx="18.5" cy="17.5" r="1.5" />
          </svg>
        ),
        label: "Out for Delivery",
        color: "text-indigo-600",
        dateLabel: `as of ${formattedDate}`,
      };

    case "cancelled":
      return {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        ),
        label: "Cancelled",
        color: "text-gray-600",
        dateLabel: `on ${formattedDate} as per your request`,
      };

    case "failed":
    default:
      return {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <circle cx="12" cy="16" r="1" />
          </svg>
        ),
        label: "Payment Failed",
        color: "text-red-600",
        dateLabel: `on ${formattedDate}`,
      };
  }
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const router = useRouter();

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Out for Delivery", value: "out-for-delivery" },
    { label: "Delivered", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Failed", value: "failed" },
  ];

  const filteredOrders = orders.filter((order) => {
    const status =
      order.status ||
      (order.isDelivered
        ? "completed"
        : order.isPaid
          ? "processing"
          : "failed");

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" ? true : status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders/mine?page=${currentPage}&limit=5`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();

      const sortedOrders = data.orders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(sortedOrders);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Heading title="Order History" description="View and track your orders" />
      <Separator className="my-6" />

      <div className="my-4 flex flex-col sm:flex-row items-center gap-2 w-full">
        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-4 mb-4 w-full sm:max-w-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative w-full mb-4">
          <Input
            type="text"
            placeholder="Search by Order Number or Product Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 !rounded-none"
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
            className="inline-block mt-4 px-4 py-2 bg-primary text-white hover:bg-primary/90"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status =
              order.status ||
              (order.isDelivered
                ? "completed"
                : order.isPaid
                  ? "processing"
                  : "failed");

            const statusInfo = getOrderStatusUI(
              status,
              order.deliveredAt || order.paidAt || order.createdAt
            );

            return (
              <Link href={`/my-orders/${order._id}`} key={order._id}>
                {/* ✅ Mobile */}
                <div className="block md:hidden p-4 bg-white border border-gray-200 shadow-sm transition cursor-pointer mb-4 rounded-xl">
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: Image */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={order.items[0]?.image || "/placeholder.png"}
                        alt={order.items[0]?.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    {/* Right: Order Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {order.items.length === 1
                          ? order.items[0].name
                          : `${order.items.length} items`}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Order #{order.orderNumber}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {statusInfo.icon}
                        <span
                          className={`text-xs font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.label} {statusInfo.dateLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button: Reorder or Cancelled */}
                  <div className="mt-4 w-full flex justify-end">
                    {status !== "cancelled" ? (
                      <button
                        className="group flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-[#ff3f6c] text-[#ff3f6c] bg-white hover:bg-[#ffeff3] transition w-full"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(
                            `/product/${order.items[0]?.product?.productCode}`
                          );
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 group-hover:scale-105 transition-transform" />
                        <span>Reorder</span>
                      </button>
                    ) : (
                      <span className="text-xs text-red-600 font-semibold">
                        ❌ Order Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* ✅ Desktop */}
                <div className="hidden md:block transition-all duration-300 hover:bg-gray-50 hover:shadow-lg cursor-pointer mb-4 border border-gray-200 bg-white p-6">
                  {/* Top: Order Header */}
                  <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                    <div>
                      <p className="text-lg font-semibold">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end space-y-1">
                      <div className="flex items-center gap-1">
                        {statusInfo.icon}
                        <p
                          className={`text-sm font-semibold ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {statusInfo.dateLabel}
                      </p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="flex flex-wrap gap-4 border-t pt-3">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full p-4 rounded-md"
                      >
                        {/* Left: Product Info */}
                        <div className="flex items-start gap-4">
                          <div className="relative w-14 h-14 flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.png"}
                              alt={item.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="text-sm space-y-1 text-left">
                            <p className="font-medium text-[#333]">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
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

                        {/* Right: Action */}
                        <div className="w-full md:w-auto flex justify-start md:justify-end">
                          {status !== "cancelled" ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                router.push(
                                  `/product/${item?.product?.productCode}`
                                );
                              }}
                              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[#ff3f6c] text-[#ff3f6c] bg-white hover:bg-[#ffeff3] transition w-full md:w-auto"
                            >
                              <ShoppingCart className="w-4 h-4 group-hover:scale-105 transition-transform" />
                              <span>Reorder</span>
                            </button>
                          ) : (
                            <span className="text-xs text-red-600 font-semibold">
                              ❌ Order Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border  disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1  border ${
                  pageNum === currentPage
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border  disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
