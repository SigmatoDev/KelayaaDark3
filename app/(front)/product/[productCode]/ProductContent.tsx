"use client";
import { FC, Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  FaStar,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaHeart,
} from "react-icons/fa";
import AddToCart from "@/components/products/AddToCart";
import { convertDocToObj } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CheckCircle, ShoppingCartIcon, Truck } from "lucide-react";
import useCartService from "@/lib/hooks/useCartStore";
import { useSession } from "next-auth/react";
import PriceBreakupCard from "./detailsCard";
import toast from "react-hot-toast";
import RingDetails from "./ringDetails";
import AvailabilityChecker from "./checkAvailabilty";
import "react-inner-image-zoom/lib/styles.min.css";
import InnerImageZoom from "react-inner-image-zoom";

import ProductItems, {
  ProductItemsSkeleton,
} from "@/components/products/ProductItems";
import ProductItem from "@/components/products/ProductItem";
import SignInPopup from "@/components/signin/SignIn";

interface Product {
  productType: string;
  size: string;
  ring_size: string;
  _id: string;
  name: string;
  productCode: string;
  weight: string;
  price_per_gram: string;
  info: string;
  slug: string;
  image: string;
  price: number;
  description: string;
  category: string;
  productCategory: string;
  countInStock: number;
  reviewsCount: number;
  tags: string[];
  images: string[];
  materialType?: string;
  metalWeight?: number;
  metalRate?: number;
  diamondWeight?: number;
  diamondRate?: number;
  diamondType?: string;
  gemCut?: string;
  carats: string;
  clarity?: string;
  color?: string;
  pricing?: {
    grossWeight: number;
    goldPrice?: number;
    goldTotal: number;
    diamondPrice: number;
    diamondTotal: number;
    makingCharge: number;
    additionalCharges?: number;
    totalPrice: number;
  };
  isFeatured?: boolean; // Optional field (can be boolean or undefined)
  goldPrice?: number;
}

interface ProductPageContentProps {
  product: Product;
  similarProducts?: Product[];
}

