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
  ring_size?: string;
  quantity?: string;
  size?: string;
  isFeatured: boolean;
};

const productSchema = new mongoose.Schema<Product>(
  {
    name: { type: String },
    productCode: { type: String },
    weight: { type: String },
    price_per_gram: { type: String },
    info: { type: String },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: { type: String },
    productCategory: { type: String },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
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
    subCategories: { type: String },
    productType: { type: String },
    ring_size: {
      type: String,
      validate: {
        validator: function (this: mongoose.Document & Product, value: string) {
          if (value && this.productCategory) {
            const cat = this.productCategory.toLowerCase();
            return cat === "ring" || cat === "rings";
          }
          return !value;
        },
        message:
          "ring_size is only allowed when productCategory is 'Ring' or 'Rings'",
      },
    },
    quantity: {
      type: String,
      validate: {
        validator: function (this: mongoose.Document & Product, value: string) {
          if (value && this.productCategory) {
            const cat = this.productCategory.toLowerCase();
            return cat === "bangles";
          }
          return !value;
        },
        message: "quantity is only allowed when productCategory is 'bangles'",
      },
    },
    size: {
      type: String,
      validate: {
        validator: function (this: mongoose.Document & Product, value: string) {
          if (value && this.productCategory) {
            const cat = this.productCategory.toLowerCase();
            return (
              cat === "bangles" || cat === "bangle" || cat === "bangle pair"
            );
          }
          return !value;
        },
        message: "size is only allowed when productCategory is 'bangles'",
      },
    },
  },
  { timestamps: true }
);

const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;
