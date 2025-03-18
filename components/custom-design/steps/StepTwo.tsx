"use client";

import { useState } from "react";
import Image from "next/image";
import { DesignFormData } from "../CustomDesignForm";
import ImageUpload from "../ImageUpload";

interface StepTwoProps {
  data: DesignFormData;
  onChange: (data: DesignFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ data, onChange, onNext, onBack }) => {
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = () => {
    if (data.designMethod === "details") {
      return data.stoneType && data.occasion && data.size;
    }
    return data.customImage && data.occasion && data.size;
  };

  const stoneTypes = [
    {
      type: "diamond",
      image: "/dm.jpg",
      label: "DIAMOND"
    },
    {
      type: "gemstone",
      image: "/dm.jpg",
      label: "COLOURED\nGEMSTONE"
    },
    {
      type: "no stone",
      image: "/dm.jpg",
      label: "NO STONE"
    }
  ];

  const StoneOption = ({ stone }: { stone: typeof stoneTypes[0] }) => (
    <div className="flex flex-col items-center">
      <button
        onClick={() => onChange({ ...data, stoneType: stone.type })}
        className="group relative w-full focus:outline-none"
      >
        <div className="relative w-full aspect-square">
          <Image
            src={stone.image}
            alt={stone.label}
            fill
            className={`object-cover rounded-lg transition-opacity duration-200 ${
              data.stoneType === stone.type
                ? "opacity-100"
                : "opacity-70 group-hover:opacity-100"
            }`}
          />
          {data.stoneType === stone.type && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </button>
      <p className="text-[13px] text-gray-900 text-center tracking-[1px] uppercase font-medium mt-5">
        {stone.label}
      </p>
    </div>
  );

  return (
    <div className="max-w-6xl w-full mx-auto py-8 overflow-x-hidden">
      <div className="space-y-6 bg-[#f5f4f0] px-28 py-14 rounded-lg">
        {/* Design Method Toggle */}
        <div className="flex justify-center">
          <div className="w-[500px]">
            <div className="flex items-center justify-between border-b border-gray-200">
              <button
                onClick={() => onChange({ ...data, designMethod: "details" })}
                className={`text-sm pb-4 border-b-2 -mb-[1px] transition-colors ${
                  data.designMethod === "details"
                    ? "border-pink-500 text-pink-500 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                I have details of the idea of my design
              </button>
              <button
                onClick={() => onChange({ ...data, designMethod: "image" })}
                className={`text-sm pb-4 border-b-2 -mb-[1px] transition-colors ${
                  data.designMethod === "image"
                    ? "border-pink-500 text-pink-500 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                I have images that I can upload
              </button>
            </div>
          </div>
        </div>

        <div className="pt-16 space-y-8">
          {data.designMethod === "details" ? (
            /* Stone Selection */
            <div className="grid grid-cols-[280px_1fr] items-start gap-12">
              <label className="text-gray-700 text-sm pt-2">
                What Types Of Center Stones Might You Be Considering For Your Ring?
              </label>
              <div className="rounded-lg hover:border-gray-300 transition-colors">
                <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                  {stoneTypes.map((stone) => (
                    <StoneOption key={stone.type} stone={stone} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Image Upload */
            <div className="grid grid-cols-[280px_1fr] items-start gap-9">
              <label className="text-gray-700 text-sm pt-2">
                Upload Your Reference Images
              </label>
              <div className="rounded-lg hover:border-gray-300 transition-colors">
                <ImageUpload
                  imageUrl={data.customImage}
                  onImageUploaded={(url) => onChange({ ...data, customImage: url })}
                  setIsUploading={setIsUploading}
                />
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Supported formats: JPG, PNG, GIF (max. 10MB)
                </p>
              </div>
            </div>
          )}

          {/* Occasion Selection */}
          <div className="grid grid-cols-[280px_1fr] items-center gap-12">
            <label className="text-gray-700 text-sm">What Is The Occasion For</label>
            <div className="relative">
              <select
                value={data.occasion}
                onChange={(e) => onChange({ ...data, occasion: e.target.value })}
                className="w-full h-[50px] px-4 pr-12 appearance-none border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:ring-opacity-50 bg-white hover:border-gray-300 transition-colors text-gray-700"
              >
                <option value="">Wedding</option>
                <option value="engagement">Engagement</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Size Selection */}
          <div className="grid grid-cols-[280px_1fr] items-center gap-12">
            <label className="text-gray-700 text-sm">Size Of The Ring</label>
            <div className="relative">
              <select
                value={data.size}
                onChange={(e) => onChange({ ...data, size: parseInt(e.target.value) })}
                className="w-full h-[50px] px-4 pr-12 appearance-none border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:ring-opacity-50 bg-white hover:border-gray-300 transition-colors text-gray-700"
              >
                <option value="">15 MM</option>
                {Array.from({ length: 14 }, (_, i) => i + 7).map((size) => (
                  <option key={size} value={size}>
                    {size} MM
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-[280px_1fr] items-start gap-12">
            <label className="text-gray-700 text-sm pt-2">Describe More Details</label>
            <textarea
              value={data.additionalDetails}
              onChange={(e) => onChange({ ...data, additionalDetails: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:ring-opacity-50 bg-white hover:border-gray-300 transition-colors h-32 resize-none text-gray-700 placeholder-gray-400"
              placeholder="Enter"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center max-w-[500px] mx-auto mt-14">
        <button
          onClick={onBack}
          className="px-8 py-3 border border-gray-200 rounded-lg text-gray-700 hover:border-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!validateForm() || isUploading}
          className={`px-8 py-3 rounded-lg text-white transition-colors ${
            validateForm() && !isUploading
              ? "bg-pink-500 hover:bg-pink-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepTwo;