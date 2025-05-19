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
  FaSearchPlus,
  FaSearchMinus,
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
import SetPriceBreakupCard from "./setDetailsCard";
import BangleDetails from "./bangleDetails";
import Link from "next/link";
import ProductDetailsSkeleton from "./productSkeleton";
import axios from "axios";

interface Product {
  subCategories: string;
  inventory_no_of_line: any;
  pricePerLine: number;
  length: boolean;
  items: Item[];
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
    gst: number;
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
  const existItem = items.find((x) => x.productCode === product.productCode);
  const { data: session } = useSession();
  const userId = session?.user?._id;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const [isZoomed, setIsZoomed] = useState(false); // Track zoom state
  const [mainImageLoading, setMainImageLoading] = useState(true);

  // Handle the Zoom button click
  const handleZoomClick = () => {
    setIsZoomed(!isZoomed); // Toggle zoom state
  };

  // Sharing logic
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

    const fetchWishlistStatus = async () => {
      try {
        const res = await axios.get(`/api/wishlist?userId=${userId}`);
        const data = res?.data;
        console.log("ress", res);

        const isInWishlist = data?.products?.some(
          (item: Product) => item._id === product._id
        );
        console.log("isInWishlist", isInWishlist);

        setIsWishlisted(isInWishlist);
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistStatus();
  }, [session, userId, product._id]);

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

  useEffect(() => {
    setMainImageLoading(true); // Reset loader whenever selected image changes
  }, [selectedImage]);

  const generateBreadcrumbLink = () => {
    if (product?.materialType === "Beads") {
      return `/search?materialType=${encodeURIComponent(product.materialType)}`;
    }
    if (
      (product?.productType === "Sets" || product?.productType === "Bangles") &&
      product?.materialType === "gold"
    ) {
      return `/search?productCategory=${encodeURIComponent(product.productType)}&materialType=gold`;
    }
    return `/search?productCategory=${encodeURIComponent(product.productCategory)}`;
  };

  const getBreadcrumbLabel = (product: ProductType) => {
    if (product?.materialType === "Beads") {
      return product.materialType;
    }
    if (
      (product?.productType === "Sets" || product?.productType === "Bangles") &&
      product?.materialType === "gold"
    ) {
      return product.productType;
    }
    return product?.productCategory;
  };

  const [loading, setLoading] = useState(true); // add a loading state

  useEffect(() => {
    // Force 2 second minimum loading
    setTimeout(() => {
      setLoading(false);
    }, 300); // Delay set to 2 seconds
  }, []);

  // if (loading || !product) {
  //   return <ProductDetailsSkeleton />;
  // }

