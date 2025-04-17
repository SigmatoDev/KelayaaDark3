"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useLayoutService from "@/lib/hooks/useLayout";

interface StyleFilterProps {
  category: string[];
  selectedCategory: string;
  q: string;
  productCategory: string;
  price: string;
  rating: string;
  sort: string;
  page: string;
  materialType: string;
}

const StyleFilter = ({
  category,
  selectedCategory,
  q,
  productCategory,
  price,
  rating,
  sort,
  page,
  materialType,
}: StyleFilterProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();
  const { theme } = useLayoutService();
  const searchParams = useSearchParams(); // To access the URL parameters

  // 🧪 Debug logs
  console.log("Initial selectedCategory prop:", selectedCategory);
  console.log("Received categories:", category);

  // Sync selected categories with URL when it changes
  useEffect(() => {
    const selectedCategoriesFromUrl = searchParams.get("category");
    if (selectedCategoriesFromUrl) {
      setSelected(selectedCategoriesFromUrl.split(","));
    }
  }, [searchParams]);

  // ✅ Only update selected state if selectedCategory prop changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      const split = selectedCategory.split(",");
      setSelected(split);
      console.log("Initial selection state:", split);
    } else {
      setSelected([]);
      console.log("Initial selection state: []");
    }
  }, [selectedCategory]);

  const handleSelect = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((c) => c !== item)
      : [...selected, item];
    setSelected(updated);
    console.log("Updated selected filters:", updated);
  };

  const handleClear = () => setSelected([]);

  useEffect(() => {
    const params: Record<string, string> = {
      q,
      materialType,
      productCategory,
      category: selected.length > 0 ? selected.join(",") : "all",
      price,
      rating,
      sort,
      page,
    };

    const query = new URLSearchParams(params).toString();
    const url = `/search?${query}`;
    console.log("Navigating to:", url);
    router.push(url);
    router.refresh();
  }, [selected]);

  const checkboxStyle = (isActive: boolean) =>
    `flex items-center gap-2 cursor-pointer py-2 px-3 rounded transition-all ${
      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-pink-50"
    }`;

  const textStyle = (isActive: boolean) =>
    `${isActive ? "font-medium text-black" : ""}`;

  const visibleItems = showMore ? category : category.slice(0, 6);

  useEffect(() => {
    if (selectedCategory === "all" && selected.length > 0) {
      setSelected([]);
    }
  }, [selectedCategory]);

  return (
    <div
      className={`p-4 rounded-lg ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold">Browse by Type</h2>
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
        {visibleItems.map((item, index) => {
          const isActive = selected.includes(item);
          return (
            <label
              key={item}
              onClick={() => handleSelect(item)}
              className={checkboxStyle(isActive)}
            >
              <input
                type="checkbox"
                checked={isActive}
                readOnly
                className="accent-pink-500 w-4 h-4"
              />
              <span className={`text-sm ${textStyle(isActive)}`}>{item}</span>
            </label>
          );
        })}

        {category.length > 6 && (
          <button
            onClick={() => setShowMore((prev) => !prev)}
            className="text-sm text-pink-600 hover:underline mt-2 ml-1"
          >
            {showMore ? "Show Less" : `+ ${category.length - 6} more`}
          </button>
        )}
      </div>
    </div>
  );
};

export default StyleFilter;
