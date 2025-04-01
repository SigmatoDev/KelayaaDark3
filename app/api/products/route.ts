import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import GoldDiamondProductPricingModel from "@/lib/models/GoldDiamondProductsPricingDetails";
import GoldPrice from "@/lib/models/GoldPriceSchema";
import ProductModel from "@/lib/models/ProductModel";

export const GET = auth(async (req: any) => {
  await dbConnect();
  console.log("🔄 Fetching products from DB...");

  const products = await ProductModel.find().sort({ createdAt: -1 });
  console.log(`✅ Retrieved ${products.length} products.`);

  console.log("🔄 Fetching latest gold prices...");
  const goldPricesList = await GoldPrice.find({});
  console.log(`✅ Retrieved ${goldPricesList.length} gold prices.`);

  // Convert gold prices into a map for faster lookup
  const goldPriceMap = goldPricesList.reduce(
    (acc, g) => {
      acc[g.karat] = g.price;
      return acc;
    },
    {} as Record<string, number>
  );

  // Process products and update pricing dynamically
  const updatedProducts = await Promise.all(
    products.map(async (product) => {
      console.log(`🔍 Processing: ${product.name} (${product.productCode})`);

      const pricingDetails = await GoldDiamondProductPricingModel.findOne({
        productCode: product.productCode,
      });

      if (!pricingDetails) {
        console.log(`⚠️ No pricing details found for ${product.productCode}`);
        return product;
      }

      console.log(`✅ Found pricing details for ${product.productCode}`);

      // **🔹 Get gold price based on purity**
      const goldPrice =
        goldPriceMap[product.goldPurity] ?? pricingDetails.goldPrice;

      console.log(`💰 Gold Price for ${product.goldPurity}: ${goldPrice}`);

      // **🔹 Calculate new gold total price**
      const goldTotal = pricingDetails.grossWeight * goldPrice;
      console.log(
        `📊 Gold Total: ${goldTotal} (Weight: ${pricingDetails.grossWeight} * Price: ${goldPrice})`
      );

      // **🔹 Calculate final total price**
      const totalPrice =
        goldTotal + pricingDetails.makingCharge + pricingDetails.diamondTotal;
      console.log(
        `📊 Final Price Calculation for ${product.productCode}:`,
        `Gold Total: ${goldTotal}, Making Charge: ${pricingDetails.makingCharge},`,
        `Diamond Total: ${pricingDetails.diamondTotal}, Final Price: ${totalPrice}`
      );

      // ✅ **Update GoldDiamondProductPricingModel**
      await GoldDiamondProductPricingModel.findByIdAndUpdate(
        pricingDetails._id,
        {
          goldPrice, // ✅ Update gold price
          goldTotal, // ✅ Update gold total price
          totalPrice, // ✅ Update final total price
        }
      );

      // ✅ **Update ProductModel**
      await ProductModel.findByIdAndUpdate(product._id, {
        price: totalPrice, // ✅ Store updated total price
      });

      console.log(`✅ Updated ${product.productCode} in DB.`);

      return {
        ...product.toObject(),
        goldPrice, // ✅ Updated gold price
        goldTotal, // ✅ Updated gold total
        price: totalPrice, // ✅ Updated final price
      };
    })
  );

  // Sort products (products with images come first)
  const sortedProducts = updatedProducts.sort((a, b) => {
    const hasImageA = a.image && a.image.startsWith("http");
    const hasImageB = b.image && b.image.startsWith("http");
    return hasImageB - hasImageA;
  });

  console.log("✅ Final sorted products list ready to send.");

  return Response.json(sortedProducts);
}) as any;
