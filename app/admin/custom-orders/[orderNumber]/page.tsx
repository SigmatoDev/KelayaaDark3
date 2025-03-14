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

export default function CustomOrderDetail({ params }: { params: { orderNumber: string } }) {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/admin/custom-designs/${params.orderNumber}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        console.log("Fetched order details:", data); // Debug log
        setOrder(data);
        setStatus(data.status);
        setAdminNotes(data.adminNotes || "");
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title={`Order ${order.orderNumber}`}
            description="Custom Design Order Details"
          />
          <StatusBadge status={order.status} />
        </div>
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm">{order.user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{order.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Contact Number</p>
                <p className="text-sm">{order.contactNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Gender</p>
                <p className="text-sm capitalize">{order.gender || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Design Details */}
          <Card>
            <CardHeader>
              <CardTitle>Design Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Design Type</p>
                <p className="text-sm capitalize">{order.designType}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Metal Type</p>
                <p className="text-sm capitalize">{order.metalType}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Material Karat</p>
                <p className="text-sm">{order.materialKarat}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Stone Type</p>
                <p className="text-sm capitalize">{order.stoneType || 'No stone'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Custom Image */}
          {order.customImage && (
            <Card>
              <CardHeader>
                <CardTitle>Custom Design Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-[200px] w-full">
                  <Image
                    src={order.customImage}
                    alt="Custom Design"
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <a 
                  href={order.customImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-2 block"
                >
                  View Full Image
                </a>
              </CardContent>
            </Card>
          )}

          {/* Price Details */}
          <Card>
            <CardHeader>
              <CardTitle>Price Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Budget</p>
                <p className="text-sm">₹{order.budget?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm font-medium">GST (18%)</p>
                <p className="text-sm">₹{order.gst?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Payable</p>
                <p className="text-sm font-bold">₹{order.totalPayable?.toLocaleString('en-IN')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Occasion</p>
                <p className="text-sm capitalize">{order.occasion}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Size</p>
                <p className="text-sm">{order.size}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Timeline</p>
                <p className="text-sm">{order.timeline}</p>
              </div>
              {order.additionalDetails && (
                <div>
                  <p className="text-sm font-medium">Additional Notes</p>
                  <p className="text-sm whitespace-pre-wrap">{order.additionalDetails}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Order Management
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Add notes about this order..."
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleUpdate}
            disabled={updating}
            className="w-full"
          >
            {updating ? "Updating..." : "Update Order"}
          </Button>
        </div>
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