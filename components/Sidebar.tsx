"use client";

import Link from "next/link";
import useSWR from "swr";

import useLayoutService from "@/lib/hooks/useLayout";

const Sidebar = () => {
  const { toggleDrawer } = useLayoutService();
  const {
    data: categories,
    error,
    isLoading,
  } = useSWR("/api/products/categories");

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: products } = useSWR("/api/products", fetcher);

  if (!products) return <p>Loading...</p>;

  console.log("Fetched products:", products);

  console.log("dataaaa.", products);

  if (error) return error.message;
  if (isLoading || !categories) return "Loading...";

  return (
    <ul className="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
      <li>
        <h2 className="text-xl">Shop Categories</h2>
      </li>
      {categories.map((category: string) => (
        <li key={category}>
          <Link href={`/search?category=${category}`} onClick={toggleDrawer}>
            {category}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;
