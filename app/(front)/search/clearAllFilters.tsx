"use client";

import { useRouter, useSearchParams } from "next/navigation";

const ClearAllFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClearAll = () => {
    const params = new URLSearchParams();

    // Reset all relevant filters to default values
    params.set("q", "");
    params.set("materialType", "all");
    params.set("productCategory", "all");
    params.set("category", "all");
    params.set("price", "all");
    params.set("rating", "all");
    params.set("sort", "default");
    params.set("page", "1");

    router.push(`/search?${params.toString()}`);
    router.refresh();
  };

  return (
    <div className="">
      <button
        onClick={handleClearAll}
        className="text-sm text-[#e688a2] hover:underline"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default ClearAllFilters;
