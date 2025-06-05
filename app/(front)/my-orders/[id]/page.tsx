"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaFileDownload,
  FaRedo,
  FaTruck,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import TimelineStepper from "./TimeLineSTepper";
import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import InvoiceDownload from "./invoiceDownload";
import { useReactToPrint } from "react-to-print";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./invoiceDownload";
import ResponsiveStatusStepper from "./TimeLineSTepper";

interface User {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  provider: string;
  isAdmin: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface BillingDetails {
  sameAsShipping: boolean;
  firstName: string;
  lastName: string;
  address: string;
  landmark?: string;
  country?: string;
  state: string;
  city: string;
  postalCode: string;
}

interface ShippingAddress {
  address: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

interface OrderDetail {
  unique_txn_id: string;
  statusHistory: [];
  _id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  isPaid: boolean;
  paymentMethod: string;
  totalPrice: number;
  items: {
    product: {
      productCode: string;
    };
    productId: string;
    name: string;
    price: number;
    qty: number;
    image: string;
  }[];
  shippingAddress: ShippingAddress;
  billingDetails: BillingDetails;
  personalInfo: {
    email: string;
    mobileNumber: string;
  };
  invoice_id: string;
  user?: User;
}

const ORDER_STATUSES = [
  "Processing",
  // "Payment",
  "Shipped",
  "Out for Delivery",
  "Completed",
];

interface StatusStep {
  status: string;
  note: string;
  changedAt: string;
}

// Motion variants for step circle
const circleVariants = {
  inactive: { scale: 1, backgroundColor: "#fff", borderColor: "#d1d5db" }, // gray-300
  active: { scale: 1.2, backgroundColor: "#dcfce7", borderColor: "#22c55e" }, // green-100, green-500
};

// Motion variants for connecting line
const lineVariants = {
  inactive: { backgroundColor: "#d1d5db" },
  active: { backgroundColor: "#22c55e", transition: { duration: 0.5 } },
};

export default function SingleOrderPage() {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data);

        const normalizeStatus = (str: string) =>
          str.toLowerCase().replace(/[\s-]/g, "");

        const normalizedStatuses = ORDER_STATUSES.map(normalizeStatus); // e.g. ['processing', 'shipped', 'outfordelivery', 'completed']
        const statusHistory = data.statusHistory || [];

        console.log("Fetched Order Data:", data);
        console.log("Normalized ORDER_STATUSES:", normalizedStatuses);
        console.log("Raw statusHistory:", statusHistory);

        // Normalize reached statuses from history
        const reachedStatuses = statusHistory.map((item: any) =>
          normalizeStatus(item.status)
        );

        console.log(
          "Normalized Reached Statuses from history:",
          reachedStatuses
        );

        // Find the highest index from ORDER_STATUSES that exists in history
        let lastReachedIndex = -1;
        for (let i = normalizedStatuses.length - 1; i >= 0; i--) {
          if (reachedStatuses.includes(normalizedStatuses[i])) {
            lastReachedIndex = i;
            break;
          }
        }

