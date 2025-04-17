"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useLayoutService from "@/lib/hooks/useLayout";

const priceRanges = [
  { name: "Under ₹1,000", value: "0-1000" },
  { name: "₹1,000 - ₹5,000", value: "1000-5000" },
  { name: "₹5,000 - ₹10,000", value: "5000-10000" },
  { name: "₹10,000 - ₹25,000", value: "10000-25000" },
  { name: "₹25,000 - ₹50,000", value: "25000-50000" },
  { name: "₹50,000 - ₹1,00,000", value: "50000-100000" },
  { name: "₹1,00,000 - ₹2,00,000", value: "100000-200000" },
  { name: "₹2,00,000 - ₹5,00,000", value: "200000-500000" },
  { name: "Above ₹5,00,000", value: "500000-10000000" },
];

const PriceFilter = ({
  selectedPrice,
  materialType,
  q,
  productCategory,
  rating,
  sort,
  page,
}: {
  selectedPrice: string;
  materialType: string;
  q: string;
  productCategory: string;
  rating: string;
  sort: string;
  page: string;
}) => {
  const router = useRouter();
  const { theme } = useLayoutService();
  const selectedValues =
    selectedPrice === "all" ? [] : selectedPrice.split(",");
  const [showMore, setShowMore] = useState(false);

  const togglePriceValue = (value: string) => {
    const updated = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    const params = new URLSearchParams({
      q,
      materialType,
      productCategory,
      rating,
      sort,
      page,
      price: updated.length ? updated.join(",") : "all",
    });
    router.push(`/search?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams({
      q,
      materialType,
      productCategory,
      rating,
      sort,
      page,
      price: "all",
    });
    router.push(`/search?${params.toString()}`);
  };

  const visibleRanges = showMore ? priceRanges : priceRanges.slice(0, 4);

  return (
    <div
      className={`p-4 rounded-lg ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Price Range</h2>
        {selectedValues.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-pink-600 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="space-y-2">
        {visibleRanges.map((range) => {
          const isSelected = selectedValues.includes(range.value);
          return (
            <label
              key={range.value}
              className={`flex items-center gap-1 cursor-pointer py-1 px-3 rounded transition-all ${
                isSelected
                  ? "font-medium text-[#EC4999]"
                  : theme === "dark"
                  ? "hover:bg-gray-700"
                  : "hover:bg-pink-50"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => togglePriceValue(range.value)}
                className="accent-pink-500 w-4 h-4"
              />
              <span className="text-sm">{range.name}</span>
            </label>
          );
        })}

        {/* Show More / Less toggle (centered) */}
        {priceRanges.length > 4 && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowMore((prev) => !prev)}
              className="text-sm text-pink-600 hover:underline mt-2"
            >
              {showMore ? "Show Less" : `+ ${priceRanges.length - 4} more`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceFilter;
