"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  FaRing,
  FaWrench,
  FaShapes,
  FaRuler,
  FaPhoneAlt,
  FaEnvelope,
  FaEllipsisH,
  FaUserCircle,
  FaInfoCircle,
  FaShieldAlt,
  FaRedo,
  FaTimes,
  FaSignInAlt,
  FaShoppingCart,
  FaBoxOpen,
  FaSignOutAlt,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { Heart, HeartIcon, ReceiptTextIcon } from "lucide-react";
import SignInPopup from "../signin/SignIn";

const MobileDrawer = ({ closeDrawer }: { closeDrawer: () => void }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  // Use index-based active nav
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleSignInClick = () => {
    closeDrawer();
    setTimeout(() => {
      setIsSignInOpen(true);
    }, 300);
  };

  const handleLogoutClick = async () => {
    await signOut({ redirect: false });
    router.push("/");
    closeDrawer();
  };

  const userName = session?.user?.name ?? "";
  const userPhone = session?.user?.mobileNumber ?? "";
  const userInitial = userName ? userName[0].toUpperCase() : "";

  const navItems = [
    {
      label: "Silver",
      icon: <HiOutlineSparkles className="w-5 h-5 text-pink-500" />,
      href: "/search?materialType=silver",
    },
    {
      label: "Gold & Diamonds",
      icon: <FaRing className="w-5 h-5 text-pink-500" />,
      href: "/search?materialType=gold",
    },
    {
      label: "Beads",
      icon: <FaEllipsisH className="w-5 h-5 text-pink-500" />,
      href: "/search?materialType=Beads",
    },
    {
      label: "Custom Design",
      icon: <FaWrench className="w-5 h-5 text-pink-500" />,
      href: "/custom-design",
    },
    {
      label: "Collections",
      icon: <FaShapes className="w-5 h-5 text-pink-500" />,
      href: "/search?productCategory=collections",
    },
    {
      label: "Size Guide",
      icon: <FaRuler className="w-5 h-5 text-pink-500" />,
      href: "/ring-bangle-size-guide",
    },
  ];

  const contactItems = [
    {
      label: "Email",
      icon: <FaEnvelope className="w-5 h-5 text-pink-500" />,
      info: "info@kelayaa.com",
    },
    {
      label: "Phone",
      icon: <FaPhoneAlt className="w-5 h-5 text-pink-500" />,
      info: "+91 9945000100",
    },
    {
      label: "Phone",
      icon: <FaPhoneAlt className="w-5 h-5 text-pink-500" />,
      info: "+91 8431358078",
    },
  ];

  const footerLinks = [
    {
      label: "About Us",
      href: "/about-us",
      icon: <FaInfoCircle className="w-5 h-5 text-pink-500" />,
    },
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
      icon: <FaShieldAlt className="w-5 h-5 text-pink-500" />,
    },
    {
      label: "Terms & Conditions",
      href: "/terms-and-conditions",
      icon: <ReceiptTextIcon className="w-5 h-5 text-pink-500" />,
    },
    {
      label: "Refund Policy",
      href: "/return-policy",
      icon: <FaRedo className="w-5 h-5 text-pink-500" />,
    },
  ];

  const userLinks = [
    {
      label: "My Orders",
      href: "/my-orders",
      icon: <FaBoxOpen className="w-5 h-5 text-pink-500" />,
    },
    {
      label: "My Cart",
      href: "/cart",
      icon: <FaShoppingCart className="w-5 h-5 text-pink-500" />,
    },
    {
      label: "My Wishlist",
      href: "/wishlist",
      icon: <HeartIcon className="w-5 h-5 text-pink-500" />,
    },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-xl flex flex-col p-4 space-y-6 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeDrawer}
          className="absolute top-4 right-4 text-xl text-gray-600 hover:text-pink-600"
          aria-label="Close menu"
        >
          <FaTimes />
        </button>

        {/* User Profile or Sign In */}
        {!session?.user ? (
          <button
            onClick={handleSignInClick}
            className="flex items-center space-x-2 text-pink-600 font-semibold text-base hover:text-pink-700 transition"
          >
            <FaSignInAlt className="w-6 h-6" />
            <span>Sign In</span>
          </button>
        ) : (
          <div className="flex items-center space-x-4 mb-6 justify-between">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 text-pink-600 font-bold text-xl select-none">
                {userInitial || <FaUserCircle className="w-8 h-8" />}
              </div>
              <div className="ml-2">
                <p className="text-lg font-semibold text-gray-800">
                  {userName}
                </p>
                <p className="text-sm text-gray-500">{userPhone}</p>
              </div>
            </div>
            <button
              onClick={handleLogoutClick}
              className="flex items-center space-x-2 text-pink-600 font-semibold text-base hover:text-pink-700 transition"
            >
              <FaSignOutAlt className="w-5 h-5" />
              {/* <span>Logout</span> */}
            </button>
          </div>
        )}

        {/* User quick links if logged in */}
        {session?.user && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Your Account
            </p>
            <div className="flex flex-col space-y-2">
              {userLinks.map((link, idx) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    closeDrawer();
                    setActiveIndex(idx + navItems.length); // offset so indices don't overlap with navItems
                  }}
                  className={`flex items-center px-4 py-2 rounded-md space-x-3 text-sm font-medium transition-colors ${
                    activeIndex === idx + navItems.length
                      ? "bg-pink-200 text-pink-700 rounded-lg border border-pink-300"
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-300 mb-4" />

        {/* Navigation Section */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Categories</p>
          <div className="flex flex-col space-y-2">
            {navItems.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    closeDrawer();
                    setActiveIndex(idx);
                  }}
                  className={`flex items-center px-4 py-2 rounded-md space-x-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-pink-200 text-pink-700 rounded-lg border border-pink-300"
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-300 my-6" />

        {/* Contact Info */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Contact Info</p>
          <div className="flex flex-col space-y-2 text-gray-700">
            {contactItems.map((item) => (
              <div key={item.info} className="flex items-center space-x-2">
                {item.icon}
                <span>{item.info}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-300 my-6" />

        {/* Footer Links */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Quick Links</p>
          <div className="flex flex-col text-sm text-gray-500 space-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeDrawer}
                className="flex items-center space-x-3 hover:text-pink-600"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      {isSignInOpen && (
        <SignInPopup isOpen={isSignInOpen} setIsOpen={setIsSignInOpen} />
      )}
    </>
  );
};

export default MobileDrawer;
