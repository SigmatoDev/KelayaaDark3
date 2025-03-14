"use client";
import { useRouter } from "next/navigation";
import React from "react";

const CardGrid: React.FC = () => {
  const router = useRouter();
  const cards = [
    { id: 1, title: "Gold & Diamond", image: "/images/categories/gold.webp" },
    { id: 2, title: "Silver", image: "/images/categories/diamond.webp" },
    { id: 3, title: "Gem Stone", image: "/images/categories/silver.webp" },
    // { id: 4, title: "", image: "/images/categories/cat-1.webp" },
    // { id: 5, title: "Custom Designs", image: "/images/categories/custom.webp" },
  ];
  const customCards = [
    { id: 1, title: "Gold & Diamond", image: "/images/categories/gold.webp" },
    { id: 2, title: "Silver", image: "/images/categories/diamond.webp" },
    { id: 3, title: "Gem Stone", image: "/images/categories/silver.webp" },
    // { id: 4, title: "", image: "/images/categories/cat-1.webp" },
    // { id: 5, title: "Custom Designs", image: "/images/categories/custom.webp" },
  ];

  return (
    <>
         {/* New Section */}
         <div className="text-center">
        <h2 className="text-[20px] md:text-[38px] font-normal mb-6 mt-20 md:mt-14 uppercase text-center">
        CUSTOM
          <span className="bg-gradient-to-r from-[#f76999] to-[#fb8d92] bg-clip-text text-transparent ml-2">
            DESIGNS
          </span>
        </h2>
      </div>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative bg-white p-1 cursor-pointer overflow-hidden"
            >
              <div className="relative group">
                <div className="relative overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-80 object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gray-200 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                  <button
                    className="bg-white text-black px-4 py-2 text-sm font-semibold rounded-sm hover:bg-gray-200 tracking-[1px] transition"
                    onClick={() => router.push("/search")}
                  >
                    EXPLORE
                  </button>
                </div>
              </div>
              <h2 className="text-lg text-gray-500 mt-2">{card.title}</h2>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-[20px] md:text-[38px] font-normal mb-6 mt-2 md:mt-24 uppercase text-center">
          EXPLORE OUR
          <span className="bg-gradient-to-r from-[#f76999] to-[#fb8d92] bg-clip-text text-transparent ml-2">
            COLLECTIONS
          </span>
        </h2>
      </div>
      <div className="container mx-auto">
        {/* First row: 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cards.slice(0, 3).map((card) => (
            <div
              key={card.id}
              className="relative bg-white p-1 cursor-pointer overflow-hidden"
            >
              <div className="relative group">
                <div className="relative overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-80 object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gray-200 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                  <button
                    className="bg-white text-black px-4 py-2 text-sm font-semibold rounded-sm hover:bg-gray-200 tracking-[1px] transition"
                    onClick={() => router.push("/search")}
                  >
                    EXPLORE
                  </button>
                </div>
              </div>
              <h2 className="text-lg text-gray-500 mt-2">{card.title}</h2>
            </div>
          ))}
        </div>

        
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {customCards.slice(3, 5).map((card) => (
            <div
              key={card.id}
              className="relative bg-white p-1 cursor-pointer overflow-hidden"
            >
              <div className="relative group">
                <div className="relative overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-[300px] object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gray-200 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                  <button
                    className="bg-white text-black px-4 py-2 text-sm font-semibold rounded-sm hover:bg-gray-200 transition tracking-[1px]"
                    onClick={() => router.push("/search")}
                  >
                    EXPLORE
                  </button>
                </div>
              </div>
              <h2 className="text-lg text-gray-500 mt-2">{card.title}</h2>
            </div>
          ))}
        </div> */}
      </div>

 
    </>
  );
};

export default CardGrid;
