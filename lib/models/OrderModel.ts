import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    personalInfo: {
      email: { type: String, required: true },
      mobileNumber: { type: String, required: true },
      createAccountAfterCheckout: { type: Boolean, default: false },
    },
    shippingAddress: {
      address: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    
    gstDetails: {
      hasGST: { type: Boolean, required: true },
      companyName: { type: String },
      gstNumber: { type: String },
    },
    billingDetails: {
      sameAsShipping: { type: Boolean, default: true },
      firstName: { type: String },
      lastName: { type: String },
      address: { type: String },
      landmark:{ type: String },
      country: { type: String },
      state: { type: String },
      city: { type: String },
      postalCode: { type: String },
    },

    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    paymentIntentId: { type: String },
  },
  {
    timestamps: true,
  }
);

const OrderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;

// Updated TypeScript Types
export type Order = {
  _id: string;
  user?: { name: string };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingDetails: BillingDetails;
  personalInfo: PersonalInfo;
  gstDetails: GstDetails;
  paymentMethod: string;
  paymentResult?: { id: string; status: string; email_address: string };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  paymentIntentId: string;
};

export type OrderItem = {
  countInStock: number;
  productCategory: string;
  category: string;
  name: string;
  slug: string;
  qty: number;
  image: string;
  price: number;
  color?: string;
  size?: string;
  productCode: string;
  productType: string;
  ring_size?: string;
};

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  address: string;
  landmark?: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
};

export type BillingDetails = ShippingAddress & {
  sameAsShipping: boolean;
  firstName?: string;
  lastName?: string;
  address?: string;
  landmark: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
};

export type PersonalInfo = {
  email: string;
  mobileNumber: string;
  password?: string; // ✅ Added
  createAccountAfterCheckout: boolean;
};


export type GstDetails = {
  hasGST: boolean;
  companyName?: string;
  gstNumber?: string;
};
