"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/models/ProductModel";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

const FALLBACK_IMAGE = "/images/noimage.webp";

// Function to validate image URL
const isValidImageUrl = (url: string) => {
  return url.startsWith("http://") || url.startsWith("https://");
};

const ProductItem = ({ product }: { product: Product }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Validate the product image or fallback
  const initialImage = isValidImageUrl(product?.image)
    ? product.image
    : FALLBACK_IMAGE;
  const [imageSrc, setImageSrc] = useState(initialImage);

  // State for this product's wishlist status
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch wishlist status for this specific product
  useEffect(() => {
    if (!userId) return;

    const fetchWishlistStatus = async () => {
      try {
        const res = await fetch(
          `/api/wishlist?userId=${userId}&productId=${product._id}`
        );
        const data = await res.json();
        setIsWishlisted(data.status); // Ensure only this product's status updates
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
      }
    };

    fetchWishlistStatus();
  }, [userId, product._id]);

  // Toggle wishlist for this specific product
  const toggleWishlist = async () => {
    if (!userId) {
      toast.error("Please log in to manage wishlist");
      return;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product._id }),
      });

      const data = await response.json();

      setIsWishlisted(data.status); // Ensure only this product updates

      if (data.status) {
        toast.success("Added to Wishlist ❤️");
      } else {
        toast.success("Removed from Wishlist ❌");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="card mb-4 w-[300px] h-[333px] xl:w-[300px] xl:h-[333px] 2xl:w-[400px] 2xl:h-[433px] md:w-[200px] md:h-[233px] lg:w-[250px] lg:h-[270px] relative rounded-xl border border-neutral-200 shadow-sm transition-shadow duration-300 hover:shadow-md hover:shadow-pink-100 bg-white">
      <figure className="w-full h-full overflow-hidden">
        <Link
          href={`/product/${product.slug}`}
          className="relative w-full h-full block"
        >
          <Image
            key={imageSrc} // Forces re-render if fallback image updates
            src={imageSrc}
            alt={product.name || "Product Image Unavailable"}
            fill
            className="object-cover w-full h-full transition-transform duration-700 ease-in-out hover:scale-125"
            onError={() => setImageSrc(FALLBACK_IMAGE)}
          />
        </Link>
      </figure>

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg"
      >
        <Heart
          className={`w-6 h-6 transition-all ${
            isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"
          }`}
        />
      </button>

      <div className="card-body p-2 text-left">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-1 font-medium text-base text-[#474747]">
            {product.name || "Product Name Unavailable"}
          </h3>
        </Link>
        <div className="card-actions flex items-center justify-start">
          <span className="text-base text-[#000000]">
            ₹{product.price ? product.price.toFixed(2) : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
