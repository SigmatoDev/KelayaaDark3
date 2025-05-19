import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import BanglesProductModel from "@/lib/models/BanglesProductSchema";
import BeadsProductModel from "@/lib/models/BeadsProductModel";
import GoldDiamondProductPricingModel from "@/lib/models/GoldDiamondProductsPricingDetails";
import GoldPrice from "@/lib/models/GoldPriceSchema";
import ProductModel from "@/lib/models/ProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";

export const GET = auth(async (req: any) => {
  await dbConnect();

  // Fetch from all models
  const [products, sets, bangles, beads] = await Promise.all([
    ProductModel.find().sort({ createdAt: -1 }),
    SetsProductModel.find().sort({ createdAt: -1 }),
    BanglesProductModel.find().sort({ createdAt: -1 }),
    BeadsProductModel.find().sort({ createdAt: -1 }),
  ]);

  // Merge all into one array
  const allProducts = [
    ...products.map((p) => ({ ...p.toObject(), type: "product" })),
    ...sets.map((s) => ({ ...s.toObject(), type: "set" })),
    ...bangles.map((b) => ({ ...b.toObject(), type: "bangle" })),
    ...beads.map((b) => ({ ...b.toObject(), type: "bead" })),
  ];

  // Filter: remove products with missing or invalid image field
  const filteredProducts = allProducts.filter(
    (item) =>
      item.image &&
      typeof item.image === "string" &&
      item.image.startsWith("http")
  );

  return Response.json(filteredProducts);
}) as any;

// export const GET = auth(async (req: any) => {
//   await dbConnect();
//   console.log(
//     "🔄 Fetching products, sets, bangles, and gold prices from DB..."
//   );

//   const [products, sets, bangles, goldPricesList] = await Promise.all([
//     ProductModel.find().sort({ createdAt: -1 }),
//     SetsProductModel.find().sort({ createdAt: -1 }),
//     BanglesProductModel.find().sort({ createdAt: -1 }),
//     GoldPrice.find({}),
//   ]);

//   console.log(`✅ Retrieved ${products.length} products.`);
//   console.log(`✅ Retrieved ${sets.length} sets.`);
//   console.log(`✅ Retrieved ${bangles.length} bangles.`);
//   console.log(`✅ Retrieved ${goldPricesList.length} gold prices.`);

//   const goldPriceMap = goldPricesList.reduce(
//     (acc, g) => {
//       acc[g.karat] = g.price;
//       return acc;
//     },
//     {} as Record<string, number>
//   );

//   // Update Regular Products
//   const updatedProducts = await Promise.all(
//     products.map(async (product) => {
//       const isGoldKD =
//         product.materialType?.toLowerCase() === "gold" &&
//         product.productCode?.toUpperCase().startsWith("KD");

//       if (!isGoldKD) return product.toObject();

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

//       const { makingCharge, diamondTotal } = pricingDetails;

//       // Subtotal before GST
//       const subtotal = goldTotal + makingCharge + diamondTotal;

//       // Calculate 3% GST
//       const gstAmount = +(subtotal * 0.03).toFixed(2);

//       // Final total price including GST
//       const totalPrice = subtotal + gstAmount;

//       await GoldDiamondProductPricingModel.findByIdAndUpdate(
//         pricingDetails._id,
//         {
//           goldPrice,
//           goldTotal,
//           gst: gstAmount,
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

//   // Update Sets
//   const updatedSets = await Promise.all(
//     sets.map(async (set) => {
//       const isGoldKD =
//         set.materialType?.toLowerCase() === "gold" &&
//         set.productCode?.toUpperCase().startsWith("KD");

//       if (!isGoldKD) return set.toObject();

//       console.log(`🔍 Processing Set: ${set.name} (${set.productCode})`);

//       const setDoc = await SetsProductModel.findById(set._id);
//       if (!setDoc) {
//         console.log(`❌ Set not found for ID: ${set._id}`);
//         return set.toObject();
//       }

//       setDoc.items.forEach((item, index) => {
//         const purity = item.goldPurity;
//         const productCode = set.productCode;

//         const pricing = item.pricing;
//         if (!pricing || !purity || !productCode) return;

//         const latestGoldPrice = goldPriceMap[purity];
//         if (!latestGoldPrice) {
//           console.log(
//             `⚠️ No gold price found for purity: ${purity} for set item: ${productCode}`
//           );
//           return;
//         }

//         const grossWeight = pricing?.grossWeight ?? 0;
//         const diamondTotal = pricing?.diamondTotal ?? 0;
//         const makingCharges = pricing?.makingCharges ?? 0;

//         const goldTotal = grossWeight * latestGoldPrice;

//         // Subtotal before GST
//         const subtotal = goldTotal + diamondTotal + makingCharges;

