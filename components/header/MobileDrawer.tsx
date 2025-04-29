import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaGem,
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
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { ReceiptTextIcon } from "lucide-react";
import SignInPopup from "../signin/SignIn";

const MobileDrawer = ({ closeDrawer }: { closeDrawer: () => void }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const handleSignInClick = () => {
    closeDrawer(); // Close drawer first
    setTimeout(() => {
      setIsSignInOpen(true); // Then open sign-in popup
    }, 300); // Slight delay for smoother UX
  };

  // const userName = session?.user?.name;
  // const userPhone = session?.user?.mobileNumber;

  const navItems = [
    {
      label: "Silver",
      icon: <HiOutlineSparkles className="w-5 h-5" />,
      href: "/search?materialType=silver",
    },
    {
      label: "Gold & Diamonds",
      icon: <FaRing className="w-5 h-5" />,
      href: "/search?materialType=gold",
    },
    {
      label: "Beads",
      icon: <FaEllipsisH className="w-5 h-5" />,
      href: "/search?materialType=Beads",
    },
    {
      label: "Custom Design",
      icon: <FaWrench className="w-5 h-5" />,
      href: "/custom-design",
    },
    {
      label: "Collections",
      icon: <FaShapes className="w-5 h-5" />,
      href: "/search?productCategory=collections",
    },
    {
      label: "Size Guide",
      icon: <FaRuler className="w-5 h-5" />,
      href: "/ring-bangle-size-guide",
    },
  ];

  const contactItems = [
    {
      label: "Email",
      icon: <FaEnvelope className="w-5 h-5" />,
      info: "info@kelayaa.com",
    },
    {
      label: "Phone",
      icon: <FaPhoneAlt className="w-5 h-5" />,
      info: "+91 9945000100",
    },
    {
      label: "Phone",
      icon: <FaPhoneAlt className="w-5 h-5" />,
      info: "+91 8431358078",
    },
  ];

  const footerLinks = [
    {
      label: "About Us",
      href: "/about-us",
      icon: <FaInfoCircle className="w-5 h-5" />,
    },
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
      icon: <FaShieldAlt className="w-5 h-5" />,
    },
    {
      label: "Terms & Conditions",
      href: "/terms-and-conditions",
      icon: <ReceiptTextIcon className="w-5 h-5" />,
    },
    {
      label: "Refund Policy",
      href: "/return-policy",
      icon: <FaRedo className="w-5 h-5" />,
    },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-xl flex flex-col p-4 space-y-6 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeDrawer}
          className="absolute top-4 right-4 text-xl text-gray-600 hover:text-pink-600"
        >
          <FaTimes />
        </button>

        {/* Top Profile / Sign In Section */}
        {/* {!session?.user ? (
          <button
            onClick={handleSignInClick}
            className="flex items-center space-x-2 text-pink-600 font-medium text-sm hover:text-pink-700 transition"
          >
            <FaSignInAlt className="w-5 h-5" />
            <span>Sign In</span>
          </button>
        ) : (
          <div className="flex items-center space-x-3 mb-6">
            <FaUserCircle className="w-10 h-10 text-pink-600" />
            <div>
              <p className="text-lg font-semibold">{userName}</p>
              <p className="text-sm text-gray-500">{userPhone}</p>
            </div>
          </div>
        )} */}

        <div className="border-t border-gray-300 mb-4" />

        {/* Navigation Section */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Categories</p>
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = router?.asPath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeDrawer}
                  className={`flex items-center px-4 py-2 rounded-md space-x-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-pink-100 text-pink-600"
                      : "text-gray-700 hover:bg-gray-100"
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
