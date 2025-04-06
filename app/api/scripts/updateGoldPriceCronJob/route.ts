import cron from "node-cron";
import dbConnect from "@/lib/dbConnect";
import GoldDiamondProductPricingModel from "@/lib/models/GoldDiamondProductsPricingDetails";
import ProductModel from "@/lib/models/ProductModel";
import GoldPrice from "@/lib/models/GoldPriceSchema";

export const updateGoldProductPrices = async () => {
  await dbConnect();
  console.log("⏰ Scheduled Job: Updating gold product prices...");

  // Fetch only products that are gold and have productCode starting with 'KD'
  const products = await ProductModel.find({
    materialType: /gold/i,
    productCode: /^KD/,
  });

  // Fetch current gold prices
  const goldPricesList = await GoldPrice.find({});
  const goldPriceMap = goldPricesList.reduce(
    (acc: { [x: string]: any }, g: { karat: string | number; price: any }) => {
      acc[g.karat] = g.price;
      return acc;
    },
    {} as Record<string, number>
  );

  for (const product of products) {
    const pricingDetails = await GoldDiamondProductPricingModel.findOne({
      productCode: product.productCode,
    });

    if (!pricingDetails) {
      console.log(`⚠️ No pricing details found for ${product.productCode}`);
      continue;
    }

    const goldPrice =
      goldPriceMap[product.goldPurity] ?? pricingDetails.goldPrice;

    const goldTotal = pricingDetails.grossWeight * goldPrice;
    const totalPrice =
      goldTotal + pricingDetails.makingCharge + pricingDetails.diamondTotal;

    // Update pricing model
    await GoldDiamondProductPricingModel.findByIdAndUpdate(pricingDetails._id, {
      goldPrice,
      goldTotal,
      totalPrice,
    });

    // Update product model
    await ProductModel.findByIdAndUpdate(product._id, {
      price: totalPrice,
    });

    console.log(
      `✅ Updated: ${product.productCode} | Final Price: ₹${totalPrice}`
    );
  }

  console.log("✅ Gold product prices updated.");
};

// 🕘 Run 3 times a day: 9:45 AM, 12:45 PM, 5:45 PM IST (convert to UTC = 4:15, 7:15, 12:15)
cron.schedule("15 4 * * *", updateGoldProductPrices); // 9:45 AM IST
cron.schedule("15 7 * * *", updateGoldProductPrices); // 12:45 PM IST
cron.schedule("15 12 * * *", updateGoldProductPrices); // 5:45 PM IST
