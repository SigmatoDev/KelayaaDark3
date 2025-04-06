import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import GoldDiamondProductPricingModel from "@/lib/models/GoldDiamondProductsPricingDetails";
import GoldPrice from "@/lib/models/GoldPriceSchema";
import ProductModel from "@/lib/models/ProductModel";

export const GET = auth(async (req: any) => {
  await dbConnect();

  const products = await ProductModel.find().sort({ createdAt: -1 });

  // Sort: products with valid image URLs (http/https) come first
  const sortedProducts = products.sort((a, b) => {
    const hasImageA = a.image && a.image.startsWith("http");
    const hasImageB = b.image && b.image.startsWith("http");
    return Number(hasImageB) - Number(hasImageA);
  });

  return Response.json(sortedProducts);
}) as any;

// export const GET = auth(async (req: any) => {
//   await dbConnect();
//   console.log("🔄 Fetching products from DB...");

//   const products = await ProductModel.find().sort({ createdAt: -1 });
//   console.log(`✅ Retrieved ${products.length} products.`);

//   console.log("🔄 Fetching latest gold prices...");
//   const goldPricesList = await GoldPrice.find({});
//   console.log(`✅ Retrieved ${goldPricesList.length} gold prices.`);

//   const goldPriceMap = goldPricesList.reduce(
//     (acc, g) => {
//       acc[g.karat] = g.price;
//       return acc;
//     },
//     {} as Record<string, number>
//   );

//   const updatedProducts = await Promise.all(
//     products.map(async (product) => {
//       const isGoldKD =
//         product.materialType?.toLowerCase() === "gold" &&
//         product.productCode?.toUpperCase().startsWith("KD");

//       if (!isGoldKD) {
//         return product.toObject(); // Skip non-gold or KS series
//       }

//       console.log(`🔍 Processing: ${product.name} (${product.productCode})`);

//       const pricingDetails = await GoldDiamondProductPricingModel.findOne({
//         productCode: product.productCode,
//       });

//       if (!pricingDetails) {
//         console.log(`⚠️ No pricing details found for ${product.productCode}`);
//         return product.toObject();
//       }

//       console.log(`✅ Found pricing details for ${product.productCode}`);

//       const goldPrice =
//         goldPriceMap[product.goldPurity] ?? pricingDetails.goldPrice;

//       console.log(`💰 Gold Price for ${product.goldPurity}: ${goldPrice}`);

//       const goldTotal = pricingDetails.grossWeight * goldPrice;

//       console.log(
//         `📊 Gold Total: ${goldTotal} (Weight: ${pricingDetails.grossWeight} * Price: ${goldPrice})`
//       );

//       const totalPrice =
//         goldTotal + pricingDetails.makingCharge + pricingDetails.diamondTotal;

//       console.log(
//         `📊 Final Price Calculation for ${product.productCode}:`,
//         `Gold Total: ${goldTotal}, Making Charge: ${pricingDetails.makingCharge},`,
//         `Diamond Total: ${pricingDetails.diamondTotal}, Final Price: ${totalPrice}`
//       );

//       await GoldDiamondProductPricingModel.findByIdAndUpdate(
//         pricingDetails._id,
//         {
//           goldPrice,
//           goldTotal,
//           totalPrice,
//         }
//       );

//       await ProductModel.findByIdAndUpdate(product._id, {
//         price: totalPrice,
//       });

//       console.log(`✅ Updated ${product.productCode} in DB.`);

//       return {
//         ...product.toObject(),
//         goldPrice,
//         goldTotal,
//         price: totalPrice,
//       };
//     })
//   );

//   const sortedProducts = updatedProducts.sort((a, b) => {
//     const hasImageA = a.image && a.image.startsWith("http");
//     const hasImageB = b.image && b.image.startsWith("http");
//     return Number(hasImageB) - Number(hasImageA);
//   });

//   console.log("✅ Final sorted products list ready to send.");

//   return Response.json(sortedProducts);
// }) as any;
