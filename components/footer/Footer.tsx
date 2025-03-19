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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Section - Logo & Email Subscription (Takes full width in mobile, 1 grid in large screens) */}
          <div className="md:col-span-1 flex flex-col items-center xl:items-start">
            {/* <h2 className="text-3xl font-semibold text-pink-500">Kelayaa</h2> */}
            <div className="flex justify-center  w-[200px] h-[80px] md:w-[250px] md:h-[90px] overflow-hidden my-4 md:my-0">
              <Link href="/">
                <img
                  src="/Kelayaa - logo.webp"
                  alt="Kelayaa Logo"
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
            <div className="mt-4 border rounded-sm border-[#3d3d3d] p-3 w-full max-w-xs">
              <input
                type="email"
                placeholder="Enter Your Mail"
                className="w-full outline-none bg-transparent font-normal"
              />
            </div>
            <p className="text-sm mt-3 font-normal">
              Join our community and get exclusive updates, special offers, and
              the latest insights delivered straight to your inbox! Be the first
              to know about:
            </p>
          </div>

          {/* Right Section - Quick Links & Contact Us (Takes 2 grid columns) */}
          <div className="md:col-span-1 flex justify-between gap-2 text-left">
            {/* Website */}
            <div>
              <h3 className="font-semibold xl:text-lg text-[14px] mb-3 uppercase">Categories</h3>
              <ul className="space-y-1 xl:text-sm text-[12px]">
                <li
                  onClick={() => router.push("/gold")}
                  className="cursor-pointer"
                >
                Gold & Diamonds
                </li>
                <li
                  onClick={() => router.push("/silver")}
                  className="cursor-pointer"
                >
                 Silver
                </li>
                <li
                  onClick={() => router.push("/gemstone")}
                  className="cursor-pointer"
                >
                  Gem Stone
                </li>
                <li
                  onClick={() => router.push("/custom-design")}
                  className="cursor-pointer"
                >
                 Custom Design
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold xl:text-lg text-[14px] mb-3">QUICK LINKS</h3>
              <ul className="space-y-1 xl:text-sm text-[12px]">
                <li
                  onClick={() => router.push("/about-us")}
                  className="cursor-pointer"
                >
                  About Us
                </li>
                <li
                  onClick={() => router.push("/privacy-policy")}
                  className="cursor-pointer"
                >
                  Privacy & Policy
                </li>
                <li
                  onClick={() => router.push("/terms-&-conditions")}
                  className="cursor-pointer"
                >
                  Terms & Conditions
                </li>
                <li className="cursor-pointer">Cookie Policy</li>
                <li
                  onClick={() => router.push("/custom-designs")}
                  className="cursor-pointer"
                >
                  Custom Designs
                </li>
                <li
                  onClick={() => router.push("/faqs")}
                  className="cursor-pointer"
                >
                  FAQ's
                </li>
                <li
                  onClick={() => router.push("/return-and-cancellation")}
                  className="cursor-pointer"
                >
                  Returns and Cancellation
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="font-semibold xl:text-lg text-[14px] mb-3 ">CONTACT US</h3>
              <ul className="space-y-1 xl:text-sm text-[12px]">
                <li>Write To Us</li>
                <li>Call us: <br  className="block sm:hidden"/><a href="tel:1800-1800-900" className="text-black hover:text-[#EC008C]">1800-1800-900</a></li>
                <li>Email us: <br  className="block sm:hidden"/><a href="mailto:support@kelayaa.com" className="text-black hover:text-[#EC008C] ">support@kelayaa.com</a> </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer with Social Media & Copyright */}
      <footer
        className="w-full p-4 text-grey-800"
        style={{
          background:
            "bg-grey-800",
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Left - Social Media Icons */}
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook">
              <FaFacebook className="text-xl hover:text-gray-200 transition" />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram className="text-xl hover:text-gray-200 transition" />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter className="text-xl hover:text-gray-200 transition" />
            </a>
          </div>

          {/* Right - Copyright Text */}
          <p className="text-sm md:text-base">@Copyright - Kelayaa</p>
        </div>
      </footer>
    </footer>
  );
};

export default Footer;
