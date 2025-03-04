"use client";
import { useRouter } from "next/navigation";
import React from "react";

const CardGrid: React.FC = () => {
  const router = useRouter();
  const cards = [
    { id: 1, title: "Gold", image: "/images/special-collections/bangles.webp" },
    {
      id: 2,
      title: "Diamond",
      image: "/images/special-collections/Bracelets.webp",
    },
    {
      id: 3,
      title: "Silver",
      image: "/images/special-collections/silverpendant.webp",
    },
  ];

  return (
    <>
      <div className="text-center">
        <h2 className="text-[20px] md:text-[38px] font-normal mb-6 mt-20 uppercase">
          <span className="bg-gradient-to-r from-[#f76999] to-[#fb8d92] bg-clip-text text-transparent mr-2">
            GRACE
          </span>
          IN EVERY DETAILS
        </h2>
      </div>
      <div className="container mx-auto px-10">
        {/* First row: 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
          {cards.slice(0, 3).map((card) => (
            <div
              key={card.id}
              className="relative bg-white p-1 cursor-pointer overflow-hidden"
            >
              <div className="relative group">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-80 object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
                {/* <div className="absolute inset-0 bg-gray-200 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                  <button
                    className="bg-white text-black px-4 py-2 text-sm font-semibold rounded-sm hover:bg-gray-200 tracking-[1px] transition"
                    onClick={() => router.push("/search")}
                  >
                    EXPLORE
                  </button>
                </div> */}
              </div>
              {/* <h2 className="text-lg text-gray-500 mt-2">{card.title}</h2> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CardGrid;
