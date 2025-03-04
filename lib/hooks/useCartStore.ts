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
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  paymentStatus: "pending" | "success" | "failed";
  lastOrderId: string;
  discountPrice: number; // Store discount price
  couponDiscount: number;
  couponCode: string;
  // Add function types
  init: () => void;
  increase: (item: OrderItem) => void;
  decrease: (item: OrderItem) => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  saveShippingAddress: (address: ShippingAddress) => void;
  savePaymentMethod: (method: string) => void;
  setPaymentStatus: (status: "pending" | "success" | "failed") => void;
  setLastOrderId: (id: string) => void;
  clear: () => void;
};

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
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
  discountPrice: 0, // Initial discount price is 0
  couponDiscount: 0,
  couponCode: "",
  init: () => {},
  increase: () => {},
  decrease: () => {},
  applyCoupon: () => {},
  removeCoupon: () => {},
  saveShippingAddress: () => {},
  savePaymentMethod: () => {},
  setPaymentStatus: () => {},
  setLastOrderId: () => {},
  clear: () => {},
};

export const cartStore = create<Cart>()(
  persist(() => initialState, {
    name: "cartStore",
  })
);

const useCartService = create<Cart>((set, get) => ({
  ...initialState,
  init: () => set({ 
    items: [],
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    paymentMethod: '',
    shippingAddress: {} as ShippingAddress,
  }),
  increase: (item: OrderItem) => {
    const exist = get().items.find((x) => x.slug === item.slug);
    const updatedCartItems = exist
      ? get().items.map((x) =>
          x.slug === item.slug ? { ...exist, qty: exist.qty + 1 } : x
        )
      : [...get().items, { ...item, qty: 1 }];
    set({ items: updatedCartItems });
  },
  decrease: (item: OrderItem) => {
    const exist = get().items.find((x) => x.slug === item.slug);
    if (!exist) return;

    const updatedCartItems =
      exist.qty === 1
        ? get().items.filter((x) => x.slug !== item.slug)
        : get().items.map((x) =>
            x.slug === item.slug ? { ...exist, qty: exist.qty - 1 } : x
          );

    set({ items: updatedCartItems });
  },
  applyCoupon: (code: string) => {
    const { itemsPrice } = get();
    let discount = 0;

    if (code === "FIRST500" && itemsPrice >= 1000) {
      discount = 500;
    } else if (code === "WELCOME200" && itemsPrice >= 500) {
      discount = 200;
    } else {
      return;
    }

    set({ couponCode: code, couponDiscount: discount });

    // Update discountPrice (if you have conditions for it)
    const discountPrice = itemsPrice >= 2500 ? itemsPrice * 0.1 : 0;
    set({ discountPrice });

    updateCart(get().items);
  },
  removeCoupon: () => {
    set({
      couponCode: "",
      couponDiscount: 0,
      discountPrice: 0,
    });
    updateCart(get().items);
  },
  saveShippingAddress: (shippingAddress: ShippingAddress) => {
    set({ shippingAddress });
  },
  savePaymentMethod: (paymentMethod: string) => {
    set({ paymentMethod });
  },
  setPaymentStatus: (status: "pending" | "success" | "failed") => {
    set({ paymentStatus: status });
  },
  setLastOrderId: (lastOrderId: string) => {
    set({ lastOrderId });
  },
  clear: () => {
    set({
      ...initialState,
      paymentStatus: "pending",
    });
  },
}));

export default useCartService;

const updateCart = (items: OrderItem[]) => {
  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(items);
  cartStore.setState({
    items,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
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
