import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: String,
    productCode: String,
    productType: String,
    gemCut: String,
    ringSize: Number,
    carats: Number,
    diamondPrice: Number,
    clarity: String,
    color: String,
    goldPurity: String,
    goldPrice: Number,
    grossWeight: Number,
    pricePerGram: Number,
    makingCharge: Number,
    diamondTotal: Number,
    goldTotal: Number,
    totalPrice: Number,
    size: String,
  },
  { timestamps: true }
);

// Ensure the model is only compiled once
const GoldDiamondProductPricingModel =
  mongoose.models.GoldDiamondProductPricing ||
  mongoose.model("GoldDiamondProductPricing", productSchema);

export default GoldDiamondProductPricingModel;
