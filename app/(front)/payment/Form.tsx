"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import useCartService from "@/lib/hooks/useCartStore";

const Form = () => {
  const router = useRouter();
  const [selectedPaymentType, setSelectedPaymentType] = useState<
    "PhonePe" | "CashOnDelivery"
  >("PhonePe");
  const [selectedPhonePeOption, setSelectedPhonePeOption] =
    useState<string>("UPI");

  const { savePaymentMethod, paymentMethod, shippingAddress } =
    useCartService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPaymentType === "CashOnDelivery") {
      savePaymentMethod("CashOnDelivery");
    } else {
      savePaymentMethod(`PhonePe - ${selectedPhonePeOption}`);
    }

    router.push("/place-order");
  };

  useEffect(() => {
    if (!shippingAddress) {
      router.push("/shipping");
    }
    if (paymentMethod) {
      if (paymentMethod.includes("CashOnDelivery")) {
        setSelectedPaymentType("CashOnDelivery");
      } else {
        setSelectedPaymentType("PhonePe");
      }
    }
  }, [paymentMethod, router, shippingAddress]);

  return (
    <div>
      <CheckoutSteps current={2} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg">
        {/* Left - Payment Method Type */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Choose Payment Method</h2>
          <div className="space-y-2">
            {["PhonePe", "CashOnDelivery"].map((type) => (
              <div key={type} className="flex items-center space-x-3">
                <input
                  type="radio"
                  id={type}
                  value={type}
                  name="paymentType"
                  checked={selectedPaymentType === type}
                  onChange={() =>
                    setSelectedPaymentType(type as "PhonePe" | "CashOnDelivery")
                  }
                  className="radio radio-primary"
                />
                <label htmlFor={type} className="text-sm font-medium">
                  {type === "CashOnDelivery"
                    ? "Cash on Delivery (COD)"
                    : "Pay with PhonePe"}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Right - PhonePe Options */}
        {selectedPaymentType === "PhonePe" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">
              Choose PhonePe Payment Option
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "UPI",
                "Wallet",
                "Credit Card",
                "Debit Card",
                "Net Banking",
              ].map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={option}
                    value={option}
                    name="phonepeOption"
                    checked={selectedPhonePeOption === option}
                    onChange={() => setSelectedPhonePeOption(option)}
                    className="radio radio-secondary"
                  />
                  <label htmlFor={option} className="text-sm font-medium">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="col-span-2 mt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <button
              type="submit"
              className="btn bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold w-full"
            >
              Next
            </button>
            <button
              type="button"
              className="btn w-full"
              onClick={() => router.back()}
            >
              Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
