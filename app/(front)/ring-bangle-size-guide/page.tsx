"use client";

import { Download } from "lucide-react";
import Link from "next/link";

export default function RingBangleSizeGuide() {
  return (
    <div className="bg-white text-[#333] py-16 px-4 md:px-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Find Your <span className="text-pink-600">Ring</span> or <span className="text-pink-600">Bangle Size</span>
        </h1>
        <p className="text-gray-600 text-base md:text-lg mb-10 leading-relaxed">
          A helpful and beautifully crafted guide to accurately measure your ring or bangle size at home.  
          Includes printable Indian size charts and a step-by-step measuring method to ensure the perfect fit.
        </p>
      </div>

      {/* Section Cards */}
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Ring Size Guide */}
        <div className="bg-gray-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-[#111] mb-3">Ring Size Guide</h2>
          <p className="text-gray-600 text-sm mb-5">
            Download our printable Indian Ring Size Chart with sizes in both Indian and US standards.  
            Includes inner diameter and circumference in millimeters.
          </p>
          <ul className="text-sm text-gray-500 list-disc pl-5 mb-5">
            <li>Measure using a string or existing ring</li>
            <li>Match with diameter on chart</li>
            <li>Printable circles included</li>
          </ul>
          <Link
            href="/pdfs/Indian_Ring_Size_Chart.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition"
          >
            <Download className="w-5 h-5" /> Download Ring Size Chart
          </Link>
        </div>

        {/* Bangle Size Guide */}
        <div className="bg-gray-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-[#111] mb-3">Bangle Size Guide</h2>
          <p className="text-gray-600 text-sm mb-5">
            Our Bangle Size Chart follows Indian sizing with detailed mm dimensions.  
            Includes a wrist measurement guide and printable size circle for your convenience.
          </p>
          <ul className="text-sm text-gray-500 list-disc pl-5 mb-5">
            <li>Measure using a scale or wrist string</li>
            <li>Match with bangle diameter</li>
            <li>Includes full Indian bangle size range</li>
          </ul>
          <Link
            href="/pdfs/Indian_Bangle_Size_Chart.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition"
          >
            <Download className="w-5 h-5" /> Download Bangle Size Chart
          </Link>
        </div>
      </div>

      {/* Bottom Tip */}
      <div className="mt-16 text-center text-gray-500 text-sm">
        Need help? <span className="text-pink-600 underline hover:text-pink-700 cursor-pointer">Chat with our support team</span> to find your perfect fit.
      </div>
    </div>
  );
}
