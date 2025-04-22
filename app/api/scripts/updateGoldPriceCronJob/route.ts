import cron from "node-cron";
import dbConnect from "@/lib/dbConnect";
import GoldDiamondProductPricingModel from "@/lib/models/GoldDiamondProductsPricingDetails";
import ProductModel from "@/lib/models/ProductModel";
import GoldPrice from "@/lib/models/GoldPriceSchema";
import SetsProductModel from "@/lib/models/SetsProductsModel";
import BanglesProductModel from "@/lib/models/BanglesProductSchema";

export const updateGoldProductPrices = async () => {
  await dbConnect();
  console.log("⏰ Scheduled Job: Updating gold product prices...");

  // Fetch only products that are gold and have productCode starting with 'KD'
  const goldProducts = await ProductModel.find({
    materialType: /gold/i,
    productCode: /^KD/,
  });

  // Fetch Sets and Bangles products
  const setsProducts = await SetsProductModel.find({
    materialType: /gold/i,
    productCode: /^KD/,
  });

  const banglesProducts = await BanglesProductModel.find({
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

  // Update Gold Products
  await updateProductPrices(goldProducts, goldPriceMap);

  // Update Sets Products
  await updateSetsOrBanglesPrices(setsProducts, goldPriceMap, SetsProductModel);

  // Update Bangles Products
  await updateSetsOrBanglesPrices(
    banglesProducts,
    goldPriceMap,
    BanglesProductModel
  );

  console.log("✅ Gold product prices updated.");
};

// Helper function to update prices for normal Gold Products
const updateProductPrices = async (
  products: any[],
  goldPriceMap: Record<string, number>
) => {
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
};

// Helper function to update prices for Sets and Bangles Products
const updateSetsOrBanglesPrices = async (
  products: any[],
  goldPriceMap: Record<string, number>,
  model: any
) => {
  for (const product of products) {
    for (const item of product.items) {
      // Retrieve the correct gold price based on purity
      const goldPrice = goldPriceMap[product.goldPurity] ?? item.goldPrice;

      // Calculate Gold Total: grossWeight * pricePerGram
      const goldTotal = item.grossWeight * item.pricePerGram;

      // Calculate the total price for the item
      const totalPrice = goldTotal + item.makingCharges + item.diamondTotal;

      // Update pricing model for item
      await model.updateOne(
        { _id: product._id, "items._id": item._id },
        {
          $set: {
            "items.$.goldPrice": goldPrice,
            "items.$.goldTotal": goldTotal,
            "items.$.totalPrice": totalPrice,
          },
        }
      );

      // Optionally, update the overall price of the product itself, if necessary
      const updatedProductPrice = product.items.reduce(
        (total: any, item: { totalPrice: any; }) => total + item.totalPrice,
        0
      );

      await model.findByIdAndUpdate(product._id, {
        price: updatedProductPrice,
      });

      console.log(
        `✅ Updated: ${product.productCode} | Item Final Price: ₹${totalPrice}`
      );
    }
  }
};

// 🕘 Run 3 times a day: 9:45 AM, 12:45 PM, 5:45 PM IST (convert to UTC = 4:15, 7:15, 12:15)
cron.schedule("15 4 * * *", updateGoldProductPrices); // 9:45 AM IST
cron.schedule("15 7 * * *", updateGoldProductPrices); // 12:45 PM IST
cron.schedule("15 12 * * *", updateGoldProductPrices); // 5:45 PM IST
