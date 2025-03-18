"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import Image from "next/image";

interface CustomOrder {
  orderNumber: string;
  status: string;
  createdAt: string;
  customImage: string;
  designType: string;
  metalType: string;
  budget: number;
  specifications: {
    size: string;
    occasion: string;
    stoneType: string;
  };
}

export default function CustomOrderHistory() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Custom Order History</h1>
        <Card>
          <CardContent className="flex justify-center items-center h-40">
            <p className="text-gray-500">No custom orders found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Custom Order History</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.orderNumber} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  Order #{order.orderNumber}
                </CardTitle>
                <StatusBadge status={order.status} />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Design Image */}
                <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                  {order.customImage ? (
                    <Image
                      src={order.customImage}
                      alt="Design"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">No image available</p>
                    </div>
                  )}
                </div>

                {/* Order Details */}
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Design Type</p>
                    <p>{order.designType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Metal Type</p>
                    <p>{order.metalType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Size</p>
                    <p>{order.specifications.size}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Stone Type</p>
                    <p>{order.specifications.stoneType}</p>
                  </div>
                </div>

                {/* Price and Timeline */}
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Budget</p>
                    <p className="text-lg font-semibold">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR'
                      }).format(order.budget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order Date</p>
                    <p>{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Occasion</p>
                    <p>{order.specifications.occasion}</p>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-4">Order Timeline</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {getOrderTimeline(order.status).map((step, index) => (
                      <div key={index} className="relative flex items-center">
                        <div className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          step.completed ? 'bg-green-50 border-green-500' : 'bg-white border-gray-300'
                        }`}>
                          {step.completed && (
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-12">
                          <p className="font-medium">{step.title}</p>
                          <p className="text-sm text-gray-500">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getOrderTimeline(status: string) {
  const steps = [
    {
      title: 'Order Placed',
      description: 'Your custom design order has been received',
      completed: true
    },
    {
      title: 'Design Review',
      description: 'Our team is reviewing your design requirements',
      completed: ['processing', 'approved', 'in_production', 'completed'].includes(status)
    },
    {
      title: 'Design Approved',
      description: 'Your design has been approved and finalized',
      completed: ['approved', 'in_production', 'completed'].includes(status)
    },
    {
      title: 'In Production',
      description: 'Your jewelry is being crafted',
      completed: ['in_production', 'completed'].includes(status)
    },
    {
      title: 'Completed',
      description: 'Your custom jewelry is ready',
      completed: ['completed'].includes(status)
    }
  ];

  return steps;
} 