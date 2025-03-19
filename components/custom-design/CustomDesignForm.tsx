"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import OrderConfirmation from "./OrderConfirmation";

export interface DesignFormData {
  // Step One fields
  gender: string;
  contactNumber: string;
  countryCode: string;  // Always a string, never null
  designType: string;
  metalType: string;
  materialKarat: number | null;
  budget: number;
  occasion: string;
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
  gender: '',
  contactNumber: '',
  countryCode: '+91', // Default to India's country code
  designType: '',
  metalType: '',
  materialKarat: null,
  budget: 0,
  occasion: '',
  productName: '',
  weight: undefined,

  // Step Two initial values
  designMethod: 'details',
  stoneType: '',
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
      <div className="mb-12">
        <div className="relative flex justify-between max-w-2xl mx-auto px-4">
          {/* Connecting lines */}
          <div className="absolute top-[20px] left-[12%] right-[12%] h-[1px] bg-gray-200">
            <div 
              className="h-full bg-[#EC4999] transition-all"
              style={{ width: `${(step - 1) * 50}%` }}
            />
          </div>

          {/* Step 1 */}
          <div className="flex flex-col items-center relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium ${
              step > 1 ? "bg-[#EC4999] text-white" : step === 1 ? "bg-[#EC4999] text-white" : "bg-gray-200 text-gray-500"
            }`}>
              {step > 1 ? (
                // Replace this with your check icon SVG
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : "01"}
            </div>
            <span className={`mt-2 text-sm ${
              step >= 1 ? "text-[#EC4999]" : "text-gray-400"
            }`}>
              Start with your idea
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium ${
              step > 2 ? "bg-[#EC4999] text-white" : step === 2 ? "bg-[#EC4999] text-white" : "bg-gray-200 text-gray-500"
            }`}>
              {step > 2 ? (
                // Replace this with your check icon SVG
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : "02"}
            </div>
            <span className={`mt-2 text-sm ${
              step >= 2 ? "text-[#EC4999]" : "text-gray-400"
            }`}>
              Design your concepts
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium ${
              step > 3 ? "bg-[#EC4999] text-white" : step === 3 ? "bg-[#EC4999] text-white" : "bg-gray-200 text-gray-500"
            }`}>
              {step > 3 ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : "03"}
            </div>
            <span className={`mt-2 text-sm ${
              step >= 3 ? "text-[#EC4999]" : "text-gray-400"
            }`}>
              Get Estimates
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