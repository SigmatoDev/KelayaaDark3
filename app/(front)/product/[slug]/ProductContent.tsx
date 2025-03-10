"use client";
import { FC, useState } from "react";
import Image from "next/image";
import { FaStar, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import AddToCart from "@/components/products/AddToCart";
import { convertDocToObj } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ShoppingCartIcon } from "lucide-react";
import useCartService from "@/lib/hooks/useCartStore";

interface Product {
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
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const router = useRouter();
  const { items } = useCartService();
  const existItem = items.find((x) => x.slug === product.slug);

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Section - Image Gallery */}
      <div className="flex flex-col md:flex-row gap-4">
        {product.images.length > 0 ? (
          <>
            <div className="flex md:flex-col gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`border-2 p-1 rounded-none ${
                    selectedImage === img
                      ? "border-pink-500"
                      : "border-gray-200"
                  }`}
                >
                  <Image src={img} alt="Ring" width={60} height={60} />
                </button>
              ))}
            </div>
            <div className="relative w-full h-[400px] md:h-[500px]">
              <Image
                src={selectedImage}
                alt="Selected Ring"
                layout="fill"
                objectFit="cover"
                quality={100}
              />
            </div>
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
          <p className="text-gray-600">Tags</p>
          <p className="font-semibold capitalize">
            : {product?.tags?.join(", ")}
          </p>
          <p className="text-gray-600">Share</p>
          <div className="flex gap-3 text-gray-500">
            : <FaFacebookF size={14} />
            <FaTwitter size={14} />
            <FaInstagram size={14} />
          </div>
        </div>

        {/* Size & Availability */}
        <div className="flex items-center gap-4 w-full mb-4">
          <div className="flex items-center bg-[#FFF6F8] rounded-md px-3 py-2 w-full">
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
          <button className="bg-[#FFF6F8] text-pink-500 text-[12px] px-6 py-2 font-semibold rounded-none w-full">
            CHECK AVAILABILITY
          </button>
        </div>

        {/* Buttons Grid */}
        <div
          className={`grid ${existItem ? "grid-cols-3" : "grid-cols-2"} gap-4 w-full`}
        >
          <button className="bg-[#FFF6F8] text-pink-500 text-[12px] font-bold px-6 py-3 rounded-none w-full">
            ADD TO WISHLIST
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
