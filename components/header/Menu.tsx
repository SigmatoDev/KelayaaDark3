"use client";

import { ChevronDown, ChevronUp, LogOutIcon, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { signOut, signIn, useSession } from "next-auth/react";
import useCartService from "@/lib/hooks/useCartStore";
import useLayoutService from "@/lib/hooks/useLayout";
import { useState, useEffect, useRef } from "react";
import {
  RiDashboard2Line,
  RiProfileLine,
  RiShieldUserLine,
  RiUser2Line,
} from "react-icons/ri";

const Menu = () => {
  const { items } = useCartService();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useLayoutService();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const signOutHandler = () => {
    signOut({ callbackUrl: "/admin/signin?callbackUrl=/admin/dashboard" });
  };

  const handleClick = () => {
    (document.activeElement as HTMLElement)?.blur();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="hidden md:block">{/* <SearchBox /> */}</div>
      <ul className="flex gap-2">
        {session?.user ? (
          <li>
            <div
              ref={dropdownRef}
              className="dropdown dropdown-end dropdown-bottom relative"
            >
              <button
                type="button"
                className="btn btn-ghost bg-gray-700 hover:bg-gray-700 rounded-btn flex items-center gap-2"
                onClick={toggleDropdown}
              >
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                {session.user.name}
                {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
              </button>
              {isDropdownOpen && (
                <ul
                  tabIndex={0}
                  className="menu dropdown-content absolute right-0 z-[1] w-52 rounded-box bg-gray-900 p-2 shadow"
                >
                  {session.user.isAdmin && (
                    <li
                      onClick={handleClick}
                      className="hover:bg-gray-400 hover:rounded-md"
                    >
                      <Link href="/admin/dashboard">
                        <RiDashboard2Line /> Dashboard
                      </Link>
                    </li>
                  )}
                  <li
                    onClick={handleClick}
                    className="hover:bg-gray-400 hover:rounded-md"
                  >
                    <Link href="/profile">
                      <RiUser2Line /> Profile
                    </Link>
                  </li>
                  <li onClick={handleClick} className="bg-red-500 rounded-md">
                    <button type="button" onClick={signOutHandler}>
                      <LogOutIcon className="h-4 w-4" />
                      Sign out
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </li>
        ) : (
          <li>
            <button
              className="btn btn-ghost rounded-btn"
              type="button"
              onClick={() => signIn()}
            >
              Sign in
            </button>
          </li>
        )}
      </ul>
    </>
  );
};

export default Menu;
