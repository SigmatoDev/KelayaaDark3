"use client";

import { motion } from "framer-motion";
import { RocketIcon } from "lucide-react";

export default function UnderDevelopment() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-xl w-full text-center"
      >
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <RocketIcon className="w-12 h-12 text-pink-500" />
          </motion.div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          We're Launching Something Amazing!
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          This page is currently under development. Stay tuned for updates,
          exciting features, and a magical experience coming your way 💖
        </p>

        <div className="mt-6">
          <button
            className="bg-pink-500 hover:bg-pink-600 transition-all text-white font-semibold py-2 px-6 rounded-full shadow-md"
            onClick={() => (window.location.href = "/")} // or use `router.push("/")` if inside a page
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
