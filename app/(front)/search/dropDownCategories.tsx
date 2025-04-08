"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const { theme } = useLayoutService();

  const handleSelect = (category: string) => {
    const updated = selected.includes(category)
      ? selected.filter((c) => c !== category)
      : [...selected, category];
    setSelected(updated);
  };

  const handleClear = () => setSelected([]);

  useEffect(() => {
    const params: Record<string, string> = {
      q,
      materialType,
      productCategory: selected.length > 0 ? selected.join(",") : "all",
      price,
      rating,
      sort,
      page,
    };

    const query = new URLSearchParams(params).toString();
    router.push(`/search?${query}`);
    router.refresh();
  }, [selected]);

  const checkboxStyle = (isActive: boolean) =>
    `flex items-center gap-2 cursor-pointer py-2 px-3 rounded transition-all ${
      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-pink-50"
    }`;

  const textStyle = (isActive: boolean) =>
    `${isActive ? "font-medium text-black" : ""}`;

  const visibleCategories = showMore ? categories : categories.slice(0, 4);

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
        <h2 className="text-lg font-semibold">Categories</h2>
        {selected.length > 0 && (
          <button
            onClick={handleClear}
            className="text-sm text-pink-600 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {visibleCategories.map((category) => {
          const isActive = selected.includes(category);
          return (
            <label
              key={category}
              onClick={() => handleSelect(category)}
              className={checkboxStyle(isActive)}
            >
              <input
                type="checkbox"
                checked={isActive}
                readOnly
                className="accent-pink-500 w-4 h-4"
              />
              <span className={textStyle(isActive)}>{category}</span>
            </label>
          );
        })}

        {categories.length > 4 && (
          <button
            onClick={() => setShowMore((prev) => !prev)}
            className="text-sm text-pink-600 hover:underline mt-2 ml-1"
          >
            {showMore ? "Show Less" : `+ ${categories.length - 4} more`}
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
