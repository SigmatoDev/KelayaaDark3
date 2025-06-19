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
import { useState, useEffect, Suspense, useRef } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Banner from "./Banner";
import { signOut, useSession } from "next-auth/react";
import { SearchBox } from "./SearchBox";
import Menu from "./Menu";
import HeroSection from "../hero-section/HeroSection";
import Carousel, { CarouselSkeleton } from "../carousel/carousel";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import CardGrid from "../category-box/CategoryBox";
import SignInPopup from "../signin/SignIn";
import useCartService from "@/lib/hooks/useCartStore";
import HeroSectionCustomDesign from "../hero-section-customdesign/heroSectionCustomDesign";
import { MdOutlineAccountCircle } from "react-icons/md";

const keywords = ["Gold", "Diamond", "Silver", "Special"];
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
  label: string;
}

interface MenuItem {
  subitems: {
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
        label: "Pendants",
        subcategories: [
          { label: "All Pendants" },
          { label: "Minimalist" },
          { label: "Statement" },
          { label: "Silver" },
        ],
      },
      {
        label: "Rings",
        subcategories: [
          { label: "All Rings" },
          { label: "Cocktail" },
          { label: "Minimalist" },
          { label: "Silver" },
        ],
      },
      {
        label: "Earrings",
        subcategories: [
          { label: "All Earrings" },
          { label: "Hoops" },
          { label: "Studs" },
          { label: "Chandeliers" },
          { label: "Dangles" },
        ],
      },
      {
        label: "Bangles",
        subcategories: [
          { label: "All Bangles" },
          { label: "Adjustable" },
          { label: "Kada" },
          { label: "Silver Traditional" },
        ],
      },
      {
        label: "Bracelets",
        subcategories: [
          { label: "All Bracelets" },
          { label: "Tennis" },
          { label: "Minimalist" },
          { label: "Precious Stones" },
        ],
      },
      {
        label: "Sets",
        subcategories: [
          { label: "All Sets" },
          { label: "Earrings and Pendant" },
          { label: "Earrings and Ring" },
          { label: "Earrings, Ring and Pendant" },
          { label: "Necklace and Earrings" },
          { label: "Necklace, Bracelet and Earrings" },
        ],
      },
      {
        label: "Toe Rings",
        subcategories: [
          { label: "All Toe Rings" },
          // { label: "Semi Precious Stones" },
          // { label: "Silver" },
        ],
      },
      {
        label: "Shop by price",
        subcategories: [
          { label: "Below ₹500" },
          { label: "₹500 - ₹1000" },
          { label: "₹1000 - ₹2000" },
          { label: "₹2000 - ₹3000" },
          { label: "₹3000 - ₹4000" },
          { label: "₹4000+" },
        ],
      },
    ],
    images: ["/images/menu/silverdrp1.webp", "/images/menu/silverdrp2.webp"],
  },

  golddiamonds: {
    subitems: [
      {
        label: "Sets",
        subcategories: [
          { label: "All sets" },
          { label: "Princess" },
          { label: "Chokers" },
          { label: "Necklace & Earrings" },
          { label: "Pendant & Earrings" },
        ],
      },
      {
        label: "Pendants",
        subcategories: [
          { label: "All Pendants" },
          { label: "Minimalist" },
          { label: "Statement" },
          { label: "Solitaire" },
        ],
      },
      {
        label: "Rings",
        subcategories: [
          { label: "All Rings" },
          { label: "Dailywear" },
          { label: "Cocktail" },
          { label: "Engagement" },
        ],
      },
      {
        label: "Earrings",
        subcategories: [
          { label: "All Earrings" },
          { label: "Studs" },
          { label: "Hoops" },
          { label: "Solitaire" },
        ],
      },
      {
        label: "Bangles",
        subcategories: [{ label: "All Bangles" }],
      },
      {
        label: "Bracelets",
        subcategories: [{ label: "All Bracelets" }],
      },
      {
        label: "Nose Pins",
        subcategories: [{ label: "All Nose Pins" }],
      },
      {
        label: "Shop By Price",
        subcategories: [
          { label: "₹5000 - ₹25000" },
          { label: "₹25000 - ₹50000" },
          { label: "₹50000 - ₹1L" },
          { label: "₹1L - ₹2.5L" },
          { label: "₹2.5L - ₹5L" },
          { label: "₹5L - ₹7.5L" },
          { label: "₹7.5L - ₹10L" },
          { label: "₹10L+" },
        ],
      },
    ],
    images: ["/images/menu/golddpr1.webp", "/images/menu/golddpr2.webp"],
  },

  beads: {
    subitems: [
      {
        label: "Beads",

        subcategories: [
          { label: "Amethyst" },
          { label: "Aquamarine & Rose Quartz" },
          { label: "Beryl" },
          { label: "Blue Saphire" },
          { label: "Cats Eye" },
          { label: "Coral" },
          { label: "Emerald" },
          { label: "Florite" },
          { label: "Garnet" },
          { label: "Iolite" },
          { label: "Labradorite" },
          { label: "Lemon Topaz" },
          { label: "Moonstone" },
          { label: "Multi Semi Precious" },
          { label: "Multi colored Sapphire" },
          { label: "Onyx" },
          { label: "Opal" },
          { label: "Pearl" },
          { label: "Peridot" },
          { label: "Pink Opal" },
          { label: "Quartz" },
          { label: "Rose quartz" },
          { label: "Ruby" },
          { label: "Ruby Immitation" },
          { label: "Russian Emerald" },
          { label: "Smokey Quarts" },
          { label: "Topaz" },
          { label: "Tourmaline" },
          { label: "Turqoise" },
        ],
      },
    ],
    images: ["/images/menu/beads-1.JPG", "/images/menu/beads-2.JPG"],
  },

  "custom-jewellery": {
    subitems: [
      {
        // href: "/custom-jewellery/how-it-works",
        label: "How it works",
        description: "The step-by-step process to create your dream piece",
      },
      {
        // href: "/custom-design",
        label: "Start my idea",
        description: "Begin your custom jewelry journey",
      },
    ],
    steps: [
      "Share your idea with our designers",
      "Book a consultation appointment",
      "Design visualization & approval",
      "Crafting & delivery of your piece",
    ],
    images: ["/images/menu/cd-sec1.webp", "/images/menu/cd-sec2.webp"],
  },
  collections: {
    subitems: [
      {
        // href: "/collections/air",
        label: "Air",
        description: "Ethereal and lightweight designs",
      },
      {
        // href: "/collections/water",
        label: "Water",
        description: "Fluid and flowing patterns",
      },
      {
        // href: "/collections/earth",
        label: "Earth",
        description: "Organic and natural inspirations",
      },
      {
        // href: "/collections/fire",
        label: "Fire",
        description: "Bold and passionate creations",
      },
    ],
    images: [
      "/images/menu/air.webp",
      "/images/menu/water.webp",
      "/images/menu/earth.webp",
      "/images/menu/fire.webp",
    ],
  },
  // beads: {
  //   subitems: [
  //     {
  //       // href: "/collections/air",
  //       label: "Air",
  //       description: "Ethereal and lightweight designs",
  //     },
  //   ],
  //   images: [
  //     "/images/menu/air.webp",
  //     "/images/menu/water.webp",
  //     "/images/menu/earth.webp",
  //     "/images/menu/fire.webp",
  //   ],
  // }
};

