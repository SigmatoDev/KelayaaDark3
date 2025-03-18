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

export default function ProductShips() {
  const features = [
    { icon: '/images/la_shopping-cart.svg', title: 'FREE DELIVERY', description: 'Enjoy the convenience of fast and free delivery on all your orders. No hidden charges—just smooth and timely doorstep service, every time you shop with us.' },
    { icon: '/images/la_user-check.svg', title: '100% SECURE PAYMENT', description: 'Shop with confidence using our end-to-end encrypted payment system. Your transactions are fully protected with industry-standard security protocols.' },
    { icon: '/images/la_tag.svg', title: 'DAILY OFFERS', description: 'Discover amazing deals and exclusive offers every day. Save more with exciting discounts on your favorite collections—because you deserve a little extra.' },
    { icon: '/images/la_award.svg', title: 'QUALITY GUARANTEE', description: 'We stand by our promise of premium quality craftsmanship. Every piece you choose is carefully curated and quality-checked for complete customer satisfaction.' },
  ];

  return (
    <div className="bg-gray-100 xl:h-[317px] py-10 md:py-14 mt-10 xl:mt-20">
      <div className="w-full h-full flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col xl:items-start items-center w-full">
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg group hover:cursor-pointer">
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
              <p className="font-normal text-[12px] md:text-[12px] text-[#908F8D] text-center xl:text-left w-[75%]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}










