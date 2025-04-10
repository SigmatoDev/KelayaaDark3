// app/collections/air/page.tsx

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const AirCollection = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-8 flex flex-col items-center justify-center text-center">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-gray-700"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        💨 Air Collection
      </motion.h1>
      <motion.p
        className="mt-4 text-lg md:text-xl text-gray-700 max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Light as a breeze. Whimsical designs that dance with the wind.
      </motion.p>

      <motion.div
        className="mt-8"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Image
          src="/images/menu/air.webp"
          alt="Air themed jewelry"
          width={300}
          height={300}
          loading="lazy"
          className="rounded-lg shadow-lg"
        />
      </motion.div>
    </main>
  );
};

export default AirCollection;
