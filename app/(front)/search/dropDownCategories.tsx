"use client";

import { useState } from "react";
import Link from "next/link";
import useLayoutService from "@/lib/hooks/useLayout";

const CategoryDropdown = ({
  categories,
  selectedCategory,
  q,
  productCategory,
  price,
  rating,
  sort,
  page,
  materialType,
}: {
  categories: string[];
  selectedCategory: string;
  q: string;
  productCategory: string;
  price: string;
  rating: string;
  sort: string;
  page: string;
  materialType: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const buildFilterUrl = ({ c }: { c?: string }) => {
    const params = {
      q,
      materialType,
      productCategory,
      price,
      rating,
      sort,
      page,
    };
    if (c) params.productCategory = c;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const handleSelect = () => {
    setIsOpen(false); // Close dropdown after selecting an item
  };

  const { theme } = useLayoutService();

  return (
    <div
      className={`p-4 rounded-lg shadow-md ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="relative">
        {/* Dropdown Toggle Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full px-4 py-2 text-left border rounded-lg focus:outline-none transition-all ${
            selectedCategory !== "all"
              ? "ring-1 ring-pink-500"
              : "border-gray-300"
          }`}
        >
          {selectedCategory === "all" ? "Select Category" : selectedCategory}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 ml-2 inline-block transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
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
          <ul className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto  bg-white text-black  border rounded-lg shadow-lg">
            <li>
              <Link
                href={buildFilterUrl({ c: "all" })}
                onClick={handleSelect}
                className={`block px-4 py-2 hover:bg-blue-100 ${
                  selectedCategory === "all" ? "bg-[#EC4999] text-white" : ""
                }`}
              >
                All
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={buildFilterUrl({ c: category })}
                  onClick={handleSelect}
                  className={`block px-4 py-2 ${
                    selectedCategory === category
                      ? theme === "dark"
                        ? "bg-[#EC4999] text-white"
                        : "hover:bg-pink-50"
                      : theme === "dark"
                        ? "bg-[#EC4999] text-white"
                        : "hover:bg-pink-50"
                  }`}
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryDropdown;
