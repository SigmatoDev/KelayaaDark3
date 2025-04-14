"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ClientSearchWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 700); // reduce to 700ms for faster feel

    return () => clearTimeout(timeout);
  }, [searchParams.toString()]);

  if (loading) {
    // Render skeleton cards
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-100 animate-pulse h-[320px] rounded-lg shadow-sm"
          >
            <div className="h-48 bg-gray-300 rounded-t-lg"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <>{children}</>;
}
