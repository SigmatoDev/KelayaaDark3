"use client";
import {
  AlignJustify,
  Heart,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  LogOut,
  History,
  User2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Banner from "./Banner";
import { signOut, useSession } from "next-auth/react";
import { SearchBox } from "./SearchBox";
import Menu from "./Menu";
import HeroSection from "../hero-section/HeroSection";
import Carousel, { CarouselSkeleton } from "../carousel/carousel";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import CardGrid from "../category-box/CategoryBox";
import SignInPopup from "../signin/SignIn";
import useCartService from "@/lib/hooks/useCartStore";
import HeroSectionCustomDesign from "../hero-section-customdesign/heroSectionCustomDesign";

const keywords = ["Gold", "Diamond", "Silver", "Platinum", "Special"];
const promotions = [
  "✨ Create Your Dream Jewellery",
  "💎 Get 10% Discount on Your First Order",
  "🚚 Free Shipping Across India",
];

// Define Menu Data Structure
interface MenuItem {
  subitems: { href: string; label: string }[];
  images: string[];
}

// Menu Data for Different Sections
const menuData: Record<string, MenuItem> = {
  silver: {
    subitems: [
      { href: "/silver-pendants", label: "Pendants" },
      { href: "/silver-rings", label: "Rings" },
      { href: "/silver-necklaces", label: "Necklaces" },
      { href: "/silver-earrings", label: "Earrings" },
      { href: "/silver-bangles", label: "Bangles" },
      { href: "/silver-bracelets", label: "Bracelets" },
      { href: "/silver-sets", label: "Sets" },
      { href: "/silver-toe-rings", label: "Toe Rings" },
      { href: "/silver-chains", label: "Chains" },
    ],
    images: [
      "/images/hovermenu/bangles1.webp",
      "/images/hovermenu/pendant.webp",
    ],
  },
  gold: {
    subitems: [
      { href: "/gold-rings", label: "Rings" },
      { href: "/gold-necklaces", label: "Necklaces" },
      { href: "/gold-earrings", label: "Earrings" },
      { href: "/gold-bracelets", label: "Bracelets" },
      { href: "/gold-bangles", label: "Bangles" },
    ],
    images: ["/images/hovermenu/gold1.webp", "/images/hovermenu/gold3.webp"],
  },
  diamonds: {
    subitems: [
      { href: "/diamond-rings", label: "Rings" },
      { href: "/diamond-necklaces", label: "Necklaces" },
      { href: "/diamond-earrings", label: "Earrings" },
    ],
    images: ["/images/hovermenu/pendant.webp", "/images/hovermenu/gold3.webp"],
  },
  "custom-jewellery": {
    subitems: [
      { href: "/custom-designs", label: "Custom Designs" },
      { href: "/custom-engagement", label: "Engagement Rings" },
    ],
    images: ["/images/hovermenu/gold1.webp", "/images/hovermenu/gold3.webp"],
  },
  // "sale-offers": {
  //   subitems: [
  //     { href: "/discounted-rings", label: "Discounted Rings" },
  //     { href: "/sale-necklaces", label: "Sale Necklaces" },
  //   ],
  //   images: ["/images/hovermenu/gold4.webp", "/images/hovermenu/gold1.webp"],
  // },
  collections: {
    subitems: [
      { href: "/wedding-collection", label: "Wedding Collection" },
      { href: "/festive-collection", label: "Festive Collection" },
    ],
    images: ["/images/hovermenu/gold3.webp", "/images/hovermenu/gold1.webp"],
  },
};
const Header = () => {
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const [currentKeyword, setCurrentKeyword] = useState(keywords[0]);
  const [currentPromo, setCurrentPromo] = useState(promotions[0]);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { totalCartQuantity } = useCartService();
  const [menuOpen, setMenuOpen] = useState(false);

  const signOutHandler = async () => {
    await signOut({ redirect: false }); // Prevent full page reload
    setMenuOpen(false); // Close menu on logout
  };

  const handleClick = () => setMenuOpen(false); // Close menu on link click

  useEffect(() => {
    let keywordIndex = 0;
    const keywordInterval = setInterval(() => {
      keywordIndex = (keywordIndex + 1) % keywords.length;
      setCurrentKeyword(keywords[keywordIndex]);
    }, 2000);

    return () => clearInterval(keywordInterval);
  }, []);

  useEffect(() => {
    let promoIndex = 0;
    const promoInterval = setInterval(() => {
      promoIndex = (promoIndex + 1) % promotions.length;
      setCurrentPromo(promotions[promoIndex]);
    }, 3000);

    return () => clearInterval(promoInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add event listener only on client side
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  if (session?.user?.isAdmin) {
    return (
      <header>
        <nav>
          <div className="navbar justify-between bg-base-300">
            <div>
              <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
                <AlignJustify />
              </label>
              <Link
                href="/"
                className="ml-2 text-base font-semibold sm:ml-4 sm:text-lg"
              >
                Kelayaa
              </Link>
            </div>
            <Menu />
          </div>
        </nav>
      </header>
    );
  }

  return (
    <>
      <div
        className={`${pathname === "/" ? "xl:fixed" : "block"} top-0 z-30 w-screen ${
          isScrolled
            ? "bg-[#000] backdrop-blur-sm"
            : pathname === "/"
              ? "xl:bg-[#0000006d] xl:backdrop-blur-md bg-black hover:bg-[#ffffffe1]"
              : "bg-black"
        } transition-all duration-1000 ${!isScrolled ? "group" : ""}`}
      >
        <header
          className={`text-gray-800 w-full xl:h-[80px] my-0 transition-[margin] xl:flex xl:justify-center items-center duration-1000 ease-in-out ${isScrolled ? " mt-1" : " my-1"}`}
        >
          {/* Parent Div 1 - Search & Logo Section */}
          <div className="w-full px-4 sm:px-8 lg:px-12">
            <div className="flex relative items-center justify-center max-w-[1600px] mx-auto">
              {/* Logo */}

              <nav
                className={`text-white w-full z-[999] ${!isScrolled ? "group-hover:text-black" : ""}`}
              >
                <div
                  className={`flex  absolute left-0 top-0 lg:top-3 z-[9999] justify-center items-center w-[150px] lg:w-[200px] h-[40px] lg:h-[60px] md:w-[250px] md:h-[60px] overflow-hidden transition-all duration-1000 ease-out opacity-100 scale-100 pointer-events-auto`}
                >
                  <Link href="/">
                    <img
                      src="/Kelayaa - logo.webp"
                      alt="Kelayaa Logo"
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </Link>
                </div>
                <div className="flex items-center justify-end max-w-[1600px] mx-auto px-4">
                  <div className="flex items-center">
                    <label
                      htmlFor="my-drawer"
                      className={`btn btn-square btn-ghost text-white ${!isScrolled ? "group-hover:text-black" : ""} md:hidden ml-auto`}
                    >
                      <AlignJustify />
                    </label>

                    <Link
                      href="/cart"
                      className="relative  md:hidden flex flex-col items-center text-center"
                    >
                      <ShoppingCart
                        className={`w-[50px] h-5 text-white ${pathname === "/" && !isScrolled ? "group-hover:text-black" : ""} hover:text-pink-500 transition`}
                      />
                      <span className="absolute -top-3 -right-0.5 bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {totalCartQuantity || 0}
                      </span>
                    </Link>
                  </div>

                  {/* Navigation Links */}
                  <div className="relative z-50">
                    <div
                      className="hidden md:flex space-x-4 uppercase px-1 py-2 relative items-center xl:py-[30px]"
                      onMouseLeave={() => setIsOpen(false)}
                    >
                      <div className="flex items-center space-x-8">
                        {Object.keys(menuData).map((key) => (
                          <Link
                            key={key}
                            href={`/search`}
                            className={`w-[140px] text-center text-white ${pathname === "/" && !isScrolled ? "group-hover:text-black" : ""} transition-all duration-300 ease-in-out hover:text-pink-300 text-xs`}
                            onMouseEnter={() => {
                              setActiveMenu(key);
                              setIsOpen(true);
                            }}
                          >
                            {key.replace("-", " ")}
                            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-pink-500 transition-all duration-300 ease-in-out hover:w-full shadow-[0_0_8px_#ec4899]"></span>
                          </Link>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4 ml-auto">
                        {/* User menu */}
                        <div className="relative">
                          {session && session.user ? (
                            <li className="list-none">
                              <div className="relative">
                                <button
                                  onClick={() => setMenuOpen(!menuOpen)}
                                  className="flex items-center px-3 py-2 text-white bg-transparent rounded-lg hover:bg-gray-800 transition"
                                >
                                  <User className="h-4 w-4 mr-1" />{" "}
                                  {session.user.name}
                                  <ChevronDown className="ml-2 w-4 h-4" />
                                </button>
                                {/* Dropdown menu */}
                                {menuOpen && (
                                  <ul className="absolute right-0 z-[9999] mt-2 w-52 rounded-lg bg-white/10 backdrop-blur-md p-2 shadow-lg border border-white/20">
                                    <li
                                      onClick={handleClick}
                                      className="flex items-center z-[9999] px-3 py-2 hover:bg-white/20 rounded-md"
                                    >
                                      <History className="w-4 h-4 text-white" />
                                      <Link
                                        href="/order-history"
                                        className="text-white ml-2"
                                      >
                                        Order History
                                      </Link>
                                    </li>
                                    <li
                                      onClick={handleClick}
                                      className="flex items-center px-3 py-2 hover:bg-white/20 rounded-md"
                                    >
                                      <User className="w-4 h-4 text-white" />
                                      <Link
                                        href="/profile"
                                        className="text-white ml-2"
                                      >
                                        Profile
                                      </Link>
                                    </li>
                                    <li
                                      onClick={handleClick}
                                      className="flex items-center px-3 py-2 hover:bg-white/20 rounded-md"
                                    >
                                      <History className="w-4 h-4 text-white" />
                                      <Link
                                        href="/custom-order-history"
                                        className="text-white ml-2"
                                      >
                                        Custom Orders
                                      </Link>
                                    </li>
                                    <li>
                                      <button
                                        type="button"
                                        onClick={signOutHandler}
                                        className="flex items-center w-full px-3 py-2 text-white bg-pink-700 hover:bg-pink-500 rounded-md"
                                      >
                                        <LogOut className="w-4 h-4 text-white" />
                                        <span className="ml-2">Sign Out</span>
                                      </button>
                                    </li>
                                  </ul>
                                )}
                              </div>
                            </li>
                          ) : (
                            <button
                              onClick={() => setIsSignInOpen(true)}
                              className="flex flex-row items-center text-center w-[70px]"
                            >
                              <User className="w-5 h-5 text-white hover:text-pink-500 transition group-hover:text-black" />
                              <p className="text-[12px] font-medium mt-1 text-white group-hover:text-black">
                                SIGN IN
                              </p>
                            </button>
                          )}
                        </div>

                        {/* Wishlist */}
                        <Link
                          href="/wishlist"
                          className="flex flex-col items-center text-center"
                        >
                          <Heart
                            className={`w-5 h-5 text-white ${pathname === "/" && !isScrolled ? "group-hover:text-black" : ""} hover:text-pink-500 transition`}
                          />
                        </Link>

                        <Link
                          href="/cart"
                          className="relative flex flex-col items-center text-center"
                        >
                          <ShoppingCart
                            className={`w-[50px] h-5 text-white ${pathname === "/" && !isScrolled ? "group-hover:text-black" : ""} hover:text-pink-500 transition`}
                          />
                          <span className="absolute -top-3 -right-0.5 bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {totalCartQuantity || 0}
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* Dynamic Dropdown */}
                    {isOpen && activeMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute left-0 top-full w-full h-[300px] bg-white shadow-2xl rounded-b-2xl p-6 grid grid-cols-3 gap-6 z-50"
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                      >
                        {/* Column 1: Subitems */}
                        <div className="flex flex-col space-y-2 pb-4">
                          {menuData[activeMenu].subitems.map((subitem, idx) => (
                            <Link
                              key={idx}
                              href={`/category/${subitem.label}`}
                              onClick={() => setIsOpen(false)}
                              className="text-gray-500 uppercase hover:text-pink-500 text-sm font-[400]"
                            >
                              {subitem.label}
                            </Link>
                          ))}
                        </div>

                        {/* Column 2: Image 1 */}
                        <div className="relative w-full h-full">
                          <Image
                            src={menuData[activeMenu].images[0]}
                            alt="Promo 1"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg shadow-sm"
                          />
                        </div>

                        {/* Column 3: Image 2 */}
                        <div className="relative w-full h-full">
                          <Image
                            src={menuData[activeMenu].images[1]}
                            alt="Promo 2"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg shadow-sm"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </header>
      </div>
      {/* Hide Carousel & HeroSection if not on homepage */}
      {pathname === "/" && (
        <>
          <div>
            <Suspense fallback={<CarouselSkeleton />}>
              <Carousel />
            </Suspense>
          </div>
          <div className="px-4">
            {/* <HeroSection /> */}
            <HeroSectionCustomDesign />
          </div>
          <CardGrid />
        </>
      )}

      {/* Render SignInPopup and control its visibility */}
      {isSignInOpen && (
        <SignInPopup isOpen={isSignInOpen} setIsOpen={setIsSignInOpen} />
      )}
    </>
  );
};

export default Header;
