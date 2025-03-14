"use client";
import { useState } from "react";
import Image from "next/image";
import { DesignFormData } from "../CustomDesignForm";

interface StepThreeProps {
  data: DesignFormData;
  onChange: (data: DesignFormData) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function StepThree({
  data,
  onChange,
  onSubmit,
  onBack,
  isSubmitting,
}: StepThreeProps) {
  const [couponCode, setCouponCode] = useState("");

  // Calculate prices (you can adjust these calculations)
  const subtotal = data.budget;
  const gst = subtotal * 0.18;
  const deliveryCharge = 0; // Free delivery
  const discount = 0; // Will be updated when coupon is applied
  const totalPayable = subtotal + gst + deliveryCharge - discount;

  const validateForm = () => {
    return data.timeline && data.termsAccepted && data.customizationAccepted;
  };

  const handleSubmit = async () => {
    await onSubmit();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column - Form Fields */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6">Additional Details</h2>

        {/* Timeline Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Expected Timeline</label>
          <select
            value={data.timeline}
            onChange={(e) => onChange({ ...data, timeline: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select Timeline</option>
            <option value="1-2 weeks">1-2 weeks</option>
            <option value="2-4 weeks">2-4 weeks</option>
            <option value="1-2 months">1-2 months</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        {/* Terms Acceptance */}
        <div className="space-y-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={data.termsAccepted}
              onChange={(e) =>
                onChange({ ...data, termsAccepted: e.target.checked })
              }
              className="mt-1"
            />
            <span className="text-sm text-gray-600">
              I understand that this is a custom design and the final product may
              vary slightly from the design shown. No returns or exchanges will be
              accepted for custom designs.
            </span>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={data.customizationAccepted}
              onChange={(e) =>
                onChange({ ...data, customizationAccepted: e.target.checked })
              }
              className="mt-1"
            />
            <span className="text-sm text-gray-600">
              I agree to discuss any customization requirements with the design team
              and understand that additional charges may apply based on
              modifications.
            </span>
          </label>
        </div>
      </div>

      {/* Right Column - Price Summary */}
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          {/* Design Preview */}
          {data.customImage && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Your Design</p>
              <div className="relative h-48 w-full">
                <Image
                  src={data.customImage}
                  alt="Custom Design"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (18%)</span>
              <span>₹{gst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span className="text-green-500">Free</span>
            </div>

            {/* Coupon Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 p-2 border rounded-lg"
              />
              <button
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                onClick={() => {
                  // Add coupon validation logic here
                }}
              >
                Apply
              </button>
            </div>

            {/* Total */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-semibold">
                <span>Total Payable</span>
                <span>₹{totalPayable.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <div className="space-x-4">
            <button
              onClick={() => {
                // Add save design logic here
              }}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Save Design
            </button>
            <button
              onClick={handleSubmit}
              disabled={!validateForm() || isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 