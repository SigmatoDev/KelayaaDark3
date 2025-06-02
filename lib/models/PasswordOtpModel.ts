import mongoose, { Schema, models } from "mongoose";

const PasswordOtpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index
  },
  { timestamps: true }
);

// The `expires: 0` means MongoDB will delete the document as soon as the expiresAt time passes

export default models.PasswordOtp ||
  mongoose.model("PasswordOtp", PasswordOtpSchema);
