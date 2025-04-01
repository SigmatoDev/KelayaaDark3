import mongoose from "mongoose";

export type Product = {
  _id?: string;
  name: string;
  productCode: string;
  weight?: string;
  price_per_gram?: string;
  info?: string;
  slug?: string;
  image?: string;
  images: string[];
  price: number;
  description: string;
  category?: string;
  productCategory?: string;
  countInStock: number;
  materialType?: string;
  gemCut?: string;
  carats?: string;
  clarity?: string;
  color?: string;
  goldPurity?: string;
  subCategories?: string;
  productType?: string;
};

const productSchema = new mongoose.Schema(
  {
    name: { type: String },
    productCode: { type: String },
    weight: { type: String },
    price_per_gram: { type: String },
    info: { type: String },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    category: { type: String },
    productCategory: { type: String },
    image: { type: String, default: "" }, // ✅ Keeps backward compatibility
    images: { type: [String], default: [] }, // ✅ Supports multiple images
    price: { type: Number, default: 0 },
    description: { type: String },
    countInStock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    materialType: { type: String },
    gemCut: { type: String },
    carats: { type: String },
    clarity: { type: String },
    color: { type: String },
    goldPurity: { type: String },
    subCategories: {
      type: String,
      // enum: [
      //   "Cocktail",
      //   "Cocktail/Engagement",
      //   "Dailywear",
      //   "Dailywear/Engagement",
      // ],
    },
    productType: { type: String },
  },
  { timestamps: true }
);

const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;
