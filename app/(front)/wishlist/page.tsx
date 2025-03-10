"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import AddToCart from "@/components/products/AddToCart";
import { convertDocToObj } from "@/lib/utils";
import { Heart } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  slug: string;
}

interface WishlistResponse {
  status: boolean;
  message: string;
  products: Product[];
}

const Wishlist = () => {
  const [wishlistData, setWishlistData] = useState<WishlistResponse | null>(
    null
  );
  const { data: session } = useSession();
  const userId = session?.user?._id; // You can get this from session or auth context
  const router = useRouter(); // Initialize router for navigation

  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await fetch(`/api/wishlist?userId=${userId}`);
      const data = await res.json();
      setWishlistData(data);
    };

    fetchWishlist();
  }, [userId]);

  if (!wishlistData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold">Loading wishlist...</span>
      </div>
    );
  }

  if (!wishlistData.status) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold text-red-500">
          {wishlistData.message}
        </span>
      </div>
    );
  }

  const handleNavigateToProduct = (productId: string) => {
    router.push(`/product/${productId}`); // Navigate to the product page
  };

  return (
    <div className="container mx-auto py-10 px-5">
      <h2 className="text-3xl  mb-8 text-center flex items-center justify-center">
        Your Wishlist <Heart className="ml-2 w-8 h-8 stroke-pink-700"/>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistData.products.length === 0 ? (
          <p className="text-center text-xl col-span-2">
            Your wishlist is empty
          </p>
        ) : (
          wishlistData.products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleNavigateToProduct(product?.slug)}
              className="flex flex-col md:flex-row bg-white shadow-md p-4 cursor-pointer"
            >
              {/* Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover mb-4 md:mb-0 md:mr-6"
              />
              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800">
                  {product.name}
                </h3>
                {/* Description */}
                <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                  {product.description}
                </p>
                {/* Price */}
                <p className="text-md font-semibold text-black my-3">
                  ₹{product.price}
                </p>
                {/* Add to Cart Button */}
                <AddToCart
                  item={{
                    ...convertDocToObj(product),
                    qty: 0,
                    color: "",
                    size: "",
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;
