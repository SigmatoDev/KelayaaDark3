"use client";
import Image from "next/image";

export default function SizeGuide() {
  return (
    <>
      {/* Top Banner Section */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src="/images/banner/ringsizeguide.webp"
          alt="Ring Size Guide Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="w-[50%] absolute inset-0 bg-black/30 flex items-center pl-8 md:pl-16">
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-tight">
            Find Your <span className="text-black">Perfect Ring & Bangle Size</span>
          </h1>
          {/* <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kelayaa helps you find your ideal ring and bangle size with ease. Discover your perfect match today.
          </p> */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-8 space-y-16 text-[#333]">
        {/* Hero Section */}
        <section className="text-center">
         
         
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
                {/* Table Rows */}
                {[
                  ["14.8", "4", "7"],
                  ["15.2", "4.5", "8"],
                  ["15.6", "5", "9"],
                  ["16.0", "5.5", "10"],
                  ["16.5", "6", "11"],
                  ["16.9", "6.5", "12"],
                  ["17.3", "7", "13"],
                  ["17.7", "7.5", "14"],
                  ["18.2", "8", "15"],
                  ["18.6", "8.5", "16"],
                  ["19.0", "9", "17"],
                ].map(([dia, us, ind], i) => (
                  <tr className="border" key={i}>
                    <td className="p-4 border">{dia}</td>
                    <td className="p-4 border">{us}</td>
                    <td className="p-4 border">{ind}</td>
                  </tr>
                ))}
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
                {/* Table Rows */}
                {[
                  ["57.2", "2-2"],
                  ["58.7", "2-4"],
                  ["60.3", "2-6"],
                  ["61.9", "2-8"],
                  ["63.5", "2-10"],
                  ["65.1", "2-12"],
                  ["66.7", "2-14"],
                ].map(([dia, size], i) => (
                  <tr className="border" key={i}>
                    <td className="p-4 border">{dia}</td>
                    <td className="p-4 border">{size}</td>
                  </tr>
                ))}
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
    </>
  );
}
