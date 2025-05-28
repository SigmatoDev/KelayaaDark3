"use client";

import { useState } from "react";
import Image from "next/image";

export default function SizeGuide() {
  const [activeTab, setActiveTab] = useState("ring");

  return (
    <div className="bg-gray-100">
      {/* Top Banner Section with Tabs */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src="/images/banner/ringsizeguide.webp"
          alt="Ring Size Guide Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-start justify-center pl-8 md:pl-16">
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Find Your <span className="text-black">Perfect Ring & Bangle Size</span>
          </h1>
          
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 space-y-16 text-[#333] bg-white">

      <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("ring")}
              className={`px-4 py-2 rounded-full font-semibold ${
                activeTab === "ring" ? "bg-black text-white border" : "bg-white text-black border"
              }`}
            >
              Ring Size Guide
            </button>
            <button
              onClick={() => setActiveTab("bangle")}
              className={`px-4 py-2 rounded-full font-semibold ${
                activeTab === "bangle" ? "bg-black text-white border" : "bg-white text-black border"
              }`}
            >
              Bangle Size Guide
            </button>
          </div>

        {/* Introduction Text */}
       

        {/* Procedures Section */}
        {activeTab === "ring" && (
          <>
           <h2 className="text-4xl font-bold mb-10 text-center">Ring Size Chart</h2>

           <p className="text-center text-lg text-gray-700 max-w-4xl mx-auto">
            Use a soft measuring tape or a piece of thread to measure around your finger. When it forms a complete circle, mark it, and match the length to the chart below. For the most comfortable fit, if you fall between two sizes, always size up.
          </p>
            {/* Procedure 1 */}
            <section className="space-y-12">
              <div className="bg-white p-8 rounded-3xl shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-center">Procedure 1: Measure with Paper/Thread</h2>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <Image src="/images/howto/step1.webp" alt="Procedure 1 Step 1" width={600} height={400} className="rounded-xl" />
                    <p className="text-center mt-4">Step 1: Cut a thin strip of paper or thread. Wrap it around the base of your finger and mark where it overlaps.</p>
                  </div>
                  <div className="flex-1">
                    <Image src="/images/howto/step2.webp" alt="Procedure 1 Step 2" width={600} height={400} className="rounded-xl" />
                    <p className="text-center mt-4">Step 2: Measure the marked length with a ruler and compare it with the chart below to find your size.</p>
                  </div>
                </div>
                {/* Chart */}
                <div className="mt-12 overflow-x-auto">
                  <h3 className="text-2xl font-bold text-center mb-6">Ring Size Chart (Using Circumference)</h3>
                  <div className="mx-auto w-full md:w-[60%]">
                    <table className="min-w-full text-sm text-left border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-4 border">Ring Size (Indian)</th>
                          <th className="p-4 border">Circumference (Inches)</th>
                          <th className="p-4 border">Circumference (MM)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [1, "1.61", "40.8"], [2, "1.66", "42.1"], [3, "1.69", "43.0"], [4, "1.73", "44.0"], [5, "1.77", "44.9"],
                          [6, "1.81", "45.9"], [7, "1.86", "47.1"], [8, "1.89", "48.1"], [9, "1.93", "49.0"], [10, "1.97", "50.0"],
                          [11, "2.00", "50.9"], [12, "2.04", "51.8"], [13, "2.08", "52.8"], [14, "2.13", "54.0"], [15, "2.16", "55.0"],
                          [16, "2.20", "55.9"], [17, "2.24", "56.9"], [18, "2.28", "57.8"], [19, "2.33", "59.1"], [20, "2.36", "60.0"],
                          [21, "2.40", "60.9"], [22, "2.44", "61.9"], [23, "2.47", "62.8"], [24, "2.51", "63.8"], [25, "2.55", "64.7"],
                          [26, "2.60", "66.0"], [27, "2.63", "66.9"], [28, "2.67", "67.9"], [29, "2.72", "69.1"], [30, "2.76", "70.1"],
                        ].map(([size, inch, mm], i) => (
                          <tr className="border" key={i}>
                            <td className="p-4 border">{size}</td>
                            <td className="p-4 border">{inch}</td>
                            <td className="p-4 border">{mm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Procedure 2 */}
            <section className="space-y-12 mt-20">
              <div className="bg-white p-8 rounded-3xl shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-center">Procedure 2: Measure Using an Existing Ring</h2>
                <div className="flex flex-col items-center">
                  <div className="w-full md:w-[60%]">
                    <Image src="/images/howto/step2a.webp" alt="Procedure 2 Step 1" width={600} height={400} className="rounded-xl" />
                  </div>
                  <p className="text-center mt-4">Step 1: Select a ring that fits the desired finger. Place it on a ruler and measure the inner diameter accurately.</p>
                  <p className="text-center mt-2">Step 2: Refer to the chart below to find your ring size based on the diameter measurement.</p>
                </div>
                {/* Chart */}
                <div className="mt-12 overflow-x-auto">
                  <h3 className="text-2xl font-bold text-center mb-6">Ring Size Chart (Using Diameter)</h3>
                  <div className="mx-auto w-full md:w-[60%]">
                    <table className="min-w-full text-sm text-left border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-4 border">Ring Size (Indian)</th>
                          <th className="p-4 border">Diameter (Inches)</th>
                          <th className="p-4 border">Diameter (MM)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [1, "0.51", "13.0"], [2, "0.53", "13.4"], [3, "0.54", "13.7"], [4, "0.55", "14.0"], [5, "0.56", "14.3"],
                          [6, "0.57", "14.6"], [7, "0.59", "15.0"], [8, "0.60", "15.3"], [9, "0.61", "15.6"], [10, "0.63", "15.9"],
                          [11, "0.64", "16.2"], [12, "0.65", "16.5"], [13, "0.66", "16.8"], [14, "0.68", "17.2"], [15, "0.69", "17.5"],
                          [16, "0.70", "17.8"], [17, "0.71", "18.1"], [18, "0.72", "18.4"], [19, "0.74", "18.8"], [20, "0.75", "19.1"],
                          [21, "0.76", "19.4"], [22, "0.78", "19.7"], [23, "0.79", "20.0"], [24, "0.80", "20.3"], [25, "0.81", "20.6"],
                          [26, "0.83", "21.0"], [27, "0.84", "21.3"], [28, "0.85", "21.6"], [29, "0.87", "22.0"], [30, "0.88", "22.3"],
                        ].map(([size, inch, mm], i) => (
                          <tr className="border" key={i}>
                            <td className="p-4 border">{size}</td>
                            <td className="p-4 border">{inch}</td>
                            <td className="p-4 border">{mm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Bangle Size Chart Section */}
        {activeTab === "bangle" && (
          <section className="text-center">
          <h2 className="text-4xl font-bold mb-10">Bangle Size Chart</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-8">
            Bring your thumb and little finger together and measure around the widest part of your hand. Use a flexible tape or thread. Mark and measure to find your ideal bangle size.
          </p>
        
          <div className="flex flex-col items-center mb-10">
            <div className="w-full md:w-[80%]">
              <Image src="/images/howto/banglestep.webp" alt="Procedure 1 Step" width={1200} height={500} className="rounded-xl" />
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-6 text-left md:text-center">
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold mb-2">Step 1:</h3>
                <p>
                  Cut a thin strip of paper or thread. Bring your thumb and little finger together and measure where your hand is the widest. Mark the spot where the thread meets.
                </p>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold mb-2">Step 2:</h3>
                <p>
                  Measure the length of the thread with your ruler. Use the following chart to determine your bangle size.
                </p>
              </div>
            </div>
          </div>
        
          {/* Procedure #1 Table */}
          <div className="overflow-x-auto mt-4">
            <div className="mx-auto w-full md:w-[60%]">
              <table className="min-w-full text-sm text-left border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 border">Bangle Size (Indian)</th>
                    <th className="p-4 border">Circumference (Inches)</th>
                    <th className="p-4 border">Circumference (MM)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["2-2", "6.67", "169.4"],
                    ["2-4", "7.06", "179.6"],
                    ["2-6", "7.46", "189.5"],
                    ["2-8", "7.85", "199.4"],
                    ["2-10", "8.24", "209.3"],
                    ["2-12", "8.64", "219.5"],
                    ["2-14", "9.03", "229.4"],
                    ["3", "9.42", "239.3"],
                  ].map(([size, inch, mm], i) => (
                    <tr className="border" key={i}>
                      <td className="p-4 border">{size}</td>
                      <td className="p-4 border">{inch}</td>
                      <td className="p-4 border">{mm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        
          {/* Procedure #2 */}
          <div className="mt-16 text-left max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Procedure #2</h3>
            <div className="w-full md:w-[80%]">
              <Image src="/images/howto/bangle2.webp" alt="Procedure 1 Step" width={1200} height={500} className="rounded-xl" />
            </div>
            <p className="mb-4">
              <strong>Step 1:</strong> Take a bangle you already own. Make sure that you are choosing the correct hand. Place it on a ruler and measure its inner diameter. Use the following chart to determine your bangle size.
            </p>
        
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm text-left border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 border">Bangle Size (Indian)</th>
                    <th className="p-4 border">Size (Inches)</th>
                    <th className="p-4 border">Size (MM)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["2-2", "2.125", "54.0"],
                    ["2-4", "2.25", "57.2"],
                    ["2-6", "2.375", "60.3"],
                    ["2-8", "2.5", "63.5"],
                    ["2-10", "2.625", "66.7"],
                    ["2-12", "2.75", "69.9"],
                    ["2-14", "2.875", "73.0"],
                    ["3", "3.0", "76.3"],
                  ].map(([size, inch, mm], i) => (
                    <tr className="border" key={i}>
                      <td className="p-4 border">{size}</td>
                      <td className="p-4 border">{inch}</td>
                      <td className="p-4 border">{mm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        )}
      </div>
    </div>
  );
}
