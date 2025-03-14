"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/custom-orders/DataTable";
import { columns } from "./components/columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";

export default function CustomOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching custom orders...");
        const response = await fetch("/api/admin/custom-designs");
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch orders:", errorData);
          throw new Error(errorData.message || "Failed to fetch orders");
        }
        
        const data = await response.json();
        console.log("Raw custom orders data:", data);
        
        if (!Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          throw new Error("Invalid data format received");
        }

        const formattedOrders = data.map((order: any) => ({
          id: order._id,
          orderNumber: order.orderNumber,
          createdAt: order.createdAt,
          customer: order.user?.name || 'Unknown',
          contactNumber: order.contactNumber,
          customImage: order.customImage,
          designType: order.designType,
          budget: order.budget,
          status: order.status,
        }));
        
        console.log("Formatted orders:", formattedOrders);
        setOrders(formattedOrders);
        setError(null);
      } catch (error: any) {
        console.error("Error in fetchOrders:", error);
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
          <h2 className="text-lg font-medium text-red-600">Error loading orders</h2>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title={`Custom Orders (${orders.length})`}
            description="Manage custom design orders"
          />
        </div>
        <Separator />
        <DataTable
          columns={columns}
          data={orders}
          searchKey="orderNumber"
        />
      </div>
    </div>
  );
} 