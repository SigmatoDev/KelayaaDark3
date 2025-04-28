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
import HowToSection from "@/components/howto-section/howToSection";
import CategoryGrid from "@/components/category-grid/categoryGrid";
import KelayaFavourites from "@/components/KelayaFavourites/KelayaFavourites";
import HeroSectionCustomDesign from "@/components/hero-section-customdesign/heroSectionCustomDesign";
import { usePathname, useRouter } from "next/navigation";
import MobileCategoryCarousel from "@/components/carousel/MobileCategoryCarousel";
import MobileHeroSectionCustomDesign from "@/components/hero-section-customdesign/MobileHeroSectionCustomDesign";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Kelayaa",
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    "Kelayaa – your ultimate destination for gold and diamond jewellery",
};

const HomePage = () => {
  return (
    <>
      <>
        <MobileCategoryCarousel />
        <div>
          <Suspense fallback={<CarouselSkeleton />}>
            <Carousel />
          </Suspense>
        </div>
        <div className="px-4">
          {/* <HeroSection /> */}
          <HeroSectionCustomDesign />
          <MobileHeroSectionCustomDesign />
        </div>
        {/* <CardGrid /> */}
      </>

      <div className="w-full mt-0">
        <KelayaFavourites />
      </div>

      <div className="w-full">
        <CategoryGrid />
      </div>

      {/* Regular Content Inside Container */}
      <div className="w-full mx-auto px-2">
        <Suspense
          fallback={<ProductItemsSkeleton qty={8} name="Latest Products" />}
        >
          <ProductItems />
        </Suspense>
      </div>

      {/* <div className="w-full mx-auto px-4 mb-8">
        <CardGrid />
      </div> */}

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
        <HowToSection />
      </div>

      <div className="w-full">
        <ProductShips />
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
