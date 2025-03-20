import mongoose from "mongoose";

export type Product = {
  filter(arg0: (product: any) => boolean): unknown;
  _id?: string;
  name: string;
  productCode: string;
  weight: string;
  price_per_gram: string;
  info: string;
  slug: string;
  image: string;
  images: string[]; // ✅ Changed from `image: string` to `images: string[]`
  price: number;
  description: string;
  category: string;
  productCategory: string;
  countInStock: number;
};

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    productCode: { type: String, required: true },
    weight: { type: String, required: true },
    price_per_gram: { type: String, required: true },
    info: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String },
    productCategory: { type: String, required: true },
    image: { type: String }, // Keeping single image for backward compatibility
    images: { type: [String], default: [] }, // ✅ Add this for multiple images
    price: { type: Number, required: true },
    description: { type: String, required: true },
    countInStock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;
