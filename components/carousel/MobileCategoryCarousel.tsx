"use client";

import Link from "next/link";
import { FaRing, FaCrown, FaStar } from "react-icons/fa";
import { GiMetalBar, GiPearlNecklace } from "react-icons/gi";


const categories = [
    { name: "Silver", href: "/search?materialType=silver", icon: <GiMetalBar size={24} /> },
    { name: "Gold & Diamonds", href: "/search?materialType=gold", icon: <FaRing size={24} /> },
    { name: "Beads", href: "/search?materialType=beads", icon: <GiPearlNecklace size={24} /> },
    { name: "Custom Design", href: "/custom-design", icon: <FaCrown size={24} /> },
    { name: "Collections", href: "/search?productCategory=collections", icon: <FaStar size={24} /> },
  ];
  

const MobileCategoryCarousel = () => {
  return (
    <section className="block md:hidden bg-[#f8edd2] py-4 overflow-x-auto">
      <div className="flex space-x-4 px-4">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.href}
            className="flex flex-col items-center text-center min-w-[70px]"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center hover:bg-[#e0c9a0] transition">
              {category.icon}
            </div>
            <span className="mt-2 text-xs font-medium text-gray-700">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MobileCategoryCarousel;
