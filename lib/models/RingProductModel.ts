import mongoose from 'mongoose';

// Define the structure of a RingProduct document
export type RingProduct = {
  _id?: string;
  productId: mongoose.Schema.Types.ObjectId; // Reference to Product
  ringSize: string;
  grossWeight: number;
  goldWeight: number;
};

// Define the schema for RingProduct
const ringProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // References the Product collection
      required: true,
    },
    ringSize: {
      type: String,
      required: true, // Ensure ring size is mandatory
    },
    grossWeight: {
      type: Number,
      required: true, // Ensure gross weight is mandatory
    },
    goldWeight: {
      type: Number,
      required: true, // Ensure gold weight is mandatory
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

// Create or retrieve the RingProduct model
const RingProductModel =
  mongoose.models.RingProduct || mongoose.model('RingProduct', ringProductSchema);

export default RingProductModel;
