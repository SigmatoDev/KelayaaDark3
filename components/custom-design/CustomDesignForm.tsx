"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import OrderConfirmation from "./OrderConfirmation";

export interface DesignFormData {
  // Step 1
  gender: string;
  contactNumber: string;
  designType: string;
  metalType: string;
  materialKarat: number;
  budget: number;

  // Step 2
  designMethod: string;
  stoneType?: string;
  customImage?: string;
  occasion: string;
  size: number;
  additionalDetails: string;

  // Step 3
  timeline: string;
  termsAccepted: boolean;
  customizationAccepted: boolean;
}

export default function CustomDesignForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DesignFormData>({
    gender: "",
    contactNumber: "",
    designType: "",
    metalType: "",
    materialKarat: 20,
    budget: 20000,
    designMethod: "details",
    occasion: "",
    size: 7,
    additionalDetails: "",
    timeline: "",
    termsAccepted: false,
    customizationAccepted: false,
  });
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
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between">
          <span className={step >= 1 ? "text-pink-500" : "text-gray-400"}>
            Start with your idea
          </span>
          <span className={step >= 2 ? "text-pink-500" : "text-gray-400"}>
            Design your concept
          </span>
          <span className={step >= 3 ? "text-pink-500" : "text-gray-400"}>
            Get estimates
          </span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-pink-500 rounded-full transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
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