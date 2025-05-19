"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

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
    description: "Featuring Rings, Bangles, Bracelets, Chains, Anklets & Antique",
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

const MobileHeroSectionCustomDesign = () => {
  const router = useRouter();

  const renderImage = (card: Card) => {
    if (card.type === "double-image") {
      if (!card.bgImage || !card.fgImage) return null;
      return (
        <motion.div
          className="relative w-full h-full mt-6"
          whileHover="hover"
          initial="initial"
        >
          <motion.div
            className="absolute -bottom-10 -right-0 w-full h-full z-0"
            variants={{
              initial: { scale: 1.3 },
              hover: { scale: 1.2 },
            }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={card.bgImage}
              alt="Background Image"
              fill
              className="object-contain opacity-10"
            />
          </motion.div>
          <motion.div
            className="bottom-0 right-0 w-[200px] h-[240px] flex justify-center items-center z-10"
            variants={{
              initial: { y: 0, scale: 1 },
              hover: { y: -20, scale: 1.1 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src={card.fgImage}
              alt="Foreground Image"
              width={300}
              height={300}
              className="rounded-lg"
            />
          </motion.div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4 mt-8 w-full px-4 sm:hidden">
      {/* Top Full Card */}
      <div className="w-full">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`relative overflow-hidden p-4 rounded-lg ${card.bgColor} flex flex-col items-center group min-h-[320px] border hover:bg-pink-50 transition duration-300`}
          >
            <div className="w-full z-20 flex flex-col items-start">
              <div className="relative w-full">
                <h2 className={`text-xl font-semibold mb-2 ${card.textColor}`}>
                  {card.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                <div className="flex flex-col gap-2 w-full">
                  <Link
                    href={card.linkUrl}
                    className={`px-4 py-2 text-white ${card.buttonColor} rounded-md text-center font-medium`}
                  >
                    {card.buttonText}
                  </Link>
                  <Link
                    href={card.howTextUrl}
                    className="inline-flex justify-center items-center text-gray-700 text-xs underline hover:text-pink-500"
                  >
                    {card.howText} →
                  </Link>
                </div>
              </div>
            </div>
            {renderImage(card)}
          </div>
        ))}
      </div>

      {/* Bottom Two Cards */}
      <div className="flex gap-4 w-full">
        {/* Card 2 */}
        <div
          onClick={() => router.push("/search")}
          className="w-1/2 h-[180px] relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
        >
          <Image
            src="/images/menu/cd-sec1.webp"
            alt="Explore Custom"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-0 w-full h-10 bg-[#Dd91a6] flex items-center justify-center text-white text-xs font-semibold">
            Explore Custom
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => router.push("/search")}
          className="w-1/2 h-[180px] relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
        >
          <Image
            src="/images/menu/cd-sec2.webp"
            alt="Explore Collections"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-0 w-full h-10 bg-[#Dd91a6] flex items-center justify-center text-white text-xs font-semibold">
            Explore Collections
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHeroSectionCustomDesign;
