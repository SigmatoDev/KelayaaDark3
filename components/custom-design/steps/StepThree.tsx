"use client";

import { useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DesignFormData } from "../CustomDesignForm";

interface StepThreeProps {
  data: DesignFormData;
  onChange: (data: DesignFormData) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const StepThree: React.FC<StepThreeProps> = ({
  data,
  onChange,
  onSubmit,
  onBack,
  isSubmitting,
}: StepThreeProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(true);
  const [showValidationError, setShowValidationError] = useState(false);

  // Calculate prices
  const basePrice = data.basePrice || 27499.00;
  const subtotal = basePrice;
  const gst = data.gst || 281.00;
  const deliveryCharge = data.deliveryCharge || 0;
  const discount = couponApplied ? data.discount || 500 : 0;
  const totalPayable = subtotal + gst + deliveryCharge - discount;

  // Format product details
  const getProductDetails = () => {
    const parts = [];
    parts.push('1 Qty');
    if (data.metalType) parts.push(data.metalType);
    if (data.karat) parts.push(`${data.karat} kart`);
    if (data.stoneType) parts.push(`With ${data.stoneType}`);
    return parts.join(' | ');
  };

  const validateForm = () => {
    return !!(
      data.personalConsultation && 
      data.termsAccepted && 
      data.timeline && 
      data.customizationAccepted
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setShowValidationError(true);
      return;
    }
    await onSubmit();
  };

  const handleSaveDesign = () => {
    console.log("Saving design...");
  };

  // Calculate min and max dates
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  const handleDateChange = (date: Date | null) => {
    setShowValidationError(false);
    onChange({
      ...data,
      timeline: date
    });
  };

  const handleCheckboxChange = (field: keyof Pick<DesignFormData, 'personalConsultation' | 'termsAccepted' | 'customizationAccepted'>) => {
    setShowValidationError(false);
    onChange({
      ...data,
      [field]: !data[field]
    });
  };

  const isValid = validateForm();

  return (
    <div className="max-w-6xl w-full mx-auto py-8">
      <div className="space-y-12 bg-[#f5f4f0] px-28 py-16 rounded-lg">
        <div className="grid grid-cols-[1fr_400px] gap-16">
          {/* Left Column - Additional Details */}
          <div>
            <h3 className="text-[15px] text-gray-700 font-medium mb-8">Additional Details</h3>
            <div className="space-y-6">
              {/* Expected Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-700">Expected Timeline for this design requirement</span>
                  <div className="text-[13px] text-gray-500">
                  {data.timeline ? new Date(data.timeline).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : '14th Mar 2025'}
                </div>
                </div>
                <div className="relative">
                  <DatePicker
                    selected={data.timeline}
                    onChange={handleDateChange}
                    minDate={minDate}
                    maxDate={maxDate}
                    dateFormat="dd MMM yyyy"
                    placeholderText="Select delivery date"
                    className={`w-full px-4 py-2 text-[13px] text-gray-700 border rounded-lg focus:outline-none ${
                      showValidationError && !data.timeline
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-pink-500"
                    }`}
                  />
                  {showValidationError && !data.timeline && (
                    <p className="text-red-500 text-[11px] mt-1">Please select a delivery date</p>
                  )}
                </div>
                <div className="text-[13px] text-gray-500">
                  {getProductDetails()}
                </div>
              </div>

              {/* Personal Consultation */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div 
                  className={`w-5 h-5 rounded-[4px] border ${
                    data.personalConsultation 
                      ? "bg-pink-500 border-pink-500" 
                      : showValidationError
                        ? "border-red-500"
                        : "border-gray-300"
                  } flex items-center justify-center transition-colors`}
                  onClick={() => handleCheckboxChange('personalConsultation')}
                >
                  {data.personalConsultation && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[13px] text-gray-700">
                  I opt for personal consultation for this design requirement
                </span>
              </label>

              {/* Terms & Conditions */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div 
                  className={`w-5 h-5 rounded-[4px] border ${
                    data.termsAccepted 
                      ? "bg-pink-500 border-pink-500" 
                      : showValidationError
                        ? "border-red-500"
                        : "border-gray-300"
                  } flex items-center justify-center transition-colors`}
                  onClick={() => handleCheckboxChange('termsAccepted')}
                >
                  {data.termsAccepted && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[13px] text-gray-700">
                  I agree the terms & Conditions & make 15% of advance payment for this design
                </span>
              </label>

              {/* Customization Acceptance */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div 
                  className={`w-5 h-5 rounded-[4px] border ${
                    data.customizationAccepted 
                      ? "bg-pink-500 border-pink-500" 
                      : showValidationError
                        ? "border-red-500"
                        : "border-gray-300"
                  } flex items-center justify-center transition-colors`}
                  onClick={() => handleCheckboxChange('customizationAccepted')}
                >
                  {data.customizationAccepted && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[13px] text-gray-700">
                  I understand and accept potential customization requirements
                </span>
              </label>

              {showValidationError && (
                <p className="text-red-500 text-[11px]">Please complete all required fields before proceeding</p>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <h3 className="text-[15px] text-gray-700 font-medium mb-8">Order Summary</h3>
            <div className="bg-white rounded-lg p-6 space-y-6">
              {/* Selected Design Preview */}
              {data.customImage && (
                <div className="mb-6">
                  <p className="text-[13px] text-gray-700 mb-3">Selected Design</p>
                  <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <Image
                      src={data.customImage}
                      alt="Selected Design"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Product Details */}
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-[15px]">{data.productName}</h4>
                  <p className="text-[13px] text-gray-500">{getProductDetails()}</p>
                  <p className="text-[13px] font-medium mt-1">₹{basePrice.toLocaleString()}.00</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-600">Sub Total</span>
                  <span>₹{subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-600">GST</span>
                  <span>₹{gst.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-600">Home Delivery available</span>
                  <span className="text-green-600">Free</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-[13px] items-center">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>COUPON APPLIED</span>
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-green-600">-₹{discount.toLocaleString()}.00</span>
                  </div>
                )}
              </div>

              {/* Bank Offers */}
              <div className="flex items-center gap-2 text-[13px] text-pink-500 border border-dashed border-pink-200 rounded-lg p-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>SBI Bank Offers Available</span>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between text-[15px]">
                  <span className="font-medium">Estimated Total Payable</span>
                  <span className="font-medium">₹{totalPayable.toLocaleString()}.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={onBack}
            className="px-8 py-2.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 hover:border-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSaveDesign}
            className="px-8 py-2.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 hover:border-gray-300 transition-colors"
          >
            Save Design
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={`px-8 py-2.5 rounded-lg text-[13px] text-white transition-colors ${
              isValid && !isSubmitting
                ? "bg-pink-500 hover:bg-pink-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepThree;