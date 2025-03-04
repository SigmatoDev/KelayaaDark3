"use client";

import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      {/* Company Introduction */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">The Story of Kelayaa</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Kelayaa is where artistry meets craftsmanship. Born from a deep love
          for jewelry and design, we craft pieces that aren’t just
          accessories—they’re personal statements. Every gem, every setting,
          every detail is an expression of individuality, reflecting tradition,
          modernity, and an unwavering dedication to quality.
        </p>
      </section>

      {/* Vision & Mission */}
      <section className="bg-gray-100 p-8 rounded-lg shadow-lg">
        <div className="grid md:grid-cols-2 gap-8 text-center">
          <div>
            <h2 className="text-3xl font-semibold mb-3">Our Vision</h2>
            <p className="text-gray-700">
              To redefine jewelry as more than just adornment—each piece should
              be a legacy, a story, and a connection to the soul.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold mb-3">Our Mission</h2>
            <p className="text-gray-700">
              We bring bold ideas to life through craftsmanship and innovation.
              Every design is made with care, precision, and the belief that
              jewelry should be as unique as the person wearing it.
            </p>
          </div>
        </div>
      </section>

      {/* Core Team */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-6">
          Meet the Founders
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Aryan Amla",
              role: "Visionary Entrepreneur",
              desc: "Fueled by passion and creativity, Aryan shapes the future of Kelayaa with bold ideas and strategic leadership.",
            },
            {
              name: "Himanish Amla",
              role: "Strategic Innovator",
              desc: "A thinker and a doer, Himanish drives innovation, ensuring that Kelayaa stands at the forefront of the jewelry industry.",
            },
            {
              name: "Bharath Amla",
              role: "Tech Trailblazer",
              desc: "With three decades of experience, Bharath brings deep industry knowledge, blending technology with fine craftsmanship.",
            },
            {
              name: "Aarushi Amla",
              role: "Creative Force",
              desc: "A jewelry artist at heart, Aarushi brings designs to life, creating timeless pieces that reflect individuality and grace.",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white shadow-lg rounded-lg"
            >
              <div className="w-24 h-24 bg-gray-300 mx-auto mb-4 rounded-full"></div>
              <h3 className="text-2xl font-semibold">{member.name}</h3>
              <p className="text-gray-500 font-medium">{member.role}</p>
              <p className="text-gray-700 mt-2">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
