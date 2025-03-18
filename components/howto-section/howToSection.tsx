import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HowToSection = () => {
  const guides = [
    {
      title: "How to Select Birthstones",
      description: "Discover how to choose birthstones by month and color — a beautiful guide inspired by nature.",
      image: "/images/howto/birthstone.webp",
      link: "/how-to-select-birth-stones",
    },
    {
      title: "Find Your Ring or Bangle Size",
      description: "A helpful guide to accurately measure your ring or bracelet size. Includes printable charts & video guide.",
      image: "/images/howto/ringsize.webp",
      link: "/ring-bangle-size-guide",
    },
    {
      title: "Lab-Grown vs Natural Diamonds",
      description: "Understand the difference between lab-grown and natural diamonds with CAD videos and expert tips.",
      image: "/images/howto/lab-nature-grown.webp",
      link: "/labvsnatural",
    },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800">How To Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <Link
              key={index}
              href={guide.link}
              className="group rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="h-52 w-full overflow-hidden">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-pink-500 transition-colors duration-300">
                  {guide.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{guide.description}</p>
                <span className="inline-flex items-center text-sm font-medium text-pink-500 group-hover:underline transition-all">
                  Learn More <ArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowToSection;
