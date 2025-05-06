import React from "react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-1/3 bg-gray-200 rounded" />

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Images */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnails (left) */}
          <div className="flex md:flex-col gap-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="w-16 h-16 bg-gray-200 rounded" />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1">
            <div className="h-[500px] bg-gray-200 rounded w-full" />
          </div>
        </div>

        {/* Right Side - Details Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-6 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/3 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />

          <div className="h-10 w-full bg-gray-200 rounded mt-4" />
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-100 rounded mt-6" />
        </div>
      </div>
    </div>
  );
}
