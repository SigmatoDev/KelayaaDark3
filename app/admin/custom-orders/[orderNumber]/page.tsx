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
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { StatusBadge } from "@/components/ui/status-badge";

const statusOptions = [
  { value: "pending", label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", className: "bg-blue-100 text-blue-800" },
  { value: "in_progress", label: "In Progress", className: "bg-purple-100 text-purple-800" },
  { value: "completed", label: "Completed", className: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", className: "bg-red-100 text-red-800" }
];

export default function CustomOrderDetails() {
  const params = useParams();
  const router = useRouter();
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        console.log("Fetching design for orderNumber:", params.orderNumber);
        const response = await fetch(`/api/admin/custom-designs/${params.orderNumber}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          throw new Error(errorData.message || "Failed to fetch design details");
        }
        
        const data = await response.json();
        console.log("Received design data:", data);
        setDesign(data);
        setStatus(data.status);
        setAdminNotes(data.adminNotes || "");
      } catch (error: any) {
        console.error("Error fetching design:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.orderNumber) {
      fetchDesign();
    }
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
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>No design found</div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title={`Order ${design.orderNumber}`}
            description="Custom Design Order Details"
          />
          <StatusBadge status={design.status} />
        </div>
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-4">
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm">{design.user?.name || 'N/A'}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{design.user?.email || 'N/A'}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-sm font-medium">Contact Number</p>
                <p className="text-sm">{design.contactNumber || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Design Image */}
          <Card>
            <CardHeader>
              <CardTitle>Design Reference</CardTitle>
            </CardHeader>
            <CardContent>
              {design.customImage ? (
                <div className="relative w-full h-40">
                  <Image
                    src={design.customImage}
                    alt="Custom Design"
                    fill
                    className="object-contain rounded-md"
                    onError={(e) => {
                      console.error("Image load error:", e);
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg'; // Add a placeholder image
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
                  <p className="text-sm text-gray-500">No image provided</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Design Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Design Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-4">
                <p className="text-sm font-medium">Design Type</p>
                <p className="text-sm">{design.designType || 'N/A'}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-sm font-medium">Metal Type</p>
                <p className="text-sm">{design.metalType || 'N/A'}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-sm font-medium">Material Karat</p>
                <p className="text-sm">{design.materialKarat || 'N/A'}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-sm font-medium">Stone Type</p>
                <p className="text-sm">{design.specifications?.stoneType || 'N/A'}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-sm font-medium">Size</p>
                <p className="text-sm">{design.specifications?.size || 'N/A'}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-sm font-medium">Occasion</p>
                <p className="text-sm">{design.specifications?.occasion || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Price Details */}
          <Card>
            <CardHeader>
              <CardTitle>Price Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-4">
                <p className="text-sm font-medium">Budget</p>
                <p className="text-sm">
                  {design.budget
                    ? new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(design.budget)
                    : 'N/A'}
                </p>
              </div>
              <div  className="flex gap-4" >
                <p className="text-sm font-medium">Created At</p>
                <p className="text-sm">
                  {design.createdAt
                    ? new Date(design.createdAt).toLocaleString("en-IN")
                    : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Order Details - #{design.orderNumber}
          </h1>
          <Badge
            className={`text-lg px-4 py-2 ${
              statusOptions.find((opt) => opt.value === design.status)?.className
            }`}
          >
            {design.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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

        {design.imageUrls?.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Reference Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {design.imageUrls.map((url: string, index: number) => (
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
    </div>
  );
} 