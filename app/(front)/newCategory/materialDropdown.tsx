"use client";

import { useState } from "react";
import Link from "next/link";
import useLayoutService from "@/lib/hooks/useLayout";

const MaterialTypeDropdown = ({
  materials,
  selectedMaterialType,
  q,
  materialType,
  price,
  rating,
  sort,
  page,
  productCategory,
}: {
  materials: string[];
  selectedMaterialType: string;
  q: string;
  materialType: string;
  price: string;
  rating: string;
  sort: string;
  page: string;
  productCategory: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useLayoutService();

  const buildFilterUrl = ({ m }: { m?: string }) => {
    const params: any = {
      q,
      materialType,
      productCategory,
      price,
      rating,
      sort,
      page,
    };
    if (m) params.materialType = m;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const handleSelect = () => setIsOpen(false);

  return (
    <div
      className={`p-4 rounded-lg shadow-md ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">Material Type</h2>
      <div className="relative">
        {/* Dropdown Toggle Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full px-4 py-2 text-left border rounded-lg focus:outline-none transition-all ${
            selectedMaterialType !== "all"
              ? "ring-1 ring-pink-500"
              : "border-gray-300"
          }`}
        >
          {selectedMaterialType === "all"
            ? "Select Material Type"
            : selectedMaterialType.charAt(0).toUpperCase() +
              selectedMaterialType.slice(1)}
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
                href={buildFilterUrl({ m: "all" })}
                onClick={handleSelect}
                className={`block px-4 py-2 rounded ${
                  selectedMaterialType === "all"
                    ? "bg-[#EC4999] text-white"
                    : "hover:bg-pink-50"
                }`}
              >
                All
              </Link>
            </li>

            {/* Material Options */}
            {materials.map((material) => (
              <li key={material}>
                <Link
                  href={buildFilterUrl({ m: material })}
                  onClick={handleSelect}
                  className={`block px-4 py-2 rounded ${
                    selectedMaterialType === material
                      ? "bg-[#EC4999] text-white font-semibold"
                      : "hover:bg-pink-50"
                  }`}
                >
                  {material.charAt(0).toUpperCase() + material.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MaterialTypeDropdown;
