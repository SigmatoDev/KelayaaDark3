"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const router = useRouter();
  return (
    <footer className="w-full bg-[#FFF6F6] text-[#282828]">
      {/* Main Footer Content */}
      <div className="container mx-auto py-[60px] md:py-[100px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(250px,1fr)_repeat(4,1fr)]">
          {/* Column 1 - Logo & Email (Smaller Width) */}
          <div className="flex flex-col items-center md:items-start md:max-w-[300px]">
            <div className="flex justify-center w-[200px] h-[80px] md:w-[250px] md:h-[90px] overflow-hidden">
              <Link href="/">
                <img
                  src="/Kelayaa - logo.webp"
                  alt="Kelayaa Logo"
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
            <div className="mt-6 border rounded-sm border-[#3d3d3d] p-3 w-full">
              <input
                type="email"
                placeholder="Enter Your Mail"
                className="w-full outline-none bg-transparent font-normal"
              />
            </div>
            <p className="text-sm mt-4 text-center md:text-left">
              Join our community for exclusive updates and offers
            </p>
          </div>

          {/* Column 2 - Categories */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {["Gold & Diamonds", "Silver", "Gem Stone", "Custom Design"].map(
                (item) => {
                  const getRoute = (label: string) => {
                    switch (label) {
                      case "Gold & Diamonds":
                        return "/search?materialType=gold";
                      case "Silver":
                        return "/search?materialType=silver";
                      case "Gem Stone":
                        return "/search?materialType=gem-stone";
                      case "Custom Design":
                        return "/custom-design"; // corrected spelling
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
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Advantage</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Gold Saving scheme",
                "Gold Exchange",
                "Gold rates",
                "Refer a friend",
              ].map((item) => (
                <li
                  key={item}
                  onClick={() => router.push("/")}
                  className="cursor-pointer hover:text-[#EC008C] transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                "About Us",
                "Privacy Policy",
                "Terms",
                "Return Policy",
                "FAQs",
              ].map((item) => (
                <li
                  key={item}
                  onClick={() =>
                    router.push(`/${item.toLowerCase().replace(" ", "-")}`)
                  }
                  className="cursor-pointer hover:text-[#EC008C] transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5 - Contact */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Write To Us</li>
              <li>
                <a
                  href="tel:1800-1800-900"
                  className="hover:text-[#EC008C] transition"
                >
                  +91 9945000100 <br />
                  +91 8431358078
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@kelayaa.com"
                  className="hover:text-[#EC008C] transition"
                >
                  info@kelayaa.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full p-6 bg-[#282828] text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-4">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-gray-300 transition"
            >
              <FaFacebook className="text-xl" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-gray-300 transition"
            >
              <FaInstagram className="text-xl" />
            </a>
            ¸
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
