"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";

export default function LabVsNaturalDiamonds() {
  return (
    <div className="bg-white text-[#333] py-16 px-4 md:px-20">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Lab-Grown vs <span className="text-pink-600">Natural Diamonds</span>
        </h1>
        <p className="text-gray-600 text-base md:text-lg mb-10 leading-relaxed">
          Discover the key differences between lab-grown and natural diamonds.  
          Our detailed guide includes CAD video examples, expert buying tips, and sustainability insights.
        </p>
      </div>

      {/* Comparison Section */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
        {/* Lab-Grown Diamonds */}
        <div className="bg-gray-50 rounded-2xl shadow-md p-6 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-[#111] mb-3">Lab-Grown Diamonds</h2>
          <ul className="list-disc text-gray-600 text-sm pl-5 space-y-2">
            <li>Scientifically created using HPHT or CVD process</li>
            <li>100% real carbon structure, identical to natural diamonds</li>
            <li>Eco-friendly and cost-effective</li>
            <li>No mining impact</li>
            <li>Certified by IGI, GIA</li>
          </ul>
        </div>

        {/* Natural Diamonds */}
        <div className="bg-gray-50 rounded-2xl shadow-md p-6 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-[#111] mb-3">Natural Diamonds</h2>
          <ul className="list-disc text-gray-600 text-sm pl-5 space-y-2">
            <li>Formed over billions of years under Earth's surface</li>
            <li>Each stone is naturally unique</li>
            <li>Often higher in resale value</li>
            <li>Traditional appeal & legacy choice</li>
            <li>Also certified by GIA, SGL, IGI</li>
          </ul>
        </div>
      </div>

      {/* Video Section */}
      <div className="text-center mb-16">
        <h3 className="text-2xl font-semibold mb-4">Watch CAD Videos</h3>
        <p className="text-gray-600 mb-6 text-sm md:text-base max-w-2xl mx-auto">
          Explore the brilliance of both diamonds through CAD design videos to understand light performance, cut precision, and shape differences.
        </p>
        <div className="flex justify-center">
          <div className="bg-black w-[300px] h-[180px] md:w-[500px] md:h-[280px] rounded-xl flex items-center justify-center text-white hover:opacity-90 cursor-pointer">
            <PlayCircle className="w-10 h-10 text-white" />
            <span className="ml-3 text-sm">Watch Now</span>
          </div>
        </div>
      </div>

      {/* Expert Tips */}
      <div className="bg-pink-50 max-w-5xl mx-auto p-6 rounded-2xl shadow-sm">
        <h3 className="text-xl font-semibold text-[#111] mb-3">Expert Buying Tips</h3>
        <ul className="list-disc text-gray-700 text-sm pl-5 space-y-2">
          <li>Check certifications (IGI/GIA/SGL)</li>
          <li>Compare brilliance side-by-side before purchase</li>
          <li>Ask your jeweller about source transparency</li>
          <li>Lab diamonds offer better size-for-price ratio</li>
          <li>Natural diamonds may hold better emotional/symbolic value</li>
        </ul>
      </div>

      {/* Sustainability Section */}
      <div className="mt-16 text-center text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed">
        <p>
          Lab-grown diamonds are a step toward ethical luxury.  
          If you're a conscious buyer, lab diamonds offer guilt-free brilliance without compromising beauty.
        </p>
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-12">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition underline underline-offset-2"
        >
          Talk to Our Diamond Experts →
        </Link>
      </div>
    </div>
  );
}
