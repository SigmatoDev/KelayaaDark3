"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import MailchimpForm from "@/components/newsletter/MailchimpForm";

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="w-full bg-[#FFF6F6] text-[#282828]">
      {/* Main Footer Content */}
      <div className="container mx-auto py-[60px] md:py-[100px]">
        <div className="flex flex-col md:flex-row md:flex-wrap md:gap-y-12 md:gap-x-6">
          {/* Column 1 - Newsletter */}
          <div className="w-full md:basis-[30%] md:shrink-0 mb-10 md:mb-0">
            <MailchimpForm />
          </div>

          {/* Column 2 - Categories */}
          <div className="w-full md:flex-1 mb-10 md:mb-0">
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {["Gold & Diamonds", "Silver", "Beads", "Custom Design"].map(
                (item) => {
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
                }
              )}
            </ul>
          </div>

          {/* Column 3 - Advantage */}
          <div className="w-full md:flex-1 mb-10 md:mb-0">
            <h3 className="font-semibold text-lg mb-4">Advantage</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Size Guide", url: "/ring-bangle-size-guide" },
                { name: "Refer a Friend", url: "/refer-friend" },
              ].map((item) => (
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

          {/* Column 4 - Quick Links */}
          <div className="w-full md:flex-1 mb-10 md:mb-0">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                "About Us",
                "Privacy Policy",
                "Terms and Conditions",
                "Return Policy",
                "FAQs",
              ].map((item) => (
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

          {/* Column 5 - Contact */}
          <div className="w-full md:basis-[28%] md:shrink-0">
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
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

      {/* Bottom Footer */}
      <div className="w-full p-6 bg-[#282828] text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-4">
            {/* <a href="#" aria-label="Facebook" className="hover:text-gray-300 transition">
              <FaFacebook className="text-xl" />
            </a> */}
            <a href="https://www.instagram.com/kelayaajewellery/" aria-label="Instagram" className="hover:text-gray-300 transition">
              <FaInstagram className="text-xl" />
            </a>
          </div>
          <p className="text-sm md:text-base">
            © {new Date().getFullYear()} Kelayaa
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
