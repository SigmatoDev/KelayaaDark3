"use client";
import { DesignFormData } from "../CustomDesignForm";

interface StepOneProps {
  data: DesignFormData;
  onChange: (data: DesignFormData) => void;
  onNext: () => void;
}

export default function StepOne({ data, onChange, onNext }: StepOneProps) {
  const validateForm = () => {
    return (
      data.gender &&
      data.contactNumber &&
      data.designType &&
      data.metalType &&
      data.materialKarat &&
      data.budget >= 20000
    );
  };

  return (
    <div className="max-w-6xl w-full mx-auto py-8">
      <div className="space-y-8 bg-[#f5f4f0] px-28 py-16 rounded-lg">
        {/* Gender Selection */}
        <div className="grid grid-cols-[280px_1fr] items-center gap-12">
          <label className="text-gray-700 text-sm">I Am Creating For</label>
          <div className="relative">
            <select
              value={data.gender}
              onChange={(e) => onChange({ ...data, gender: e.target.value })}
              className="w-full p-3 pr-12 appearance-none border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
            >
              <option value="">Female (For Myself)</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
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
          <label className="text-gray-700 text-sm">Contact Number*</label>
          <input
            type="tel"
            value={data.contactNumber}
            onChange={(e) => onChange({ ...data, contactNumber: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
            placeholder="Enter"
          />
        </div>

        {/* Design Type */}
        <div className="grid grid-cols-[280px_1fr] items-start gap-12">
          <label className="text-gray-700 text-sm pt-2">I Would Like To Design</label>
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
                }`}
              >
                <span className="text-2xl mb-2">{icon}</span>
                <span className="text-xs text-gray-600">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Metal Type */}
        <div className="grid grid-cols-[280px_1fr] items-start gap-12">
          <label className="text-gray-700 text-sm pt-2">Metal Type</label>
          <div className="grid grid-cols-2 gap-4 max-w-xs">
            <button
              onClick={() => onChange({ ...data, metalType: "gold" })}
              className={`flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border transition-all ${
                data.metalType === "gold"
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-pink-300"
              }`}
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
              }`}
            >
              <span className="text-2xl mb-2">⚪</span>
              <span className="text-xs text-gray-600">SILVER</span>
            </button>
          </div>
        </div>

        {/* Material Type */}
        <div className="grid grid-cols-[280px_1fr] items-center gap-12">
          <label className="text-gray-700 text-sm">Material Type</label>
          <div className="relative">
            <select
              value={data.materialKarat}
              onChange={(e) => onChange({ ...data, materialKarat: parseInt(e.target.value) })}
              className="w-full p-3 pr-12 appearance-none border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
            >
              <option value="">14 Karat Gold</option>
              <option value="20">20 Karat</option>
              <option value="24">24 Karat</option>
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
          <label className="text-gray-700 text-sm">What Is Budget Your Looking For This Design</label>
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
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <span className="text-sm text-gray-600">Max. Amount</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-center mt-14">
        <button
          onClick={onNext}
          disabled={!validateForm()}
          className="w-[150px] bg-gradient-to-r from-pink-500 to-orange-400 text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
