"use client";

import { useEffect, useState } from "react";

const CheckoutSteps = ({ current = 0 }) => {
  const steps = [
    "Personal Information",
    "Payment Method",
    "Place Order",
  ];

  return (
    <div className="relative flex justify-between items-center w-full max-w-4xl mx-auto mt-10 px-6">
      {/* Connector Line */}
      <div className="absolute top-5 left-6 right-6 h-[2px] bg-gray-300 z-0 overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-500 ease-in-out"
          style={{
            width: `${(current / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Steps */}
      {steps.map((label, index) => {
        const isCompleted = current > index;
        const isActive = current === index;

        return (
          <div key={index} className="flex flex-col items-center z-10 flex-1">
            {/* Circle */}
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                isCompleted
                  ? "bg-green-500 border-green-500 text-white"
                  : isActive
                  ? "bg-black border-black text-white"
                  : "bg-white border-gray-400 text-gray-400"
              }`}
            >
              {isCompleted ? (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17L4 12" />
                </svg>
              ) : (
                index + 1
              )}
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-xs font-semibold text-center ${
                isCompleted
                  ? "text-green-600"
                  : isActive
                  ? "text-black"
                  : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
