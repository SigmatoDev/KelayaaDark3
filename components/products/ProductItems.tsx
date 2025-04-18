import productService from "@/lib/services/productService";
import { convertDocToObj, delay } from "@/lib/utils";
import ProductItem from "./ProductItem";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const ProductItems = async () => {
  // await delay(1000);
  const latestProducts = await productService.getLatest();
  console.log("latestProducts", latestProducts);
  return (
    <div className="px-4 mt-20">
      {/* <h2 className="text-2xl text-center  font-semibold">
        EXPLORE OUR PRODUCTS
      </h2> */}
      <h2 className="text-[20px] md:text-[38px] font-normal mb-2 mt-10 uppercase text-center text-[#474747]">
        NEW
        <span className="bg-gradient-to-r from-[#f76999] to-[#fb8d92] bg-clip-text text-transparent ml-2">
          ARRIVALS
        </span>
      </h2>
      <p className="text-center mb-6 text-gray-400 font-light text-sm">
        Discover what’s new, what’s bold, and what’s trending — our latest
        styles have just landed, and they’re ready to impress!
      </p>
      <div className="grid grid-cols-1 mt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 items-center justify-center justify-items-center">
        {latestProducts?.map((product) => (
          <ProductItem key={product.slug} product={convertDocToObj(product)} />
        ))}
      </div>

      {/* <div className="flex justify-center items-center my-8">
        <button
          className="w-[150px] h-[40px] px-2 flex justify-center items-center text-white font-semibold uppercase text-[12px] "
          style={{
            background:
              "linear-gradient(90.25deg, #EC008C 36.97%, #FC6767 101.72%)",
          }}
        >
          Explore More <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div> */}

      <div className="flex justify-end items-center my-8 px-4">
        <Link
          href="/search"
          className="group inline-flex items-center gap-2 text-black font-medium text-sm border-b border-transparent hover:border-black transition-all duration-300"
        >
          Explore More
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default ProductItems;

const ProductItemSkeleton = () => {
  return (
    <div className="w-full bg-gray-200 rounded-lg overflow-hidden shadow-md">
      <div className="relative w-full aspect-[4/5]">
        <div className="skeleton absolute inset-0 w-full h-full" />
      </div>
      <div className="p-4">
        <div className="skeleton mb-2 h-6 w-3/4" />
        <div className="skeleton mb-2 h-4 w-1/2" />
        <div className="skeleton mb-2 h-4 w-1/3" />
        <div className="flex items-center justify-between">
          <div className="skeleton h-8 w-20" />
        </div>
      </div>
    </div>
  );
};

export const ProductItemsSkeleton = ({
  qty,
  name,
}: {
  qty: number;
  name: string;
}) => {
  return (
    <div>
      <h2 className=" text-[20px] md:text-[38px] font-normal mb-10 mt-14 uppercase text-center text-[#474747]">
        EXPLORE OUR
        <span className="bg-gradient-to-r from-[#f76999] to-[#fb8d92] bg-clip-text text-transparent ml-2">
          PRODUCTS
        </span>
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {Array.from({ length: qty }).map((_, i) => {
          return <ProductItemSkeleton key={i} />;
        })}
      </div>
    </div>
  );
};
