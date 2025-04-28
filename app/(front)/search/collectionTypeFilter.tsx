"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useLayoutService from "@/lib/hooks/useLayout";
import React from "react";

interface CollectionTypeFilterProps {
  collectionTypes: string[];
  selectedCollectionType: string;
  q: string;
  productCategory: string;
  price: string;
  rating: string;
  sort: string;
  page: string;
  materialType: string;
}

const CollectionTypeFilter = ({
  collectionTypes,
  selectedCollectionType,
  q,
  productCategory,
  price,
  rating,
  sort,
  page,
  materialType,
}: CollectionTypeFilterProps) => {
  const initialSelection =
    selectedCollectionType && selectedCollectionType !== "all"
      ? selectedCollectionType.split(",")
      : [];

  const [selected, setSelected] = useState<string[]>(initialSelection);
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();
  const { theme } = useLayoutService();

  const handleSelect = (type: string) => {
    const updated = selected.includes(type)
      ? selected.filter((t) => t !== type)
      : [...selected, type];

    setSelected(updated);

    const params: Record<string, string> = {
      q,
      materialType,
      price,
      rating,
      sort,
      page,
      collectionType: updated.length > 0 ? updated.join(",") : "all",
      productCategory: updated.length > 0 ? "collections" : "all", // <-- Key change here
    };

    const query = new URLSearchParams(params).toString();
    router.push(`/search?${query}`);
    router.refresh();
  };

  const handleClear = () => {
    setSelected([]);

    const params: Record<string, string> = {
      q,
      materialType,
      productCategory: "all", // <-- Force to 'all'
      price,
      rating,
      sort,
      page,
      collectionType: "all",
    };

    const query = new URLSearchParams(params).toString();
    router.push(`/search?${query}`);
    router.refresh();
  };

  // useEffect(() => {
  //   const params: Record<string, string> = {
  //     q,
  //     materialType,
  //     productCategory: "collections",
  //     price,
  //     rating,
  //     sort,
  //     page,
  //     collectionType: selected.length > 0 ? selected.join(",") : "all",
  //   };

  //   const query = new URLSearchParams(params).toString();
  //   router.push(`/search?${query}`);
  //   router.refresh();
  // }, [selected]);

  const checkboxStyle = (isActive: boolean) =>
    `flex items-center gap-2 cursor-pointer py-2 px-3 rounded transition-all ${
      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-pink-50"
    }`;

  const textStyle = (isActive: boolean) =>
    `${isActive ? "font-medium text-black" : ""}`;

  const visibleTypes = showMore ? collectionTypes : collectionTypes.slice(0, 4);

  useEffect(() => {
    const updatedSelection =
      selectedCollectionType && selectedCollectionType !== "all"
        ? selectedCollectionType.split(",")
        : [];
    setSelected(updatedSelection);
  }, [selectedCollectionType]);

  return (
    <div
      className={`p-4 rounded-lg ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold">Collection Type</h2>
        {selected.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-[#333] hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-col gap-0">
        {visibleTypes.map((type, index) => {
          const isActive = selected.includes(type);
          const checkboxId = `checkbox-collection-${index}`;

          return (
            <label
              key={type}
              htmlFor={checkboxId}
              className={checkboxStyle(isActive)}
            >
              <input
                type="checkbox"
                id={checkboxId}
                checked={isActive}
                onChange={() => handleSelect(type)}
                className="accent-pink-500  w-4 h-4"
              />
              <span className={`text-sm ${textStyle(isActive)}`}>{type}</span>
            </label>
          );
        })}

        {collectionTypes.length > 4 && (
          <button
            onClick={() => setShowMore((prev) => !prev)}
            className="text-sm text-[#e688a2] hover:underline mt-2 ml-1"
          >
            {showMore ? "Show Less" : `+ ${collectionTypes.length - 4} more`}
          </button>
        )}
      </div>
    </div>
  );
};

export default CollectionTypeFilter;
