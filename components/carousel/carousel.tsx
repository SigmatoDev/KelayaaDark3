// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import {
//   Carousel as SCarousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// import image1 from "../../public/images/featured/featured-11.webp";
// import image3 from "../../public/images/featured/featured-33.webp";
// import image4 from "../../public/images/featured/featured-36.webp";
// import image5 from "../../public/images/featured/featurad-31.webp";
// import image6 from "../../public/images/featured/featured3b.webp";

// const images = [image1, image3, image4, image5, image6];

// const Carousel = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, []);

//   const handlePrevious = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   return (
// <div className="relative w-full h-[50vh] md:h-[90vh] overflow-hidden mt-[10px] md:mt-0">
// <div className="relative mx-auto w-full h-full px-2 md:px-0 md:rounded-none rounded-lg">
//         <SCarousel opts={{ loop: true }}>
//           <CarouselContent>
//             {images.map((image, index) => (
//              <CarouselItem
//              key={index}
//              className={`${
//                index === currentIndex ? "block" : "hidden"
//              } w-full h-[50vh] md:h-[90vh] transition-opacity duration-700 overflow-hidden rounded-lg`}
//            >
//              <Image
//                src={image}
//                alt={`Slide ${index + 1}`}
//                className="w-full h-full object-cover object-center rounded-lg"
//                placeholder="blur"
//                priority
//              />
//            </CarouselItem>
           
//             ))}

            
//             <div className="absolute z-30 top-[25%] md:top-[50%] left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-4 md:space-y-6 text-center px-4">
//   <h2 className="text-white text-lg md:text-5xl font-semibold leading-tight">
//     Celebrate Every Moment with <br /> Pure, Elegant Gold
//   </h2>
//   <p className="text-white text-xs md:text-xl mt-2">
//     Crafted with Love, Worn with Pride, Timelessly Beautiful.
//   </p>
//   <div className="flex flex-row flex-wrap justify-center gap-2 md:gap-4 mt-4">
//     <a
//       href="/search"
//       className="px-4 py-2 border border-white bg-white text-black hover:bg-transparent hover:text-white transition rounded-md text-xs md:text-base"
//     >
//       Shop the Collection
//     </a>
//     <a
//       href="/custom-design"
//       className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition rounded-md text-xs md:text-base"
//     >
//       Get Custom Designs
//     </a>
//   </div>
// </div>


//           </CarouselContent>

         
//           <button
//             onClick={handlePrevious}
//             className="absolute top-1/2 text-white left-4 transform -translate-y-1/2 bg-transparent border border-white rounded-full p-2 z-30 hover:bg-white hover:text-black transition"
//           >
//             <ChevronLeft className="w-6 h-6" />
//           </button>

         
//           <button
//             onClick={handleNext}
//             className="absolute top-1/2 right-4 text-white transform -translate-y-1/2 bg-transparent border border-white rounded-full p-2 z-30 hover:bg-white hover:text-black transition"
//           >
//             <ChevronRight className="w-6 h-6" />
//           </button>
//         </SCarousel>
//       </div>
//     </div>
//   );
// };

// export default Carousel;

// export const CarouselSkeleton = () => {
//   return <div className="skeleton h-[450px] md:h-[600px] w-full rounded-lg" />;
// };




"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel as SCarousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

import image1 from "../../public/images/featured/featured-11.webp";
import image3 from "../../public/images/featured/featured-33.webp";
import image4 from "../../public/images/featured/featured-36.webp";
import image5 from "../../public/images/featured/featurad-31.webp";
import image6 from "../../public/images/featured/featured3b.webp";

const images = [image1, image3, image4, image5, image6];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

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
    <div className="relative w-full h-[50vh] md:h-[90vh] overflow-hidden mt-[10px] md:mt-0">
      <div className="relative mx-auto w-full h-full px-2 md:px-0 md:rounded-none rounded-lg">
        <SCarousel opts={{ loop: true }}>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem
                key={index}
                className={`${
                  index === currentIndex ? "block" : "hidden"
                } w-full h-[50vh] md:h-[90vh] transition-opacity duration-700 overflow-hidden rounded-lg`}
              >
                <Image
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover object-center rounded-lg"
                  placeholder="blur"
                  priority
                />
              </CarouselItem>
            ))}

            {/* Centered / Left-aligned Text */}
            <div className="absolute z-30 top-[25%] md:top-[50%] left-4 md:left-1/2 transform md:-translate-x-1/2 flex flex-col items-start md:items-center space-y-2 md:space-y-6 text-left md:text-center px-4">
              <h2 className="text-white text-base md:text-5xl font-semibold leading-snug md:leading-tight">
                Celebrate Every Moment with <br className="hidden md:block" /> Pure, Elegant Gold
              </h2>
              <p className="text-white text-[11px] md:text-xl mt-1 md:mt-2">
                Crafted with Love, Worn with Pride, Timelessly Beautiful.
              </p>
              <div className="flex flex-wrap justify-start md:justify-center gap-2 md:gap-4 mt-3 md:mt-4">
                <a
                  href="/search"
                  className="px-3 py-1.5 border border-white bg-white text-black hover:bg-transparent hover:text-white transition rounded-md text-xs md:text-base"
                >
                  Shop the Collection
                </a>
                <a
                  href="/custom-design"
                  className="px-3 py-1.5 border border-white text-white hover:bg-white hover:text-black transition rounded-md text-xs md:text-base"
                >
                  Get Custom Designs
                </a>
              </div>
            </div>
          </CarouselContent>

          {/* Left Arrow — hidden on mobile */}
          <button
            onClick={handlePrevious}
            className="hidden sm:block absolute top-1/2 left-4 text-white transform -translate-y-1/2 bg-transparent border border-white rounded-full p-2 z-30 hover:bg-white hover:text-black transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow — hidden on mobile */}
          <button
            onClick={handleNext}
            className="hidden sm:block absolute top-1/2 right-4 text-white transform -translate-y-1/2 bg-transparent border border-white rounded-full p-2 z-30 hover:bg-white hover:text-black transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </SCarousel>
      </div>
    </div>
  );
};

export default Carousel;

// Skeleton loader component
export const CarouselSkeleton = () => {
  return <div className="skeleton h-[450px] md:h-[600px] w-full rounded-lg" />;
};
