// app/collections/earth/page.tsx

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const EarthCollection = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8 flex flex-col items-center justify-center text-center">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-green-700"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🌍 Earth Collection
      </motion.h1>
      <motion.p
        className="mt-4 text-lg md:text-xl text-green-800 max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Inspired by nature. Organic textures and raw elegance in every piece.
      </motion.p>

      <motion.div
        className="mt-8"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Image
          src="/images/menu/earth.webp"
          alt="Earth themed jewelry"
          width={300}
          height={300}
          loading="lazy"
          className="rounded-lg shadow-lg"
        />
      </motion.div>
    </main>
  );
};

export default EarthCollection;