//         // Calculate 3% GST
//         const gstAmount = +(subtotal * 0.03).toFixed(2);

//         // Final total price including GST
//         const totalPrice = subtotal + gstAmount;

//         console.log(
//           `📦 ${productCode} | Gold: ₹${latestGoldPrice} x ${grossWeight}g = ₹${goldTotal}, Diamond: ₹${diamondTotal}, Making: ₹${makingCharges}, GST (3%): ₹${gstAmount}, Total: ₹${totalPrice}`
//         );

//         // Update pricing fields properly
//         pricing.goldPrice = latestGoldPrice;
//         pricing.goldTotal = goldTotal;
//         pricing.gst = gstAmount;
//         pricing.totalPrice = totalPrice;
//       });

//       const totalSetPrice = setDoc.items.reduce(
//         (sum, item) => sum + (item.pricing?.totalPrice ?? 0),
//         0
//       );

//       setDoc.price = totalSetPrice;

//       // Important: tell Mongoose to track changes in items[]
//       setDoc.markModified("items");

//       // Save updated document
//       await setDoc.save();

//       console.log(
//         `✅ Updated Set ${set.productCode} | Final Price: ₹${totalSetPrice}`
//       );

//       return setDoc.toObject();
//     })
//   );

//   // Update Bangles
//   const updatedBangles = await Promise.all(
//     bangles.map(async (bangle) => {
//       const isGoldKD =
//         bangle.materialType?.toLowerCase() === "gold" &&
//         bangle.productCode?.toUpperCase().startsWith("KD");

//       if (!isGoldKD) return bangle.toObject();

//       console.log(
//         `🔍 Processing Bangle: ${bangle.name} (${bangle.productCode})`
//       );

//       // Fetch the bangle document from MongoDB
//       const bangleDoc = await BanglesProductModel.findById(bangle._id);
//       if (!bangleDoc) {
//         console.log(`❌ Bangle not found for ID: ${bangle._id}`);
//         return bangle.toObject();
//       }

//       // Process each item in the bangle
//       bangleDoc.items.forEach((item, index) => {
//         const purity = item.goldPurity;
//         const productCode = bangle.productCode;

//         const pricing = item.pricing;
//         if (!pricing || !purity || !productCode) return;

//         const latestGoldPrice = goldPriceMap[purity];
//         if (!latestGoldPrice) {
//           console.log(
//             `⚠️ No gold price found for purity: ${purity} for bangle item: ${productCode}`
//           );
//           return;
//         }

//         const grossWeight = pricing?.grossWeight ?? 0;
//         const diamondTotal = pricing?.diamondTotal ?? 0;
//         const makingCharges = pricing?.makingCharges ?? 0;

//         const goldTotal = grossWeight * latestGoldPrice;

//         // Subtotal before GST
//         const subtotal = goldTotal + diamondTotal + makingCharges;

//         // Calculate 3% GST
//         const gstAmount = +(subtotal * 0.03).toFixed(2);

//         // Final total price including GST
//         const totalPrice = subtotal + gstAmount;

//         console.log(
//           `💍 ${productCode} | Gold: ₹${latestGoldPrice} x ${grossWeight}g = ₹${goldTotal}, Diamond: ₹${diamondTotal}, Making: ₹${makingCharges}, GST (3%): ₹${gstAmount}, Total: ₹${totalPrice}`
//         );

//         // Update pricing fields properly
//         pricing.goldPrice = latestGoldPrice;
//         pricing.goldTotal = goldTotal;
//         pricing.gst = gstAmount;
//         pricing.totalPrice = totalPrice;
//       });

//       // Calculate the total price for the bangle set
//       const totalBanglePrice = bangleDoc.items.reduce(
//         (sum, item) => sum + (item.pricing?.totalPrice ?? 0),
//         0
//       );

//       // Set the new total price for the bangle
//       bangleDoc.price = totalBanglePrice;

//       // Notify Mongoose to track changes in items[]
//       bangleDoc.markModified("items");

//       // Save updated document
//       await bangleDoc.save();

//       console.log(
//         `✅ Updated Bangle ${bangle.productCode} | Final Price: ₹${totalBanglePrice}`
//       );

//       return bangleDoc.toObject();
//     })
//   );

//   // Merge & Sort All
//   const allProducts = [...updatedProducts, ...updatedSets, ...updatedBangles];

//   const sortedProducts = allProducts.sort((a, b) => {
//     const hasImageA = a.image?.startsWith("http") ? 1 : 0;
//     const hasImageB = b.image?.startsWith("http") ? 1 : 0;
//     return hasImageB - hasImageA;
//   });

//   console.log("✅ Final sorted product list ready to send.");
//   return Response.json(sortedProducts);
// }) as any;
