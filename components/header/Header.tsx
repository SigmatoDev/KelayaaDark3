"use client";
import { AlignJustify, Heart, ShoppingCart, User, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Banner from "./Banner";
import { useSession } from "next-auth/react";
import { SearchBox } from "./SearchBox";
import Menu from "./Menu";
import HeroSection from "../hero-section/HeroSection";
import Carousel, { CarouselSkeleton } from "../carousel/carousel";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import CardGrid from "../category-box/CategoryBox";
import SignInPopup from "../signin/SignIn";

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
      { href: "/silver-rings", label: "Rings" },
      { href: "/silver-necklaces", label: "Necklaces" },
      { href: "/silver-earrings", label: "Earrings" },
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
  "sale-offers": {
    subitems: [
      { href: "/discounted-rings", label: "Discounted Rings" },
      { href: "/sale-necklaces", label: "Sale Necklaces" },
    ],
    images: ["/images/hovermenu/gold4.webp", "/images/hovermenu/gold1.webp"],
  },
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

  if (session?.user.isAdmin) {
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
          <div className="block bg-base-300 pb-3 text-center md:hidden">
            <SearchBox />
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
              ? "xl:bg-[#0000006d] xl:backdrop-blur-cm bg-black hover:bg-[#Fff]"
              : "bg-black"
        } transition-all duration-1000 ${!isScrolled ? "group" : ""}`}
      >
        <motion.div 
          className={`w-screen flex justify-around items-center py-2 ${pathname !== "/" ? "" : "overflow-hidden"}`}
          initial={false}
          animate={{
            height: pathname === "/" && isScrolled ? 0 : "auto",
            y: pathname === "/" && isScrolled ? -50 : 0,
            opacity: pathname === "/" && isScrolled ? 0 : 1,
          }}
          transition={{
            height: {
              duration: 0.3,
              ease: "easeInOut"
            },
            y: {
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.5
            },
            opacity: { duration: 0.3 }
          }}
        >
          <div>
            <p className={`text-[10px] text-[#fff] ${pathname === "/" && !isScrolled ? "group-hover:text-black" : ""} transition-colors duration-300`}>Stores</p>
          </div>
          <div>
            <p className={`text-[10px] text-white uppercase tracking-[1px] w-[300px] text-center font-medium transition-all duration-500 animate-fade ${pathname === "/" && !isScrolled ? "group-hover:text-black" : ""}`}>
              {currentPromo}
            </p>
          </div>
          <div className="flex flex-row items-center text-center">
            <Link
              href={""}
              onClick={() => setIsSignInOpen(true)}
              className="flex flex-row items-center text-center w-[70px]"
            >
              <User
                className={`w-4 h-4 text-white ${pathname === "/" && !isScrolled ? "group-hover:text-black" : ""} hover:text-pink-500 transition`}
              />
              <p
                className={`text-[10px] font-sm mt-1 text-[#ffffff] ${pathname === "/" && !isScrolled ? "group-hover:text-black" : ""}`}
              >
                SIGN IN
              </p>
            </Link>

            <Link
              href="/wishlist"
              className="flex flex-col items-center text-center"
            >
              <Heart
                className={`w-4 h-4 text-white ${pathname === "/" && !isScrolled ? "group-hover:text-black" : ""} hover:text-pink-500 transition`}
              />
            </Link>
          </div>
        </motion.div>
        <motion.div 
          className={`w-screen flex items-center justify-center overflow-hidden ${pathname !== "/" ? "hidden" : ""}`}
          initial={false}
          animate={{
            height: isScrolled ? 0 : "auto",
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        >
          <div className="flex items-center justify-center w-[200px] h-[60px] md:w-[350px] md:h-[120px] relative">
            <Link href="/" className="flex items-center justify-center w-screen h-full">
              <motion.div
                initial={false}
                animate={{
                  y: isScrolled ? -120 : 0,
                  opacity: isScrolled ? 0 : 1,
                }}
                transition={{
                  y: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    duration: 0.8,
                  },
                  opacity: { duration: 0.5 },
                }}
                className="flex items-center justify-center relative w-full h-full"
              >
                <motion.img
                  src="/Kelayaa - logo.webp"
                  alt="Kelayaa Logo"
                  className={`w-[75%] h-full object-contain transition-all duration-300 ${
                    !isScrolled ? "group-hover:opacity-0" : ""
                  }`}
                />
                <motion.img
                  src="/Kelayaa - logo.webp"
                  alt="Kelayaa Logo Black"
                  className={`w-[75%] h-full object-contain absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                    !isScrolled ? "opacity-0 group-hover:opacity-100" : "opacity-0"
                  }`}
                />
              </motion.div>
            </Link>
          </div>
        </motion.div>
        <header
          className={`text-gray-800 w-full xl:h-[80px] transition-[margin] xl:flex xl:justify-center items-center duration-1000 ease-in-out ${isScrolled ? " mt-0" : " mt-4"}`}
        >
          {/* Parent Div 1 - Search & Logo Section */}
          <div className="w-full px-4 sm:px-8 lg:px-12 ">
            <div className="flex relative items-center justify-center py-3 max-w-[1600px] mx-auto">
              {/* Logo */}

              <div
                className={`flex absolute left-0 justify-center w-[200px] h-[60px] md:w-[250px] md:h-[60px] overflow-hidden transition-all duration-1000 ease-out ${
                  pathname === "/" 
                    ? isScrolled ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    : "opacity-100 scale-100"
                }`}
              >
                <Link href="/">
                  <img
                    src="/Kelayaa - logo.webp"
                    alt="Kelayaa Logo"
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>

              <div className="w-[100px]">
                {/* navvvvvvvvvvvvv */}
                <nav
                  className={`text-white w-[100px] z-[999] ${!isScrolled ? "group-hover:text-black" : ""}`}
                >
                  <div className="flex items-center justify-center max-w-[1600px] mx-auto px-4">
                    {/* Mobile Menu */}
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="my-drawer"
                        className={`btn btn-square btn-ghost text-white ${!isScrolled ? "group-hover:text-black" : ""} md:hidden`}
                      >
                        <AlignJustify />
                      </label>
                    </div>

                   

                    {/* Navigation Links */}
                    <div className="relative z-50">
                      <div
                        className="hidden md:flex space-x-0 uppercase mx-auto px-1 py-3 relative rounded-[30px] items-center justify-center xl:py-[42px]"
                        onMouseLeave={() => setIsOpen(false)}
                      >
                        {Object.keys(menuData).map((key) => (
                          <Link
                            key={key}
                            href={`/${key}`}
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
                        <Link
                          href="/cart"
                          className="relative flex flex-col items-center text-center"
                        >
                          <ShoppingCart
                            className={`w-[50px] h-4 text-white ${pathname === "/" && !isScrolled ? "group-hover:text-black" : ""} hover:text-pink-500 transition`}
                          />
                          <span className="absolute -top-3 -right-0.5 bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            0
                          </span>
                        </Link>
                      </div>

                      {/* Dynamic Dropdown */}
                      {isOpen && activeMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="absolute  left-0 top-full w-full h-[250px] bg-white  rounded-b-2xl p-6 grid grid-cols-3 gap-6  z-50"
                          onMouseEnter={() => setIsOpen(true)}
                          onMouseLeave={() => setIsOpen(false)}
                        >
                          {/* Column 1: Subitems */}
                          <div className="flex flex-col space-y-2 ">
                            {menuData[activeMenu].subitems.map(
                              (subitem, idx) => (
                                <Link
                                  key={idx}
                                  href={"/search"}
                                  className="text-gray-500 uppercase hover:text-pink-500 text-sm font-[300]"
                                >
                                  {subitem.label}
                                </Link>
                              )
                            )}
                          </div>

                          {/* Column 2: Image 1 */}
                          <div className="relative w-full h-42">
                            <Image
                              src={menuData[activeMenu].images[0]}
                              alt="Promo 1"
                              layout="fill"
                              objectFit="cover"
                              className="rounded-lg shadow-sm"
                            />
                          </div>

                          {/* Column 3: Image 2 */}
                          <div className="relative w-full h-42">
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

              
              {/* <div className="flex xl:gap-7 gap-1 justify-center">
                <Link
                  href="/cart"
                  className="relative flex flex-col items-center text-center"
                >
                  <ShoppingCart
                    className={`w-[50px] h-4 text-white ${!isScrolled ? "group-hover:text-black" : ""} hover:text-pink-500 transition`}
                  />
                  <span className="absolute -top-3 -right-0.5 bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    0
                  </span>
                </Link>
              </div> */}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden px-2 py-2 mx-10 mb-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={`Search in Kelayaa... ${currentKeyword}`}
                className="w-full p-2 pl-12 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
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
            <HeroSection />
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
