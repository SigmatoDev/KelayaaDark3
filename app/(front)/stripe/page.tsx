"use client";
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useCartService from "@/lib/hooks/useCartStore";
import PaymentForm from "./paymentForm"; // Adjust this import according to your file structure
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const PaymentPage = () => {
  const router = useRouter();
  // Retrieve cart details from useCartService
  const { items, shippingAddress, totalPrice } = useCartService();

  // If there are no items, we can assume that the cart is empty, and redirect to another page or show a message.
  if (items.length === 0) {
    router.push("/cart");
    return;
  }

  // Example: Assuming the first item in the cart is the product you're purchasing
  const productName = items[0].name; // Use the first product's name, or combine all product names if needed
  const orderId = `ORD${new Date().getTime()}`; // Example order ID using timestamp

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        orderId={orderId}
        productName={productName}
        amount={totalPrice}
        customerName={shippingAddress.firstName}
        customerAddress={{
          line1: shippingAddress.streetAddress1,
          line2: "", // Assuming shippingAddress doesn't contain line2
          city: shippingAddress.city,
          state: "", // Assuming shippingAddress doesn't have state
          postal_code: shippingAddress.postalCode,
          country: shippingAddress.country,
        }}
      />
    </Elements>
  );
};

export default PaymentPage;
