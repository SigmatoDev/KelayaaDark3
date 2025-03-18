"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import OrderConfirmation from "./OrderConfirmation";

export interface DesignFormData {
  // Step One fields
  name: string;
  email: string;
  phone: string;
  occasion: string;
  budget: number;
  metalType: string;
  karat: number;
  productName: string;
  weight?: number;

  // Step Two fields
  designMethod: 'details' | 'upload';
  stoneType?: string;
  customImage?: string;
  additionalDetails?: string;

  // Step Three fields
  timeline: Date | null;
  personalConsultation: boolean;
  termsAccepted: boolean;
  customizationAccepted: boolean;

  // Price calculation fields
  basePrice?: number;
  gst?: number;
  deliveryCharge?: number;
  discount?: number;
}

export const initialFormData: DesignFormData = {
  // Step One initial values
  name: '',
  email: '',
  phone: '',
  occasion: '',
  budget: 0,
  metalType: 'Gold',
  karat: 22,
  productName: 'Wedding Ring',
  weight: 4.4,

  // Step Two initial values
  designMethod: 'details',
  stoneType: 'Diamonds',
  customImage: '',
  additionalDetails: '',

  // Step Three initial values
  timeline: null,
  personalConsultation: false,
  termsAccepted: false,
  customizationAccepted: false,

  // Price calculation initial values
  basePrice: 27499,
  gst: 281,
  deliveryCharge: 0,
  discount: 500
};

export default function CustomDesignForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DesignFormData>(initialFormData);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/custom-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit design");
      }

      setOrderNumber(data.design.orderNumber);
      setShowConfirmation(true);
      toast.success("Design submitted successfully!");
    } catch (error: any) {
      console.error("Error submitting design:", error);
      toast.error(error.message || "Failed to submit design");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return <OrderConfirmation orderNumber={orderNumber} />;
  }

  return (
    <div className="w-[100%] mx-auto ">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative flex justify-center gap-20">
          {/* Connecting lines - adjusted width to match new spacing */}
          <div className="absolute top-4 left-[30%] right-[15%] h-[2px] bg-gray-200" style={{ width: '42%' }}>
            <div 
              className="h-full bg-pink-500 transition-all"
              style={{ width: `${(step - 1) * 50}%` }}
            />
          </div>

          {/* Step 1 */}
          <div className="flex flex-col items-center relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-500"
            }`}>
              01
            </div>
            <span className={`mt-2 text-sm ${
              step >= 1 ? "text-pink-500" : "text-gray-400"
            }`}>
              Start with your idea
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-500"
            }`}>
              02
            </div>
            <span className={`mt-2 text-sm ${
              step >= 2 ? "text-pink-500" : "text-gray-400"
            }`}>
              Design your concept
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-500"
            }`}>
              03
            </div>
            <span className={`mt-2 text-sm ${
              step >= 3 ? "text-pink-500" : "text-gray-400"
            }`}>
              Get estimates
            </span>
          </div>
        </div>
      </div>

      {/* Form Steps */}
      {step === 1 && (
        <StepOne
          data={formData}
          onChange={setFormData}
          onNext={handleNext}
        />
      )}
      {step === 2 && (
        <StepTwo
          data={formData}
          onChange={setFormData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 3 && (
        <StepThree
          data={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onBack={handleBack}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
} 