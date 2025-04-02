"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Category = {
  name: string;
  slug: string;
  image: string;
  hoverImage: string;
};

const categories: Category[] = [
  {
    name: "Pendants",
    slug: "pendants",
    image: "/images/collections/pendants.webp",
    hoverImage: "/images/collections/pendantshover.webp",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    image: "/images/collections/necklace-1.webp",
    hoverImage: "/images/collections/necklacehover.webp",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    image: "/images/collections/bracelets.webp",
    hoverImage: "/images/collections/bracelethover.webp",
  },
  {
    name: "Earrings",
    slug: "earrings",
    image: "/images/collections/earrings.webp",
    hoverImage: "/images/collections/earringshover.webp",
  },
];

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative w-[calc(100vw-4.5rem)] h-[260px] sm:w-[320px] sm:h-[340px] lg:w-[320px] lg:h-[300px] xl:w-[300px] xl:h-[320px] 2xl:w-[400px] 2xl:h-[420px] overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative w-full h-full">
        {/* Hover Image - Place it first so it scales underneath the default */}
        <Image
          src={category.hoverImage}
          alt={`${category.name} hover`}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
          priority={category.slug === 'pendants'}
          className="object-cover transition duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105 z-0"
        />

        {/* Default Image - Will fade out on hover */}
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
          priority={category.slug === 'pendants'}
          className="object-cover transition duration-700 ease-in-out opacity-100 group-hover:opacity-0 z-10"
        />

        {/* Mobile Touch Feedback Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Category Name Box */}
      <div className="absolute bottom-0 w-full bg-white/95 backdrop-blur-[1px] px-4 py-2.5 sm:py-3.5 flex items-center justify-between text-[#474747] font-medium text-base sm:text-lg z-20 group-hover:bg-pink-50 transition-colors duration-300">
        <span className="relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 group-hover:after:w-full after:h-[2px] after:bg-[#EC4999] after:transition-all after:duration-300">{category.name}</span>
        <ArrowRight className="w-5 h-5 text-[#474747] group-hover:text-[#EC4999] transition-all duration-300 group-hover:translate-x-1.5" />
      </div>
    </Link>
  );
};

const CategoryGrid = () => {
  return (
    <div className="px-4 mt-6 sm:mt-16 mx-auto md:w-[94%] flex items-center justify-center flex-col">
      <h2 className="text-[22px] md:text-[36px] text-center font-normal mb-2 uppercase text-[#474747]">
        Explore Our
        <span className="bg-gradient-to-r from-[#EC4999] to-[#fb8d92] bg-clip-text text-transparent ml-2">
          Collections
        </span>
      </h2>
      <p className="text-center mb-3 sm:mb-8 text-gray-600 font-light text-sm max-w-[85%] sm:max-w-none">
        From everyday essentials to statement styles — explore our collections
        and find what speaks to you.
      </p>
      <div className="grid justify-center items-start grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 xl:gap-8 2xl:gap-2 justify-items-center w-full">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
