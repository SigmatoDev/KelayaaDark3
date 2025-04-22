"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AddToCart from "@/components/products/AddToCart";
import { convertDocToObj } from "@/lib/utils";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";

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
  products?: Product[]; // made optional
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
  console.log("userId", userId);
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId || hasFetchedRef.current) return;

      hasFetchedRef.current = true;

      try {
        const res = await fetch(`/api/wishlist?userId=${userId}`);
        const data = await res.json();
        console.log("Fetched wishlist data:", data);
        setWishlistData(data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setWishlistData({ status: false, message: "Failed to fetch wishlist" });
      }
    };

    if (pathname === "/wishlist" && userId) {
      fetchWishlist();
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

  // Show loading state
  if (!wishlistData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold">Loading wishlist...</span>
      </div>
    );
  }

  // Show error state
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
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl mb-8 text-center flex items-center justify-center font-bold text-gray-800">
        Your Wishlist <Heart className="ml-2 w-7 h-7 stroke-pink-700" />
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-xl text-gray-500">
          Your wishlist is empty
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex flex-col bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4 cursor-pointer"
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

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <AddToCart
                  item={{
                    ...convertDocToObj(product),
                    qty: 0,
                    color: "",
                    size: "",
                  }}
                />
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition-all duration-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
