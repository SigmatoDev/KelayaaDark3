import mongoose from "mongoose";

const AdminSettingsSchema = new mongoose.Schema(
  {
    adminEmail: { type: String, default: "" },
    adminPassword: { type: String, default: "" },

    brevo: {
      abandonedCartEmail: { type: String, default: "" },
      orderStatusEmail: { type: String, default: "" },
      adminOrderEmails: { type: [String], default: [] },
      customerJewelrySenderEmail: { type: String, default: "" },
      customerJewelryRecipientEmails: { type: [String], default: [] },
      notificationEmail: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.AdminSettings ||
  mongoose.model("AdminSettings", AdminSettingsSchema);
