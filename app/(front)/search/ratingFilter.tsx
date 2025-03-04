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
      <h2 className="text-lg font-semibold mb-4">Customer Review</h2>
      <ul className="space-y-2">
        {/* <li>
          <Link
            href={buildFilterUrl({ r: "all" })}
            className={`block p-2 rounded-md ${
              selectedRating === "all"
                ? "bg-yellow-500 text-white"
                : "hover:bg-yellow-100"
            }`}
          >
            Any
          </Link>
        </li> */}
        {ratings.map((r) => (
          <li key={r}>
            <Link
              href={buildFilterUrl({ r: `${r}` })}
              className={`block p-2 rounded-md ${
                `${r}` === selectedRating
                  ? "bg-yellow-500 text-white"
                  : "hover:bg-yellow-100"
              }`}
            >
              <Rating caption={"& up"} value={r} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RatingFilter;
