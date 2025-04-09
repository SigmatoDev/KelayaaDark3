import dbConnect from "@/lib/dbConnect";
import { auth } from "@/lib/auth";
import SetsProductModel from "@/lib/models/SetsProductsModel";

export const PATCH = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    console.log("body", body);
    if (!Array.isArray(body.pricing)) {
      console.log("❌ Invalid pricing data format:", body);
      return Response.json(
        { message: "Invalid pricing data format" },
        { status: 400 }
      );
    }

    for (const entry of body.pricing) {
      const { productCode, items } = entry;

      if (!productCode || !Array.isArray(items)) {
        console.log(
          `⚠️ Skipping entry: missing productCode or invalid items`,
          entry
        );
        continue;
      }

      const product = await SetsProductModel.findOne({ productCode });

      if (!product) {
        console.log(`❌ Product with code "${productCode}" not found.`);
        continue;
      }

      if (items.length !== product.items.length) {
        console.log(
          `⚠️ Mismatch in items length for product ${productCode}: Expected ${product.items.length}, Got ${items.length}`
        );
        continue;
      }

      // Update pricing for each item
      for (let i = 0; i < items.length; i++) {
        const pricing = items[i].pricing;

        if (pricing) {
          product.items[i].pricing = {
            diamondPrice: Number(pricing.diamondPrice || 0),
            goldPrice: Number(pricing.goldPrice || 0),
            grossWeight: Number(pricing.grossWeight || 0),
            pricePerGram: Number(pricing.pricePerGram || 0),
            makingCharges: Number(pricing.makingCharges || 0),
            diamondTotal: Number(pricing.diamondTotal || 0),
            goldTotal: Number(pricing.goldTotal || 0),
            totalPrice: Number(pricing.totalPrice || 0),
          };
          console.log(`✅ Updated pricing for item[${i}] in ${productCode}`);
        } else {
          console.log(
            `⚠️ No pricing provided for item[${i}] in ${productCode}`
          );
        }
      }

      await product.save();
      console.log(`💾 Saved updated pricing for product: ${productCode}`);
    }

    return Response.json({ message: "Pricing updated successfully." });
  } catch (error: any) {
    console.error("🔥 Error in PATCH /sets/pricing:", error);
    return Response.json(
      { message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}) as any;