  useEffect(() => {
    if (!selectedImage || typeof window === "undefined") return;

    const isSlowConnection =
      navigator.connection &&
      (navigator.connection.saveData ||
        ["slow-2g", "2g"].includes(navigator.connection.effectiveType));

    const isMobile =
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
        navigator.userAgent
      );

    if (isSlowConnection || isMobile) return; // Skip for mobile or slow connections

    const index = product.images.findIndex((img) => img === selectedImage);
    const originalImage = product.image_variants?.[index]?.original;

    if (originalImage) {
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.as = "image";
      preloadLink.href = originalImage;
      document.head.appendChild(preloadLink);
    }
  }, [selectedImage]);

  return (
    <>
      {/* Right Section - Product Details */}
      {/* Breadcrumb Section */}
      <div className="bg-pink-100 px-4 py-4 rounded-md text-sm mb-4">
        <div className="flex flex-wrap items-center space-x-2 text-gray-700">
          <Link href="/" className="hover:underline hover:text-pink-500">
            Home
          </Link>
          <span>/</span>

          <Link
            href={generateBreadcrumbLink()}
            className="hover:underline hover:text-pink-500 capitalize"
          >
            {getBreadcrumbLabel(product)}
          </Link>

          <span>/</span>

          <span className="font-semibold truncate">{product?.name}</span>
        </div>
      </div>

      {/* rest of your product details */}

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section - Image Gallery */}

        {/* Left Section - Image Gallery */}
        {/* Left Section - Image Gallery */}
        <div className="flex flex-col md:flex-row gap-4 md:sticky md:top-24 self-start">
          {product.images?.length > 0 ? (
            <>
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-2">
                {product.images
                  .map((img, index) => ({ img, index }))
                  .filter(({ img }) => img && img.startsWith("http"))
                  .map(({ img, index }) => {
                    const variant = product.image_variants?.[index] ?? {};
                    const thumbUrl = variant.image_small || img;

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setIsZoomed(false); // reset zoom mode
                          setSelectedImage(img);
                        }}
                        className={`p-1 rounded-none ${
                          selectedImage === img
                            ? "border-2 border-pink-500"
                            : ""
                        }`}
                      >
                        <Image
                          src={thumbUrl}
                          alt={`Thumbnail ${index + 1}`}
                          width={60}
                          height={60}
                          quality={50}
                          placeholder="blur"
                          blurDataURL="/images/blur.png"
                          loading="lazy"
                          className="object-cover"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).style.display =
                              "none")
                          }
                        />
                      </button>
                    );
                  })}
              </div>

              {/* Main image display */}
              {selectedImage && (
                <div className="relative w-full max-w-[500px] h-[400px] md:h-[500px] overflow-hidden">
                  {/* Zoom icon */}
                  <button
                    onClick={handleZoomClick}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md z-10"
                    title={isZoomed ? "Exit Zoom" : "Zoom Image"}
                  >
                    {isZoomed ? (
                      <FaSearchMinus className="text-gray-700" />
                    ) : (
                      <FaSearchPlus className="text-gray-700" />
                    )}
                  </button>

                  {/* Main or Zoomed image */}
                  {(() => {
                    const index = product.images.findIndex(
                      (img) => img === selectedImage
                    );
                    const variant = product.image_variants?.[index] ?? {};
                    const mainImage = variant.image_large || selectedImage;
                    const zoomImage = variant.original || selectedImage;

                    return isZoomed ? (
                      <InnerImageZoom
                        src={zoomImage}
                        zoomSrc={zoomImage}
                        zoomType="click"
                        zoomPreload={true}
                        width={600}
                        height={600}
                        // Zooms in 2x instead of 1.5x
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        {/* Spinner */}
                        {mainImageLoading && (
                          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-40">
                            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

                        <Image
                          src={mainImage}
                          alt="Main product image"
                          width={800}
                          height={800}
                          quality={75}
                          placeholder="blur"
                          blurDataURL="/images/blur.png"
                          loading="eager"
                          priority
                          onLoad={() => setMainImageLoading(false)}
                          className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).style.display =
                              "none")
                          }
                        />
                      </div>
                    );
                  })()}
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
            {product?.materialType === "Beads" ? (
              <>
                <div className="text-[26px] font-bold text-[#bb5683] leading-snug">
                  ₹
                  {(() => {
                    // Find the item with the matching productCode and materialType === "Beads"
                    const beadItem = items.find(
                      (x) =>
                        x.productCode === product.productCode &&
                        x.materialType === "Beads"
                    );

                    // If a matching item is found, calculate price * qty, otherwise show the pricePerLine
                    const totalPrice = beadItem
                      ? product.pricePerLine * beadItem.qty
                      : product.pricePerLine;

                    // Return the formatted totalPrice
                    return totalPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                  })()}
                </div>

                <div className="text-xs text-gray-400">
                  Price Per Selected lines
                </div>
              </>
            ) : (
              <div className="text-[26px] font-bold text-[#bb5683] leading-snug">
                ₹
                {product.price
                  ? product.price.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "N/A"}
              </div>
            )}

            <div className="text-xs text-gray-400">
              MRP (inclusive of all taxes)
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
            {product?.materialType !== "Beads" && (
              <>
                <p className="text-gray-600">Type</p>
                <p className="font-semibold">
                  :{" "}
                  {product?.productType === "Sets" ||
                  product?.productType === "Bangles"
                    ? product?.productType
                    : product?.productCategory}
                </p>
              </>
            )}
            {product?.materialType !== "Beads" &&
              product?.productType !== "Sets" &&
              product?.productType !== "Bangles" &&
              product?.productType !== "Bracelet" && (
                <>
                  <p className="text-gray-600">Style</p>
                  <p className="font-semibold">
                    :{" "}
                    {product?.category ||
                      (Array.isArray(product?.subCategories)
                        ? product.subCategories.join(", ")
                        : product?.subCategories)}
                  </p>
                </>
              )}
            {(product?.productType === "Sets" ||
              product?.productCategory === "Pendants" ||
              product?.productCategory === "Sets") && (
              <>
                <p className="text-red-400 text-xs">*Note</p>
                <p className="text-red-400 text-xs">
                  : Chains are not included.
                </p>
              </>
            )}

            {/* <p className="text-gray-600">Tags</p>
          <p className="font-semibold capitalize">
            : {product?.tags?.join(", ")}
          </p> */}
            {(product?.size?.length > 0 || Number(product?.ring_size) > 0) && (
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

            {product?.materialType === "Beads" && product?.length && (
              <>
                <p className="text-gray-600">Length</p>
                <p className="font-semibold">: {product?.length} inches</p>
              </>
            )}
            {product?.materialType === "Beads" && product?.info && (
              <>
                <p className="text-gray-600">Info</p>
                <p className="font-semibold">: {product?.info} </p>
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

          {product?.materialType === "gold" &&
            product?.productType === "Bangles" && (
              <div>
                <BangleDetails product={product} />
              </div>
            )}

          <div>
            {/* Price Breakup Section (Visible only for gold products) */}
            {/* {product?.materialType === "gold" && (
            <PriceBreakupCard product={product} />
          )} */}

            {product?.materialType === "gold" &&
              product?.productType !== "Sets" &&
              product?.productType !== "Bangles" && (
                <PriceBreakupCard product={product} />
              )}

            {((product?.materialType === "gold" &&
              product?.productType === "Sets") ||
              product?.productType === "Bangles") && (
              <SetPriceBreakupCard product={product} />
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

            {/*  */}

            {product.countInStock !== 0 && (
              <AddToCart
                item={{
                  ...convertDocToObj(product),
                  qty: 0,
                  // color: "",
                  // size: "",
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
                Products are delivered within{" "}
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
          {product?.materialType === "Beads" && (
            <div>
              <div className="flex justify-start gap-8 items-center my-4">
                <div className="text-center">
                  <img
                    src="/images/certificates/gig_certificate.webp"
                    alt="BIS Logo"
                    className="h-12 mx-auto"
                  />
                  <p className="text-[10px] mt-2">GIG Certified</p>
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
