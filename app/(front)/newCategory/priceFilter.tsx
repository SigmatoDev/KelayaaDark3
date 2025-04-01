"use client";

import { useState } from "react";
import Link from "next/link";
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
  materialType, // Add materialType as prop
  q,
  productCategory,
  rating,
  sort,
  page,
}: {
  selectedPrice: string;
  materialType: string; // Include materialType in the type definition
  q: string;
  productCategory: string;
  rating: string;
  sort: string;
  page: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useLayoutService();

  // Updated function to include materialType in the URL
  const buildFilterUrl = ({ p }: { p?: string }) => {
    const params: any = {
      q,
      materialType,
      productCategory,
      price: selectedPrice,
      rating,
      sort,
      page,
    };
    if (p) params.price = p;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const handleSelect = () => setIsOpen(false);

  return (
    <div
      className={`p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}`}
    >
      <h2 className="text-lg font-semibold mb-4">Price Range</h2>
      <div className="relative">
        {/* Dropdown Toggle Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full px-4 py-2 text-left border rounded-lg focus:outline-none transition-all ${
            selectedPrice !== "all" ? "ring-1 ring-pink-500" : "border-gray-300"
          }`}
        >
          {selectedPrice
            ? priceRanges.find((p) => p.value === selectedPrice)?.name ||
              "Select Price Range"
            : "Select Price Range"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 ml-2 inline-block transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <ul className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto bg-white text-black border rounded-lg shadow-lg">
            {/* 'All' Option */}
            <li>
              <Link
                href={buildFilterUrl({ p: "all" })}
                onClick={handleSelect}
                className={`block px-4 py-2 rounded ${
                  selectedPrice === "all"
                    ? "bg-[#EC4999] text-white"
                    : "hover:bg-pink-50"
                }`}
              >
                All
              </Link>
            </li>

            {/* Price Range Options */}
            {priceRanges.map((range) => (
              <li key={range.value}>
                <Link
                  href={buildFilterUrl({ p: range.value })}
                  onClick={handleSelect}
                  className={`block px-4 py-2 rounded ${
                    selectedPrice === range.value
                      ? "bg-[#EC4999] text-white font-semibold"
                      : "hover:bg-pink-50"
                  }`}
                >
                  {range.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PriceFilter;
