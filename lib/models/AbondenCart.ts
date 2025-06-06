import mongoose from "mongoose";

const AbandonedCartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        productType: {
          type: String,
          enum: ["gold", "silver", "Beads"],
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    lastReminderSentAt: { type: Date, default: null },
    reminderCount: { type: Number, default: 0 },
    isRecovered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Safely define the model
const AbandonedCart =
  mongoose.models?.AbandonedCart ||
  mongoose.model("AbandonedCart", AbandonedCartSchema);

export default AbandonedCart;
