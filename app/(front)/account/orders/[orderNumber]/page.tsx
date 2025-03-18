"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

interface OrderStatus {
  status: string;
  date: string;
  description: string;
}

const statusSteps: Record<string, OrderStatus[]> = {
  pending: [
    {
      status: "Order Placed",
      date: "Just now",
      description: "Your custom design order has been received"
    }
  ],
  confirmed: [
    {
      status: "Order Placed",
      date: "Previous",
      description: "Your custom design order has been received"
    },
    {
      status: "Order Confirmed",
      date: "Just now",
      description: "Our design team has reviewed your request"
    }
  ],
  in_progress: [
    {
      status: "Order Placed",
      date: "Previous",
      description: "Your custom design order has been received"
    },
    {
      status: "Order Confirmed",
      date: "Previous",
      description: "Our design team has reviewed your request"
    },
    {
      status: "In Progress",
      date: "Just now",
      description: "Your design is being crafted by our artisans"
    }
  ],
  completed: [
    {
      status: "Order Placed",
      date: "Previous",
      description: "Your custom design order has been received"
    },
    {
      status: "Order Confirmed",
      date: "Previous",
      description: "Our design team has reviewed your request"
    },
    {
      status: "In Progress",
      date: "Previous",
      description: "Your design is being crafted by our artisans"
    },
    {
      status: "Completed",
      date: "Just now",
      description: "Your custom design is ready"
    }
  ]
};

export default function OrderTrackingPage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.orderNumber) return;
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/custom-design/${params.orderNumber}`);
        if (!response.ok) throw new Error('Failed to fetch order');
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params?.orderNumber]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
    </div>;
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">
      Order not found
    </div>;
  }

  const currentStatusSteps = statusSteps[order.status] || statusSteps.pending;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Order #{order.orderNumber}
      </h1>

      {/* Status Timeline */}
      <div className="mb-8">
        <div className="relative">
          {currentStatusSteps.map((step, index) => (
            <div key={step.status} className="flex items-start mb-8">
              <div className="flex items-center">
                <div className="bg-pink-500 rounded-full h-8 w-8 flex items-center justify-center text-white">
                  {index + 1}
                </div>
                {index < currentStatusSteps.length - 1 && (
                  <div className="h-full w-0.5 bg-pink-500 absolute ml-4" 
                       style={{ top: `${(index * 100) + 32}px`, height: '40px' }} />
                )}
              </div>
              <div className="ml-4">
                <h3 className="font-medium">{step.status}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
                <p className="text-xs text-gray-400 mt-1">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Design Details</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500">Design Type</dt>
                <dd className="font-medium">{order.designType}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Metal Type</dt>
                <dd className="font-medium">{order.metalType} ({order.materialKarat}K)</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Size</dt>
                <dd className="font-medium">{order.size}mm</dd>
              </div>
              {order.additionalDetails && (
                <div>
                  <dt className="text-sm text-gray-500">Additional Details</dt>
                  <dd className="text-sm">{order.additionalDetails}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Price Details</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>₹{order.subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between text-gray-600">
                <dt>GST</dt>
                <dd>₹{order.gst.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between text-gray-600">
                <dt>Delivery</dt>
                <dd className="text-green-500">Free</dd>
              </div>
              <div className="flex justify-between font-semibold pt-4 border-t">
                <dt>Total</dt>
                <dd>₹{order.totalPayable.toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          {order.customImage && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Design Image</h2>
              <div className="relative h-64 w-full">
                <Image
                  src={order.customImage}
                  alt="Custom Design"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 