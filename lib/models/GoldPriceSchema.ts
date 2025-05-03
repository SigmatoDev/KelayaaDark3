import mongoose, { Document, Schema, model, models } from "mongoose";

// Define TypeScript Interface for Type Safety
export interface IGoldPrice extends Document {
  karat: "14K" | "18K" | "22K" | "24K"; // ⬅️ Added "14K"
  price: number;
  previousPrice?: number;
  percentageChange?: number;
  timestamp: Date; // First insertion time
  updatedAt: Date; // Tracks when price was last updated
}

// Define Mongoose Schema
const GoldPriceSchema = new Schema<IGoldPrice>(
  {
    karat: {
      type: String,
      enum: ["14K", "18K", "22K", "24K"], // ⬅️ Included "14K"
      required: true,
    },
    price: { type: Number, required: true },
    previousPrice: { type: Number, default: null },
    percentageChange: { type: Number, default: null },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Export Mongoose Model
const GoldPrice =
  models.GoldPrice || model<IGoldPrice>("GoldPrice", GoldPriceSchema);

export default GoldPrice;
