import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlaiceholder } from "plaiceholder";
import { Heart, Share2 } from "lucide-react";

import AddToCart from "@/components/products/AddToCart";
import { Rating } from "@/components/products/Rating";
import productService from "@/lib/services/productService";
import { convertDocToObj } from "@/lib/utils";

export const generateMetadata = async ({ params }: { params: { slug: string } }) => {
  const product = await productService.getBySlug(params.slug);

  if (!product) {
    return notFound();
  }

  return {
    title: product.name,
    description: product.description,
  };
};

const ProductPage = async ({ params }: { params: { slug: string } }) => {
  const product = await productService.getBySlug(params.slug);

  if (!product) {
    return notFound();
  }

  const buffer = await fetch(product.image).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );

  const { base64 } = await getPlaiceholder(buffer);

  return (
    <div className="my-2">
      <div className="my-4">
        <Link href="/" className="btn">{`<- Back to Products`}</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {/* Image Section */}
        <div className="relative aspect-square md:col-span-2 rounded-lg">
          <Image
            src={product.image}
            alt={product.name}
            placeholder="blur"
            blurDataURL={base64}
            width={440}
            height={640}
            sizes="100vw"
            className="h-full w-full object-contain"
          />
        </div>
        {/* Product Info Section */}
        <div className="p-6 max-w-xl mx-auto space-y-6">
          <div className="space-y-6">
            {/* Product Name */}
            <h1 className="text-2xl font-bold">{product.name}</h1>

            {/* Divider */}
            <div className="divider"></div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold">Description</h2>
              <p>{product.description}</p>
            </div>

            {/* Additional Info */}
            <div>
              <h2 className="text-sm font-semibold">Info</h2>
              <p>{product.info}</p>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-500">In Stock:</span>
              <p>{product.countInStock}</p>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-orange-500">
              ₹{product.price}
              <span className="block text-sm font-normal">(Inclusive of all taxes)</span>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-lg shadow-lg">
              <h2 className="text-sm font-semibold mb-4">Price Breakdown</h2>
              <div className="flex items-center divide-x divide-gray-300">
                <div className="px-2">
                  <p className="text-sm">Weight (Grms.)</p>
                  <p className="text-sm">{product.weight || "0.00"}</p>
                </div>
                <div className="px-2">
                  <p className="text-sm">Price (per gram)</p>
                  <p className="text-sm">₹{product.price_per_gram || "0.00"}</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex justify-between mt-6 space-x-2">
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

              {/* Wishlist Button */}
              <button className="flex items-center justify-center px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg shadow-lg hover:bg-blue-500 hover:text-white transition-all">
                <Heart className="text-blue-500" />
              </button>

              {/* Share Button */}
              <button className="flex items-center justify-center px-4 py-2 border-2 border-green-500 text-green-500 rounded-lg shadow-lg hover:bg-green-500 hover:text-white transition-all">
                <Share2 className="text-green-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
