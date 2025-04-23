"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
    name: "Sets",
    slug: "sets",
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
  const router = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams({
      q: "",
      materialType: "",
      productCategory: category.name,
      category: "all",
      price: "",
      rating: "",
      sort: "",
      page: "1",
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative w-full h-[240px] sm:h-[300px] md:h-[320px] lg:h-[300px] xl:h-[320px] overflow-hidden rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="relative w-full h-full">
        {/* Hover Image */}
        <Image
          src={category.hoverImage}
          alt={`${category.name} hover`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
          priority={category.slug === "pendants"}
          className="object-cover transition duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105 z-0"
        />

        {/* Default Image */}
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
          priority={category.slug === "pendants"}
          className="object-cover transition duration-700 ease-in-out opacity-100 group-hover:opacity-0 z-10"
        />

        {/* Touch Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Label */}
      <div className="absolute bottom-0 w-full bg-white/95 backdrop-blur-[2px] px-4 py-2.5 flex items-center justify-between text-[#474747] font-medium text-sm md:text-base z-20 group-hover:bg-pink-50 transition-colors duration-300">
        <span className="relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 group-hover:after:w-full after:h-[2px] after:bg-[#EC4999] after:transition-all after:duration-300">
          {category.name}
        </span>
        <ArrowRight className="w-4 h-4 text-[#474747] group-hover:text-[#EC4999] transition-transform duration-300 group-hover:translate-x-1.5" />
      </div>
    </div>
  );
};

const CategoryGrid = () => {
  return (
    <section className="px-4 mt-6 sm:mt-10 mx-auto max-w-7xl">
      {/* Heading */}
      <h2 className="text-[22px] md:text-[36px] text-center font-normal mb-2 uppercase text-[#474747]">
        Explore Our
        <span className="bg-gradient-to-r from-[#EC4999] to-[#fb8d92] bg-clip-text text-transparent ml-2">
          Collections
        </span>
      </h2>
      <p className="text-center mb-6 sm:mb-10 text-gray-600 font-light text-sm max-w-[85%] sm:max-w-full mx-auto">
        From everyday essentials to statement styles — explore our collections and find what speaks to you.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
