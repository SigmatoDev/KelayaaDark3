"use client";

import useLayoutService from "@/lib/hooks/useLayout";
import Link from "next/link";

const prices = [
  { name: "₹8290 to ₹82900", value: "8290-82900" },
  { name: "₹82900 to ₹165800", value: "82900-165800" },
  { name: "₹165800 to ₹331600", value: "165800-331600" },
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
                  ? "bg-[#EC4999] text-white"
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
