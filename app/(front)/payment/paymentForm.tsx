"use client";
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";

const PaymentForm = ({
  orderId,
  productName,
  amount,
  customerName,
  customerAddress,
}: {
  orderId: string;
  productName: string;
  amount: number;
  customerName: string;
  customerAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!stripe || !elements) {
      alert("Stripe is not ready yet.");
      return;
    }

    try {
      setLoading(true);

      // Dynamic description for the transaction
      const description = `Order ID: ${orderId} - Product: ${productName}`;

      // Call your backend to create a PaymentIntent
      const { data } = await axios.post("/api/stripe", {
        amount, // Amount in cents
        description, // Dynamic description
        customerName, // Customer name
        customerAddress, // Customer address
      });

      if (!data.paymentIntent || !data.paymentIntent.client_secret) {
        throw new Error("Failed to create payment intent.");
      }

      // Confirm the payment using the client secret
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.paymentIntent.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (error) {
        console.error("Payment failed:", error.message);
        setErrorMessage(error.message || "Payment failed. Please try again.");
      } else if (paymentIntent) {
        setSuccessMessage("Payment successful!");
        router.push("/payment/success");
        console.log("Payment Intent:", paymentIntent);
        // Navigate to a success page or update the UI as needed
      }
    } catch (error: any) {
      console.error("Error during payment initialization:", error.message);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-4 border rounded"
    >
      <h2 className="text-lg font-bold mb-4">Complete Your Payment</h2>
      <p className="mb-2">
        You are purchasing: <strong>{productName}</strong>
      </p>
      <p className="mb-4">
        Order ID: <strong>{orderId}</strong>
      </p>
      <p className="mb-4">
        Amount: <strong>₹{amount.toFixed(2)}</strong>
      </p>

      {/* Customer Information */}
      <div className="mb-4">
        <label htmlFor="customerName" className="block">
          Customer Name
        </label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => {}}
          className="input input-bordered w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="customerAddress" className="block">
          Customer Address
        </label>
        <input
          type="text"
          id="customerAddress"
          placeholder="Address Line 1"
          value={customerAddress.line1}
          onChange={(e) => {}}
          className="input input-bordered w-full"
        />
      </div>

      <div className="mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#fa755a",
              },
            },
          }}
        />
      </div>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default PaymentForm;
