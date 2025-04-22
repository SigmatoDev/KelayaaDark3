import mongoose from "mongoose";

export type User = {
  _id: string;
  name: string;
  email: string;
  password?: string; // Optional for OAuth users
  isAdmin: boolean;
  provider: string; // Track if user registered via Google
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String, // Remove `required: true` to allow OAuth users
    },
    provider: {
      type: String,
      enum: ["credentials", "google"], // Track login method
      default: "credentials",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models?.User || mongoose.model("User", UserSchema);

export default UserModel;
