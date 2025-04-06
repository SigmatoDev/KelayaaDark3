"use client";
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { FaStar, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import AddToCart from "@/components/products/AddToCart";
import { convertDocToObj } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CheckCircle, ShoppingCartIcon } from "lucide-react";
import useCartService from "@/lib/hooks/useCartStore";
import { useSession } from "next-auth/react";

interface Product {
  size: string;
  ring_size: number;
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
}

interface ProductPageContentProps {
  product: Product;
}

const ProductPageContent: FC<ProductPageContentProps> = ({ product }) => {
  console.log("products....", product);
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [showAvailability, setShowAvailability] = useState<boolean>(false);
  const router = useRouter();
  const { items } = useCartService();
  const existItem = items.find((x) => x.slug === product.slug);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Zoom state for the image
  const [scale, setScale] = useState(1); // Initial scale of 1
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Position for dragging the image

  // Fetch Wishlist Status
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
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Section - Image Gallery */}
      <div className="flex flex-col md:flex-row gap-4">
        {product.images.length > 0 ? (
          <>
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
                      alt="product image"
                      width={60}
                      height={60}
                      onError={(e) =>
                        ((e.target as HTMLImageElement).style.display = "none")
                      }
                    />
                  </button>
                ) : null;
              })}
            </div>

            {/* Main image */}
            {selectedImage && (
              <div
                className="relative w-full h-[400px] md:h-[500px] overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
                style={{
                  cursor: "grab", // Change the cursor to indicate dragging
                }}
              >
                <div
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: "center center",
                    transition: "transform 0.3s ease",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                >
                  <Image
                    src={
                      selectedImage.startsWith("http")
                        ? selectedImage
                        : `/${selectedImage}`
                    }
                    alt="product image"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    onError={(e) =>
                      ((e.target as HTMLImageElement).style.display = "none")
                    }
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <p>No images found for this product.</p>
        )}
      </div>

      {/* Right Section - Product Details */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{product?.name}</h1>
        <p className="text-[16px] text-gray-700">
          Rs. {product?.price.toFixed(2)}
        </p>
        <div className="flex items-center gap-2 my-2">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <span className="text-gray-500 text-[14px]">
            | {product?.reviewsCount} Customer Reviews
          </span>
        </div>
        <p className="text-gray-600 text-sm">{product?.description}</p>

        {/* SKU, Category, Tags */}
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm items-center">
          {/* <p className="text-gray-600">SKU</p>
          <p className="font-semibold">: {product?.productCode}</p> */}
          <p className="text-gray-600">Category</p>
          <p className="font-semibold">: {product?.productCategory}</p>
          {/* <p className="text-gray-600">Tags</p>
          <p className="font-semibold capitalize">
            : {product?.tags?.join(", ")}
          </p> */}
          {(product?.size || product?.ring_size) && (
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

          <p className="text-gray-600">Share</p>
          <div className="flex gap-1 items-center text-gray-500">
            : <FaFacebookF size={14} />
            {/* <FaTwitter size={14} /> */}
            <FaInstagram size={14} />
          </div>
        </div>

        {/* Size & Availability */}
        <div className="flex items-center gap-4 w-full mb-4">
          {/* Size Selector (Visible only if productCategory is "Rings") */}
          {/* {product?.productCategory === "Rings" && (
            <div className="flex items-center bg-[#FFF6F8] rounded-md px-3 py-2 w-1/2">
              <span className="text-gray-600 text-[12px] font-medium mr-2">
                SIZE
              </span>
              <span className="px-1">|</span>
              <select className="bg-transparent text-pink-500 font-semibold text-[12px] focus:outline-none w-full">
                <option className="text-black text-[12px]">18.00 MM</option>
                <option className="text-black text-[12px]">19.00 MM</option>
                <option className="text-black text-[12px]">20.00 MM</option>
              </select>
            </div>
          )} */}
          {/* <p className="font-semibold">Size: {product?.ring_size}</p> */}

          {/* Check Availability Button + Message */}
          <div
            className={`flex flex-col ${product?.productCategory === "Rings" || product?.productCategory === "Ring" ? "w-1/2" : "w-full"}`}
          >
            <button
              className="bg-[#FFF6F8] text-pink-500 text-[12px] px-6 py-2 font-semibold rounded-none w-full"
              onClick={() => {
                setShowAvailability(true);
                setTimeout(() => setShowAvailability(false), 3000);
              }}
            >
              CHECK AVAILABILITY
            </button>
            {showAvailability && product.countInStock > 1 && (
              <div className="flex items-center text-green-600 text-sm font-semibold mt-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                This product is available
              </div>
            )}
          </div>
        </div>

        {/* Buttons Grid */}
        <div
          className={`grid ${existItem ? "grid-cols-3" : "grid-cols-2"} gap-4 w-full`}
        >
          <button
            onClick={toggleWishlist}
            className="bg-[#FFF6F8] text-pink-500 text-[12px] font-bold px-6 py-3 rounded-none w-full"
          >
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
                  "linear-gradient(90.25deg, #EC008C 36.97%, #FC6767 101.72%)",
              }}
            >
              <ShoppingCartIcon className="w-4 h-4 mr-4" />
              GO TO CART
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPageContent;
