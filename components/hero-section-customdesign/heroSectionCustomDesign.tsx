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
  howText: string;
  howTextUrl: string;
}

const cards: Card[] = [
  {
    title: "Create Your Dream Jewellery",
    description:
      "Featuring Rings, Bangles, Bracelets, Chains, Anklets & Antique",
    buttonText: "START MY IDEA",
    bgColor: "bg-[#F8EEE7]",
    textColor: "text-brown-700",
    buttonColor: "bg-[#Dd91a6] hover:bg-[#000]",
    bgImage: "/blob.svg",
    fgImage: "/phone.png",
    image: "",
    type: "double-image",
    linkUrl: "/custom-design",
    howText: "How it works?",
    howTextUrl: "/how-it-works",
  },
];

const HeroSectionCustomDesign = () => {
  const router = useRouter();

  const renderImage = (card: Card) => {
    if (card.type === "double-image") {
      if (!card.bgImage || !card.fgImage) return null;
      return (
        <motion.div
          className="relative w-full lg:w-[50%] h-full mt-8 lg:mt-0"
          whileHover="hover"
          initial="initial"
        >
          <motion.div
            className="absolute -bottom-14 -right-0 lg:-right-24 w-full h-full z-0"
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
            className="absolute -bottom-4 -right-0 lg:-right-10 w-[200px] sm:w-[260px] h-[200px] sm:h-[260px] z-10 flex justify-center items-center"
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
    <div className="hidden md:flex flex-col lg:flex-row gap-6 mt-16 sm:mt-16 lg:mt-16 w-[95%] xl:w-[90%] 2xl:w-[80%] mx-auto px-4 sm:px-6">
      {/* Column 1 — 50% width on desktop, full on mobile */}
      <div className="w-full lg:w-1/2 lg:mb-0">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`relative overflow-hidden p-6 sm:p-8 lg:p-10 rounded-lg ${card.bgColor} flex flex-col lg:flex-row items-center group min-h-[300px] sm:min-h-[350px] lg:h-[400px] border-train-animation hover:bg-pink-50 transition-colors duration-300`}
          >
            <div className="w-full lg:w-[50%] z-20 flex flex-col justify-start items-start mb-8 lg:mb-0 relative">
              {/* Content with enhanced contrast */}
              <div className="relative z-10 w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-transparent pointer-events-none lg:hidden"></div>
                <h2
                  className={`text-2xl sm:text-3xl font-medium ${card.textColor} text-center lg:text-left mb-3 relative`}
                >
                  {card.title}
                </h2>
                <p className="mt-2 text-sm text-gray-900 text-center lg:text-left leading-relaxed relative">
                  {card.description}
                </p>
                <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-start gap-4 w-full mt-6 lg:mt-8 relative">
                  <Link
                    href={card.linkUrl}
                    className={`px-6 py-2.5 text-white ${card.buttonColor} text-center w-full sm:w-auto rounded-md shadow-sm hover:shadow transition-all duration-300 font-medium bg-[#] hover:bg-[#d93d87]`}
                  >
                    {card.buttonText}
                  </Link>
                  <Link
                    href={card.howTextUrl}
                    className="inline-flex items-center gap-1.5 text-[#000] hover:text-[#d93d87] border-b border-[#EC4999]/30 hover:border-[#EC4999] transition-all duration-300 group px-2"
                  >
                    <span>{card.howText}</span>
                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            {renderImage(card)}
          </div>
        ))}
      </div>

      {/* Column 2 & 3 wrapper - stack on mobile, side by side on desktop */}
      <div className="flex flex-col sm:flex-row lg:w-1/2 gap-6">
        {/* Column 2 */}
        <div className="w-full sm:w-1/2 h-[300px] sm:h-[350px] lg:h-[400px] group relative">
          <div
            onClick={() => router.push("/search")}
            className="relative w-full h-full overflow-hidden rounded-lg bg-[#EFEFEF] hover:bg-pink-50 cursor-pointer group-hover:scale-105 transition-all duration-300"
          >
            <Image
              src="/images/menu/cd-sec1.webp"
              alt="Search Design"
              fill
              className="object-cover"
            />

            {/* Gradient Bar - Always visible on mobile, hover on desktop */}
            <div className="absolute bottom-0 left-0 w-full h-[3.5rem] sm:h-14 lg:h-0 lg:group-hover:h-16 transition-all duration-500 ease-in-out bg-[#Dd91a6] hover:bg-[#Dd91a6] flex items-center justify-center overflow-hidden shadow-sm">
              <div className="text-white text-[0.9375rem] font-medium flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 text-center min-h-[3.25rem] hover:scale-[1.02] transition-transform duration-300">
                <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-px after:bg-white/30 after:transition-all after:duration-300">
                  Explore More Custom Designs
                </span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-2 text-lg leading-none">
                  →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="w-full sm:w-1/2 h-[300px] sm:h-[350px] lg:h-[400px] group relative">
          <div
            onClick={() => router.push("/search")}
            className="relative w-full h-full overflow-hidden rounded-lg bg-[#EFEFEF] hover:bg-[#Dd91a6] cursor-pointer group-hover:scale-105 transition-all duration-300"
          >
            <Image
              src="/images/menu/cd-sec2.webp"
              alt="Collections Design"
              fill
              className="object-cover"
            />

            {/* Gradient Bar - Always visible on mobile, hover on desktop */}
            <div className="absolute bottom-0 left-0 w-full h-[3.5rem] sm:h-14 lg:h-0 lg:group-hover:h-16 transition-all duration-500 ease-in-out bg-[#Dd91a6] hover:bg-[#Dd91a6] flex items-center justify-center overflow-hidden shadow-sm">
              <div className="text-white text-[0.9375rem] font-medium flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 text-center min-h-[3.25rem] hover:scale-[1.02] transition-transform duration-300">
                <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-px after:bg-white/30 after:transition-all after:duration-300">
                  Explore More Custom Designs
                </span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-2 text-lg leading-none">
                  →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionCustomDesign;
