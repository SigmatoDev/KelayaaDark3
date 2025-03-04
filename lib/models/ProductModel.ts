import mongoose from "mongoose";

export type Product = {
  _id?: string;
  name: string;
  productCode: string;
  weight: string;
  price_per_gram: string;
  info: string;
  slug: string;
  image: string;
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
    image: { type: String },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;
