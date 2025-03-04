"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const banners = [
  "/images/featured/featured-1.webp",
  "/images/featured/featured-1.webp",
  "/images/featured/featured-1.webp",
  "/images/featured/featured-1.webp",
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full -z-0 -top-12 aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/7] lg:aspect-[16/6] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute w-full h-full"
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "-100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <img
            src={banners[currentIndex]}
            alt={`Banner ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Banner;
