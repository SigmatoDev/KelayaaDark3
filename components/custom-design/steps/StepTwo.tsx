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

export default function StepTwo({ data, onChange, onNext, onBack }: StepTwoProps) {
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
      image: "/images/stones/diamond.jpg",
      label: "Diamond"
    },
    {
      type: "gemstone",
      image: "/images/stones/gemstone.jpg",
      label: "Gemstone"
    },
    {
      type: "no stone",
      image: "/images/stones/no-stone.jpg",
      label: "No Stone"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Design your concept</h2>

      {/* Design Method Toggle */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => onChange({ ...data, designMethod: "details" })}
          className={`px-6 py-2 rounded-full ${
            data.designMethod === "details"
              ? "bg-pink-500 text-white"
              : "bg-gray-100"
          }`}
        >
          I have details
        </button>
        <button
          onClick={() => onChange({ ...data, designMethod: "image" })}
          className={`px-6 py-2 rounded-full ${
            data.designMethod === "image"
              ? "bg-pink-500 text-white"
              : "bg-gray-100"
          }`}
        >
          I have image
        </button>
      </div>

      {/* Stone Selection or Image Upload */}
      {data.designMethod === "details" ? (
        <div className="space-y-4">
          <label className="block text-sm font-medium">Select Stone Type</label>
          <div className="grid grid-cols-3 gap-4">
            {stoneTypes.map((stone) => (
              <div
                key={stone.type}
                onClick={() => onChange({ ...data, stoneType: stone.type })}
                className={`cursor-pointer rounded-lg p-4 border-2 transition-all ${
                  data.stoneType === stone.type
                    ? "border-pink-500"
                    : "border-transparent hover:border-pink-200"
                }`}
              >
                <div className="relative h-32 mb-2">
                  <Image
                    src={stone.image}
                    alt={stone.label}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <p className="text-center">{stone.label}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="block text-sm font-medium">Upload Reference Image</label>
          <ImageUpload
            imageUrl={data.customImage}
            onImageUploaded={(url) => onChange({ ...data, customImage: url })}
            setIsUploading={setIsUploading}
          />
        </div>
      )}

      {/* Occasion Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">What is the occasion for?</label>
        <div className="flex gap-4">
          {["wedding", "engagement"].map((occasion) => (
            <button
              key={occasion}
              type="button"
              onClick={() => onChange({ ...data, occasion })}
              className={`px-6 py-2 rounded-lg border capitalize ${
                data.occasion === occasion
                  ? "bg-pink-500 text-white border-pink-500"
                  : "border-gray-300 hover:border-pink-500"
              }`}
            >
              {occasion}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Size (mm)</label>
        <select
          value={data.size}
          onChange={(e) => onChange({ ...data, size: parseInt(e.target.value) })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
        >
          {Array.from({ length: 14 }, (_, i) => i + 7).map((size) => (
            <option key={size} value={size}>
              {size}mm
            </option>
          ))}
        </select>
      </div>

      {/* Additional Details */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Additional Details</label>
        <textarea
          value={data.additionalDetails}
          onChange={(e) =>
            onChange({ ...data, additionalDetails: e.target.value })
          }
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 h-32"
          placeholder="Describe any specific requirements or preferences..."
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!validateForm() || isUploading}
          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          Next Step
        </button>
      </div>
    </div>
  );
} 