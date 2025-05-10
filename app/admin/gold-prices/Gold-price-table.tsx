"use client";

import useGoldPriceStore from "@/lib/hooks/useGoldPriceStore";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const GoldPriceTable: React.FC = () => {
  const { goldPrices, fetchGoldPrices } = useGoldPriceStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGoldPrices();
    const interval = setInterval(() => {
      fetchGoldPrices();
    }, 18000000); // Every 5 hours
    return () => clearInterval(interval);
  }, [fetchGoldPrices]);

  useEffect(() => {
    if (goldPrices.length > 0) {
      setIsLoading(false);
    }
  }, [goldPrices]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
        Live Gold Prices (₹/gram)
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl shadow-md bg-white p-6 hover:shadow-lg transition space-y-4 animate-pulse"
                >
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-300 rounded w-full"></div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))
          : goldPrices.map((price) => {
              const isUp = price.direction === "up";
              const isDown = price.direction === "down";
              const percentage = Math.abs(price.percentageChange).toFixed(2);

              return (
                <div
                  key={price.karat}
                  className="rounded-2xl shadow-md bg-white p-6 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-medium text-gray-600">
                    {price.karat}
                  </h3>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    ₹{price.price.toFixed(2)}
                  </p>

                  <div
                    className={`flex items-center gap-1 mt-2 text-sm font-medium ${
                      isUp
                        ? "text-green-600"
                        : isDown
                          ? "text-red-500"
                          : "text-gray-500"
                    }`}
                    title={`Previous: ₹${price.previousPrice.toFixed(2)}`}
                  >
                    {isUp && <ArrowUpRight size={16} />}
                    {isDown && <ArrowDownRight size={16} />}
                    {!isUp && !isDown && <Minus size={16} />}
                    {percentage}%
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default GoldPriceTable;
