"use client";

import useLayoutService from "@/lib/hooks/useLayout";
import Link from "next/link";

const prices = [
  { name: "₹1 to ₹50", value: "1-50" },
  { name: "₹51 to ₹200", value: "51-200" },
  { name: "₹1800 to ₹2500", value: "1800-2500" },
];

const PriceFilter = ({
  selectedPrice,
  q,
  productCategory,
  rating,
  sort,
  page,
}: {
  selectedPrice: string;
  q: string;
  productCategory: string;
  rating: string;
  sort: string;
  page: string;
}) => {
  const buildFilterUrl = ({ p }: { p?: string }) => {
    const params = {
      q,
      productCategory,
      price: selectedPrice,
      rating,
      sort,
      page,
    };
    if (p) params.price = p;
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
      <h2 className="text-lg font-semibold mb-4">Price</h2>
      <ul className="space-y-2">
        {/* <li>
          <Link
            href={buildFilterUrl({ p: "all" })}
            className={`block p-2 rounded-md ${
              selectedPrice === "all"
                ? "bg-green-500 text-white"
                : theme === "dark"
                ? "hover:bg-gray-700"
                : "hover:bg-green-100"
            }`}
          >
            Any
          </Link>
        </li> */}
        {prices.map((p) => (
          <li key={p.value}>
            <Link
              href={buildFilterUrl({ p: p.value })}
              className={`block p-2 rounded-md ${
                selectedPrice === p.value
                  ? "bg-green-500 text-white"
                  : theme === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-green-100"
              }`}
            >
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PriceFilter;
