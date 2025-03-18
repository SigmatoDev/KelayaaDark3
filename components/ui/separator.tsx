"use client";

import * as React from "react";

interface SeparatorProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function Separator({ 
  className = "", 
  orientation = "horizontal" 
}: SeparatorProps) {
  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-800 ${
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
      } ${className}`}
    />
  );
} 