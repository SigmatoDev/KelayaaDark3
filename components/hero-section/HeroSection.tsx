// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { motion } from "framer-motion";

// const images = [
//   {
//     default: "/images/hero/image1-default.png",
//     hover: "/images/hero/image1-hover.png",
//   },
//   {
//     default: "/images/hero/image2-default.png",
//     hover: "/images/hero/image2-hover.png",
//   },
// ];

// const HeroSection = () => {
//   return (
//     <div className="flex items-center justify-center w-full py-8 px-8">
//       <div className="md:gap-12 w-[80%] flex flex-col md:flex-row ">
//         {images.map((img, index) => (
//           <HoverImage
//             key={index}
//             defaultSrc={img.default}
//             hoverSrc={img.hover}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// const HoverImage = ({
//   defaultSrc,
//   hoverSrc,
// }: {
//   defaultSrc: string;
//   hoverSrc: string;
// }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       className="relative w-full md:w-[80%] h-[200px] md:h-[450px] flex flex-row items-center justify-center overflow-hidden"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <motion.div
//         className="absolute inset-0 w-full md:h-full"
//         initial={{ opacity: 1 }}
//         animate={{ opacity: isHovered ? 0 : 1 }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}
//       >
//         <Image
//           src={defaultSrc}
//           alt="Hero Image"
//           layout="fill"
//           className=" w-full md:w-[80%] h-full object-contain"
//         />
//       </motion.div>
//       <motion.div
//         className="absolute inset-0 w-full md:h-full"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: isHovered ? 1 : 0 }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}
//       >
//         <Image
//           src={hoverSrc}
//           alt="Hero Image Hover"
//           layout="fill"
//           className="w-full md:w-[80%] h-full object-contain"
//         />
//       </motion.div>
//     </div>
//   );
// };

// export default HeroSection;


"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

import { Marko_One } from 'next/font/google';

const markoOne = Marko_One({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const cards = [
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
  },
  {
    title: "Best Sellers And New Arrivals",
    description:
      "Featuring Rings, Bangles, Bracelets, Chains, Anklets & Antique",
    buttonText: "SHOP NOW",
    bgColor: "bg-[#EFEFEC]",
    textColor: "text-gray-700",
    buttonColor: "bg-gradient-to-r from-pink-500 to-orange-400",
    bgImage: "/blob.svg",
    fgImage: "/phone.png",
  },
];

const HeroSection = () => {
  return (
    <div className=" xl:w-[85%] 2xl:w-[70%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-24">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`relative overflow-hidden p-10 rounded-lg ${card.bgColor} flex items-center group W-[759px] h-[400px]`}
        >
          <div className="w-[50%] z-20">
            <h2 className={`text-2xl font-bold ${card.textColor} ${markoOne.className} `}>
              {card.title}
            </h2>
            <p className="mt-2 text-sm text-gray-500">{card.description}</p>
            <button
              className={`mt-4 px-4 py-2 text-white rounded-lg ${card.buttonColor}`}
            >
              {card.buttonText}
            </button>
          </div>

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
        </div>
      ))}
    </div>
  );
};

export default HeroSection;
