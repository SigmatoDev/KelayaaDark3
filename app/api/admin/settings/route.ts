import dbConnect from "@/lib/dbConnect";
import AdminSettings from "@/lib/models/AdminSettings";
import UserModel from "@/lib/models/UserModel";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  await dbConnect();
  const data = await req.json();

  try {
    let settings = await AdminSettings.findOne();

    let hashedPassword: string | undefined;
    if (data.adminPassword) {
      hashedPassword = await bcrypt.hash(data.adminPassword, 10);
      data.adminPassword = hashedPassword;
    }

    if (data.brevo) {
      data.brevo = {
        abandonedCartEmail: data.brevo.abandonedCartEmail || "",
        orderStatusEmail: data.brevo.orderStatusEmail || "",
        adminOrderEmails: Array.isArray(data.brevo.adminOrderEmails)
          ? data.brevo.adminOrderEmails
          : [],
        customerJewelrySenderEmail: data.brevo.customerJewelrySenderEmail || "",
        customerJewelryRecipientEmails: Array.isArray(
          data.brevo.customerJewelryRecipientEmails
        )
          ? data.brevo.customerJewelryRecipientEmails
          : [],
        notificationEmail: data.brevo.notificationEmail || "",
      };
    }

    if (!settings) {
      settings = await AdminSettings.create(data);
    } else {
      if (data.adminEmail !== undefined) {
        settings.adminEmail = data.adminEmail;
      }
      if (data.adminPassword !== undefined && data.adminPassword !== "") {
        settings.adminPassword = data.adminPassword;
      }
      if (data.brevo) {
        settings.set("brevo", {
          ...settings.brevo,
          ...data.brevo,
        });
      }
      await settings.save();
      console.log("✅ Saved settings:", settings.brevo);
    }

    // ✅ Sync with UserModel (admin)
    const user = await UserModel.findOne({ isAdmin: true });
    if (user) {
      if (data.adminEmail) user.email = data.adminEmail;
      if (hashedPassword) user.password = hashedPassword;
      await user.save();
      console.log("✅ Synced admin user credentials with UserModel");
    } else {
      console.warn("⚠️ No admin user found to update");
    }

    return Response.json({ success: true, settings });
  } catch (error) {
    console.error("❌ Failed to update settings:", error);
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  const settings = await AdminSettings.findOne();

  if (!settings) return Response.json({});

  // Remove sensitive info before sending to client
  const { adminPassword, ...safeSettings } = settings.toObject();

  return Response.json(safeSettings);
}
