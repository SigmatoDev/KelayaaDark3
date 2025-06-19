"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AddToCart from "@/components/products/AddToCart";
import { convertDocToObj } from "@/lib/utils";
import { Heart, TrashIcon } from "lucide-react";
import { MdOutlineDeleteOutline } from "react-icons/md";

interface Product {
  productCode: string;
  _id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  slug: string;
}

interface WishlistResponse {
  status?: boolean;
  message?: string;
  products?: Product[];
}

const Wishlist = () => {
  const [wishlistData, setWishlistData] = useState<WishlistResponse | null>(
    null
  );
  const { data: session } = useSession();
  const userId = session?.user?._id;
  const router = useRouter();
  const pathname = usePathname();
  const hasFetchedRef = useRef(false);

  const isMyAccountWishlist =
    typeof window !== "undefined" &&
    pathname === "/my-account" &&
    new URLSearchParams(window.location.search).get("tab") === "wishlist";

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId || hasFetchedRef.current) return;

      hasFetchedRef.current = true;

      try {
        const res = await fetch(`/api/wishlist?userId=${userId}`);
        const data = await res.json();
        setWishlistData(data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setWishlistData({ status: false, message: "Failed to fetch wishlist" });
      }
    };

    if (
      (pathname === "/wishlist" || pathname === "/my-account") &&
      typeof window !== "undefined"
    ) {
      const tab = new URLSearchParams(window.location.search).get("tab");
      if (tab === "wishlist" || pathname === "/wishlist") {
        fetchWishlist();
      }
    }
  }, [userId, pathname]);

  const handleNavigateToProduct = (slug: string) => {
    router.push(`/product/${slug}`);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!userId) return;

    const res = await fetch("/api/wishlist", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, productId }),
    });

    const result = await res.json();
    if (result.status) {
      setWishlistData((prev) =>
        prev
          ? {
              ...prev,
              products: prev.products?.filter((p) => p._id !== productId) || [],
            }
          : prev
      );
    }
  };

  // Loading
  if (!wishlistData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold">Loading wishlist...</span>
      </div>
    );
  }

  // Error
  if (wishlistData.status === false) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold text-red-500">
          {wishlistData.message || "Unable to load wishlist"}
        </span>
      </div>
    );
  }

  const products = wishlistData.products || [];

  return (
    <div
      className={`container mx-auto px-4 sm:px-6 lg:px-8 ${
        isMyAccountWishlist ? "" : "py-8"
      }`}
    >
      <h2 className="text-2xl mb-8 text-center flex items-center justify-center font-bold text-gray-800">
        Your Wishlist <Heart className="ml-2 w-7 h-7 stroke-pink-700" />
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-xl text-gray-500">
          Your wishlist is empty
        </p>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            isMyAccountWishlist ? "lg:grid-cols-3" : "lg:grid-cols-4"
          } gap-6`}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="flex flex-col bg-white shadow p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover mb-4 cursor-pointer"
                onClick={() => handleNavigateToProduct(product?.productCode)}
              />
              <div
                className="flex flex-col flex-grow justify-between cursor-pointer"
                onClick={() => handleNavigateToProduct(product?.productCode)}
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-md font-semibold text-black my-2">
                  ₹
                  {new Intl.NumberFormat("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(product.price))}
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <div className="flex flex-row gap-2">
                  <div className="text-xs">
                    <AddToCart
                      item={{
                        ...convertDocToObj(product),
                        qty: 0,
                        color: "",
                        size: "",
                      }}
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition"
                    title="Remove from Wishlist"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6L18.5 19a2 2 0 01-2 2H7.5a2 2 0 01-2-2L5 6M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
