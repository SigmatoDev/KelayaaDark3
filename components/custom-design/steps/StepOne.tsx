"use client";
import { DesignFormData } from "../CustomDesignForm";
import React from 'react';

interface StepOneProps {
  data: DesignFormData;
  onChange: (data: DesignFormData) => void;
  onNext: () => void;
}

export default function StepOne({ data, onChange, onNext }: StepOneProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize country code if not set
  React.useEffect(() => {
    if (!data.countryCode) {
      onChange({ ...data, countryCode: '+91' });
    }
  }, []);

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      onChange({ ...data, countryCode: value });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      onChange({ ...data, contactNumber: value });
    }
  };

  const validateForm = () => {
    const validations = {
      gender: !!data.gender,
      phone: data.contactNumber?.length === 10,
      designType: !!data.designType,
      metalType: !!data.metalType,
      materialKarat: data.materialKarat !== null,
      budget: data.budget >= 20000
    };

    const isValid = Object.values(validations).every(Boolean);
    return isValid;
  };

  const handleNext = async () => {
    if (validateForm() && !isSubmitting) {
      try {
        setIsSubmitting(true);
        await onNext();
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isPhoneValid = data.contactNumber?.length === 10;
  const isPhoneEntered = data.contactNumber?.length > 0;
  const isPhoneError = isPhoneEntered && !isPhoneValid;

  return (
    <div className="max-w-6xl w-full mx-auto py-8">
      <div className="space-y-8 bg-[#f5f4f0] px-28 py-16 rounded-lg">
        {/* Gender Selection */}
        <div className="grid grid-cols-[280px_1fr] items-center gap-12">
          <label className="text-gray-700 text-sm text-right">I Am Creating For</label>
          <div className="relative">
            <select
              value={data.gender}
              onChange={(e) => onChange({ ...data, gender: e.target.value })}
              className="w-full p-3 pr-12 appearance-none border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
              disabled={isSubmitting}
            >
              <option value="">Choose who you are creating for</option>
              <option value="myself">For Myself</option>
              <option value="someone else">For Someone Else</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contact Number */}
        <div className="grid grid-cols-[280px_1fr] items-center gap-12">
          <label className="text-gray-700 text-sm text-right" id="phone-label">Contact Number*</label>
          <div className="flex gap-2">
            <div className="relative w-28">
              <select
                value={data.countryCode}
                onChange={handleCountryCodeChange}
                className={`w-full p-3 pr-8 appearance-none border rounded-lg focus:outline-none transition-colors ${
                  isPhoneValid 
                    ? 'border-[#D23F57] bg-pink-50' 
                    : isPhoneError
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200'
                } hover:border-[#D23F57] disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-labelledby="phone-label"
                aria-required="true"
                aria-invalid={isPhoneError}
                disabled={isSubmitting}
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+65">🇸🇬 +65</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg className={`h-4 w-4 ${isPhoneValid ? 'text-[#D23F57]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="flex-1 relative">
              <input
                type="tel"
                value={data.contactNumber}
                onChange={handlePhoneChange}
                pattern="[0-9]{10}"
                minLength={10}
                maxLength={10}
                className={`w-full p-3 border rounded-lg focus:outline-none transition-colors ${
                  isPhoneValid 
                    ? 'border-[#D23F57] bg-pink-50' 
                    : isPhoneError
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200'
                } hover:border-[#D23F57] disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Enter 10-digit number"
                aria-labelledby="phone-label"
                aria-required="true"
                aria-invalid={isPhoneError}
                aria-describedby={isPhoneError ? "phone-error" : undefined}
                disabled={isSubmitting}
              />
              {isPhoneError && (
                <div id="phone-error" className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-red-500" role="alert">
                  {10 - (data.contactNumber?.length || 0)} digits remaining
                </div>
              )}
              {isPhoneValid && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true">
                  <svg className="h-5 w-5 text-[#D23F57]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Design Type */}
        <div className="grid grid-cols-[280px_1fr] items-start gap-12">
          <label className="text-gray-700 text-sm pt-2 text-right" >I Would Like To Design</label>
          <div className="grid grid-cols-5 gap-4">
            {[
              { type: "Rings", icon: "💍" },
              { type: "Bracelets", icon: "⚜️" },
              { type: "Bangles", icon: "⭕" },
              { type: "Necklaces", icon: "📿" },
              { type: "Earrings", icon: "👂" }
            ].map(({ type, icon }) => (
              <button
                key={type}
                onClick={() => onChange({ ...data, designType: type })}
                className={`flex flex-col items-center bg-gray-50 justify-center p-4 rounded-lg border transition-all ${
                  data.designType === type
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 hover:border-pink-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isSubmitting}
              >
                <span className="text-2xl mb-2">{icon}</span>
                <span className="text-xs text-gray-600">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Metal Type */}
        <div className="grid grid-cols-[280px_1fr] items-start gap-12">
          <label className="text-gray-700 text-sm pt-2 text-right">Metal Type</label>
          <div className="grid grid-cols-2 gap-4 max-w-xs">
            <button
              onClick={() => onChange({ ...data, metalType: "gold" })}
              className={`flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border transition-all ${
                data.metalType === "gold"
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-pink-300"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={isSubmitting}
            >
              <span className="text-2xl mb-2">✨</span>
              <span className="text-xs text-gray-600">GOLD</span>
            </button>
            <button
              onClick={() => onChange({ ...data, metalType: "silver" })}
              className={`flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg border transition-all ${
                data.metalType === "silver"
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-pink-300"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={isSubmitting}
            >
              <span className="text-2xl mb-2">⚪</span>
              <span className="text-xs text-gray-600">SILVER</span>
            </button>
          </div>
        </div>

        {/* Material Type */}
        <div className="grid grid-cols-[280px_1fr] items-center gap-12">
          <label className="text-gray-700 text-sm text-right">Material Type</label>
          <div className="relative">
            <select
              value={data.materialKarat}
              onChange={(e) => onChange({ ...data, materialKarat: parseInt(e.target.value) })}
              className="w-full p-3 pr-12 appearance-none border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
              disabled={isSubmitting}
            >
              <option value="">Select material karat</option>
              <option value="14">14 Karat Gold</option>
              <option value="20">20 Karat Gold</option>
              <option value="24">24 Karat Gold</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="grid grid-cols-[280px_1fr] items-center gap-12">
          <label className="text-gray-700 text-sm text-right">What Is Budget Your Looking For This Design</label>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="number"
                value={20000}
                disabled
                className="w-full p-3 pr-24 border text-gray-900 placeholder:text-gray-900 border-gray-200 rounded-lg bg-gray-50"
                placeholder="Min. Amount"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <span className="text-sm text-gray-600">Min. Amount</span>
              </div>
            </div>
            <div className="flex-1 relative">
              <input
                type="number"
                value={data.budget}
                onChange={(e) => onChange({ ...data, budget: parseInt(e.target.value) })}
                className="w-full p-3 pr-24 border text-gray-900 placeholder:text-gray-900 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
                placeholder="Enter"
                disabled={isSubmitting}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <span className="text-sm text-gray-600">Max. Amount</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          disabled={!validateForm() || isSubmitting}
          className={`px-8 py-3 rounded-lg font-medium transition-colors relative ${
            validateForm() && !isSubmitting
              ? 'bg-[#D23F57] text-white hover:bg-[#c03a51]'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          aria-label={
            isSubmitting 
              ? "Submitting form..." 
              : validateForm() 
                ? "Continue to next step" 
                : "Please fill in all required fields"
          }
        >
          {isSubmitting ? (
            <>
              <span className="opacity-0">Next</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </div>
  );
}
