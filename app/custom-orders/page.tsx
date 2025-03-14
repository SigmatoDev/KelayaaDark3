"use client";
import { useEffect, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import Image from "next/image";

export default function UserCustomOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/custom-design');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Heading 
        title="My Custom Orders" 
        description="Track and manage your custom design orders"
      />
      <Separator className="my-6" />

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No orders found</h3>
          <p className="text-gray-500 mt-2">Start creating your custom design today!</p>
          <Link 
            href="/custom-design"
            className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Create Custom Design
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.orderNumber} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  {/* Order Info */}
                  <div className="space-y-2">
                    <Link 
                      href={`/custom-orders/${order.orderNumber}`}
                      className="text-lg font-medium hover:text-primary"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Design Details */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Design Type</p>
                    <p className="text-sm capitalize">{order.designType}</p>
                    <p className="text-sm font-medium mt-2">Metal Type</p>
                    <p className="text-sm capitalize">{order.metalType}</p>
                  </div>

                  {/* Image Preview */}
                  <div className="relative h-24 md:h-32">
                    {order.customImage ? (
                      <Image
                        src={order.customImage}
                        alt="Design Preview"
                        fill
                        className="object-contain rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Price and Action */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium">Total Amount</p>
                      <p className="text-lg font-bold">
                        ₹{order.totalPayable?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <Link
                      href={`/custom-orders/${order.orderNumber}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 mt-2"
                    >
                      View Details
                    </Link>
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