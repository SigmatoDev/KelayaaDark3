"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useLayoutService from "@/lib/hooks/useLayout";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  q: string;
  productCategory: string;
  price: string;
  rating: string;
  sort: string;
  page: string;
  materialType: string;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  q,
  productCategory,
  price,
  rating,
  sort,
  page,
  materialType,
}: CategoryFilterProps) => {
  const initialSelection =
    selectedCategory && selectedCategory !== "all"
      ? selectedCategory.split(",")
      : [];

  const [selected, setSelected] = useState<string[]>(initialSelection);
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // This is to read URL parameters directly
  const { theme } = useLayoutService();

  useEffect(() => {
    // Automatically sync the selected categories with the URL parameters
    const selectedCategoriesFromUrl = searchParams.get("productCategory");
    if (selectedCategoriesFromUrl) {
      setSelected(selectedCategoriesFromUrl.split(","));
    }
  }, [searchParams]);

  const handleSelect = (category: string) => {
    const updated = selected.includes(category)
      ? selected.filter((c) => c !== category)
      : [...selected, category];
    setSelected(updated);
  };

  const handleClear = () => setSelected([]);

  useEffect(() => {
    // When selected changes, update the URL and trigger a page refresh
    const params: Record<string, string> = {
      q,
      materialType,
      productCategory: selected.length > 0 ? selected.join(",") : "",
      price,
      rating,
      sort,
      page,
    };

    const query = new URLSearchParams(params).toString();
    router.push(`/search?${query}`);
    router.refresh();
  }, [selected, q, materialType, price, rating, sort, page]); // Also update when other dependencies change

  const checkboxStyle = (isActive: boolean) =>
    `flex items-center gap-2 cursor-pointer py-2 px-3 rounded transition-all ${
      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-pink-50"
    }`;

  const textStyle = (isActive: boolean) =>
    `${isActive ? "font-medium text-black" : ""}`;

  // List of categories you want to display (excluding "all")
  const allCategories = [
    "Bangle Pair",
    "Bangles",
    "Bracelets",
    "Earrings",
    "Pendants",
    "Rings",
    "Sets",
    "Toe Rings",
  ];

  // If productCategory is "all", we don't want to display it in the checkbox
  const filteredCategories = productCategory === "all" ? allCategories.filter(category => category !== "All") : allCategories;

  const visibleCategories = showMore ? filteredCategories : filteredCategories.slice(0, 4);

  useEffect(() => {
    if (productCategory === "all" && selected.length > 0) {
      setSelected([]);
    }
  }, [productCategory]);

  return (
    <div
      className={`p-4 rounded-lg ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold">Categories</h2>
        {selected.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-[#333 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-col gap-0">
        {visibleCategories.map((category, index) => {
          const isActive = selected.includes(category);
          const checkboxId = `checkbox-${index}`; // Unique ID for each checkbox

          return (
            <label
              key={category}
              htmlFor={checkboxId} // Link the label to the input checkbox by ID
              className={checkboxStyle(isActive)}
            >
              <input
                type="checkbox"
                id={checkboxId} // Unique ID for the checkbox
                checked={isActive}
                onChange={() => handleSelect(category)} // Allow for state toggle
                className="accent-pink-500 w-4 h-4"
              />
              <span className={`text-sm ${textStyle(isActive)}`}>

                {category}
              </span>
            </label>
          );
        })}

        {allCategories.length > 4 && (
          <button
            onClick={() => setShowMore((prev) => !prev)}
            className="text-sm text-pink-600 hover:underline mt-2 ml-1"
          >
            {showMore ? "Show Less" : `+ ${filteredCategories.length - 4} more`}
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
