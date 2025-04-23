// components/MobileFilter.tsx
"use client";

import { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";

export default function MobileFilter({
  materialTypeDropdown,
  categoryDropdown,
  priceFilter,
  collectionTypeFilter,
}: {
  materialTypeDropdown: React.ReactNode;
  categoryDropdown: React.ReactNode;
  priceFilter: React.ReactNode;
  collectionTypeFilter: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-5 right-5 bg-pink-500 text-white p-4 rounded-full shadow-lg md:hidden z-50"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="w-6 h-6" />
      </button>

      {/* Mobile Filter Panel */}
      {open && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button onClick={() => setOpen(false)}>
              <X className="w-7 h-7 text-gray-600" />
            </button>
          </div>

          {/* Filters Content */}
          <div className="space-y-6">
            {materialTypeDropdown}
            {categoryDropdown}
            {priceFilter}
            {collectionTypeFilter}
          </div>

          <button
            onClick={() => setOpen(false)}
            className="w-full mt-8 bg-pink-500 text-white py-3 rounded-md font-semibold shadow hover:bg-pink-600 transition"
          >
            Apply Filters
          </button>
        </div>
      )}
    </>
  );
}
