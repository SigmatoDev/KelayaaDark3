"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ShippingAddress } from "../models/OrderModel";
import { round2 } from "../utils";

// ✅ Corrected CartItem with _id
type CartItem = {
  materialType: string;
  pricePerLine: any;
  _id: string;
  name: string;
  slug: string;
  qty: number;
  price: number;
  image: string;
  color?: string;
  size?: string;
  productCode: string;
  productType: string;
  ring_size?: string;
  countInStock: number;
  productCategory: string;
  category: string;
  basePrice: number;
};

type Cart = {
  items: CartItem[];
  originalItemsPrice: number;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  totalPriceAfterCheckout: number;
  totalCartQuantity: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  paymentStatus: "pending" | "success" | "failed";
  lastOrderId: string;
  discountPrice: number;
  couponDiscount: number;
  couponCode: string;
  gstDetails: {
    hasGST: boolean;
    companyName: string;
    gstNumber: string;
  };
  personalInfo: {
    mobileNumber: string;
    email: string;
  };
};

const initialState: Cart = {
  items: [],
  originalItemsPrice: 0,
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  totalPriceAfterCheckout: 0,
  totalCartQuantity: 0,
  paymentMethod: "Razorpay",
  shippingAddress: {
    firstName: "",
    lastName: "",
    address: "",
    landmark: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
  },
  billingAddress: {
    firstName: "",
    lastName: "",
    address: "",
    landmark: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
  },
  paymentStatus: "pending",
  lastOrderId: "",
  discountPrice: 0,
  couponDiscount: 0,
  couponCode: "",
  gstDetails: {
    hasGST: false,
    companyName: "",
    gstNumber: "",
  },
  personalInfo: {
    mobileNumber: "",
    email: "",
  },
};

export const cartStore = create<Cart>()(
  persist(() => initialState, {
    name: "cartStore",
  })
);

const useCartService = () => {
  const {
    items,
    originalItemsPrice,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    totalPriceAfterCheckout,
    totalCartQuantity,
    paymentMethod,
    shippingAddress,
    billingAddress,
    paymentStatus,
    lastOrderId,
    discountPrice,
    couponDiscount,
    couponCode,
    gstDetails,
    personalInfo,
  } = cartStore();

  return {
    items,
    originalItemsPrice,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    totalPriceAfterCheckout,
    totalCartQuantity,
    paymentMethod,
    shippingAddress,
    billingAddress,
    paymentStatus,
    lastOrderId,
    discountPrice,
    couponDiscount,
    couponCode,
    gstDetails,
    personalInfo,

    // Add item or increase quantity
    increase: (item: CartItem) => {
      const exist = items.find((x) => x.slug === item.slug);
      const updatedCartItems = exist
        ? items.map((x) =>
            x.slug === item.slug ? { ...x, qty: x.qty + 1 } : x
          )
        : [...items, { ...item, qty: 1, basePrice: item.price }];
      updateCart(updatedCartItems);
    },

    // Decrease quantity or remove item
    decrease: (item: CartItem) => {
      const exist = items.find((x) => x.slug === item.slug);
      if (!exist) return;

      const updatedCartItems =
        exist.qty === 1
          ? items.filter((x) => x.slug !== item.slug)
          : items.map((x) =>
              x.slug === item.slug ? { ...x, qty: x.qty - 1 } : x
            );
      updateCart(updatedCartItems);
    },

    applyCoupon: (code: string) => {
      const { itemsPrice } = cartStore.getState();
      let discount = 0;

      if (code === "FIRST500" && itemsPrice >= 1000) {
        discount = 500;
      } else if (code === "WELCOME200" && itemsPrice >= 500) {
        discount = 200;
      } else {
        return;
      }

      cartStore.setState({ couponCode: code, couponDiscount: discount });

      const discountPrice = itemsPrice >= 2500 ? itemsPrice * 0.1 : 0;
      cartStore.setState({ discountPrice });

      const { items } = cartStore.getState();
      updateCart(items);
    },

    removeCoupon: () => {
      cartStore.setState({
        couponCode: "",
        couponDiscount: 0,
        discountPrice: 0,
      });
      const { items } = cartStore.getState();
      updateCart(items);
    },

    saveGSTDetails: (gst: {
      hasGST: boolean;
      companyName: string;
      gstNumber: string;
    }) => {
      cartStore.setState({ gstDetails: gst });
    },

    savePersonalInfo: (info: { mobileNumber: string; email: string }) => {
      cartStore.setState({ personalInfo: info });
    },

    saveShippingAddress: (shippingAddress: ShippingAddress) => {
      cartStore.setState({ shippingAddress });
    },

    savePaymentMethod: (paymentMethod: string) => {
      cartStore.setState({ paymentMethod });
    },

    setPaymentStatus: (status: "pending" | "success" | "failed") => {
      cartStore.setState({ paymentStatus: status });
    },

    setLastOrderId: (lastOrderId: string) => {
      cartStore.setState({ lastOrderId });
    },

    setTotalPriceAfterCheckout: (amount: number) => {
      cartStore.setState({ totalPriceAfterCheckout: amount });
    },

    saveBillingAddress: (billingAddress: ShippingAddress) => {
      cartStore.setState({ billingAddress });
    },

    clear: () => {
      cartStore.setState({
        ...initialState,
        paymentStatus: "pending",
      });
    },
  };
};

export default useCartService;

// ⛏ Internal function to update price
// ⛏ Internal function to update price
const updateCart = (items: CartItem[]) => {
  const {
    itemsPrice: newItemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = calcPrice(items);

  // Adjust price calculation for Beads products based on materialType
  const originalItemsPrice = round2(
    items.reduce((acc, item) => {
      // Use pricePerLine if materialType is 'beads'
      const price =
        item.materialType === "Beads" ? item.pricePerLine : item.basePrice;
      return acc + price * item.qty;
    }, 0)
  );

  const totalCartQuantity = items.reduce((acc, item) => acc + item.qty, 0);

  cartStore.setState({
    items,
    originalItemsPrice,
    itemsPrice: newItemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    totalCartQuantity,
  });
};

// ⛏ Internal function to calculate cart total
export const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => {
      // Adjust price for Beads products based on materialType
      const price =
        item.materialType === "Beads" ? item.pricePerLine : item.price;
      return acc + price * item.qty;
    }, 0)
  );

  const shippingPrice = round2(itemsPrice > 100 ? 0 : 100);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = Math.round(
    itemsPrice +
      shippingPrice +
      taxPrice -
      cartStore.getState().couponDiscount -
      cartStore.getState().discountPrice
  );

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};
