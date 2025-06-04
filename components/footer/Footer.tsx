"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaInstagram } from "react-icons/fa";
import MailchimpForm from "@/components/newsletter/MailchimpForm";
import { HiChevronRight, HiChevronDown } from "react-icons/hi";

const Footer = () => {
  const router = useRouter();

  // State for which sections are open on mobile (by key)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Toggle open state for a section
  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Data for sections (except newsletter)
  const categories = ["Gold & Diamonds", "Silver", "Beads", "Custom Design"];
  const advantage = [
    { name: "Size Guide", url: "/ring-bangle-size-guide" },
    { name: "Refer a Friend", url: "/refer-friend" },
  ];
  const quickLinks = [
    "About Us",
    "Privacy Policy",
    "Terms and Conditions",
    "Return Policy",
    "FAQs",
  ];

  return (
    <footer className="w-full bg-[#FFF6F6] text-[#282828]">
      {/* Main Footer Content */}
      <div className="container mx-auto py-[40px] md:py-[100px]">
        <div className="flex flex-col md:flex-row md:flex-wrap md:gap-y-12 md:gap-x-6">
          {/* Column 1 - Newsletter */}
          <div className="w-full md:basis-[30%] md:shrink-0 mb-10 md:mb-0">
            <MailchimpForm />
          </div>

          {/* Accordion Columns for mobile, full display on desktop */}
          {/* Categories */}
          <div className="w-full md:flex-1 mb-4 md:mb-0">
            <button
              type="button"
              className="flex items-center justify-between w-full text-lg font-semibold mb-4 md:mb-6 md:cursor-default"
              onClick={() => toggleSection("categories")}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              Categories
              <span className="md:hidden">
                {openSections["categories"] ? (
                  <HiChevronDown className="w-6 h-6 text-pink-600" />
                ) : (
                  <HiChevronRight className="w-6 h-6 text-pink-600" />
                )}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out md:overflow-visible md:max-h-none ${
                openSections["categories"] ? "max-h-screen" : "max-h-0"
              }`}
            >
              <ul className="space-y-2 text-sm">
                {categories.map((item) => {
                  const getRoute = (label: string) => {
                    switch (label) {
                      case "Gold & Diamonds":
                        return "/search?materialType=gold";
                      case "Silver":
                        return "/search?materialType=silver";
                      case "Beads":
                        return "/search";
                      case "Custom Design":
                        return "/custom-design";
                      default:
                        return "/";
                    }
                  };
                  return (
                    <li
                      key={item}
                      onClick={() => router.push(getRoute(item))}
                      className="cursor-pointer hover:text-[#EC008C] transition"
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Advantage */}
          <div className="w-full md:flex-1 mb-4 md:mb-0">
            <button
              type="button"
              className="flex items-center justify-between w-full text-lg font-semibold mb-4 md:mb-6 md:cursor-default"
              onClick={() => toggleSection("advantage")}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              Advantage
              <span className="md:hidden">
                {openSections["advantage"] ? (
                  <HiChevronDown className="w-6 h-6 text-pink-600" />
                ) : (
                  <HiChevronRight className="w-6 h-6 text-pink-600" />
                )}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out md:overflow-visible md:max-h-none ${
                openSections["advantage"] ? "max-h-screen" : "max-h-0"
              }`}
            >
              <ul className="space-y-2 text-sm">
                {advantage.map((item) => (
                  <li
                    key={item.name}
                    onClick={() => router.push(item.url)}
                    className="cursor-pointer hover:text-[#EC008C] transition"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full md:flex-1 mb-4 md:mb-0">
            <button
              type="button"
              className="flex items-center justify-between w-full text-lg font-semibold mb-4 md:mb-6 md:cursor-default"
              onClick={() => toggleSection("quickLinks")}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              Quick Links
              <span className="md:hidden">
                {openSections["quickLinks"] ? (
                  <HiChevronDown className="w-6 h-6 text-pink-600" />
                ) : (
                  <HiChevronRight className="w-6 h-6 text-pink-600" />
                )}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out md:overflow-visible md:max-h-none ${
                openSections["quickLinks"] ? "max-h-screen" : "max-h-0"
              }`}
            >
              <ul className="space-y-2 text-sm">
                {quickLinks.map((item) => (
                  <li
                    key={item}
                    onClick={() =>
                      router.push(`/${item.toLowerCase().replace(/\s+/g, "-")}`)
                    }
                    className="cursor-pointer hover:text-[#EC008C] transition"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="w-full md:basis-[28%] md:shrink-0">
            <button
              type="button"
              className="flex items-center justify-between w-full text-lg font-semibold mb-4 md:mb-6 md:cursor-default"
              onClick={() => toggleSection("contact")}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              Contact
              <span className="md:hidden">
                {openSections["contact"] ? (
                  <HiChevronDown className="w-6 h-6 text-pink-600" />
                ) : (
                  <HiChevronRight className="w-6 h-6 text-pink-600" />
                )}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out md:overflow-visible md:max-h-none ${
                openSections["contact"] ? "max-h-screen" : "max-h-0"
              }`}
            >
              <ul className="space-y-2 text-sm">
                <li className="font-semibold">Write To Us</li>
                <li>
                  <a
                    href="mailto:info@kelayaa.com"
                    className="hover:text-[#EC008C] transition"
                  >
                    info@kelayaa.com
                  </a>
                </li>
                <hr />
                <li className="font-semibold">Reach Us</li>
                <li>
                  <a
                    href="tel:+919945000100"
                    className="hover:text-[#EC008C] transition"
                  >
                    +91 9945000100 <br />
                    +91 8431358078
                  </a>
                </li>
                <hr />
                <li className="font-semibold">Address</li>
                <li>
                  289-A, 3rd Floor, DISHAA, 12th Cross,
                  <br />
                  Ideal Home Township, Raja Rajeshwari Nagar,
                  <br />
                  Bangalore – 560 098. INDIA
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full p-6 bg-[#282828] text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/kelayaajewellery/"
              aria-label="Instagram"
              className="hover:text-gray-300 transition"
            >
              <FaInstagram className="text-xl" />
            </a>
          </div>
          <p className="text-sm md:text-base">© {new Date().getFullYear()} Kelayaa</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
