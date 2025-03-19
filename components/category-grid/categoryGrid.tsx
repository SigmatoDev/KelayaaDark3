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
    hoverImage: "/images/collections/pendanthover.webp",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    image: "/images/collections/necklace.webp",
    hoverImage: "/images/collections/necklacehover.webp",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    image: "/images/collections/bracelet.webp",
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
      className="group relative w-[420px] h-[400px] 2xl:w-[400px] 2xl:h-[420px] xl:w-[300px] xl:h-[320px] overflow-hidden rounded-xl shadow-md transition-all"
    >
      <div className="relative w-full h-full">
        {/* Hover Image - Place it first so it scales underneath the default */}
        <Image
          src={category.hoverImage}
          alt={`${category.name} hover`}
          fill
          className="object-cover transition duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105 z-0"
        />

        {/* Default Image - Will fade out on hover */}
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition duration-700 ease-in-out opacity-100 group-hover:opacity-0 z-10"
        />
      </div>

      {/* Category Name Box */}
      <div className="absolute bottom-0 w-full bg-white px-4 py-3 flex items-center justify-between text-[#474747] font-medium text-lg z-20">
        {category.name}
        <ArrowRight className="w-5 h-5 text-[#474747] transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

const CategoryGrid = () => {
  return (
    <div className="px-4 mt-16 mx-auto md:w-[94%] flex items-center justify-center flex-col ">
      <h2 className="text-[22px] md:text-[36px] text-center font-normal mb-2 uppercase text-[#474747]">
        Explore Our
        <span className="bg-gradient-to-r from-[#f76999] to-[#fb8d92] bg-clip-text text-transparent ml-2">
          Collections
        </span>
      </h2>
      <p className="text-center mb-8 text-gray-400 font-light text-sm">
        From everyday essentials to statement styles — explore our collections
        and find what speaks to you.
      </p>
      <div className="grid justify-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-4 2xl:gap-2 xl:gap-10 justify-items-center">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
