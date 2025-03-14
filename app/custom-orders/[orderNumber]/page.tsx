"use client";
import { useEffect, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import Image from "next/image";
import Link from "next/link";

export default function OrderDetail({ params }: { params: { orderNumber: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/custom-design/${params.orderNumber}`);
        if (!response.ok) throw new Error('Failed to fetch order details');
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [params.orderNumber]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between">
        <Heading
          title={`Order ${order.orderNumber}`}
          description="Custom Design Order Details"
        />
        <StatusBadge status={order.status} />
      </div>
      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <CardTitle>Your Design</CardTitle>
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
            </CardContent>
          </Card>
        )}

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Size</p>
              <p className="text-sm">{order.size}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Occasion</p>
              <p className="text-sm capitalize">{order.occasion}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Timeline</p>
              <p className="text-sm">{order.timeline}</p>
            </div>
          </CardContent>
        </Card>

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
            <div className="pt-2 border-t">
              <p className="text-sm font-medium">Total Amount</p>
              <p className="text-lg font-bold">₹{order.totalPayable?.toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${order.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                <div>
                  <p className="font-medium">Order Placed</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {/* Add more status steps based on your order flow */}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href="/custom-orders"
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );
} 