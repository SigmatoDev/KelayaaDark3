"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

const images = [
  {
    default: "/images/hero/image1-default.png",
    hover: "/images/hero/image1-hover.png",
  },
  {
    default: "/images/hero/image2-default.png",
    hover: "/images/hero/image2-hover.png",
  },
];

const HeroSection = () => {
  return (
    <div className="flex items-center justify-center w-full py-8 px-8">
      <div className="md:gap-12 w-[80%] flex flex-col md:flex-row ">
        {images.map((img, index) => (
          <HoverImage
            key={index}
            defaultSrc={img.default}
            hoverSrc={img.hover}
          />
        ))}
      </div>
    </div>
  );
};

const HoverImage = ({
  defaultSrc,
  hoverSrc,
}: {
  defaultSrc: string;
  hoverSrc: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full md:w-[80%] h-[200px] md:h-[450px] flex flex-row items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 w-full md:h-full"
        initial={{ opacity: 1 }}
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Image
          src={defaultSrc}
          alt="Hero Image"
          layout="fill"
          className=" w-full md:w-[80%] h-full object-contain"
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 w-full md:h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Image
          src={hoverSrc}
          alt="Hero Image Hover"
          layout="fill"
          className="w-full md:w-[80%] h-full object-contain"
        />
      </motion.div>
    </div>
  );
};

export default HeroSection;
