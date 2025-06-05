"use server"; // ✅ Only if this is called from server actions, otherwise remove it

import { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect"; // ✅ Ensure DB is connected before using Mongoose
import AbandonedCart from "../models/AbondenCart";

export const saveAbandonedCart = async ({
  userId,
  cartItems,
  totalPrice,
}: {
  userId: string;
  cartItems: any[];
  totalPrice: number;
}) => {
  if (!userId || cartItems.length === 0) return;

  await dbConnect(); // ✅ Required to make MongoDB calls

  console.log("🛒 Saving abandoned cart for user:", userId);

  const result = await AbandonedCart.findOneAndUpdate(
    { userId, isRecovered: false },
    {
      userId,
      items: cartItems.map((item) => ({
        productId: new Types.ObjectId(item._id),
        productType: item.productType,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
      })),
      totalPrice,
      updatedAt: new Date(),
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log("✅ Abandoned cart saved:", result._id);
};
