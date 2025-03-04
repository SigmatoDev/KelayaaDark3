import mongoose, { Document, Schema, model, models } from "mongoose";

// Define TypeScript Interface for Type Safety
export interface IGoldPrice extends Document {
  karat: "18K" | "22K" | "24K";
  price: number;
  previousPrice?: number;
  percentageChange?: number;
  timestamp: Date; // First insertion time
  updatedAt: Date; // Tracks when price was last updated
}

// Define Mongoose Schema
const GoldPriceSchema = new Schema<IGoldPrice>(
  {
    karat: { type: String, enum: ["18K", "22K", "24K"], required: true },
    price: { type: Number, required: true },
    previousPrice: { type: Number, default: null },
    percentageChange: { type: Number, default: null },
    timestamp: { type: Date, default: Date.now }, // Creation time
  },
  { timestamps: true } // This adds `createdAt` and `updatedAt`
);

// Export Mongoose Model
const GoldPrice =
  models.GoldPrice || model<IGoldPrice>("GoldPrice", GoldPriceSchema);

export default GoldPrice;
