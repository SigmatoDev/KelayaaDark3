"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Order History',
};

export default function OrderHistory() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (status === "loading") return;
      
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/orders/mine');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }
        
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          Loading...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">Please sign in to view your orders</h3>
          <Link 
            href="/signin" 
            className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-10 text-red-600">
          <h3 className="text-lg font-medium">Error loading orders</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Heading 
        title="Order History" 
        description="View and track your orders"
      />
      <Separator className="my-6" />

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No orders found</h3>
          <p className="text-gray-500 mt-2">Start shopping to see your orders here!</p>
          <Link 
            href="/products"
            className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id || order.orderNumber}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Order Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Link 
                        href={`/order/${order.orderNumber}`}
                        className="text-lg font-medium hover:text-primary"
                      >
                        Order #{order.orderNumber}
                      </Link>
                      <StatusBadge 
                        status={
                          order.isDelivered 
                            ? 'delivered' 
                            : order.isPaid 
                              ? 'processing' 
                              : 'pending'
                        } 
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date not available'}
                    </p>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-4">
                      {order.items?.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          {item.image && (
                            <div className="relative w-16 h-16">
                              <Image
                                src={item.image}
                                alt={item.name || 'Product'}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">{item.name || 'Product'}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.qty} × ₹{(item.price || 0).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total and Actions */}
                  <div className="flex flex-col justify-between items-end">
                    <div className="text-right">
                      <p className="text-sm font-medium">Total Amount</p>
                      <p className="text-lg font-bold">
                        ₹{(order.totalPrice || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <Link
                      href={`/order/${order.orderNumber}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
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
