// "use client";

// import Image from "next/image";

// export default function AboutUs() {
//   return (
//     <div className="max-w-6xl mx-auto px-4 md:px-10 py-16 space-y-16 text-[#333]">
//       {/* Introduction */}
//       <section className="text-center">
//         <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">
//           The Story of <span className="text-pink-600">Kelayaa</span>
//         </h1>
//         <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//           Kelayaa is where artistry meets craftsmanship. Born from a deep love
//           for jewelry and design, we craft pieces that aren’t just accessories—
//           they’re personal statements. Every gem, every setting, every detail is
//           an expression of individuality, reflecting tradition, modernity, and
//           an unwavering dedication to quality.
//         </p>
//       </section>

//       {/* Founder Section */}
//       <section className="text-center">
//         <h2 className="text-4xl font-bold mb-10">Meet Our Founder</h2>
//         <div className="flex flex-col items-center justify-center max-w-xl mx-auto bg-white shadow-lg rounded-3xl p-8">
//           <div className="w-38 h-38 rounded-lg overflow-hidden border-4 border-pink-500 mb-4 shadow-md">
//             <Image
//               src="/images/founders/arushi.webp"
//               alt="Arushi Amla"
//               width={400}
//               height={400}
//               className="object-cover w-full h-full"
//             />
//           </div>
//           <h3 className="text-2xl font-semibold text-gray-900 mb-1">
//             Arushi Amla
//           </h3>
//           <p className="text-pink-600 font-medium mb-4">Creative Force & Founder</p>
//           <p className="text-gray-700 text-base leading-relaxed">
//             A jewelry artist at heart, Arushi brings designs to life, creating timeless pieces that reflect individuality, elegance, and grace. Her vision is to blend contemporary creativity with traditional craftsmanship that celebrates the soul of every wearer.
//           </p>
//         </div>
//       </section>

//       {/* Vision & Mission */}
//       <section className="bg-pink-50 p-8 md:p-12 rounded-3xl shadow-xl">
//         <div className="grid md:grid-cols-2 gap-10 text-center">
//           <div>
//             <h2 className="text-3xl font-semibold text-gray-800 mb-4">
//               Our Vision
//             </h2>
//             <p className="text-gray-700 text-base leading-relaxed">
//               To redefine jewelry as more than just adornment—each piece should
//               be a legacy, a story, and a connection to the soul.
//             </p>
//           </div>
//           <div>
//             <h2 className="text-3xl font-semibold text-gray-800 mb-4">
//               Our Mission
//             </h2>
//             <p className="text-gray-700 text-base leading-relaxed">
//               We bring bold ideas to life through craftsmanship and innovation.
//               Every design is made with care, precision, and the belief that
//               jewelry should be as unique as the person wearing it.
//             </p>
//           </div>
//         </div>
//       </section>

      
//     </div>
//   );
// }



import axios from "axios";

export default async function AboutUsPage() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/page-content?slug=about-us`);
  const page = res.data;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
}
