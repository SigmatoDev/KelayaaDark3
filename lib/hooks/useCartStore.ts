import { create } from "zustand";
import { persist } from "zustand/middleware";

import { OrderItem, ShippingAddress } from "../models/OrderModel";
import { round2 } from "../utils";

type Cart = {
  items: OrderItem[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  totalCartQuantity: number; // ✅ New: Store total quantity
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  paymentStatus: "pending" | "success" | "failed";
  lastOrderId: string;
  discountPrice: number;
  couponDiscount: number;
  couponCode: string;
};

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  totalCartQuantity: 0, // ✅ Initial total quantity is 0
  paymentMethod: "Stripe",
  shippingAddress: {
    firstName: "",
    lastName: "",
    streetAddress1: "",
    streetAddress2: "",
    streetAddress3: "",
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
};

export const cartStore = create<Cart>()(
  persist(() => initialState, {
    name: "cartStore",
  })
);

const useCartService = () => {
  const {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    totalCartQuantity, // ✅ Added to return cart quantity
    paymentMethod,
    shippingAddress,
    paymentStatus,
    lastOrderId,
    discountPrice,
    couponDiscount,
    couponCode,
  } = cartStore();

  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    totalCartQuantity, // ✅ Include total quantity
    paymentMethod,
    shippingAddress,
    paymentStatus,
    lastOrderId,
    discountPrice,
    couponDiscount,
    couponCode,

    increase: (item: OrderItem) => {
      const exist = items.find((x) => x.slug === item.slug);
      const updatedCartItems = exist
        ? items.map((x) =>
            x.slug === item.slug ? { ...exist, qty: exist.qty + 1 } : x
          )
        : [...items, { ...item, qty: 1 }];

      updateCart(updatedCartItems);
    },

    decrease: (item: OrderItem) => {
      const exist = items.find((x) => x.slug === item.slug);
      if (!exist) return;

      const updatedCartItems =
        exist.qty === 1
          ? items.filter((x) => x.slug !== item.slug)
          : items.map((x) =>
              x.slug === item.slug ? { ...exist, qty: exist.qty - 1 } : x
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

      updateCart(items);
    },

    removeCoupon: () => {
      cartStore.setState({
        couponCode: "",
        couponDiscount: 0,
        discountPrice: 0,
      });
      updateCart(items);
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

    clear: () => {
      cartStore.setState({
        ...initialState,
        paymentStatus: "pending",
      });
    },
  };
};

export default useCartService;

const updateCart = (items: OrderItem[]) => {
  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(items);

  // ✅ Calculate total quantity
  const totalCartQuantity = items.reduce((acc, item) => acc + item.qty, 0);

  cartStore.setState({
    items,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    totalCartQuantity, // ✅ Update total quantity in state
  });
};

export const calcPrice = (items: OrderItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 100);
  const taxPrice = round2(Number(0.15 * itemsPrice));
  const totalPrice = Math.round(
    itemsPrice +
      shippingPrice +
      taxPrice -
      cartStore.getState().couponDiscount -
      cartStore.getState().discountPrice
  );

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};
