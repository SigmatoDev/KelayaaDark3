"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import useCartService from "@/lib/hooks/useCartStore";
import { OrderItem } from "@/lib/models/OrderModel";
import { ShoppingCartIcon } from "lucide-react";

const AddToCart = ({ item }: { item: OrderItem }) => {
  const router = useRouter();
  const { items, increase, decrease } = useCartService();
  const [existItem, setExistItem] = useState<OrderItem | undefined>();
  console.log("exit", existItem);
  useEffect(() => {
    setExistItem(items.find((x) => x.slug === item.slug));
  }, [item, items]);

  const addToCartHandler = () => {
    increase(item);
  };

  return existItem ? (
    <div className="w-full flex items-center justify-between space-x-4 bg-[#FFF6F8]  shadow-md border border-pink-500">
      <button
        className="w-12 h-12 text-pink-500 text-2xl font-semibold  flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-200"
        type="button"
        onClick={() => decrease(existItem)}
      >
        -
      </button>

      <span className="text-lg font-medium text-pink-500">{existItem.qty}</span>

      <button
        className="w-12 h-12 text-pink-500 text-2xl font-semibold  flex items-center justify-center  hover:bg-pink-600 hover:text-white transition-colors duration-200"
        type="button"
        onClick={() => increase(existItem)}
      >
        +
      </button>
    </div>
  ) : (
    // <button
    //   className="btn btn-primary w-full"
    //   type="button"
    //   onClick={addToCartHandler}
    // >
    //   <div className="relative flex items-center">
    //     <ShoppingCartIcon className="w-5 h-5" />
    //     {/* + Icon Overlay */}
    //     <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-black rounded-full w-5 h-4 flex items-center justify-center text-xs font-bold">
    //       +
    //     </span>
    //   </div>
    //   Add to cart
    // </button>
    <button
      className="text-white px-6 py-3 rounded-none text-[12px] font-bold w-full"
      onClick={addToCartHandler}
      style={{
        background:
          "linear-gradient(90.25deg, #EC008C 36.97%, #FC6767 101.72%)",
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
