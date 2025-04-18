"use client";

import Image from "next/image";
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
}

const cards: Card[] = [
  {
    title: "Create Your Dream Jewellery",
    description:
      "Featuring Rings, Bangles, Bracelets, Chains, Anklets & Antique",
    buttonText: "START MY IDEA",
    bgColor: "bg-[#Dd91a6]",
    textColor: "text-brown-700",
    buttonColor: "bg-gradient-to-r from-pink-500 to-orange-400",
    bgImage: "/blob.svg",
    fgImage: "/phone.png",
    image: "",
    type: "double-image" as const,
    linkUrl: "/custom-design",
  },
  {
    title: "Best Sellers And New Arrivals",
    description:
      "Featuring Rings, Bangles, Bracelets, Chains, Anklets & Antique",
    buttonText: "SHOP NOW",
    bgColor: "bg-[#EFEFEC]",
    textColor: "text-gray-700",
    buttonColor: "bg-gradient-to-r from-pink-500 to-orange-400",
    bgImage: "",
    fgImage: "",
    image: "/flower1.svg",
    type: "single-image" as const,
    linkUrl: "/sub-custom-design",
  },
];

const HeroSection = () => {
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

    return (
      <motion.div
        className="relative w-[50%] h-full flex items-center justify-center"
        whileHover="hover"
        initial="initial"
      >
        <motion.div
          className="w-[300px] h-[300px]  absolute -bottom-28 -right-16"
          variants={{
            initial: { scale: 1.1 },
            hover: { scale: 1.4, rotate: 2 },
          }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={card.image}
            alt="Card Image"
            layout="fill"
            objectFit="contain"
            className="rounded-full rotate-180"
          />
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className=" xl:w-[95%] 2xl:w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`relative overflow-hidden p-10 rounded-lg ${card.bgColor} flex items-center group W-[759px] h-[400px]`}
        >
          <div className="w-[50%] z-20 flex flex-col justify-start items-start">
            <h2
              className={`text-3xl font-medium ${card.textColor}`}
            >
              {card.title}
            </h2>
            <p className="mt-2 text-sm text-gray-500">{card.description}</p>
            <Link
              href={card.linkUrl}
              className={`mt-8 px-4 py-2 text-white ${card.buttonColor}`}
            >
              {card.buttonText}
            </Link>
          </div>

          {renderImage(card)}
        </div>
      ))}
    </div>
  );
};

export default HeroSection;
