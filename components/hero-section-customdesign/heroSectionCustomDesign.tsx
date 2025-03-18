"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Marko_One } from "next/font/google";

const markoOne = Marko_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface Card {
  title: string;
  description: string;
  buttonText: string;
  bgColor: string;
  textColor: string;
  buttonColor: string;
  type: "double-image" | "single-image";
  bgImage: string;
  fgImage: string;
  image: string;
  linkUrl: string;
  howText:string;
  howTextUrl:string;
}

const cards: Card[] = [
  {
    title: "Create Your Dream Jewellery",
    description:
      "Featuring Rings, Bangles, Bracelets, Chains, Anklets & Antique",
    buttonText: "START MY IDEA",
    bgColor: "bg-[#F8EEE7]",
    textColor: "text-brown-700",
    buttonColor: "bg-gradient-to-r from-pink-500 to-orange-400",
    bgImage: "/blob.svg",
    fgImage: "/phone.png",
    image: "",
    type: "double-image",
    linkUrl: "/custom-design",
    howText: "How it works?",
    howTextUrl:"/how-it-works"
  },
];

const HeroSectionCustomDesign = () => {
  const router = useRouter();

  const renderImage = (card: Card) => {
    if (card.type === "double-image") {
      if (!card.bgImage || !card.fgImage) return null;
      return (
        <motion.div
          className="relative w-[50%] h-full"
          whileHover="hover"
          initial="initial"
        >
          <motion.div
            className="absolute -bottom-14 -right-24 w-full h-full z-0"
            variants={{
              initial: { scale: 1.3 },
              hover: { scale: 1.2 },
            }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={card.bgImage}
              alt="Background Image"
              layout="fill"
              objectFit="contain"
              className="opacity-15"
            />
          </motion.div>
          <motion.div
            className="absolute -bottom-4 -right-10 w-[260px] h-[260px] z-10 flex justify-center items-center"
            variants={{
              initial: { y: 0, scale: 1 },
              hover: { y: -26, scale: 1.1 },
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <Image
              src={card.fgImage}
              alt="Foreground Image"
              width={500}
              height={500}
              className="rounded-lg"
            />
          </motion.div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-row gap-6 mt-24 xl:w-[95%] 2xl:w-[80%] mx-auto">
      {/* Column 1 — 50% width */}
      <div className="w-1/2">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`relative overflow-hidden p-10 rounded-lg ${card.bgColor} flex items-center group h-[400px] border-train-animation`}
            >
            <div className="w-[50%] z-20 flex flex-col justify-start items-start">
              <h2 className={`text-3xl font-medium ${card.textColor}`}>
                {card.title}
              </h2>
              <p className="mt-2 text-sm text-gray-500">{card.description}</p>
              <Link
                href={card.linkUrl}
                className={`mt-8 px-4 py-2 text-white ${card.buttonColor}`}
              >
                {card.buttonText}
              </Link>
              <Link
  href={card.howTextUrl}
  className="mt-3 pl-2 inline-flex items-center gap-1 text-gray-600 border-b border-gray-300 hover:border-gray-500 transition-all duration-300 group"
>
  <span>{card.howText}</span>
  <span className="transform transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
</Link>

            </div>
            {renderImage(card)}
          </div>
        ))}
      </div>
  
      {/* Column 2 — 25% width */}
      <div className="w-1/4 h-[400px] group relative">
  <div
    onClick={() => router.push("/search")}
    className="relative w-full h-full overflow-hidden rounded-lg bg-[#EFEFEF] cursor-pointer group-hover:scale-105 transition duration-300"
  >
    <Image
      src="/images/categories/custom2.webp"
      alt="Search Design"
      fill
      className="object-cover"
    />

    {/* Gradient Hover Bar */}
    <div className="absolute bottom-0 left-0 w-full h-0 group-hover:h-16 transition-all duration-500 ease-in-out bg-gradient-to-r from-pink-500 to-orange-400 flex items-center justify-center overflow-hidden">
      <div className="text-white text-sm font-medium flex items-center gap-2">
        <span>Explore More Custom Designs</span>
        <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
      </div>
    </div>
  </div>
</div>


  
      {/* Column 3 — 25% width */}
      <div className="w-1/4 h-[400px] group relative">
  <div
    onClick={() => router.push("/collections")}
    className="relative w-full h-full overflow-hidden rounded-lg bg-[#EFEFEF] cursor-pointer group-hover:scale-105 transition duration-300"
  >
    <Image
      src="/images/categories/custom4.webp"
      alt="Collections Design"
      fill
      className="object-cover"
    />

    {/* Slide-Up Gradient Hover Effect */}
    <div className="absolute bottom-0 left-0 w-full h-0 group-hover:h-16 transition-all duration-500 ease-in-out bg-gradient-to-r from-pink-500 to-orange-400 flex items-center justify-center overflow-hidden">
      <div className="text-white text-sm font-medium flex items-center gap-2">
        <span>Explore More Custom Designs</span>
        <span className="transition-transform duration-300 group-hover:translate-x-2">
          →
        </span>
      </div>
    </div>
  </div>
</div>




    </div>
  );
  
};

export default HeroSectionCustomDesign;