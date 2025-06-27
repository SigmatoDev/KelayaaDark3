import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import BanglesProductModel from "@/lib/models/BanglesProductSchema";
import BeadsProductModel from "@/lib/models/BeadsProductModel";
import GoldDiamondProductPricingModel from "@/lib/models/GoldDiamondProductsPricingDetails";
import GoldPrice from "@/lib/models/GoldPriceSchema";
import ProductModel from "@/lib/models/ProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();

  // Fetch from all three models
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

  // Optional: Sort by image presence
  const sortedProducts = allProducts.sort((a, b) => {
    const hasImageA = a.image && a.image.startsWith("http");
    const hasImageB = b.image && b.image.startsWith("http");
    return Number(hasImageB) - Number(hasImageA);
  });

  return Response.json(sortedProducts);
}) as any;

// Utility to clean number strings
const cleanNumber = (val: any) =>
  typeof val === "string"
    ? Number(val.replace(/[^0-9.]/g, "").trim())
    : Number(val || 0);

// Utility to calculate gold totals
const calculateTotals = (pricing: any, goldRate: number) => {
  const diamondTotal =
    cleanNumber(pricing.diamondPrice) * cleanNumber(pricing.carats);
  const goldTotal = goldRate * cleanNumber(pricing.grossWeight);
  const makingCharges = cleanNumber(pricing.makingCharge);
  const baseTotal = diamondTotal + goldTotal + makingCharges;
  const gst = 3;
  const gstAmount = (baseTotal * gst) / 100;
  const totalPriceWithGst = baseTotal + gstAmount;

  return {
    diamondTotal,
    goldTotal,
    makingCharges,
    baseTotal,
    gst,
    gstAmount,
    totalPrice: totalPriceWithGst,
  };
};

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const parsedBody = await req.json();

    if (!Array.isArray(parsedBody.products)) {
      return Response.json(
        { message: "Invalid product format" },
        { status: 400 }
      );
    }

    const createdProducts = [];

    for (const productData of parsedBody.products) {
      const { name, productCode, materialType, pricingDetails, ...rest } =
        productData;

      const isGold = (materialType || "").toLowerCase() === "gold";
      const isSilver = (materialType || "").toLowerCase() === "silver";

      if (isGold && !pricingDetails?.goldPurity) {
        return Response.json(
          { message: `Gold goldPurity is required for ${productCode}` },
          { status: 400 }
        );
      }

      let goldRate = 0;
      let totalPrice = 0;

      // Clean numeric inputs
      const weight = cleanNumber(
        productData.weight || pricingDetails?.grossWeight
      );

      let pricePerGram = isGold
        ? cleanNumber(pricingDetails?.pricePerGram)
        : cleanNumber(productData?.price_per_gram);

      if (isGold) {
        // Fetch gold rate
        const goldPriceDoc = await GoldPrice.findOne({
          karat: pricingDetails.goldPurity,
        });

        if (!goldPriceDoc) {
          return Response.json(
            {
              message: `No gold price found for goldPurity ${pricingDetails.goldPurity}`,
            },
            { status: 400 }
          );
        }

        goldRate = goldPriceDoc.price;
        pricePerGram = goldRate;

        const {
          diamondTotal,
          goldTotal,
          makingCharges,
          baseTotal,
          gst,
          gstAmount,
          totalPrice: goldTotalPrice,
        } = calculateTotals(pricingDetails || {}, goldRate);

        totalPrice = goldTotalPrice;

        if (isNaN(totalPrice)) {
          return Response.json(
            {
              message: `Invalid price values for product ${productCode}`,
            },
            { status: 400 }
          );
        }

        // Save gold pricing document
        const pricingDoc = new GoldDiamondProductPricingModel({
          ...pricingDetails,
          productCode,
          productName: name,
          diamondTotal,
          goldTotal,
          makingCharges,
          gst,
          gstAmount,
          totalPrice,
          goldRate,
        });

        await pricingDoc.save();
      } else {
        // Silver price = weight * price_per_gram
        totalPrice = weight * pricePerGram;

        if (isNaN(totalPrice) || totalPrice <= 0) {
          return Response.json(
            {
              message: `Invalid price values for product ${productCode}`,
            },
            { status: 400 }
          );
        }
      }

      let images: string[] = [];

      if (Array.isArray(productData.images) && productData.images.length > 0) {
        images = productData.images;
      } else if (
        typeof productData.image === "string" &&
        productData.image.trim()
      ) {
        images = [productData.image.trim()];
      }

      const product = new ProductModel({
        name,
        productCode,
        materialType,
        ...rest,
        weight,
        price_per_gram: pricePerGram,
        slug: name?.toLowerCase().replace(/\s+/g, "-"),
        countInStock: Number(productData.countInStock) || 0,
        price: totalPrice,
        images,
        image: images?.[0] || "",
      });

      const savedProduct = await product.save();
      createdProducts.push(savedProduct);
    }

    return Response.json(
      {
        message: "Products created successfully",
        products: createdProducts,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}) as any;

export const DELETE = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const { productIds } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return Response.json(
        { message: "No valid product IDs provided." },
        { status: 400 }
      );
    }

    const [products, sets, bangles, beads] = await Promise.all([
      ProductModel.deleteMany({ _id: { $in: productIds } }),
      SetsProductModel.deleteMany({ _id: { $in: productIds } }),
      BanglesProductModel.deleteMany({ _id: { $in: productIds } }),
      BeadsProductModel.deleteMany({ _id: { $in: productIds } }),
    ]);

    const totalDeleted =
      products.deletedCount +
      sets.deletedCount +
      bangles.deletedCount +
      beads.deletedCount;

    return Response.json({
      message: `Deleted ${totalDeleted} products: ${products.deletedCount} normal, ${sets.deletedCount} sets, ${bangles.deletedCount} bangles, ${beads.deletedCount} beads.`,
    });
  } catch (error: any) {
    console.error("Error deleting products:", error);
    return Response.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}) as any;
