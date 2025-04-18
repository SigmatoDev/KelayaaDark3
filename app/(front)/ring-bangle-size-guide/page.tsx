"use client";
import Image from "next/image";
export default function SizeGuide() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 py-16 space-y-16 text-[#333]">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">
          Find Your Perfect <span className="text-pink-600">Fit</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Kelayaa helps you find your ideal ring and bangle size with ease. Discover your perfect match today.
        </p>
      </section>
      {/* Ring Size Guide */}
      <section className="text-center">
        <h2 className="text-4xl font-bold mb-10">Ring Size Guide</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Your fingers deserve precision and comfort. Use our guide to discover the best fit for every occasion.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 border">Diameter (mm)</th>
                <th className="p-4 border">US Size</th>
                <th className="p-4 border">Indian Size</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border"><td className="p-4 border">14.8</td><td className="p-4 border">4</td><td className="p-4 border">7</td></tr>
              <tr className="border"><td className="p-4 border">15.2</td><td className="p-4 border">4.5</td><td className="p-4 border">8</td></tr>
              <tr className="border"><td className="p-4 border">15.6</td><td className="p-4 border">5</td><td className="p-4 border">9</td></tr>
              <tr className="border"><td className="p-4 border">16.0</td><td className="p-4 border">5.5</td><td className="p-4 border">10</td></tr>
              <tr className="border"><td className="p-4 border">16.5</td><td className="p-4 border">6</td><td className="p-4 border">11</td></tr>
              <tr className="border"><td className="p-4 border">16.9</td><td className="p-4 border">6.5</td><td className="p-4 border">12</td></tr>
              <tr className="border"><td className="p-4 border">17.3</td><td className="p-4 border">7</td><td className="p-4 border">13</td></tr>
              <tr className="border"><td className="p-4 border">17.7</td><td className="p-4 border">7.5</td><td className="p-4 border">14</td></tr>
              <tr className="border"><td className="p-4 border">18.2</td><td className="p-4 border">8</td><td className="p-4 border">15</td></tr>
              <tr className="border"><td className="p-4 border">18.6</td><td className="p-4 border">8.5</td><td className="p-4 border">16</td></tr>
              <tr className="border"><td className="p-4 border">19.0</td><td className="p-4 border">9</td><td className="p-4 border">17</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      {/* Ring Size Tips */}
      <section className="bg-pink-50 p-8 md:p-12 rounded-3xl shadow-xl">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Quick Tips</h3>
        <ul className="max-w-3xl mx-auto list-disc list-inside text-gray-700 space-y-3">
          <li>Measure your finger at the end of the day when it is largest.</li>
          <li>Avoid measuring when your fingers are cold.</li>
          <li>If between sizes, always size up for comfort.</li>
          <li>Ensure the ring fits snugly but slides over the knuckle easily.</li>
        </ul>
      </section>
      {/* Bangle Size Guide */}
      <section className="text-center">
        <h2 className="text-4xl font-bold mb-10">Bangle Size Guide</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Bangles should slide comfortably over your hand and fit gracefully on your wrist. Find your best match below.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 border">Diameter (mm)</th>
                <th className="p-4 border">Bangle Size (Indian)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border"><td className="p-4 border">57.2</td><td className="p-4 border">2-2</td></tr>
              <tr className="border"><td className="p-4 border">58.7</td><td className="p-4 border">2-4</td></tr>
              <tr className="border"><td className="p-4 border">60.3</td><td className="p-4 border">2-6</td></tr>
              <tr className="border"><td className="p-4 border">61.9</td><td className="p-4 border">2-8</td></tr>
              <tr className="border"><td className="p-4 border">63.5</td><td className="p-4 border">2-10</td></tr>
              <tr className="border"><td className="p-4 border">65.1</td><td className="p-4 border">2-12</td></tr>
              <tr className="border"><td className="p-4 border">66.7</td><td className="p-4 border">2-14</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      {/* Bangle Size Tips */}
      <section className="bg-pink-50 p-8 md:p-12 rounded-3xl shadow-xl">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Pro Tips for Bangles</h3>
        <ul className="max-w-3xl mx-auto list-disc list-inside text-gray-700 space-y-3">
          <li>Use a flexible measuring tape around your knuckles at the widest part.</li>
          <li>Compare with a bangle you already own and love.</li>
          <li>Ensure there is enough movement for comfort without slipping off easily.</li>
        </ul>
      </section>
    </div>
  );
}