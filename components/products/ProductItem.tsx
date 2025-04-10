"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/models/ProductModel";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import SignInPopup from "../signin/SignIn";

const FALLBACK_IMAGE = "/images/noimage.webp";

// Function to validate image URL
const isValidImageUrl = (url: string) => {
  return url.startsWith("http://") || url.startsWith("https://");
};

const ProductItem = ({ product }: { product: Product }) => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const hasFetchedRef = useRef(false);

  // Validate the product image or fallback
  // Validate the product image or fallback
  const initialImage = isValidImageUrl(product?.image || "")
    ? product.image
    : FALLBACK_IMAGE;
  const [imageSrc, setImageSrc] = useState(initialImage);

  // Wishlist state for this specific product
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!userId || !product._id || hasFetchedRef.current) {
      setLoading(false);
      return;
    }

    const debounceTimer = setTimeout(() => {
      hasFetchedRef.current = true;

      const fetchWishlistStatus = async () => {
        try {
          const res = await fetch(`/api/wishlist?userId=${userId}`);
          const data = await res.json();

          const isInWishlist = data.products.some(
            (item: Product) => item._id === product._id
          );

          setIsWishlisted(isInWishlist);
        } catch (error) {
          console.error("Error fetching wishlist status:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchWishlistStatus();
    }, 300); // Debounce delay in milliseconds (300ms is common)

    // Cleanup to prevent overlapping calls
    return () => clearTimeout(debounceTimer);
  }, [userId, product._id]);

  // Optimistic Wishlist Toggle
  const toggleWishlist = async () => {
    if (!userId) {
      setIsSignInOpen(true);
      // toast.error("Please log in to manage wishlist");
      return;
    }

    if (loading) return;
    setLoading(true);

    const newWishlistState = !isWishlisted;
    setIsWishlisted(newWishlistState);

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product._id }),
      });

      const data = await response.json();

      if (data.productId !== product._id) {
        throw new Error("Product mismatch");
      }

      setIsWishlisted(data.status);

      if (data.status) {
        toast.success("Added to Wishlist ❤️");
      } else {
        toast.success("Removed from Wishlist ❌");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Something went wrong. Please try again.");
      setIsWishlisted(!newWishlistState);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="relative card mb-4 w-[300px] h-[333px] xl:w-[300px] xl:h-[333px] 2xl:w-[400px] 2xl:h-[433px] md:w-[200px] md:h-[233px] lg:w-[250px] lg:h-[270px] rounded-xl border border-neutral-200 shadow-sm transition-shadow duration-300 hover:shadow-md hover:shadow-pink-100 bg-white">
    <div className="relative card mb-4 w-full h-[333px] xl:h-[333px] 2xl:h-[433px] md:h-[233px] lg:h-[270px] rounded-xl border border-neutral-200 shadow-sm transition-shadow duration-300 hover:shadow-md hover:shadow-pink-100 bg-white">
      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <figure className="w-full h-full overflow-hidden">
        <Link
          href={`/product/${product?.productCode}`}
          className="relative block w-full h-full"
        >
          <Image
            key={imageSrc}
            src={imageSrc || FALLBACK_IMAGE}
            alt={product.name || "Product Image Unavailable"}
            width={500} // Set a fixed or responsive size
            height={500}
            quality={70} // Compress for performance
            placeholder="empty" // or "blur" if you provide blurDataURL
            loading="lazy"
            className="object-cover w-full h-full transition-transform duration-700 ease-in-out hover:scale-110"
            onError={() => setImageSrc(FALLBACK_IMAGE)}
          />
        </Link>
      </figure>

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg"
        disabled={loading}
      >
        <Heart
          className={`w-6 h-6 transition-all ${isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"}`}
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
            ₹
            {product.price
              ? product.price.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Render SignInPopup and control its visibility */}
      {isSignInOpen && (
        <SignInPopup isOpen={isSignInOpen} setIsOpen={setIsSignInOpen} />
      )}
    </div>
  );
};

export default ProductItem;
