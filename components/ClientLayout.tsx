"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import DrawerButton from "@/components/DrawerButton";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { data: session } = useSession();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="drawer">
      <DrawerButton />
      <div className="drawer-content">
        <div className="flex min-h-screen flex-col">
          <Header />
          {children}
          {session?.user?.isAdmin ? "" : <Footer />}
        </div>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <Sidebar />
      </div>
    </div>
  );
}