        const step = lastReachedIndex + 1; // +1 because step 0 means "before any status reached"
        console.log(`✅ Calculated Current Step: ${step}`);
        setCurrentStep(step);
      } catch (err) {
        console.error("❌ Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (!order)
    return (
      <div className="py-20 text-center text-red-600">Order not found</div>
    );

  // GST Calculation (3% included)
  const gstRate = 0.03;
  const gstAmount = order.totalPrice - order.totalPrice / (1 + gstRate);
  const priceExcludingGST = order.totalPrice - gstAmount;

  // Realistic repeat order handler: add all items back to cart (dummy example)
  const handleRepeatOrder = () => {
    // Example: dispatch to your cart context or call API
    alert(
      `Added ${order.items.length} items to cart again. Implement your cart logic here!`
    );
  };

  // Realistic track package handler: open tracking page or modal (dummy example)
  const handleTrackPackage = () => {
    // Replace with real tracking URL or modal
    alert(
      "Track Package clicked! Implement your tracking integration or open a modal here."
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header and Download Invoice button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full md:mb-4 space-y-4 md:space-y-0 mb-2">
        <div className="flex-1 space-y-2">
          <h1 className="xs:text-2xl md:text-xl font-bold">
            Order #{order.orderNumber}
          </h1>
          <p className="text-gray-500 text-sm">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>

        <div className="w-full flex justify-end">
          <PDFDownloadLink
            document={<InvoicePDF order={order} />}
            fileName={`Invoice_Order_${order.orderNumber}.pdf`}
            className="btn btn-primary flex items-center space-x-2"
          >
            {({ loading }) =>
              loading ? (
                "Preparing PDF..."
              ) : (
                <>
                  <FaFileDownload size={18} />
                  <span>Download Invoice</span>
                </>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>

      {/* Timeline */}
      <Card className="mb-8">
        <CardContent className="p-6 pt-2">
          <h2 className="text-xl font-semibold mb-4">Order Status</h2>
          <ResponsiveStatusStepper
            statuses={ORDER_STATUSES}
            initialStep={currentStep} // currently "Shipped"
            statusHistory={order.statusHistory}
          />
        </CardContent>
      </Card>

      <Separator className="my-8" />
      {/* Items & Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 ">
        {/* Left Column: 8/12 */}
        <div className="md:col-span-5">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-semibold mb-4">Items</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="border-b last:border-none pb-5 transition hover:bg-gray-50 rounded-md px-2 cursor-pointer"
                    onClick={() =>
                      router.push(`/product/${item?.product?.productCode}`)
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
                        <Image
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-gray-600">Qty: {item.qty}</p>
                        <p className="text-gray-600">
                          Unit Price: ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-gray-300 mt-3 pt-2 text-right font-semibold text-lg">
                      Total{" "}
                      <span className="text-gray-600">
                        {" "}
                        ({item.qty} x ₹{item.price})
                      </span>
                      : ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: 4/12 */}
        <div className="md:col-span-7">
          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold mb-2">Pricing Details</h2>

              <div className="grid grid-cols-2 gap-2">
                <span>Price (Excl. GST):</span>
                <span className="text-right">
                  ₹{priceExcludingGST.toFixed(2)}
                </span>

                <span>GST (3% Included):</span>
                <span className="text-right">₹{gstAmount.toFixed(2)}</span>

                <span className="font-semibold">Total:</span>
                <span className="font-semibold text-right">
                  ₹{order.totalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Separator should be outside the grid */}
              <Separator className="my-2" />

              <div className="grid grid-cols-2 gap-2">
                <span>Payment Method:</span>
                <span className="text-right">{order.paymentMethod}</span>
                <span>Transaction ID:</span>
                <span className="text-right">{order.unique_txn_id}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shipping & Billing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Shipping Address */}
        <Card className="md:col-span-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">{order.user?.name}</p>
              <p>{order.user?.mobileNumber}</p>
              <div className="mt-2">
                <p className="text-sm text-gray-500 font-medium">Address</p>
                <p>
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.postalCode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card className="md:col-span-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Billing Details</h3>
            {order.billingDetails.sameAsShipping ? (
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">{order.user?.name}</p>
                <p>{order.user?.mobileNumber}</p>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 font-medium">Address</p>
                  <p>
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    - {order.shippingAddress.postalCode}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">
                  {order.billingDetails.firstName}{" "}
                  {order.billingDetails.lastName}
                </p>
                {/* Assuming mobileNumber is only in user, you can optionally include it here too */}
                <div className="mt-2">
                  <p className="text-sm text-gray-500 font-medium">Address</p>
                  <p>
                    {order.billingDetails.address}, {order.billingDetails.city},{" "}
                    {order.billingDetails.state} -{" "}
                    {order.billingDetails.postalCode}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action buttons can go here */}
    </div>
  );
}

{
  /* Action buttons */
}
// {/* <div className="flex flex-wrap gap-4">
//   {/* <button
//           onClick={handleRepeatOrder}
//           className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
//           aria-label="Repeat Order"
//         >
//           <FaRedo /> Repeat Order
//         </button> */}
//   {/* <button
//           onClick={handleTrackPackage}
//           className="flex items-center gap-2 px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700 transition"
//           aria-label="Track Package"
//         >
//           <FaTruck /> Track Package
//         </button> */}
// </div>; */}
