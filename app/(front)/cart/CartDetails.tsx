"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import useLayoutService from "@/lib/hooks/useLayout";
import useCartService from "@/lib/hooks/useCartStore";
import { Tag } from "lucide-react";
import toast from "react-hot-toast";
import EmptyCart from "./EmptyCart";
import { useSession } from "next-auth/react";
import SignInPopup from "@/components/signin/SignIn";

const CartDetails = () => {
  const {
    items,
    itemsPrice,
    discountPrice,
    couponDiscount,
    couponCode,
    increase,
    decrease,
    applyCoupon,
    removeCoupon,
    originalItemsPrice,
    setTotalPriceAfterCheckout,
  } = useCartService();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme } = useLayoutService();
  const { data: session } = useSession();
  const userId = session?.user?._id;
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  // State for managing price breakdown visibility
  const [priceBreakupVisible, setPriceBreakupVisible] = useState(false);

  // const discount = itemsPrice >= 2500 ? itemsPrice * 0.1 : 0; // 10% discount on orders above ₹25,000
  const [couponInput, setCouponInput] = useState("");

  const totalPrice = itemsPrice - discountPrice - couponDiscount;

  useEffect(() => {
    setMounted(true);
  }, [items, itemsPrice, decrease, increase]);

  if (!mounted) return <>Loading...</>;

  // Apply coupon logic
  const handleApplyCoupon = () => {
    applyCoupon(couponInput);
  };

  // Remove coupon logic
  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput("");
  };

  const handleProceedToCheckOut = () => {
    // if (!userId) {
    //   setIsSignInOpen(true);
    //   // toast.error("Please log in to manage wishlist");
    //   return;
    // }
    setCheckoutLoading(true); // Show loader on button
    router.push("/shipping");
    setTotalPriceAfterCheckout(totalPrice);
  };

  return (
    <div className="mt-4 p-6 bg-white w-[90%] mx-auto">
      <h1 className="mt-4 mb-8 text-2xl text-center font-semibold text-gray-900">
        Shopping Cart
      </h1>
      {items.length === 0 ? (
        <div>
          <EmptyCart />
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-6">
          {/* Product Details Section */}
          <div className="md:col-span-3 bg-white p-4 shadow-sm bg-[#f5f5f5]">
            {items.map((item) => (
              <div
                key={item.slug}
                className="grid grid-cols-3 gap-6 items-satrt justify-between border-b p-4 mb-4 bg-white"
              >
                <div className="flex">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={140}
                    height={140}
                    className="rounded-md"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h2>
                  <div className="flex space-x-2 text-sm">
                    {
                      item?.productCategory === "Rings" ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                          Size: {item?.ring_size || 18}{" "}
                          {/* Assuming "ring_size" is the property */}
                        </span>
                      ) : item?.productCategory === "Bangles" ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                          Size: {item?.size || 18}{" "}
                          {/* Assuming "size" is the property for bangles */}
                        </span>
                      ) : null // Don't render anything for other categories
                    }
                    {item?.materialType === "Beads" ? (
                      <>
                        <span className="px-2 py-1 bg-[#f6e4e9] text-pink-500 rounded">
                          {item?.materialType}
                        </span>
                        <span className="px-2 py-1 bg-orange-100 text-yellow-700 rounded">
                          Selected Line: {item?.qty || 18}{" "}
                          {/* Assuming "ring_size" is the property */}
                        </span>
                      </>
                    ) : (
                      <span className="px-4 py-1 bg-[#f6e4e9] text-pink-500 rounded">
                        {item?.productCategory || item?.productType}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center border bg-[#FFF6F8] shadow-md border border-pink-500 w-max mt-1">
                    <button
                      className="w-12 h-10 text-pink-500 text-2xl font-semibold flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-200 disabled:opacity-50"
                      type="button"
                      onClick={() => decrease(item)}
                      disabled={item.qty === 0} // Disable if qty is 0
                    >
                      -
                    </button>

                    <span className="text-lg font-medium text-pink-500 mx-4">
                      {item.qty}
                    </span>

                    <button
                      className="w-12 h-10 text-pink-500 text-2xl font-semibold flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-200 disabled:opacity-50"
                      type="button"
                      onClick={() => increase(item)}
                      disabled={
                        item.qty >=
                        (parseInt(item.countInStock as unknown as string) || 0)
                      } // Disable if qty reaches max stock
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-end items-start">
                  {item?.materialType === "Beads" ? (
                    <span className="text-md font-semibold text-gray-900">
                      ₹{" "}
                      {new Intl.NumberFormat("en-IN").format(
                        Number(item?.pricePerLine?.toFixed(2))
                      )}
                    </span>
                  ) : (
                    <span className="text-md font-semibold text-gray-900">
                      ₹{" "}
                      {new Intl.NumberFormat("en-IN").format(
                        Number(item?.price?.toFixed(2))
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Section */}
          {/* Order Summary Section */}
          <div className="p-6 bg-gray-50 border border-[#eaeaea] ">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Order Summary
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex justify-between text-sm">
                <span>Price:</span>
                <span>₹ {originalItemsPrice?.toFixed(2)}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>Discount:</span>
                <span className="text-red-500">
                  {discountPrice > 0 && "-"} ₹ {discountPrice.toFixed(2)}
                </span>
              </li>
              {couponDiscount > 0 && (
                <li className="flex justify-between text-sm">
                  <span>Coupon Discount:</span>
                  <span className="text-red-500">- ₹ {couponDiscount}</span>
                </li>
              )}
              <li className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </li>
              <li className="flex justify-between text-xl font-semibold border-t pt-4">
                <span>Total:</span>
                <span>
                  ₹{" "}
                  {new Intl.NumberFormat("en-IN").format(
                    Number(originalItemsPrice?.toFixed(2))
                  )}
                </span>
              </li>
            </ul>

            {/* Price Breakdown Section */}
            <div className="mt-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setPriceBreakupVisible(!priceBreakupVisible)}
              >
                <h3 className="text-sm font-medium text-blue-600">
                  Price Breakdown
                </h3>
                <svg
                  className={`w-5 h-5 transform transition-all ${priceBreakupVisible ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {priceBreakupVisible && (
                <ul className="mt-2 space-y-2 pl-4 text-xs text-gray-700">
                  {items.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="flex flex-col">
                        <span className="text-xs">
                          {item.name} ({item.productCode})
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Unit Price: ₹ {item.price?.toFixed(2)}
                        </span>
                      </span>
                      <span className="text-xs">
                        ₹ {(item.price * item.qty).toFixed(2)}{" "}
                        <span className="text-[10px] text-gray-500">
                          (x{item.qty})
                        </span>
                      </span>
                    </li>
                  ))}
                  <li className="flex justify-between font-semibold text-xs border-t pt-2">
                    <span>Total Items Price</span>
                    <span>₹ {originalItemsPrice?.toFixed(2)}</span>
                  </li>
                  <li className="flex justify-between text-xs">
                    <span>Discount</span>
                    <span className="text-red-500">
                      - ₹ {discountPrice.toFixed(2)}
                    </span>
                  </li>
                  {couponDiscount > 0 && (
                    <li className="flex justify-between text-xs">
                      <span>Coupon Discount</span>
                      <span className="text-red-500">- ₹ {couponDiscount}</span>
                    </li>
                  )}
                  <li className="flex justify-between text-xs">
                    <span>Shipping</span>
                    <span>₹ 0.00</span>
                  </li>
                  <li className="flex justify-between font-semibold text-xs text-green-600">
                    <span>Total:</span>
                    <span>₹ {originalItemsPrice?.toFixed(2)}</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Coupon Code Input */}
            <div>
              <div className="relative mt-6 flex gap-2">
                {couponCode && (
                  <button
                    className="ml-2 px-4 py-2 bg-gray-500 text-white font-semibold hover:bg-gray-600 transition"
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </button>
                )}
              </div>
              {couponDiscount > 0 && (
                <div className="mt-2 text-green-600 text-[10px] font-medium flex items-center gap-2">
                  <Tag className="w-3 h-3 text-green-500" />
                  Coupon Applied! ₹{couponDiscount} Discount.
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={checkoutLoading}
              className={`w-full mt-6 py-3 text-[12px] text-white font-semibold bg-gradient-to-r from-[#Dd91a6] to-red-500 flex items-center justify-center`}
              onClick={handleProceedToCheckOut}
            >
              {checkoutLoading ? (
                <div className="flex items-center space-x-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                "PROCEED TO CHECKOUT"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Render SignInPopup and control its visibility */}
      {isSignInOpen && (
        <SignInPopup isOpen={isSignInOpen} setIsOpen={setIsSignInOpen} />
      )}
    </div>
  );
};

export default CartDetails;

{
  /* Discounts & Offers Section
            {itemsPrice >= 2500 && (
              <>
                <div className="text-pink-600 mb-2 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-pink-500" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Discounts & Offers
                  </h2>
                </div>

                <div className="bg-[#FFF6F8] p-3  border border-pink-300 text-pink-400 mb-2">
                  <span className="font-semibold">10% Instant Discount</span> on
                  orders above ₹25,000.
                </div>
                <div className="bg-[#FFF6F8] p-3  border border-pink-300 text-pink-400 mb-2">
                  <span className="font-semibold">₹500 Off</span> on first order
                  above ₹10,000. Use code:{" "}
                  <span className="font-semibold">FIRST500</span>.
                </div>
                <div className="bg-[#FFF6F8] p-3  border border-pink-300 text-pink-400 mb-2">
                  <span className="font-semibold">₹200 Off</span> on orders
                  above ₹5,000. Use code:{" "}
                  <span className="font-semibold">WELCOME200</span>.
                </div>
              </>
            )} */
}
