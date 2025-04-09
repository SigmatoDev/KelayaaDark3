import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import GoldDiamondProductPricingModel from "@/lib/models/GoldDiamondProductsPricingDetails";
import GoldPrice from "@/lib/models/GoldPriceSchema";
import ProductModel from "@/lib/models/ProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";

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
//   console.log("🔄 Fetching products and sets from DB...");

//   const [products, sets, goldPricesList] = await Promise.all([
//     ProductModel.find().sort({ createdAt: -1 }),
//     SetsProductModel.find().sort({ createdAt: -1 }),
//     GoldPrice.find({}),
//   ]);

//   console.log(`✅ Retrieved ${products.length} products.`);
//   console.log(`✅ Retrieved ${sets.length} sets.`);
//   console.log(`✅ Retrieved ${goldPricesList.length} gold prices.`);

//   const goldPriceMap = goldPricesList.reduce(
//     (acc, g) => {
//       acc[g.karat] = g.price;
//       return acc;
//     },
//     {} as Record<string, number>
//   );

//   // 🔁 Update Regular Products (Gold + KD prefix only)
//   const updatedProducts = await Promise.all(
//     products.map(async (product) => {
//       const isGoldKD =
//         product.materialType?.toLowerCase() === "gold" &&
//         product.productCode?.toUpperCase().startsWith("KD");

//       if (!isGoldKD) {
//         return product.toObject(); // Skip non-gold or KS series
//       }

//       console.log(
//         `🔍 Processing Product: ${product.name} (${product.productCode})`
//       );

//       const pricingDetails = await GoldDiamondProductPricingModel.findOne({
//         productCode: product.productCode,
//       });

//       if (!pricingDetails) {
//         console.log(`⚠️ No pricing details found for ${product.productCode}`);
//         return product.toObject();
//       }

//       const goldPrice =
//         goldPriceMap[product.goldPurity] ?? pricingDetails.goldPrice;
//       const goldTotal = pricingDetails.grossWeight * goldPrice;
//       const totalPrice =
//         goldTotal + pricingDetails.makingCharge + pricingDetails.diamondTotal;

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

//       console.log(
//         `✅ Updated ${product.productCode} | Final Price: ₹${totalPrice}`
//       );

//       return {
//         ...product.toObject(),
//         goldPrice,
//         goldTotal,
//         price: totalPrice,
//       };
//     })
//   );

//   // 🔁 Update Sets Products (Only Gold + KD prefixed codes)
//   const updatedSets = await Promise.all(
//     sets.map(async (set) => {
//       const isGoldKD =
//         set.materialType?.toLowerCase() === "gold" &&
//         set.productCode?.toUpperCase().startsWith("KD");

//       if (!isGoldKD) {
//         return set.toObject(); // Skip non-gold or non-KD sets
//       }

//       console.log(`🔍 Processing Set: ${set.name} (${set.productCode})`);

//       const updatedItems = await Promise.all(
//         set.items.map(
//           async (item: { productCode: any; goldPurity: any; pricing: any }) => {
//             const productCode = item.productCode;
//             const purity = item.goldPurity;

//             if (!productCode || !purity) return item;

//             const latestGoldPrice = goldPriceMap[purity];
//             if (!latestGoldPrice) {
//               console.log(`⚠️ No gold price found for purity: ${purity}`);
//               return item;
//             }

//             const grossWeight = item?.pricing?.grossWeight ?? 0;
//             const diamondTotal = item?.pricing?.diamondTotal ?? 0;
//             const makingCharges = item?.pricing?.makingCharges ?? 0;
//             const goldTotal = grossWeight * latestGoldPrice;
//             const totalPrice = goldTotal + diamondTotal + makingCharges;

//             console.log(
//               `📦 ${productCode} | Gold: ₹${latestGoldPrice} x ${grossWeight}g = ₹${goldTotal}, ` +
//                 `Diamond: ₹${diamondTotal}, Making: ₹${makingCharges}, Total: ₹${totalPrice}`
//             );

//             return {
//               ...item,
//               pricing: {
//                 ...item.pricing,
//                 goldPrice: latestGoldPrice,
//                 goldTotal,
//                 totalPrice,
//               },
//             };
//           }
//         )
//       );

//       const totalSetPrice = updatedItems.reduce((sum, item) => {
//         return sum + (item?.pricing?.totalPrice ?? 0);
//       }, 0);

//       await SetsProductModel.findByIdAndUpdate(set._id, {
//         items: updatedItems,
//         price: totalSetPrice,
//       });

//       console.log(
//         `✅ Updated Set ${set.productCode} | Final Price: ₹${totalSetPrice}`
//       );

//       return {
//         ...set.toObject(),
//         items: updatedItems,
//         price: totalSetPrice,
//       };
//     })
//   );

//   // ✅ Merge and sort all products by image presence
//   const allProducts = [...updatedProducts, ...updatedSets];

//   const sortedProducts = allProducts.sort((a, b) => {
//     const hasImageA = a.image && a.image.startsWith("http");
//     const hasImageB = b.image && b.image.startsWith("http");
//     return Number(hasImageB) - Number(hasImageA);
//   });

//   console.log("✅ Final sorted product list ready to send.");

//   return Response.json(sortedProducts);
// }) as any;
