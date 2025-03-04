import { Metadata } from "next";
import { Suspense } from "react";

import Carousel, { CarouselSkeleton } from "@/components/carousel/carousel";
import Categories from "@/components/categories/Categories";
import Icons from "@/components/icons/Icons";
import ProductItems, {
  ProductItemsSkeleton,
} from "@/components/products/ProductItems";
import ReadMore from "@/components/readMore/ReadMore";
import Text from "@/components/readMore/Text";
import Slider from "@/components/slider/Slider";
import HeroSection from "@/components/hero-section/HeroSection";
import GiftImage from "@/components/products/GiftBanner";
import BlogsImage from "@/components/products/Blogs";
import ProductShips from "@/components/products/ProductShips";
import CardGrid from "@/components/special-collections/SpecialCollections";
import CardGrid2 from "@/components/category-box/CategoryBox";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Fullstack Next.js Store",
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    "Fullstack Next.js Store - Server Components, MongoDB, Next Auth, Tailwind, Zustand",
};

const HomePage = () => {
  return (
    <>
      <div className="w-full mx-auto  ">
        <Carousel />
      </div>
      <div className="w-full mx-auto  ">
        <HeroSection />
      </div>
      <div className="w-full mx-auto  ">
        <CardGrid2 />
      </div>
      {/* Regular Content Inside Container */}
      <div className="w-full mx-auto px-10">
        <Suspense
          fallback={<ProductItemsSkeleton qty={8} name="Latest Products" />}
        >
          <ProductItems />
        </Suspense>
      </div>

      <div className="w-full mx-auto px-4 mb-8">
        <CardGrid />
      </div>

      {/* Gift Banner Outside the Container */}
      {/* <div className="w-full mb-5">
        <GiftImage
          src="/images/banners/gift1.png"
          alt="Special Gift"
          height={200}
        />
      </div> */}
      {/* Blog Banner Outside the Container */}
      {/* <div className="container mx-auto my-8">
        <BlogsImage src="/images/banners/blog.png" alt="Blogs" height={200} />
      </div> */}
      <div className="w-full">
        <ProductShips src="/images/productship.png" alt="Blogs" height={200} />
      </div>

      {/* Back to Container for Other Content
      <div className="container mx-auto my-8 flex flex-col gap-4 md:gap-16">
        <Suspense fallback={<ProductItemsSkeleton qty={4} name="Top Rated" />}>
          <Slider />
        </Suspense>

        <ReadMore>
          <Text />
        </ReadMore>
      </div> */}
    </>
  );
};

export default HomePage;
