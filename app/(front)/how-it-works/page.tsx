"use client";

import { useRouter } from 'next/navigation';

import React from "react";

export default function HowItWorks() {

  const router = useRouter();

  return (
    <div className="bg-white py-16 px-4 md:px-20">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Create Your Dream Jewellery
        </h1>
        <p className="text-lg text-gray-600">
          Featuring Rings, Bangles, Bracelets, Chains, Anklets & Antique Pieces —
          designed with your story, your style, and your sparkle.
        </p>
        <button onClick={() => router.push("/custom-design")}  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition">
          START MY IDEA <span className="text-xl">→</span>
        </button>
      </div>

      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-gray-800">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition duration-300">
            <div className="text-5xl text-gray-600 mb-4">①</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Share Your Idea</h3>
            <p className="text-gray-600 text-sm">
              Tell us what you have in mind — whether it's a rough sketch, a Pinterest board, or just a dream. Our designers will understand your vision and bring it to life.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition duration-300">
            <div className="text-5xl text-gray-600 mb-4">②</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Design & Visualization</h3>
            <p className="text-gray-600 text-sm">
              We’ll share design drafts and 3D renderings for you to visualize your piece. Revisions are welcome until it’s just right.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition duration-300">
            <div className="text-5xl text-gray-600 mb-4">③</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Crafting & Delivery</h3>
            <p className="text-gray-600 text-sm">
              Our master artisans will handcraft your jewellery using premium materials. We’ll carefully package and deliver it right to your doorstep.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm italic">
            Your imagination, our craftsmanship — together, we create timeless pieces that tell your story.
          </p>
        </div>
      </div>
    </div>
  );
};


