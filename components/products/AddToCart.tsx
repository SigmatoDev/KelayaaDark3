"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingCartIcon } from "lucide-react";

import useCartService from "@/lib/hooks/useCartStore";
import { OrderItem } from "@/lib/models/OrderModel";

// API function to update countInStock
// const updateStockByProductCode = async (productCode: string, countInStock: number) => {
//   try {
//     const res = await fetch("/api/products/update-stock", {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ productCode, countInStock }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Failed to update stock");
//     console.log("✅ Stock updated in backend:", data.product);
//     return data;
//   } catch (error) {
//     console.error("❌ Error updating stock:", error);
//   }
// };

const AddToCart = ({ item }: { item: OrderItem }) => {
  const router = useRouter();
  const { items, increase, decrease } = useCartService();
  const [existItem, setExistItem] = useState<OrderItem | undefined>();

  useEffect(() => {
    const found = items.find((x) => x.slug === item.slug);
    setExistItem(found);
  }, [item, items]);

  // Parse countInStock safely
  const parsedCountInStock =
    parseInt(item.countInStock as unknown as string) || 0;
  const currentQty = existItem?.qty || 0;
  const isAtMaxStock = currentQty >= parsedCountInStock;

  const handleIncrease = async () => {
    if (isAtMaxStock) {
      console.log("🚫 Cannot increase, max stock reached");
      return;
    }
    increase(item);
    console.log("➕ Increased item:", item.productCode);

    // Update backend stock
    // await updateStockByProductCode(item.productCode, parsedCountInStock - currentQty - 1);
  };

  const handleDecrease = async () => {
    if (!existItem || currentQty <= 0) return;

    decrease(existItem);
    console.log("➖ Decreased item:", item.productCode);

    // Update backend stock
    // await updateStockByProductCode(item.productCode, parsedCountInStock - currentQty + 1);
  };

  const addToCartHandler = async () => {
    if (parsedCountInStock < 1) {
      console.log("❌ Cannot add, item is out of stock!");
      return;
    }

    increase(item);
    console.log("✅ Added item to cart:", item.productCode);

    // Update backend stock
    // await updateStockByProductCode(item.productCode, parsedCountInStock - 1);
  };

  return existItem ? (
    <div className="w-full flex items-center justify-between space-x-4 bg-[#FFF6F8] shadow-md border border-pink-500">
      <button
        className="w-12 h-12 text-pink-500 text-2xl font-semibold flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-200 disabled:opacity-50"
        type="button"
        onClick={handleDecrease}
        disabled={currentQty === 0}
      >
        -
      </button>

      <span className="text-lg font-medium text-pink-500">{currentQty}</span>

      <button
        className="w-12 h-12 text-pink-500 text-2xl font-semibold flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-200 disabled:opacity-50"
        type="button"
        onClick={handleIncrease}
        disabled={isAtMaxStock}
      >
        +
      </button>
    </div>
  ) : (
    <button
      className="text-white px-6 py-3 rounded-none text-[12px] font-bold w-full disabled:opacity-50"
      onClick={addToCartHandler}
      disabled={parsedCountInStock === 0}
      style={{
        background:
          "linear-gradient(90.25deg, #df6383 36.97%, #FC6767 101.72%)",
      }}
    >
      <div className="relative flex items-center justify-center">
        <ShoppingCartIcon className="w-4 h-4 mr-4" />
        ADD TO CART
      </div>
    </button>
  );
};

export default AddToCart;