const ProductPageContent: FC<ProductPageContentProps> = ({
  product,
  similarProducts,
}) => {
  console.log("products....", product);
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [showAvailability, setShowAvailability] = useState<boolean>(false);
  const router = useRouter();
  const { items } = useCartService();
  const existItem = items.find((x) => x.slug === product.slug);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  // Zoom state for the image
  const [scale, setScale] = useState(1); // Initial scale of 1
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Position for dragging the image

  // sharing
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const shareText = `Check out this product: ${product?.name} - ${shareUrl}`;
  const encodedText = encodeURIComponent(shareText);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      toast.error(
        "Sharing not supported on this browser. Please use the icons."
      );
    }
  };

  useEffect(() => {
    if (!session || !userId || !product._id) return;

    fetch(`/api/wishlist?userId=${userId}&productId=${product._id}`)
      .then((res) => res.json())
      .then((data) => setIsWishlisted(data.status));
  }, [session, userId, product._id]);

  const toggleWishlist = async () => {
    if (!userId) {
      setIsSignInOpen(true);
      // toast.error("Please log in to manage wishlist");
      return;
    }

    const response = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId: product._id }),
    });

    const data = await response.json();
    setIsWishlisted(data.status);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - container.left;
    const offsetY = e.clientY - container.top;

    const zoomLevel = 2.5; // Adjust zoom level as needed
    const centerX = offsetX / container.width;
    const centerY = offsetY / container.height;

    const scaleValue = 1 + zoomLevel * Math.max(centerX, centerY); // Zoom based on position
    setScale(scaleValue);
  };

  // Start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX - startX;
      const newY = moveEvent.clientY - startY;
      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Handle Mouse Leave to reset zoom and position
  const handleMouseLeave = () => {
    setScale(1); // Reset zoom
    setPosition({ x: 0, y: 0 }); // Reset position after leaving
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section - Image Gallery */}
        <div className="flex flex-col md:flex-row gap-4 sticky top-24 self-start">
          {product.images.length > 0 ? (
            <>
              {/* Thumbnail previews */}
              <div className="flex md:flex-col gap-2">
                {product.images.map((img, index) => {
                  const imageUrl = img.startsWith("http") ? img : `/${img}`;
                  const isImageAvailable = imageUrl && img !== "";

                  return isImageAvailable ? (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`p-1 rounded-none ${
                        selectedImage === img ? "border-2 border-pink-500" : ""
                      }`}
                    >
                      <Image
                        src={imageUrl}
                        alt={`Thumbnail ${index + 1}`}
                        width={60}
                        height={60}
                        quality={50}
                        placeholder="empty"
                        loading="lazy"
                        className="object-cover"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).style.display =
                            "none")
                        }
                      />
                    </button>
                  ) : null;
                })}
              </div>

              {/* Main image display */}
              {selectedImage && (
                <div
                  className="relative w-full max-w-[500px] h-[400px] md:h-[500px] overflow-hidden"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onMouseDown={handleMouseDown}
                  style={{ cursor: "grab" }}
                >
                  {/* <Image
                  src={
                    selectedImage.startsWith("http")
                      ? selectedImage
                      : `/${selectedImage}`
                  }
                  alt="Main product image"
                  width={800}
                  height={800}
                  quality={75}
                  priority // optional: only if above the fold
                  placeholder="empty"
                  className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: "center center",
                  }}
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                /> */}

                  <InnerImageZoom
                    src={
                      selectedImage.startsWith("http")
                        ? selectedImage
                        : `/${selectedImage}`
                    }
                    zoomSrc={
                      selectedImage.startsWith("http")
                        ? selectedImage
                        : `/${selectedImage}`
                    }
                    zoomType="hover"
                    zoomPreload={true}
                    width={600}
                    height={600}
                  />
                </div>
              )}
            </>
          ) : (
            <p>No images found for this product.</p>
          )}
        </div>

        {/* Right Section - Product Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {product?.name}
          </h1>
          <div className="space-y-1 my-2">
            <div className="text-[26px] font-bold text-[#bb5683] leading-snug">
              ₹
              {product.price
                ? product.price.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "N/A"}
            </div>

            <div className="text-xs text-gray-400">
              MRP (exclusive of all taxes)
            </div>
          </div>

          {/* <div className="flex items-center gap-2 my-2">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <span className="text-gray-500 text-[14px]">
            | {product?.reviewsCount} Customer Reviews
          </span>
        </div> */}
          <p className="text-gray-500 text-xs">{product?.description}</p>

          {/* SKU, Category, Tags */}
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm items-center">
            {/* <p className="text-gray-600">SKU</p>
          <p className="font-semibold">: {product?.productCode}</p> */}
            <p className="text-gray-600">Category</p>
            <p className="font-semibold">
              :{" "}
              {product?.productType === "Sets" ||
              product?.productType === "Bangles"
                ? product?.productType
                : product?.productCategory}
            </p>
            {/* <p className="text-gray-600">Tags</p>
          <p className="font-semibold capitalize">
            : {product?.tags?.join(", ")}
          </p> */}
            {(Number(product?.size) > 0 || Number(product?.ring_size) > 0) && (
              <>
                <p className="text-gray-600">Size</p>
                <p className="font-semibold">
                  :{" "}
                  {product?.productCategory === "Rings"
                    ? product?.ring_size
                    : product?.size}
                </p>
              </>
            )}
          </div>

          {/* Size & Availability */}
          {product?.materialType === "gold" &&
            product?.productCategory === "Rings" && (
              <div>
                <RingDetails product={product} />
              </div>
            )}

          <div>
            {/* Price Breakup Section (Visible only for gold products) */}
            {/* {product?.materialType === "gold" && (
            <PriceBreakupCard product={product} />
          )} */}

            {product?.materialType === "gold" &&
              product?.productType !== "Sets" && (
                <PriceBreakupCard product={product} />
              )}
          </div>

          {/* Buttons Grid */}
          <div
            className={`grid ${existItem ? "grid-cols-3" : "grid-cols-2"} gap-4 w-full`}
          >
            <button
              onClick={toggleWishlist}
              className="bg-[#FFF] text-[#Dd91a6] border text-[12px] font-bold px-6 py-3 rounded-none w-full flex items-center justify-center gap-2"
            >
              <FaHeart
                className={`text-[14px] ${isWishlisted ? "text-red-500" : "text-[#Dd91a6]"}`}
              />
              {isWishlisted ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}
            </button>

            {product.countInStock !== 0 && (
              <AddToCart
                item={{
                  ...convertDocToObj(product),
                  qty: 0,
                  color: "",
                  size: "",
                }}
              />
            )}

            {existItem && (
              <button
                className="text-white px-6 py-3 rounded-none text-[12px] font-bold w-full flex items-center justify-center"
                onClick={() => router.push("/cart")}
                style={{
                  background:
                    "linear-gradient(90.25deg, #df6383 36.97%, #FC6767 101.72%)",
                }}
              >
                <ShoppingCartIcon className="w-4 h-4 mr-4" />
                GO TO CART
              </button>
            )}
          </div>
          <div>
            {/* Check Availability Button + Message */}
            <AvailabilityChecker product={product} />
          </div>
          <div className="bg-[#faf4e9] p-4 flex items-start gap-4 shadow-sm mt-4">
            <Truck className="text-yellow-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                Delivery Information
              </h3>
              <p className="text-sm text-gray-600">
                Products are delivered with in{" "}
                <span className="font-medium text-gray-800">3 to 5 days</span>.
                If currently unavailable, delivery may take{" "}
                <span className="font-medium text-gray-800">14 to 21 days</span>
                .
              </p>
            </div>
          </div>
          {product?.materialType === "gold" && (
            <div>
              <div className="flex justify-start gap-8 items-center my-4">
                <div className="text-center">
                  <img
                    src="/images/certificates/bis-logo.webp"
                    alt="BIS Logo"
                    className="h-12 mx-auto"
                  />
                  <p className="text-[10px] mt-2">Hallmarked Jewellery</p>
                </div>

                <div className="text-center">
                  <img
                    src="/images/certificates/igi-logo.webp"
                    alt="IGI Logo"
                    className="h-12 mx-auto"
                  />
                  <p className="text-[10px] mt-2">IGI Certified</p>
                </div>

                <div className="text-center">
                  <img
                    src="/images/certificates/100certified.webp"
                    alt="Verified"
                    className="h-12 mx-auto"
                  />
                  <p className="text-[10px] mt-2">100% Certified by Kelayaa</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 items-center text-gray-500">
            {/* Facebook */}
            {/* Facebook */}
            <p className="text-gray-600 font-small ">Share :</p>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Facebook"
              className="text-[#1877F2] hover:text-blue-700 transition"
            >
              <FaFacebookF size={14} />
            </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="text-[#E1306C] hover:text-pink-600 transition"
            >
              <FaInstagram size={14} />
            </a>
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodedText}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on WhatsApp"
              className="text-[#25D366] hover:text-green-600 transition"
            >
              <FaWhatsapp size={14} />
            </a>
            {/* Native Share (Mobile) */}
            <button
              onClick={handleNativeShare}
              className="text-sm underline text-pink-600 hover:text-pink-700"
            >
              More options
            </button>
          </div>
        </div>
      </div>

      {similarProducts?.length > 0 && (
        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="mt-12 col-span-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarProducts?.map((item) => (
                <ProductItem key={item._id} product={item} />
              ))}
            </div>
          </section>
        </div>
      )}
      {/* Render SignInPopup and control its visibility */}
      {isSignInOpen && (
        <SignInPopup isOpen={isSignInOpen} setIsOpen={setIsSignInOpen} />
      )}
    </>
  );
};

export default ProductPageContent;
