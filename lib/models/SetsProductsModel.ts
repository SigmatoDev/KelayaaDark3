import mongoose from "mongoose";

const PricingSchema = new mongoose.Schema(
  {
    diamondPrice: Number,
    goldPrice: Number,
    grossWeight: Number,
    pricePerGram: Number,
    makingCharges: Number,
    diamondTotal: Number,
    goldTotal: Number,
    totalPrice: Number,
  },
  { _id: false }
);

const ItemSchema = new mongoose.Schema(
  {
    productCategory: String,
    gemCut: String,
    carats: Number,
    clarity: String,
    color: String,
    goldPurity: String,
    pricing: PricingSchema,
  },
  { _id: false }
);

const SetsProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    productCode: { type: String, unique: true, required: true },
    slug: { type: String, unique: true, required: true },
    description: String,
    image: String,
    images: [String],
    subCategories: [String],
    items: [ItemSchema],
    countInStock: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    productType: { type: String, default: "Sets" },
    materialType: { type: String, default: "gold" },
    collectionType: String,
  },
  { timestamps: true }
);

const SetsProductModel =
  mongoose.models.SetsProduct ||
  mongoose.model("SetsProduct", SetsProductSchema);

export default SetsProductModel;
