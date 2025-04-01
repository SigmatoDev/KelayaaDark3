import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import GoldDiamondProductPricingModel from "@/lib/models/GoldDiamondProductsPricingDetails";

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const products = await GoldDiamondProductPricingModel.find();
  return Response.json(products);
}) as any;

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.text();
    const parsedBody = JSON.parse(body);

    console.log("parsedBody", parsedBody);
    if (
      !Array.isArray(parsedBody.products) ||
      parsedBody.products.length === 0
    ) {
      return Response.json(
        { message: "Invalid input, expected an array of products." },
        { status: 400 }
      );
    }

    // Map products to match the MongoDB schema
    const productsToSave = parsedBody.products.map((product: any) => ({
      productName: product.productName,
      productCode: product.productCode,
      productType: product.productType,
      gemCut: product.gemCut,
      ringSize: Number(product.ringSize) || 0,
      carats: Number(product.carats) || 0,
      diamondPrice: Number(product.diamondPrice) || 0,
      clarity: product.clarity,
      color: product.color,
      goldPurity: product.goldPurity,
      goldPrice: Number(product.goldPrice) || 0,
      grossWeight: Number(product.grossWeight) || 0,
      pricePerGram: Number(product.pricePerGram) || 0,
      makingCharge: Number(product.makingCharge) || 0,
      diamondTotal: Number(product.diamondTotal) || 0,
      goldTotal: Number(product.goldTotal) || 0,
      totalPrice: Number(product.totalPrice) || 0,
    }));

    // Insert into MongoDB
    const savedProducts =
      await GoldDiamondProductPricingModel.insertMany(productsToSave);

    return Response.json(
      {
        message: `${savedProducts.length} products created successfully.`,
        products: savedProducts,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating products:", err);
    return Response.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
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
    console.log("productIds", productIds);

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return Response.json(
        { message: "No valid product IDs provided." },
        { status: 400 }
      );
    }

    const deletedProducts = await GoldDiamondProductPricingModel.deleteMany({
      _id: { $in: productIds },
    });

    return Response.json({
      message: `${deletedProducts.deletedCount} products deleted successfully.`,
    });
  } catch (error: any) {
    console.error("Error deleting products:", error);
    return Response.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}) as any;
