"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = open ? "hidden" : "";
    }
  }, [open]);

  return (
    <>
      {children}

      {mounted && open && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-end justify-center">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/40"
                onClick={() => onOpenChange(false)}
              ></div>

              {/* Sheet Content */}
              <div className="relative z-50 w-full max-w-md">
                {/* This gets injected from SheetContent */}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

export function SheetContent({
  children,
  side = "bottom",
  className = "",
}: {
  children: React.ReactNode;
  side?: "bottom";
  className?: string;
}) {
  return (
    <div
      className={`bg-white shadow-lg rounded-t-2xl p-4 transition-transform ${className} ${
        side === "bottom" ? "translate-y-0" : ""
      }`}
    >
      {children}
    </div>
  );
}

export function SheetTrigger({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      {children}
    </div>
  );
}
