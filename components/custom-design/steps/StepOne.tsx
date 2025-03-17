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
    <div className="space-y-10 w-full mx-auto py-8 px-4 flex flex-col justify-center items-center">
      {/* <h2 className="text-2xl font-semibold mb-6">Start with your idea</h2> */}
      <div className="w-full mx-auto py-8 px-4 bg-[#f5f4f0] flex flex-col gap-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* Gender Selection */}
          <div className="space-y-2 flex items-center gap-5">
            <label className="block text-sm font-medium">
              I am creating for
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => onChange({ ...data, gender: "male" })}
                className={`px-6 py-2 rounded-lg border ${
                  data.gender === "male"
                    ? "bg-pink-500 text-white border-pink-500"
                    : "border-gray-300 hover:border-pink-500"
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...data, gender: "female" })}
                className={`px-6 py-2 rounded-lg border ${
                  data.gender === "female"
                    ? "bg-pink-500 text-white border-pink-500"
                    : "border-gray-300 hover:border-pink-500"
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Contact Number */}
          <div className="space-y-2 flex items-center gap-5 ">
            <label className="block text-sm font-medium">Contact Number</label>
            <input
              type="tel"
              value={data.contactNumber}
              onChange={(e) =>
                onChange({ ...data, contactNumber: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your contact number"
            />
          </div>

          {/* Design Type */}
          <div className="space-y-2 flex items-center gap-5">
            <label className="block text-sm font-medium">
              I would like to Design
            </label>
            <div className="flex gap-2">
              {["Rings", "Bracelets", "Bangles", "Necklaces", "Earings"].map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onChange({ ...data, designType: type })}
                    className={`px-4 py-2 rounded-lg border ${
                      data.designType === type
                        ? "bg-pink-500 text-white border-pink-500"
                        : "border-gray-300 hover:border-pink-500"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Metal Type */}
          <div className="space-y-2 flex items-center gap-5">
            <label className="block text-sm font-medium">Metal Type</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => onChange({ ...data, metalType: "gold" })}
                className={`px-6 py-2 rounded-lg border ${
                  data.metalType === "gold"
                    ? "bg-pink-500 text-white border-pink-500"
                    : "border-gray-300 hover:border-pink-500"
                }`}
              >
                Gold
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...data, metalType: "silver" })}
                className={`px-6 py-2 rounded-lg border ${
                  data.metalType === "silver"
                    ? "bg-pink-500 text-white border-pink-500"
                    : "border-gray-300 hover:border-pink-500"
                }`}
              >
                Silver
              </button>
            </div>
          </div>

          {/* Material Karat */}
          {data.metalType === "gold" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Material Type</label>
              <div className="flex gap-4">
                {[20, 24].map((karat) => (
                  <button
                    key={karat}
                    type="button"
                    onClick={() => onChange({ ...data, materialKarat: karat })}
                    className={`px-6 py-2 rounded-lg border ${
                      data.materialKarat === karat
                        ? "bg-pink-500 text-white border-pink-500"
                        : "border-gray-300 hover:border-pink-500"
                    }`}
                  >
                    {karat} Karat
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Budget */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Budget (Minimum ₹20,000)
            </label>
            <input
              type="number"
              min="20000"
              value={data.budget}
              onChange={(e) =>
                onChange({ ...data, budget: parseInt(e.target.value) })
              }
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your budget"
            />
          </div>
        </div>
      </div>
      {/* Next Button */}
      <div className="pt-6">
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
