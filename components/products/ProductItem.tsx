"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/models/ProductModel";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

const FALLBACK_IMAGE = "/images/noimage.webp";

// Function to validate image URL
const isValidImageUrl = (url: string) => {
  return url.startsWith("http://") || url.startsWith("https://");
};

const ProductItem = ({ product }: { product: Product }) => {
  const { data: session } = useSession();
  const userId = session?.user?._id;

  // Validate the product image or fallback
  const initialImage = isValidImageUrl(product?.image)
    ? product.image
    : FALLBACK_IMAGE;
  const [imageSrc, setImageSrc] = useState(initialImage);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/wishlist?userId=${userId}&productId=${product._id}`)
      .then((res) => res.json())
      .then((data) => setIsWishlisted(data.status));
  }, [userId, product._id]);

  const toggleWishlist = async () => {
    if (!userId) return alert("Please log in to add items to wishlist");

    const response = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId: product._id }),
    });

    const data = await response.json();
    setIsWishlisted(data.status);
  };

  return (
    <div className="card mb-4 rounded-none w-[300px] h-[333px] xl:w-[300px] xl:h-[333px] 2xl:w-[400px] 2xl:h-[433px] md:w-[200px] md:h-[233px] lg:w-[250px] lg:h-[270px] relative">
      <figure className="w-full h-full overflow-hidden">
        <Link
          href={`/product/${product.slug}`}
          className="relative w-full h-full block"
        >
          <Image
            src={imageSrc}
            alt={product.name || "Product Image Unavailable"}
            fill
            className="object-cover w-full h-full transition-transform duration-700 ease-in-out hover:scale-125"
            onError={() => setImageSrc(FALLBACK_IMAGE)}
          />
        </Link>
      </figure>
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg"
      >
        <Heart
          className={`w-6 h-6 ${isWishlisted ? "text-pink-500 stroke-pink-500 stroke-2" : "text-gray-500 "}`}
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
