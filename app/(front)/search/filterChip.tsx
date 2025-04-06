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
};

const FilterChip = ({ label, href }: { label: string; href: string }) => (
  <Link
    href={href}
    className="inline-flex items-center bg-pink-100 text-pink-600 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2"
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
}) => {
  const buildUrl = (omit: string) => {
    const params = new URLSearchParams({
      q,
      productCategory,
      category,
      price,
      rating,
      sort,
      page,
      materialType,
    });

    params.set(omit, "all");
    return `/search?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {q !== "all" && (
        <FilterChip label={`Search: ${q}`} href={buildUrl("q")} />
      )}
      {productCategory !== "all" && (
        <FilterChip
          // label={`Category: ${productCategory}`}
          label={`${productCategory}`}
          href={buildUrl("productCategory")}
        />
      )}
      {category !== "all" && (
        <FilterChip
          // label={`Subcategory: ${category}`}
          label={`${category}`}
          href={buildUrl("category")}
        />
      )}
      {price !== "all" && (
        <FilterChip
          // label={`Price: ${price}`}
          label={`${price}`}
          href={buildUrl("price")}
        />
      )}
      {rating !== "all" && (
        <FilterChip
          label={`${rating} & up`}
          href={buildUrl("rating")}
        />
      )}
    </div>
  );
};

export default FilterChips;
