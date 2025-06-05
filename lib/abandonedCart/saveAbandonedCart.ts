import { Types } from "mongoose";
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

  await AbandonedCart.findOneAndUpdate(
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
      updatedAt: new Date(), // ✅ Ensure updatedAt is refreshed
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true, // ✅ Important for default fields like isRecovered, reminderCount
    }
  );
};