const DesktopHeader = () => {
  const router = useRouter();
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
  const [hoveredMaterialType, setHoveredMaterialType] = useState<string>("");
  const isSignInPage = pathname?.endsWith("/signin");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // const signOutHandler = async () => {
  //   await signOut({ redirect: false }); // Prevent full page reload
  //   setMenuOpen(false); // Close menu on logout
  // };

  const signOutHandler = async () => {
    setMenuOpen(false); // Close menu first
    await signOut({ redirect: false }); // Sign out without auto-redirect
    if (session?.user?.isAdmin) {
      router.push("/signin");
    } else {
      router.push("/");
    }
  };

  const handleClick = () => setMenuOpen(false); // Close menu on link click

  useEffect(() => {
    // handler to call on click outside
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

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

  const handleMainMenuClick = (label: string) => {
    console.log("label", label, typeof label);

    if (label === "custom-jewellery") {
      router.push("/custom-design");
      setIsOpen(false);
      return; // ⛔ prevent the next line from executing
    }

    if (label === "collections") {
      router.push(`/search?productCategory=collections`);
      setIsOpen(false);
      return; // ⛔ prevent the next line from executing
    }

    router.push(`/search?materialType=${hoveredMaterialType}`);
    setIsOpen(false);
  };

  // dynamic routing based on menu items
  const handleMainClick = (label: string) => {
    console.log("main kabel", label);
    router.push(
      `/search?productCategory=${encodeURIComponent(label)}&materialType=${hoveredMaterialType}`
    );
    setIsOpen(false);
  };

  const handleSubClick = (productCategory: string, categor: string) => {
    const lowerProductCategory = productCategory.toLowerCase();
    const lowerCategor = categor.toLowerCase();
    const isPriceCategory = lowerProductCategory === "shop by price";
    const convertToNumber = (value: string) => {
      value = value.replace(/[₹,\s]/g, "").toUpperCase();
      if (value.endsWith("L")) {
        return Math.round(parseFloat(value.replace("L", "")) * 100000);
      }
      return parseInt(value);
    };

    if (isPriceCategory) {
      // Handle price-based filtering
      if (categor.includes("+")) {
        const min = convertToNumber(categor.split("+")[0]);
        router.push(`/search?price=${encodeURIComponent(`${min}+`)}`);
      } else {
        const [minRaw, maxRaw] = categor.split("-");
        const min = convertToNumber(minRaw);
        const max = convertToNumber(maxRaw);
        router.push(`/search?price=${min}-${max}`);
      }
    } else {
      // General case: Handle "All [Category]" logic
      const isAllCategory = lowerCategor.startsWith("all ");
      const categoryParam = isAllCategory ? "all" : categor;

      const productCatParam =
        lowerProductCategory === "beads" ? "all" : productCategory;

      router.push(
        `/search?q=all&productCategory=${encodeURIComponent(
          productCatParam
        )}&category=${encodeURIComponent(
          categoryParam
        )}&materialType=${hoveredMaterialType}&price=all&rating=all&sort=newest&page=1`
      );
    }

    setIsOpen(false);
  };

  if (session?.user?.isAdmin || isSignInPage) {
    return (
      <header>
        <nav>
          <div className="navbar fixed top-0 z-50 justify-between bg-gray-800 text-white">
            <div className="h-[40px] w-[300px]">
              <img
                src="/Kelayaa1.png"
                alt="Kelayaa Logo"
                className="w-[50%]"
                style={{
                  filter: "contrast(150%)",
                }}
              />
            </div>
            <div>
              {session && (
                <div className="mr-4">
                  <button
                    onClick={() => signOutHandler()}
                    className="w-full flex items-center justify-start  text-red-500 bg-gray-700 hover:text-red-500 hover:bg-gray-700 p-3 rounded-md transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </div>
              )}

              <Menu />
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <>
      <div
        className={`xl:fixed top-0 z-30 w-screen ${
          isScrolled
            ? "bg-[#000] backdrop-blur-sm"
            : "xl:bg-[#000] xl:backdrop-blur-md bg-black"
        } transition-all duration-1000 group`}
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
                      <span className="absolute -top-3 -right-0.5 bg-[#af5772] text-white text-xs px-1.5 py-0.5 rounded-full">
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
                      <div className="flex items-center space-x-1">
                        {Object.keys(menuData).map((key) => {
                          const material =
                            key === "golddiamonds" ? "gold" : key;

                          return (
                            <Link
                              key={key}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleMainMenuClick(key);
                              }}
                              className={`w-[140px] text-center text-white ${
                                pathname === "/" && !isScrolled
                                  ? "group-hover:text-white"
                                  : ""
                              } transition-all duration-300 ease-in-out hover:text-pink-300 text-xs`}
                              onMouseEnter={() => {
                                setActiveMenu(key);
                                setIsOpen(true);
                                setHoveredMaterialType(material); // ✅ Store mapped material
                              }}
                            >
                              {key === "golddiamonds"
                                ? "Gold & Diamonds"
                                : key.replace("-", " ")}
                              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-pink-500 transition-all duration-300 ease-in-out hover:w-full shadow-[0_0_8px_#ec4899]"></span>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="flex items-center space-x-4 pl-5 ml-auto">
                        {/* User menu */}
                        <div className="relative">
                          {session && session.user ? (
                            <li className="list-none">
                              <div ref={dropdownRef} className="relative">
                                <button
                                  onClick={() => {
                                    if (session.user.userType !== "guest") {
                                      setMenuOpen(!menuOpen);
                                    }
                                  }}
                                  className={`flex items-center px-3 py-2 text-sm text-white rounded-lg transition
    ${session.user.userType === "guest" ? " cursor-not-allowed" : "bg-black hover:bg-gray-800"}
  `}
                                  disabled={session.user.userType === "guest"}
                                >
                                  <User className="h-4 w-4 mr-1" />
                                  {session.user.userType === "guest" ? null : (
                                    <>
                                      {session.user.name}
                                      <ChevronDown className="ml-2 w-4 h-4" />
                                    </>
                                  )}
                                </button>

                                {/* Dropdown menu */}
                                {menuOpen && (
                                  <ul className="absolute right-0 z-[9999] mt-2 w-52 rounded-lg bg-white backdrop-blur-md p-4 shadow-lg border border-white/20">
                                    <li
                                      onClick={handleClick}
                                      className="flex items-center z-[9999] px-3 py-2 hover:bg-white/20 rounded-md"
                                    >
                                      <MdOutlineAccountCircle className="w-4 h-4 text-pink-500" />
                                      <Link
                                        href="/my-account"
                                        className="text-pink-500 ml-2 text-xs"
                                      >
                                        My Account
                                      </Link>
                                    </li>
                                    <li
                                      onClick={handleClick}
                                      className="flex items-center z-[9999] px-3 py-2 hover:bg-white/20 rounded-md"
                                    >
                                      <History className="w-4 h-4 text-black" />
                                      <Link
                                        href="/my-orders"
                                        className="text-black ml-2 text-xs"
                                      >
                                        Order History
                                      </Link>
                                    </li>
                                    <li
                                      onClick={handleClick}
                                      className="flex items-center px-3 py-2 hover:bg-white/20 rounded-md"
                                    >
                                      <User className="w-4 h-4 text-black" />
                                      <Link
                                        href="/profile"
                                        className="text-black ml-2 text-xs"
                                      >
                                        Profile
                                      </Link>
                                    </li>
                                    {/* <li
                                      onClick={handleClick}
                                      className="flex items-center px-3 py-2 hover:bg-white/20 rounded-md"
                                    >
                                      <History className="w-4 h-4 text-black" />
                                      <Link
                                        href="/custom-my-orders"
                                        className="text-black ml-2 text-xs"
                                      >
                                        Custom Orders
                                      </Link>
                                    </li> */}
                                    <li>
                                      <button
                                        type="button"
                                        onClick={signOutHandler}
                                        className="flex items-center w-full px-3 py-2 text-white bg-[#Dd91a6] hover:bg-[#000] rounded-md"
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

                        {session && session.user ? (
                          <Link
                            href="/wishlist"
                            className="flex flex-col items-center text-center"
                          >
                            <Heart
                              className={`w-5 h-5 text-sm text-white ${pathname === "/" && !isScrolled ? "group-hover:text-white" : ""} hover:text-pink-500 transition`}
                            />
                          </Link>
                        ) : (
                          ""
                        )}

                        <div>
                          <SearchBox />
                        </div>

                        <Link
                          href="/cart"
                          className="relative flex flex-col items-center text-center"
                        >
                          <ShoppingCart
                            className={`w-[50px] h-5 text-white ${pathname === "/" && !isScrolled ? "group-hover:text-white" : ""} hover:text-pink-500 transition`}
                          />
                          <span className="absolute -top-3 -right-0.5 bg-[#af5772] text-white text-xs px-1.5 py-0.5 rounded-full">
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
                        {activeMenu !== "custom-jewellery" &&
                          activeMenu !== "collections" &&
                          activeMenu !== "beads" && (
                            <>
                              {/* Columns 1-4 */}
                              {[0, 2, 4, 6].map((startIdx, colIdx) => (
                                <div
                                  key={colIdx}
                                  className="flex flex-col h-full"
                                >
                                  {menuData[activeMenu].subitems
                                    .slice(startIdx, startIdx + 2)
                                    .map((item, idx) => (
                                      <div key={idx} className="mb-6 last:mb-0">
                                        <Link
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleMainClick(item.label);
                                          }}
                                          className="text-gray-800 uppercase hover:text-[#af5772] text-sm font-[500] block mb-2"
                                        >
                                          {item.label}
                                        </Link>

                                        {item.subcategories && (
                                          <div className="pl-2 mt-1 space-y-2">
                                            {item.subcategories.map(
                                              (subItem, subIdx) => (
                                                <Link
                                                  key={subIdx}
                                                  href="#"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    handleSubClick(
                                                      item.label,
                                                      subItem.label
                                                    );
                                                  }}
                                                  className="text-gray-500 hover:text-[#af5772] text-sm font-[300] block"
                                                >
                                                  {subItem.label}
                                                </Link>
                                              )
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              ))}

                              {/* Column 5: Images */}
                              <div className="grid grid-rows-2 gap-4 h-full">
                                {menuData[activeMenu].images
                                  .slice(0, 2)
                                  .map((img, idx) => (
                                    <div
                                      key={idx}
                                      className="relative w-full h-full rounded-lg overflow-hidden"
                                    >
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
                                {menuData[activeMenu].subitems.map(
                                  (item, idx) => (
                                    <div key={idx} className="mb-6 last:mb-0">
                                      <Link
                                        href={"/custom-design"}
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-800 uppercase hover:text-pink-500 text-sm font-[500] block mb-1"
                                      >
                                        {item.label}
                                      </Link>
                                      <p className="text-gray-500 text-xs">
                                        {item.description}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>

                              {/* Process Steps */}
                              <div>
                                <h4 className="text-gray-800 uppercase text-xs font-[600] mb-3">
                                  4-Step Process:
                                </h4>
                                <ul className="space-y-3">
                                  {menuData[activeMenu].steps?.map(
                                    (step, idx) => (
                                      <li
                                        key={idx}
                                        className="text-gray-600 text-sm flex items-start"
                                      >
                                        <span className="bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">
                                          {idx + 1}
                                        </span>
                                        {step}
                                      </li>
                                    )
                                  )}
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
                          <div className="col-span-5 grid grid-cols-4 gap-6">
                            {menuData[activeMenu].subitems.map((item, idx) => {
                              const path = `/search?productCategory=collections&collectionType=${encodeURIComponent(item.label)}`;
                              return (
                                <div key={idx} className="flex flex-col">
                                  <Link
                                    href={path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-800 uppercase hover:text-pink-500 text-lg font-[600] block mb-1"
                                  >
                                    {item.label}
                                  </Link>
                                  <p className="text-gray-500 text-sm mb-6">
                                    {item.description}
                                  </p>
                                  <div className="relative w-full h-80 rounded-lg overflow-hidden pt-8">
                                    <Link href={path}>
                                      <Image
                                        src={menuData[activeMenu].images[idx]}
                                        alt={`${item.label} collection`}
                                        fill
                                        sizes="(max-width: 500px) 100vw, 200px"
                                        onClick={() => setIsOpen(false)}
                                        className="object-cover hover:scale-105 transition-transform duration-300 rounded-md"
                                        priority={idx === 0} // prioritize first image for LCP
                                      />
                                    </Link>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Beads Special Layout */}
                        {/* Beads Special Layout */}
                        {activeMenu === "beads" && (
                          <div className="col-span-5 grid grid-cols-4 gap-6">
                            {/* Subcategories split into 3 columns, 10 per column */}
                            {(() => {
                              const allSubcategories =
                                menuData[activeMenu]?.subitems?.[0]
                                  ?.subcategories || [];
                              const columns = [[], [], []];

                              allSubcategories.forEach((item, index) => {
                                const columnIndex = Math.floor(index / 10); // Max 10 per column
                                if (columnIndex < 3) {
                                  columns[columnIndex].push(item);
                                }
                              });

                              return columns.map((columnItems, colIdx) => (
                                <div
                                  key={colIdx}
                                  className="flex flex-col space-y-2"
                                >
                                  {columnItems.map((subItem, subIdx) => (
                                    <Link
                                      key={subIdx}
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleSubClick("Beads", subItem?.label);
                                      }}
                                      className="text-gray-600 hover:text-[#af5772] text-sm font-[400] block"
                                    >
                                      {subItem?.label}
                                    </Link>
                                  ))}
                                </div>
                              ));
                            })()}

                            {/* Image Column (4th column) */}
                            <div className="flex flex-col gap-4 h-full">
                              {menuData[activeMenu].images
                                .slice(0, 2)
                                .map((img, idx) => (
                                  <div
                                    key={idx}
                                    className="relative w-full h-full min-h-[200px] rounded-lg overflow-hidden"
                                  >
                                    <Image
                                      src={img}
                                      alt={`Beads Jewelry ${idx + 1}`}
                                      fill
                                      className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                ))}
                            </div>
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

      {/* Render SignInPopup and control its visibility */}
      {isSignInOpen && (
        <SignInPopup isOpen={isSignInOpen} setIsOpen={setIsSignInOpen} />
      )}
    </>
  );
};

export default DesktopHeader;
