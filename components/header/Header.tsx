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
// interface MenuItem {
//   subitems: { href: string; label: string }[];
//   images: string[];
// }

interface Subcategory {
  href: string;
  label: string;
}

interface MenuItem {
  subitems: {
    href: string;
    label: string;
    subcategories?: Subcategory[];
    description?: string;
  }[];
  images: string[];
  steps?: string[]; // For custom jewelry steps
}

// Menu Data for Different Sections
const menuData: Record<string, MenuItem> = {
  silver: {
    subitems: [
      { 
        href: "/silver-pendants", 
        label: "Pendants",
        subcategories: [
          { href: "/silver-pendants/all", label: "All Pendants" },
          { href: "/silver-pendants/minimalist", label: "Minimalist" },
          { href: "/silver-pendants/statement", label: "Statement" },
          { href: "/silver-pendants/silver", label: "Silver" }
        ]
      },
      { 
        href: "/silver-rings", 
        label: "Rings",
        subcategories: [
          { href: "/silver-rings/all", label: "All Rings" },
          { href: "/silver-rings/cocktail", label: "Cocktail" },
          { href: "/silver-rings/minimalist", label: "Minimalist" },
          { href: "/silver-rings/silver", label: "Silver" }
        ]
      },
      { 
        href: "/silver-earrings", 
        label: "Earrings",
        subcategories: [
          { href: "/silver-earrings/all", label: "All Earrings" },
          { href: "/silver-earrings/hoops", label: "Hoops" },
          { href: "/silver-earrings/studs", label: "Studs" },
          { href: "/silver-earrings/chandeliers", label: "Chandeliers" },
          { href: "/silver-earrings/dangles", label: "Dangles" }
        ]
      },
      { 
        href: "/silver-bangles", 
        label: "Bangles",
        subcategories: [
          { href: "/silver-bangles/all", label: "All Bangles" },
          { href: "/silver-bangles/adjustable", label: "Adjustable" },
          { href: "/silver-bangles/kada", label: "Kada" },
          { href: "/silver-bangles/traditional", label: "Silver Traditional" }
        ]
      },
      { 
        href: "/silver-bracelets", 
        label: "Bracelets",
        subcategories: [
          { href: "/silver-bracelets/all", label: "All Bracelets" },
          { href: "/silver-bracelets/tennis", label: "Tennis" },
          { href: "/silver-bracelets/minimalist", label: "Minimalist" },
          { href: "/silver-bracelets/semi-precious", label: "Semi-Precious stones" }
        ]
      },
      { 
        href: "/silver-sets", 
        label: "Sets",
        subcategories: [
          { href: "/silver-sets/all", label: "All Sets" },
          { href: "/silver-sets/earrings-pendant", label: "Earrings and Pendant" },
          { href: "/silver-sets/earrings-ring", label: "Earrings and Ring" },
          { href: "/silver-sets/earrings-ring-pendant", label: "Earrings, Ring and Pendant" },
          { href: "/silver-sets/necklace-earrings", label: "Necklace and Earrings" },
          { href: "/silver-sets/necklace-bracelet-earrings", label: "Necklace, Bracelet and Earrings" }
        ]
      },
      { 
        href: "/silver-toe-rings", 
        label: "Toe Rings",
        subcategories: [
          { href: "/silver-toe-rings/all", label: "All Toe Rings" },
          { href: "/silver-toe-rings/semi-precious", label: "Semi Precious Stones" },
          { href: "/silver-toe-rings/silver", label: "Silver" }
        ]
      },
      { 
        href: "/silver-shop-by-price", 
        label: "Shop by price",
        subcategories: [
          { href: "/silver-price/below-500", label: "Below ₹500" },
          { href: "/silver-price/500-1000", label: "₹500 - ₹1000" },
          { href: "/silver-price/1000-2000", label: "₹1000 - ₹2000" },
          { href: "/silver-price/2000-3000", label: "₹2000 - ₹3000" },
          { href: "/silver-price/3000-4000", label: "₹3000 - ₹4000" },
          { href: "/silver-price/4000-plus", label: "₹4000+" }
        ]
      }
    ],
    images: [
      "/images/menu/silverdrp1.webp",
      "/images/menu/silverdrp2.webp",
    
    ]
  },
  
    golddiamonds: {
      subitems: [
        { 
          href: "/gold-sets", 
          label: "Sets",
          subcategories: [
            { href: "/gold-sets/all", label: "All sets" },
            { href: "/gold-sets/princess", label: "Princess" },
            { href: "/gold-sets/chokers", label: "Chokers" },
            { href: "/gold-sets/necklace-earrings", label: "Necklace and Earrings" },
            { href: "/gold-sets/pendant-earrings", label: "Pendant and Earrings" }
          ]
        },
        { 
          href: "/gold-pendants", 
          label: "Pendants",
          subcategories: [
            { href: "/gold-pendants/all", label: "All Pendants" },
            { href: "/gold-pendants/minimalist", label: "Minimalist" },
            { href: "/gold-pendants/statement", label: "Statement" },
            { href: "/gold-pendants/solitaire", label: "Solitaire" }
          ]
        },
        { 
          href: "/gold-rings", 
          label: "Rings",
          subcategories: [
            { href: "/gold-rings/all", label: "All Rings" },
            { href: "/gold-rings/dailywear", label: "Dailywear" },
            { href: "/gold-rings/cocktail", label: "Cocktail" },
            { href: "/gold-rings/engagement", label: "Engagement" }
          ]
        },
        { 
          href: "/gold-earrings", 
          label: "Earrings",
          subcategories: [
            { href: "/gold-earrings/all", label: "All Earrings" },
            { href: "/gold-earrings/studs", label: "Studs" },
            { href: "/gold-earrings/hoops", label: "Hoops" },
            { href: "/gold-earrings/solitaire", label: "Solitaire" }
          ]
        },
        { 
          href: "/gold-bangles", 
          label: "Bangles",
          subcategories: [
            { href: "/gold-bangles/all", label: "All Bangles" }
          ]
        },
        { 
          href: "/gold-bracelets", 
          label: "Bracelets",
          subcategories: [
            { href: "/gold-bracelets/all", label: "All Bracelets" }
          ]
        },
        { 
          href: "/gold-nosepins", 
          label: "Nose Pins",
          subcategories: [
            { href: "/gold-nosepins/all", label: "All Nose Pins" }
          ]
        },
        { 
          href: "/gold-shop-by-price", 
          label: "Shop By Price",
          subcategories: [
            { href: "/gold-price/5000-25000", label: "₹5000 - ₹25000" },
            { href: "/gold-price/25000-50000", label: "₹25000 - ₹50000" },
            { href: "/gold-price/50000-1L", label: "₹50000 - ₹1L" },
            { href: "/gold-price/1L-2.5L", label: "₹1L - ₹2.5L" },
            { href: "/gold-price/2.5L-5L", label: "₹2.5L - ₹5L" },
            { href: "/gold-price/5L-7.5L", label: "₹5L - ₹7.5L" },
            { href: "/gold-price/7.5L-10L", label: "₹7.5L - ₹10L" },
            { href: "/gold-price/10L-plus", label: "₹10L+" }
          ]
        }
      ],
      images: [
        "/images/menu/golddpr1.webp",
        "/images/menu/golddpr2.webp"
      ]
    },
    "custom-jewellery": {
      subitems: [
        { 
          href: "/custom-jewellery/how-it-works", 
          label: "How it works",
          description: "The step-by-step process to create your dream piece"
        },
        { 
          href: "/custom-design", 
          label: "Start my idea",
          description: "Begin your custom jewelry journey"
        }
      ],
      steps: [
        "Share your idea with our designers",
        "Book a consultation appointment",
        "Design visualization & approval",
        "Crafting & delivery of your piece"
      ],
      images: [
        "/images/menu/cust1.webp",
        "/images/menu/cust2.webp",
        
      ]
    },
    collections: {
      subitems: [
        { 
          href: "/collections/air", 
          label: "Air",
          description: "Ethereal and lightweight designs"
        },
        { 
          href: "/collections/water", 
          label: "Water",
          description: "Fluid and flowing patterns"
        },
        { 
          href: "/collections/earth", 
          label: "Earth",
          description: "Organic and natural inspirations"
        },
        { 
          href: "/collections/fire", 
          label: "Fire",
          description: "Bold and passionate creations"
        }
      ],
      images: [
        "/images/menu/air.webp",
        "/images/menu/water.webp",
        "/images/menu/earth.webp",
        "/images/menu/fire.webp"
      ]
    }
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
              ? "xl:bg-[#0000006d] xl:backdrop-blur-md bg-black"
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
                      className="hidden md:flex justify-center items-center space-x-4 uppercase px-1 py-2 relative items-center xl:py-[30px]"
                      onMouseLeave={() => setIsOpen(false)}
                    >
                      <div className="flex items-center space-x-8">
                        {Object.keys(menuData).map((key) => (
                          <Link
                            key={key}
                            href={`/search`}
                            className={`w-[140px] text-center text-white ${pathname === "/" && !isScrolled ? "group-hover:text-white" : ""} transition-all duration-300 ease-in-out hover:text-pink-300 text-xs`}
                            onMouseEnter={() => {
                              setActiveMenu(key);
                              setIsOpen(true);
                            }}
                          >
                            {/* {key.replace("-", " ")} */}
                            {key === "golddiamonds" ? "Gold & Diamonds" : key.replace("-", " ")}
                            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-pink-500 transition-all duration-300 ease-in-out hover:w-full shadow-[0_0_8px_#ec4899]"></span>
                          </Link>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4 pl-5 ml-auto">
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
                                  <ul className="absolute right-0 z-[9999] mt-2 w-52 rounded-lg bg-white/10 backdrop-blur-md p-4 shadow-lg border border-white/20">
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
                              <User className="w-5 h-5 text-white hover:text-pink-500 transition group-hover:text-white" />
                              <p className="text-[12px] font-medium mt-1 text-white group-hover:text-white">
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
                            className={`w-5 h-5 text-white ${pathname === "/" && !isScrolled ? "group-hover:text-white" : ""} hover:text-pink-500 transition`}
                          />
                        </Link>

                        <Link
                          href="/cart"
                          className="relative flex flex-col items-center text-center"
                        >
                          <ShoppingCart
                            className={`w-[50px] h-5 text-white ${pathname === "/" && !isScrolled ? "group-hover:text-white" : ""} hover:text-pink-500 transition`}
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
    className="fixed left-0 top-full w-screen h-[450px] bg-white shadow-2xl rounded-b-2xl p-8 grid grid-cols-5 gap-6 z-50"
    onMouseEnter={() => setIsOpen(true)}
    onMouseLeave={() => setIsOpen(false)}
  >
    {/* Standard Category Layout (for Silver, Gold, etc.) */}
    {activeMenu !== "custom-jewellery" && activeMenu !== "collections" && (
      <>
        {/* Columns 1-4 */}
        {[0, 2, 4, 6].map((startIdx, colIdx) => (
          <div key={colIdx} className="flex flex-col justify-between h-full">
            {menuData[activeMenu].subitems.slice(startIdx, startIdx + 2).map((item, idx) => (
              <div key={idx} className="mb-6 last:mb-0">
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-800 uppercase hover:text-pink-500 text-md font-[500] block mb-2"
                >
                  {item.label}
                </Link>
                {item.subcategories && (
                  <div className="pl-2 mt-1 space-y-2">
                    {item.subcategories.map((sub, subIdx) => (
                      <Link
                        key={subIdx}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-pink-400 text-sm font-[400] block"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        
        {/* Column 5: Images */}
        <div className="grid grid-rows-2 gap-4 h-full">
          {menuData[activeMenu].images.slice(0, 2).map((img, idx) => (
            <div key={idx} className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={img}
                alt={`${activeMenu} jewelry`}
                layout="fill"
                objectFit="contain"
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </>
    )}

    {/* Custom Jewellery Special Layout */}
    {activeMenu === "custom-jewellery" && (
  <div className="col-span-5 grid grid-cols-3 gap-6 h-full">
    {/* Column 1: Content (takes 1 column) */}
    <div className="flex flex-col">
      {/* Main Options */}
      <div className="mb-8">
        {menuData[activeMenu].subitems.map((item, idx) => (
          <div key={idx} className="mb-6 last:mb-0">
            <Link
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-gray-800 uppercase hover:text-pink-500 text-sm font-[500] block mb-1"
            >
              {item.label}
            </Link>
            <p className="text-gray-500 text-xs">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Process Steps */}
      <div>
        <h4 className="text-gray-800 uppercase text-xs font-[600] mb-3">4-Step Process:</h4>
        <ul className="space-y-3">
          {menuData[activeMenu].steps?.map((step, idx) => (
            <li key={idx} className="text-gray-600 text-sm flex items-start">
              <span className="bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">
                {idx + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Column 2: First Image (takes 1 column) */}
    <div className="relative h-full rounded-lg overflow-hidden">
      <Image
        src={menuData[activeMenu].images[0]}
        alt="Custom jewelry design"
        fill
        className="object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>

    {/* Column 3: Second Image (takes 1 column) */}
    <div className="relative h-full rounded-lg overflow-hidden">
      <Image
        src={menuData[activeMenu].images[1]}
        alt="Custom jewelry process"
        fill
        className="object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
  </div>
)}

    {/* Collections Special Layout */}
    {activeMenu === "collections" && (
  <div className="col-span-5 grid grid-cols-4 gap-6"> {/* Override parent grid */}
    {menuData[activeMenu].subitems.map((item, idx) => (
      <div key={idx} className="flex flex-col">
        <Link
          href={item.href}
          onClick={() => setIsOpen(false)}
          className="text-gray-800 uppercase hover:text-pink-500 text-lg font-[600] block mb-1"
        >
          {item.label}
        </Link>
        <p className="text-gray-500 text-sm mb-6">{item.description}</p>
        <div className="relative w-full h-80 rounded-lg overflow-hidden pt-8">
          <Image
            src={menuData[activeMenu].images[idx]}
            alt={`${item.label} collection`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    ))}
  </div>
)}
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
