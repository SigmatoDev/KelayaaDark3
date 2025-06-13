"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingCartIcon } from "lucide-react";

import useCartService from "@/lib/hooks/useCartStore";
import { OrderItem } from "@/lib/models/OrderModel";

const AddToCart = ({ item }: { item: OrderItem }) => {
  const router = useRouter();
  const { items, increase, decrease } = useCartService();
  const [selectedLines, setSelectedLines] = useState<number>(1); // Default to 1 line

  useEffect(() => {
    // Find the existing item in the cart
    const found = items.find((x) => x.productCode === item.productCode);
    if (found) {
      setSelectedLines(found.qty); // Set the quantity to the saved qty from the cart
    }
  }, [item, items]);
  const existItem = items.find((x) => x.productCode === item.productCode);
  const currentQty = existItem?.qty || 0;

  const parsedCountInStock =
    parseInt(item.countInStock as unknown as string) || 0;
  const isAtMaxStock = currentQty >= parsedCountInStock;

  const handleIncrease = async () => {
    if (isAtMaxStock) return;
    increase(item);
  };

  const handleDecrease = async () => {
    if (!existItem || currentQty <= 0) return;
    decrease(existItem);
  };

  const addToCartHandler = async () => {
    if (parsedCountInStock < 1) return;

    if (item.materialType === "Beads") {
      item.qty = selectedLines;
    }

    increase(item);
  };

  const handleLineSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const lines = Number(event.target.value);
    setSelectedLines(lines);

    if (existItem && item.materialType === "Beads") {
      increase({ ...item, qty: lines });
    }
  };

  return currentQty > 0 ? (
    <div className="w-full flex items-center justify-between">
      {item.materialType === "Beads" ? (
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-700">Select Lines:</span>
          <select
            value={selectedLines}
            onChange={handleLineSelection}
            className="px-2 py-1 rounded-md border border-pink-500"
          >
            {Array.from({ length: item.inventory_no_of_line || 1 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} Line{i + 1 > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="w-full flex items-center justify-between space-x-4 bg-[#FFF6F8] shadow-md border border-pink-500">
          <button
            className="w-12 h-10 sm:h-12 text-pink-500 text-2xl font-semibold flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-200"
            onClick={handleDecrease}
            disabled={currentQty === 0}
          >
            -
          </button>
          <span className="text-[16px] sm:text-lg font-bold text-pink-500">
            {currentQty}
          </span>
          <button
            className="w-12 h-10 sm:h-12 text-pink-500 text-2xl font-semibold flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-200"
            onClick={handleIncrease}
            disabled={isAtMaxStock}
          >
            +
          </button>
        </div>
      )}
    </div>
  ) : (
    <button
      className="text-white px-6 py-3 rounded-none text-[10px] sm:text-sm font-bold w-full disabled:opacity-50"
      onClick={addToCartHandler}
      disabled={parsedCountInStock === 0}
      style={{
        background:
          "linear-gradient(90.25deg, #df6383 36.97%, #FC6767 101.72%)",
      }}
    >
      {item?.materialType === "Beads" ? (
        <div className="relative flex items-center justify-center">
          Select Lines
        </div>
      ) : (
        <div className="relative flex items-center justify-center">
          <ShoppingCartIcon className="w-4 h-4 mr-4" />
          ADD TO CART
        </div>
      )}
    </button>
  );
};

export default AddToCart;
