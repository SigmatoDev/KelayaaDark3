"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useLayoutService from "@/lib/hooks/useLayout";

type Props = {
  materials: string[];
  selectedMaterialType: string; // comma-separated e.g. "gold,silver"
  q: string;
  materialType: string;
  price: string;
  rating: string;
  sort: string;
  page: string;
  productCategory: string;
};

const MaterialTypeFilter = ({
  materials,
  selectedMaterialType,
  q,
  materialType,
  price,
  rating,
  sort,
  page,
  productCategory,
}: Props) => {
  const initialSelection = selectedMaterialType
    ? selectedMaterialType.split(",").filter((m) => m !== "all")
    : [];
  const [selected, setSelected] = useState<string[]>(initialSelection);
  const { theme } = useLayoutService();
  const router = useRouter();

  const updateURL = (newSelection: string[]) => {
    const params: any = {
      q,
      materialType: newSelection.length > 0 ? newSelection.join(",") : "all",
      productCategory,
      price,
      rating,
      sort,
      page,
    };

    const query = new URLSearchParams(params).toString();
    router.push(`/search?${query}`);
    router.refresh(); // Triggers new server data
  };

  const handleChange = (material: string) => {
    let updatedSelection = [...selected];

    if (selected.includes(material)) {
      updatedSelection = updatedSelection.filter((m) => m !== material);
    } else {
      updatedSelection.push(material);
    }

    setSelected(updatedSelection);
    updateURL(updatedSelection);
  };

  const handleClearAll = () => {
    setSelected([]);
    updateURL([]);
  };

  useEffect(() => {
    if (materialType === "all" && selected.length > 0) {
      setSelected([]);
    }
  }, [materialType]);

  const checkboxStyle =
    "flex items-center gap-2 cursor-pointer py-2 px-3 rounded hover:bg-pink-50 dark:hover:bg-gray-700 transition-all";

  return (
    <div
      className={`p-4 rounded-lg  ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Material Type</h2>
        {selected.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-pink-600 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {materials.map((material) => (
          <label key={material} className={checkboxStyle}>
            <input
              type="checkbox"
              checked={selected.includes(material)}
              onChange={() => handleChange(material)}
              className="accent-pink-500 w-4 h-4"
            />
            <span
              className={`transition-all ${
                selected.includes(material)
                  ? "text-black font-font-medium	"
                  : "text-inherit"
              }`}
            >
              {material === "gold"
                ? "Gold & Diamonds"
                : material.charAt(0).toUpperCase() + material.slice(1)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MaterialTypeFilter;
