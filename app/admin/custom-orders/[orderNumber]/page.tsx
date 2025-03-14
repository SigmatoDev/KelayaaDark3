"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const statusOptions = [
  { value: "pending", label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", className: "bg-blue-100 text-blue-800" },
  { value: "in_progress", label: "In Progress", className: "bg-purple-100 text-purple-800" },
  { value: "completed", label: "Completed", className: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", className: "bg-red-100 text-red-800" }
];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `/api/admin/custom-designs/${params.orderNumber}`
        );
        if (!response.ok) throw new Error("Failed to fetch order");
        const data = await response.json();
        setOrder(data);
        setStatus(data.status);
        setAdminNotes(data.adminNotes || "");
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderNumber]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch(
        `/api/admin/custom-designs/${params.orderNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, adminNotes }),
        }
      );

      if (!response.ok) throw new Error("Failed to update order");
      toast.success("Order updated successfully");
      router.refresh();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Order not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Order Details - #{order.orderNumber}
        </h1>
        <Badge
          className={`text-lg px-4 py-2 ${
            statusOptions.find((opt) => opt.value === order.status)?.className
          }`}
        >
          {order.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>
              Order placed on {format(new Date(order.createdAt), "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Contact Details</h3>
                <p>Name: {order.user.name}</p>
                <p>Email: {order.user.email}</p>
                <p>Phone: {order.specifications.contactNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold">Design Requirements</h3>
                <p>Type: {order.designType}</p>
                <p>Metal: {order.metalType}</p>
                <p>Karat: {order.specifications.materialKarat}K</p>
                <p>Gender: {order.specifications.gender}</p>
                <p>Size: {order.specifications.size}</p>
                <p>Occasion: {order.specifications.occasion}</p>
              </div>
              <div>
                <h3 className="font-semibold">Budget Details</h3>
                <p>Budget: ₹{order.budget.toLocaleString()}</p>
                <p>GST (18%): ₹{order.gst.toLocaleString()}</p>
                <p>Total: ₹{order.totalPayable.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Update Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Admin Notes
                </label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Add notes about this order..."
                />
              </div>

              <Button
                onClick={handleUpdate}
                disabled={updating}
                className="w-full"
              >
                {updating ? "Updating..." : "Update Order"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {order.imageUrls?.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Reference Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {order.imageUrls.map((url: string, index: number) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={url}
                    alt={`Reference ${index + 1}`}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 