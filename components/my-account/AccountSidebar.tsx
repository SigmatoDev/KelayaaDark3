"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const AccountSidebar = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "orders";

  const isActive = (value: string) =>
    tab === value ? "text-[#ff3f6c] font-semibold" : "text-gray-800";

  return (
    <div className="w-[250px] border-r bg-[#fafafa] p-6 text-sm">
      <h2 className="text-lg font-semibold mb-4">Account</h2>
      <Separator className="mb-6" />

      <nav className="flex flex-col space-y-4">
        <Link
          href="/my-account?tab=orders"
          className={`transition-colors hover:text-pink-500 ${isActive("orders")}`}
        >
          Orders & Returns
        </Link>

        <Link
          href="/my-account?tab=profile"
          className={`transition-colors hover:text-pink-500 ${isActive("profile")}`}
        >
          Profile
        </Link>

        <Link
          href="/my-account?tab=wishlist"
          className={`transition-colors hover:text-pink-500 ${isActive("wishlist")}`}
        >
          My Wishlist
        </Link>
      </nav>
    </div>
  );
};

export default AccountSidebar;
