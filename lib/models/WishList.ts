import { Schema, model, models, Types } from "mongoose";

const WishlistSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    productIds: [{ type: Types.ObjectId, ref: "Product" }], // ✅ Fix: Remove `required: true`
  },
  { timestamps: true }
);

const Wishlist = models.Wishlist || model("Wishlist", WishlistSchema);
export default Wishlist;
