"use client";

import React from "react";

const HowToSelectBirthstones = () => {
  return (
    <div className="bg-white py-16 px-4 md:px-20">
      <h1 className="text-3xl md:text-5xl font-semibold text-center mb-6 text-gray-800 leading-tight">
        How to Select <span className="text-pink-600">Birthstones</span>
      </h1>
      <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12 text-base md:text-lg">
        Discover how to choose birthstones by month and color — a beautiful guide inspired by nature.
      </p>

      <div className="space-y-12">
        <section className="bg-[#f9f9f9] p-6 md:p-10 rounded-xl shadow-sm">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-300">Understanding Birthstones</h2>
          <p className="text-gray-600 leading-relaxed text-[16px]">
            Birthstones are gemstones associated with each month of the year. Each carries unique symbolism and energy.
            Whether chosen for their traditional meaning, healing properties, or aesthetic appeal, birthstones make thoughtful and personal jewelry gifts.
          </p>
        </section>

        <section className="bg-[#fff7fb] p-6 md:p-10 rounded-xl shadow-sm border border-pink-100">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700 border-b pb-2 border-pink-200">Birthstones by Month</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-600 list-disc pl-6">
            <li><strong>January:</strong> Garnet – Protection & Strength</li>
            <li><strong>February:</strong> Amethyst – Wisdom & Tranquility</li>
            <li><strong>March:</strong> Aquamarine – Calmness & Courage</li>
            <li><strong>April:</strong> Diamond – Love & Purity</li>
            <li><strong>May:</strong> Emerald – Growth & Prosperity</li>
            <li><strong>June:</strong> Pearl / Moonstone – Serenity & Elegance</li>
            <li><strong>July:</strong> Ruby – Passion & Vitality</li>
            <li><strong>August:</strong> Peridot – Renewal & Positivity</li>
            <li><strong>September:</strong> Sapphire – Loyalty & Wisdom</li>
            <li><strong>October:</strong> Opal / Tourmaline – Creativity & Joy</li>
            <li><strong>November:</strong> Topaz / Citrine – Abundance & Energy</li>
            <li><strong>December:</strong> Turquoise / Tanzanite – Healing & Peace</li>
          </ul>
        </section>

        <section className="bg-[#f0f4f8] p-6 md:p-10 rounded-xl shadow-sm">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-300">Choosing by Color</h2>
          <p className="text-gray-600 leading-relaxed text-[16px]">
            If you resonate more with colors than months, choosing birthstones by color can reflect your personality and style. Shades of blue (sapphire, aquamarine), pink (rose quartz, tourmaline), green (emerald, peridot), and white (pearl, moonstone) are all symbolic in their own way.
          </p>
        </section>

        <section className="bg-[#fff9f3] p-6 md:p-10 rounded-xl shadow-sm border border-orange-100">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700 border-b pb-2 border-orange-200">Tips to Choose the Right Birthstone</h2>
          <ul className="list-decimal pl-6 text-gray-600 space-y-2">
            <li>Choose by personality traits or emotional symbolism.</li>
            <li>Select stones with colors that complement your wardrobe.</li>
            <li>Consider the wearer’s birth month for a traditional touch.</li>
            <li>Go for healing or energy-based preferences.</li>
            <li>Try custom jewelry to blend your birthstone with your favorite design.</li>
          </ul>
        </section>

        <section className="bg-[#f6faff] p-6 md:p-10 rounded-xl shadow-sm">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-300">Explore Customized Birthstone Jewelry</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            At Kelayaa, we offer personalized jewelry to celebrate your individuality. From birthstone rings to bracelets and pendants — bring your vision to life with our craftsmanship.
          </p>
          <a
            href="/custom-design"
            className="inline-flex items-center text-sm md:text-base text-pink-600 font-medium underline hover:text-pink-800 transition duration-300"
          >
            Start Your Custom Design →
          </a>
        </section>
      </div>
    </div>
  );
};

export default HowToSelectBirthstones;
