"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import useLayoutService from "@/lib/hooks/useLayout";
import useCartService from "@/lib/hooks/useCartStore";
import { Tag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import EmptyCart from "./EmptyCart";
import { useSession } from "next-auth/react";
import SignInPopup from "@/components/signin/SignIn";
import { saveAbandonedCart } from "@/lib/abandonedCart/saveAbandonedCart";

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
    removeItem,
  } = useCartService();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme } = useLayoutService();
  const { data: session } = useSession();
  console.log("Session", session);
  const userId = session?.user?._id;
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  // State for managing price breakdown visibility
  const [priceBreakupVisible, setPriceBreakupVisible] = useState(false);

  // const discount = itemsPrice >= 2500 ? itemsPrice * 0.1 : 0; // 10% discount on orders above ₹25,000
  const [couponInput, setCouponInput] = useState("");

  const totalPrice = itemsPrice - discountPrice - couponDiscount;

  useEffect(() => {
    if (session?.user?._id && items.length > 0) {
      const formattedItems = items.map((item) => ({
        ...item,
        _id: item._id,
        productType: item.productType || "Product", // Adjust based on your store logic
      }));

      saveAbandonedCart({
        userId: session.user._id,
        cartItems: formattedItems,
        totalPrice,
      });
    }
  }, [items, session]);

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

  const handleLineSelection = (
    item: OrderItem,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLines = Number(event.target.value);
    item.qty = selectedLines; // Update the qty of this Beads item
    increase(item); // Update the cart with the new quantity
  };

  return (
    <div className="mt-4 p-4 sm:p-6 bg-white w-full sm:w-[90%] mx-auto rounded-md shadow-sm">
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
          <div
            className="md:col-span-3 bg-white p-1 bg-[#f5f5f5] max-h-[400px] overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "pink transparent", // Adjusting the color for the thumb and track
            }}
          >
            {/* Custom styles for scrollbars */}
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px; /* Set the width of the scrollbar */
              }

              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent; /* Hide the track */
              }

              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: pink;
                border-radius: 10px;
                border: 2px solid #f5f5f5; /* Border around the thumb */
              }

              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: #ff80c0; /* Hover effect */
              }

              /* Remove the scrollbar arrows */
              .custom-scrollbar::-webkit-scrollbar-button {
                display: none;
              }

              /* Optional: Hide scrollbar for a cleaner look */
              .custom-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div className="custom-scrollbar">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="grid grid-cols-3 gap-6 items-start justify-between border-b p-4 mb-4 bg-white"
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
                      {item?.productCategory === "Rings" ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                          Size: {item?.ring_size}
                        </span>
                      ) : item?.productType === "Bangles" ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                          Size: {item?.size}
                        </span>
                      ) : (
                        ""
                      )}

                      {item?.materialType === "Beads" ? (
                        <>
                          <span className="px-2 py-1 bg-[#f6e4e9] text-pink-500 rounded">
                            {item?.materialType}
                          </span>
                          <span className="px-2 py-1 bg-orange-100 text-yellow-700 rounded">
                            Selected Line: {item?.qty}
                          </span>
                          <span className="px-2 py-1 bg-orange-100 text-yellow-700 rounded">
                            {item?.size}
                          </span>
                        </>
                      ) : (
                        <span className="px-4 py-1 bg-[#f6e4e9] text-pink-500 rounded">
                          {item?.productCategory || item?.productType}
                        </span>
                      )}
                    </div>

                    {item?.materialType === "Beads" ? (
                      // Beads line selection
                      <div className="flex items-center space-x-2 mt-4">
                        <span className="text-xs text-gray-700">
                          Select Lines:
                        </span>
                        <select
                          value={item.qty}
                          onChange={(e) => handleLineSelection(item, e)}
                          className="px-2 py-1 rounded-md border border-pink-500"
                        >
                          {Array.from(
                            { length: item.inventory_no_of_line },
                            (_, i) => (
                              <option key={i} value={i + 1}>
                                {i + 1} Line{i + 1 > 1 ? "s" : ""}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    ) : (
                      // Non-Beads item quantity control
                      <div className="flex items-center border bg-[#FFF6F8] shadow-md border border-pink-500 w-max mt-1">
                        <button
                          className="w-12 h-10 text-pink-500 text-2xl font-semibold flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-200 disabled:opacity-50"
                          type="button"
                          onClick={() => decrease(item)}
                          disabled={item.qty === 0}
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
                            (parseInt(item.countInStock as unknown as string) ||
                              0)
                          }
                        >
                          +
                        </button>
                      </div>
                    )}
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
                    <button
                      onClick={() => removeItem(item)}
                      className="ml-2 border border-red-400 text-red-400 hover:text-red-500 hover:border-red-500 rounded-sm p-1 bg-white shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>

                    {/* ❌ Delete Icon */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Order Summary Section */}
          <div className="p-3 bg-white shadow-md border border-[#eaeaea] min-h-[200px] flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Order Summary
            </h2>

            {/* Price Summary */}
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>SubTotal</span>
                <span>
                  ₹{" "}
                  {new Intl.NumberFormat("en-IN").format(
                    items
                      .map((item) =>
                        item.materialType === "Beads"
                          ? item.pricePerLine * item.qty
                          : item.price * item.qty
                      )
                      .reduce((acc, curr) => acc + curr, 0)
                      .toFixed(2)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-red-500">
                  - ₹ {discountPrice.toFixed(2)}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between">
                  <span>Coupon Discount</span>
                  <span className="text-red-500">- ₹ {couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            {/* Toggle for Price Breakdown */}
            <div className="mt-4 border-t pt-3">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setPriceBreakupVisible(!priceBreakupVisible)}
              >
                <span className="text-sm font-medium text-pink-400">
                  View Price Breakdown
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 text-gray-400 ${
                    priceBreakupVisible ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {priceBreakupVisible && (
                <ul className="mt-3 space-y-2 text-xs text-gray-600">
                  {items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-[10px] text-gray-400">
                          Unit: ₹{" "}
                          {item.materialType === "Beads"
                            ? item.pricePerLine.toFixed(2)
                            : item.price?.toFixed(2)}
                        </span>
                      </div>
                      <span>
                        ₹{" "}
                        {item.materialType === "Beads"
                          ? (item.pricePerLine * item.qty).toFixed(2)
                          : (item.price * item.qty).toFixed(2)}{" "}
                        <span className="text-[10px] text-gray-400">
                          (x{item.qty})
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Grand Total */}
            <div className="flex justify-between text-xl font-semibold border-t pt-4 mt-4">
              <span>Total</span>
              <span>
                ₹{" "}
                {new Intl.NumberFormat("en-IN").format(
                  items
                    .map((item) =>
                      item.materialType === "Beads"
                        ? item.pricePerLine * item.qty
                        : item.price * item.qty
                    )
                    .reduce((acc, curr) => acc + curr, 0)
                    .toFixed(2)
                )}
              </span>
            </div>

            {/* Coupon Actions */}
            <div className="mt-4">
              {couponCode && (
                <button
                  className="px-4 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={handleRemoveCoupon}
                >
                  Remove Coupon
                </button>
              )}
              {couponDiscount > 0 && (
                <div className="mt-2 text-green-600 text-[10px] font-medium flex items-center gap-2">
                  <Tag className="w-3 h-3 text-green-500" />
                  Coupon Applied! ₹{couponDiscount} Discount.
                </div>
              )}
            </div>

            {/* Push Checkout Button to Bottom */}
            <div className="mt-auto" />

            {/* Checkout Button */}
            <button
              type="button"
              disabled={checkoutLoading}
              className="w-full mt-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#f87ea1] to-pink-500 hover:from-[#f69db6] hover:to-[#ed2e91] transition duration-300 flex justify-center items-center group overflow-hidden relative"
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
                <span className="relative">
                  <span className="block transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-0">
                    PROCEED TO CHECKOUT
                  </span>
                  <span className="absolute inset-0 block transition-all duration-300 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    Let’s Proceed →
                  </span>
                </span>
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
