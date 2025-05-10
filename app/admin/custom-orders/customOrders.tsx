"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/custom-orders/DataTable";
import { columns } from "./components/columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";

type Order = {
  id: string;
  gender: string;
  contactNumber: string;
  countryCode: string;
  jewelryType: string;
  metalType: string;
  budget: number;
  occasion: string;
  customImage: string | null;
  stoneType: string;
  additionalDetails: string;
  appointmentDate: string;
  personalConsultation: boolean;
  termsAccepted: boolean;
  goldKarat: string;
  createdAt: string;
  updatedAt: string;
};

export default function CustomOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/admin/custom-designs");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch orders");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        const formattedOrders: Order[] = data.map((order: any) => ({
          id: order._id,
          gender: order.gender,
          contactNumber: order.contactNumber,
          countryCode: order.countryCode,
          jewelryType: order.jewelryType,
          metalType: order.metalType,
          budget: order.budget,
          occasion: order.occasion,
          customImage: order.customImage || null,
          stoneType: order.stoneType,
          additionalDetails: order.additionalDetails,
          appointmentDate: order.appointmentDate,
          personalConsultation: order.personalConsultation,
          termsAccepted: order.termsAccepted,
          goldKarat: order.goldKarat,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        }));

        setOrders(formattedOrders);
        setError(null);
      } catch (error: any) {
        setError(error.message);
        toast.error("Failed to load custom orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading custom orders...</h2>
          <p className="text-sm text-gray-500">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-medium text-red-600">
            Error loading orders
          </h2>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col p-4 pt-[25px]">
      <div className="flex-1 space-y-4 ">
        <Heading
          title={`Custom Design Orders (${orders.length})`}
          description="Detailed view of all custom jewelry requests"
        />
        <Separator />
        <DataTable columns={columns} data={orders} searchKey="contactNumber" />
      </div>
    </div>
  );
}
