import Image from "next/image";
import Link from "next/link";
import { getPlaiceholder } from "plaiceholder";

import { Product } from "@/lib/models/ProductModel";

const ProductItem = async ({ product }: { product: Product }) => {
  const buffer = await fetch(product?.image).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );

  const { base64 } = await getPlaiceholder(buffer);

  return (
    <div className="card mb-4 rounded-none w-[300px] h-[333px] md:w-[400px] md:h-[433px]">
      <figure className="w-[300px] h-[333px] md:w-[400px] md:h-[433px] overflow-hidden">
        <Link href={`/product/${product.slug}`} className="relative w-full h-full block">
          <Image
            src={product?.image}
            alt={product.name}
            placeholder="blur"
            blurDataURL={base64}
            fill
            className="object-cover w-full h-full transition-transform duration-700 ease-in-out hover:scale-125"
          />
        </Link>
      </figure>
      <div className="card-body p-2 text-left">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-1 font-medium text-base text-[#474747]">
            {product.name}
          </h3>
        </Link>
        <div className="card-actions flex items-center justify-start">
          <span className="text-base text-[#000000]">₹{product.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
