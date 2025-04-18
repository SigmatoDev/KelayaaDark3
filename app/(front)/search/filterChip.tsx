"use client";

import { XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

type FilterChipsProps = {
  q: string;
  productCategory: string;
  category: string;
  price: string;
  rating: string;
  sort: string;
  page: string;
  materialType: string;
  collectionType: string;
};

const FilterChip = ({
  label,
  href,
  isClearAll = false,
}: {
  label: string;
  href: string;
  isClearAll?: boolean;
}) => (
  <Link
    href={href}
    className={`inline-flex items-center ${
      isClearAll ? "bg-gray-200 text-gray-700" : "bg-pink-100 text-[#e688a2]"
    } rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2`}
  >
    <span>{label}</span>
    <XMarkIcon className="w-4 h-4 ml-2" />
  </Link>
);

const FilterChips: React.FC<FilterChipsProps> = ({
  q,
  productCategory,
  category,
  price,
  rating,
  sort,
  page,
  materialType,
  collectionType,
}) => {
  const buildUrl = (omit: string, valueToRemove?: string) => {
    const params = new URLSearchParams({
      q,
      productCategory,
      category,
      price,
      rating,
      sort,
      page,
      materialType,
      collectionType,
    });

    const multiFields = [
      "productCategory",
      "category",
      "price",
      "rating",
      "materialType",
      "collectionType", // ✅ included collectionType
    ];

    if (multiFields.includes(omit) && valueToRemove) {
      const currentValues = (params.get(omit) || "").split(",");
      const updatedValues = currentValues.filter(
        (v) => v !== valueToRemove && v !== "all"
      );

      if (updatedValues.length === 0) {
        params.set(omit, "all");
      } else {
        params.set(omit, updatedValues.join(","));
      }
    } else {
      params.set(omit, "all");
    }

    return `/search?${params.toString()}`;
  };

  const renderMultiFilterChips = (
    field: string,
    values: string,
    formatLabel?: (v: string) => string
  ) => {
    if (values === "all") return null;
    return values
      .split(",")
      .filter((v) => v && v !== "all")
      .map((v) => (
        <FilterChip
          key={`${field}-${v}`}
          label={formatLabel ? formatLabel(v) : v}
          href={buildUrl(field, v)}
        />
      ));
  };

  const isAnyFilterApplied = [
    q,
    productCategory,
    category,
    price,
    rating,
    materialType,
    collectionType,
  ].some((v) => v && v !== "all");

  return (
    <div className="flex flex-wrap items-center gap-2">
      {q && q !== "all" && (
        <FilterChip label={`Search: ${q}`} href={buildUrl("q")} />
      )}

      {renderMultiFilterChips("materialType", materialType, (v) =>
        v === "gold"
          ? "Gold & Diamonds"
          : v.charAt(0).toUpperCase() + v.slice(1)
      )}

      {renderMultiFilterChips("productCategory", productCategory)}
      {renderMultiFilterChips("category", category)}

      {renderMultiFilterChips("price", price, (v) => {
        if (v.includes("+")) {
          const min = parseInt(v.replace("+", ""));
          return `Above ₹${min.toLocaleString("en-IN")}`;
        } else {
          const [min, max] = v.split("-").map(Number);
          if (min === 0) return `Under ₹${max.toLocaleString("en-IN")}`;
          return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
        }
      })}

      {renderMultiFilterChips("rating", rating, (v) => `${v} & up`)}

      {renderMultiFilterChips(
        "collectionType",
        collectionType,
        (v) => v.charAt(0).toUpperCase() + v.slice(1).replace(/-/g, " ")
      )}

      {isAnyFilterApplied && (
        <FilterChip
          label="Clear All"
          href="/search?q=all&productCategory=all&category=all&price=all&rating=all&sort=all&page=1&materialType=all&collectionType=all"
          isClearAll
        />
      )}
    </div>
  );
};

export default FilterChips;
