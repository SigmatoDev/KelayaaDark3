"use client";

import { useState } from "react";
import useLayoutService from "@/lib/hooks/useLayout";

const materialTypes = [
  { name: "All", value: "all" },
  { name: "Gold", value: "gold" },
  { name: "Silver", value: "silver" },
  { name: "Platinum", value: "platinum" },
  // Add more material types as needed
];

const MaterialTypeDropdown = ({
  selectedMaterialType,
  onSelect,
}: {
  selectedMaterialType: string;
  onSelect: (materialType: string) => void;
}) => {
  return (
    <div className="mb-4">
      <label className="block text-lg font-semibold mb-2">Material Type</label>
      <select
        value={selectedMaterialType}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full p-2 border rounded-lg focus:outline-none"
      >
        {materialTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MaterialTypeDropdown;
