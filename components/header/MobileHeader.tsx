"use client";

import Link from "next/link";
import { AlignJustify, ShoppingCart, Search, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useCartService from "@/lib/hooks/useCartStore";
import MobileDrawer from "./MobileDrawer";

const MobileHeader = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { totalCartQuantity } = useCartService();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Black Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-black text-white flex items-center justify-between px-4 h-14 md:hidden">
        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex items-center justify-center"
        >
          <AlignJustify className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/">
            <img
              src="/Kelayaa - logo.webp"
              alt="Kelayaa Logo"
              className="h-8 object-contain"
            />
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalCartQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {totalCartQuantity}
              </span>
            )}
          </Link>

          <button onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="w-5 h-5" />
          </button>

          {session?.user ? (
            <Link href="/profile">
              <User className="w-5 h-5" />
            </Link>
          ) : (
            <button onClick={() => setIsSignInOpen(true)}>
              <User className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Slide-Out Mobile Drawer */}
      {menuOpen && (
  <>
    <div className="fixed inset-0 bg-black/70 z-40" onClick={() => setMenuOpen(false)} />
    <MobileDrawer closeDrawer={() => setMenuOpen(false)} />
  </>
)}


      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="fixed top-14 left-0 w-full bg-white p-2 z-40 shadow-md flex md:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Search for jewelry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-md"
            >
              Go
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default MobileHeader;
