import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String },
    status: {
      type: String,
      enum: [
        "processing",
        "shipped",
        "out-for-delivery",
        "completed",
        "cancelled",
        "failed",
      ],
      default: "processing",
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "processing",
            "shipped",
            "out-for-delivery",
            "completed",
            "cancelled",
            "failed",
          ],
        },
        note: { type: String }, // Optional admin message or system note
        changedAt: { type: Date, default: Date.now },
        changedBy: {
          _id: { type: String }, // or mongoose.Schema.Types.ObjectId
          name: { type: String },
          email: { type: String },
        },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    items: [
      {
        productId: {
          type: String,
          required: false,
        },
        name: { type: String, required: false },
        slug: { type: String, required: false },
        qty: { type: Number, required: false },
        image: { type: String, required: false },
        price: { type: Number, required: false },
      },
    ],
    personalInfo: {
      fullName: { type: String, required: false },
      email: { type: String, required: false },
      mobileNumber: { type: String, required: false },
      createAccountAfterCheckout: { type: Boolean, default: false },
    },
    shippingAddress: {
      address: { type: String, required: false },
      landmark: { type: String },
      city: { type: String, required: false },
      state: { type: String, required: false },
      postalCode: { type: String, required: false },
      country: { type: String, required: false, default: "India" },
      email: { type: String },
      mobileNumber: { type: String },
    },

    gstDetails: {
      hasGST: { type: Boolean, required: false },
      companyName: { type: String },
      gstNumber: { type: String },
      gstMobileNumber: { type: String }, // new optional field for GST mobile number
      gstEmail: { type: String }, // new optional field for GST email
    },

    billingDetails: {
      sameAsShipping: { type: Boolean, default: true },
      firstName: { type: String },
      lastName: { type: String },
      address: { type: String },
      landmark: { type: String },
      country: { type: String, default: "India" },
      state: { type: String },
      city: { type: String },
      postalCode: { type: String },
    },

    paymentMethod: { type: String, required: false },
    paymentResult: {
      status: String,
      transactionId: String,
    },
    itemsPrice: { type: Number, required: false },
    shippingPrice: { type: Number, required: false },
    taxPrice: { type: Number, required: false },
    totalPrice: { type: Number, required: false },
    isPaid: { type: Boolean, required: false, default: false },
    isDelivered: { type: Boolean, required: false, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    paymentIntentId: { type: String },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    unique_txn_id: {
      type: String,
    },
    invoice_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Attach pre-save hook BEFORE compiling model
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORDER_${Date.now()}`;
  }
  next();
});

// ✅ Attach pre-save hook BEFORE compiling model
orderSchema.pre("save", function (next) {
  if (!this.invoice_id) {
    this.invoice_id = `IN_${Date.now()}`;
  }
  next();
});

orderSchema.pre("save", function (next) {
  if (
    this.isNew &&
    this.status === "processing" &&
    this.statusHistory.length === 0
  ) {
    this.statusHistory.push({
      status: "processing",
      note: "Order placed successfully",
      changedAt: new Date(),
    });
  }
  next();
});

const OrderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;

// Updated TypeScript Types
export type Order = {
  status: string;
  updatedAt: string | number | Date;
  orderNumber: string;
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
  invoice_id: string;
};

export type OrderItem = {
  product: any;
  _id: string;
  materialType: string;
  inventory_no_of_lines: number;
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
  pricePerLine?: number;
  inventory_no_of_line?: number;
};

export type ShippingAddress = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  landmark?: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  email: string;
  mobileNumber: string;
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
  fullName: string;
  email: string;
  mobileNumber: string;
  password?: string; // ✅ Added
  createAccountAfterCheckout: boolean;
};

export type GstDetails = {
  hasGST: boolean;
  companyName?: string;
  gstNumber?: string;
  gstMobileNumber?: string; // new optional field for GST mobile number
  gstEmail?: string; // new optional field for GST email
};
