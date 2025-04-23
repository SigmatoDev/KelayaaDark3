import mongoose from "mongoose";

export type BeadsProduct = {
  _id: string;
  slNo: number;
  name: string;
  productCode: string;
  netWeightCarat: number;
  // price: number;
  size: string;
  length: string;
  info: string;
  inventory_no_of_line: number;
  countInStock: number;
  pricePerLine: number;
  images: string[]; // array of image numbers
  image: string; // primary image
  materialType: string;
};

const BeadsProductSchema = new mongoose.Schema<BeadsProduct>(
  {
    name: { type: String, required: true },
    productCode: { type: String, required: true },
    netWeightCarat: { type: Number, required: true },
    // price: { type: Number, required: true },
    size: { type: String },
    length: { type: String },
    info: { type: String },
    inventory_no_of_line: { type: Number },
    countInStock: { type: Number },
    pricePerLine: { type: Number },
    image: { type: String }, // First image
    images: [{ type: String }], // All images
    materialType: { type: String, default: "Beads" },
  },
  { timestamps: true }
);

const BeadsProductModel =
  mongoose.models?.BeadsProduct ||
  mongoose.model<BeadsProduct>("BeadsProduct", BeadsProductSchema);

export default BeadsProductModel;
