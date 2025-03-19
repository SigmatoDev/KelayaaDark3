"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Carousel as SCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import image1 from "../../public/images/featured/featured-11.webp";
// import image2 from "../../public/images/featured/featured-2.webp";
import image3 from "../../public/images/featured/featured-33.webp";
import { Link } from "lucide-react";

const images = [image1, image3];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change slides every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full h-[100dvh]">
      <SCarousel opts={{ loop: true }}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className={`${
                index === currentIndex ? "block" : "hidden"
              } w-full h-[100vh] transition-opacity duration-700`}
            >
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                placeholder="blur"
                priority
              />
            </CarouselItem>
          ))}
          <div className="absolute z-50 top-[40%] md:top-[60%] left-[10%] flex gap-2 flex-col">
            <div>
              <h2 className="text-white text-2xl md:text-5xl font-normal md:leading-[1.3]">
              Celebrate Every Moment with  <br />
               Pure, Elegant Gold
              </h2>
              <p className="text-white text-[15px] py-2 md:text-xl">
              Crafted with Love, Worn with Pride, Timelessly Beautiful.
              </p>
            </div>

            <div className="flex md:gap-2 flex-col md:flex-row gap-4" >
              <div className="w-[230px] h-[40px] bg-white hover:bg-transparent border border-transparent hover:border-white transition-all duration-500 group">
                <a
                  href="/search"
                  className="w-full h-full flex items-center justify-center px-[20px] text-black group-hover:text-white transition-colors duration-500"
                >
                  Shop the collection
                </a>
              </div>
              <div className="w-[230px] h-[40px] bg-transparent border border-white flex items-center justify-center px-[20px] hover:border-white hover:bg-white transition-all duration-500 group">
                <a
                  className="text-white group-hover:text-black  "
                  href="/custom-design"
                >
                  Get Custom Designs
                </a>
              </div>
            </div>
          </div>
        </CarouselContent>
        {/* <CarouselPrevious
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer bg-white bg-opacity-50 hover:bg-opacity-100 p-3 rounded-full"
        />
        <CarouselNext
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer bg-white bg-opacity-50 hover:bg-opacity-100 p-3 rounded-full"
        /> */}
      </SCarousel>
    </div>
  );
};

export default Carousel;

export const CarouselSkeleton = () => {
  return <div className="skeleton h-[450px] md:h-[600px] w-full" />;
};
