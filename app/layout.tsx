import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Providers from "@/components/Providers";
import ClientLayout from "@/components/ClientLayout"; // New client component

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Kelayaa",
  description:
    "Kelayaa – your ultimate destination for gold and diamond jewellery",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>{" "}
          {/* Wrap children inside ClientLayout */}
        </Providers>
      </body>
    </html>
  );
}
