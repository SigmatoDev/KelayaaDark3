"use client";

import Link from "next/link";
import { Rating } from "@/components/products/Rating";
import useLayoutService from "@/lib/hooks/useLayout";

const RatingFilter = ({
  selectedRating,
  q,
  productCategory,
  price,
  sort,
  page,
}: {
  selectedRating: string;
  q: string;
  productCategory: string;
  price: string;
  sort: string;
  page: string;
}) => {
  const ratings = [5, 4, 3, 2, 1];

  const buildFilterUrl = ({ r }: { r?: string }) => {
    const params = {
      q,
      productCategory,
      price,
      sort,
      page,
      rating: selectedRating,
    };
    if (r) params.rating = r;
    return `/search?${new URLSearchParams(params).toString()}`;
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
      <h2 className="text-lg font-semibold mb-4">Customer Rating</h2>
      <ul className="flex flex-col gap-2">
        {ratings.map((r) => {
          const isSelected = `${r}` === selectedRating;
          return (
            <li key={r}>
              <Link
                href={buildFilterUrl({ r: `${r}` })}
                className={`flex items-center justify-between gap-2 p-2 rounded-md border transition-all ${
                  isSelected
                    ? "border-pink-500 bg-pink-50 text-pink-600 font-semibold"
                    : "hover:bg-pink-50 border-gray-200"
                }`}
              >
                <Rating
                  caption="& up"
                  value={r}
                  textColor={isSelected ? "text-pink-600" : "text-gray-800"}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RatingFilter;
