'use client'
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

interface ProductShipsImageProps {
  src: string;
  alt?: string;
  height?: number;
  className?: string;
}
const features = [
  { icon: '/images/la_shopping-cart.svg', title: 'FREE DELIVERY', description: 'Lorem ipsum dolor sit amet, consectetur adipi elit.' },
  { icon: '/images/la_user-check.svg', title: '100% SECURE PAYMENT', description: 'Lorem ipsum dolor sit amet, consectetur adipi elit.' },
  { icon: '/images/la_tag.svg', title: 'DAILY OFFERS', description: 'Lorem ipsum dolor sit amet, consectetur adipi elit.' },
  { icon: '/images/la_award.svg', title: 'QUALITY GUARANTEE', description: 'Lorem ipsum dolor sit amet, consectetur adipi elit.' },
];
const ProductShips: React.FC<ProductShipsImageProps> = ({

}) => {
  return (
    <div className="bg-pink-50 xl:h-[317px] py-10 md:py-14 mt-10 xl:mt-20">
      <div className="w-full h-full flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col xl:items-start items-center w-full">
              <div className="bg-pink-100 p-3 md:p-4 rounded-lg group hover:cursor-pointer">
                <motion.div
                  whileHover={{
                    rotate: [-5, 5, -5, 5, 0],
                    transition: {
                      duration: 0.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse"
                    }
                  }}
                >
                  <Image 
                    src={feature.icon} 
                    alt={feature.title} 
                    width={40} 
                    height={40} 
                    className="md:w-[50px] md:h-[50px] w-[40px] h-[40px]" 
                  />
                </motion.div>
              </div>
              <h3 className="mt-2 md:mt-3 font-normal xl:text-left text-center text-sm md:text-base">{feature.title}</h3>
              <p className="font-normal text-[12px] md:text-[14px] text-[#908F8D] text-center xl:text-left w-[75%]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductShips;










