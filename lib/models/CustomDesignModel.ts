import mongoose from "mongoose";

const customDesignSchema = new mongoose.Schema(
  {
    gender: { type: String, required: true },
    contactNumber: { type: String, required: true },
    countryCode: { type: String, required: true },
    jewelryType: { type: String, required: true },
    metalType: { type: String, required: true },
    budget: { type: Number, required: true },
    occasion: { type: String, required: true },
    designDetails: { type: String, required: false }, // Optional text for design details
    customImage: { type: String, required: false }, // Optional image for design
    stoneType: { type: String },
    diamondType: { type: String },
    gemstoneType: { type: String },
    semiPreciousType: { type: String },
    additionalDetails: { type: String },
    appointmentDate: { type: Date, default: null },
    personalConsultation: { type: Boolean, required: true },
    termsAccepted: { type: Boolean, required: true },
    goldKarat: { type: String },
  },
  { timestamps: true }
);

const CustomDesignModel =
  mongoose.models.CustomDesign ||
  mongoose.model("CustomDesign", customDesignSchema);

export default CustomDesignModel;
