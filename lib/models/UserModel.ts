import mongoose from "mongoose";

export type User = {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  password?: string;
  isAdmin: boolean;
  provider: string;
  userType: "registered" | "guest";
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: function (this: any) {
        return this.userType !== "guest";
      },
    },
    mobileNumber: {
      type: String,
      required: function (this: any) {
        return this.userType !== "guest" && !this.isAdmin;
      },
    },
    password: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
      enum: ["registered", "guest"],
      default: "registered",
    },
  },
  { timestamps: true }
);

// ✅ Enforce uniqueness ONLY for registered users
UserSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { userType: { $ne: "guest" } } }
);
UserSchema.index(
  { mobileNumber: 1 },
  { unique: true, partialFilterExpression: { userType: { $ne: "guest" } } }
);

const UserModel = mongoose.models?.User || mongoose.model("User", UserSchema);

export default UserModel;
