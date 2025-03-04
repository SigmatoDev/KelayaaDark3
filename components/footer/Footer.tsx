"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const router = useRouter();
  return (
    <footer className="w-full bg-[#FFF6F6] text-black mt-2">
      {/* Main Footer Content */}
      <div className="container mx-auto py-[100px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Section - Logo & Email Subscription (Takes full width in mobile, 1 grid in large screens) */}
          <div className="md:col-span-1">
            {/* <h2 className="text-3xl font-semibold text-pink-500">Kelayaa</h2> */}
            <div className="flex justify-center  w-[200px] h-[80px] md:w-[250px] md:h-[90px] overflow-hidden">
              <Link href="/">
                <img
                  src="/kelayaa-3.png"
                  alt="Kelayaa Logo"
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
            <div className="mt-4 border border-black p-3 w-full max-w-xs">
              <input
                type="email"
                placeholder="ENTER YOUR E-MAIL"
                className="w-full outline-none bg-transparent"
              />
            </div>
            <p className="text-sm mt-3">
              Join our community and get exclusive updates, special offers, and
              the latest insights delivered straight to your inbox! Be the first
              to know about:
            </p>
          </div>

          {/* Right Section - Quick Links & Contact Us (Takes 2 grid columns) */}
          <div className="md:col-span-1 flex justify-between">
            {/* Website */}
            <div>
              <h3 className="font-semibold text-lg mb-3 uppercase">Website</h3>
              <ul className="space-y-2 text-sm">
                <li onClick={() => router.push("/")} className="cursor-pointer">
                  Version1
                </li>
                <li
                  onClick={() => router.push("/homepage-2")}
                  className="cursor-pointer"
                >
                  Version2
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-3">QUICK LINKS</h3>
              <ul className="space-y-2 text-sm">
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
              <h3 className="font-semibold text-lg mb-3">CONTACT US</h3>
              <ul className="space-y-2 text-sm">
                <li>Write To Us</li>
                <li>Call us @ 1800-1800-900</li>
                <li>Email us: support@kelayaa.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer with Social Media & Copyright */}
      <footer
        className="w-full p-4 text-white"
        style={{
          background:
            "linear-gradient(90.25deg, #EC008C 36.97%, #FC6767 101.72%)",
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
