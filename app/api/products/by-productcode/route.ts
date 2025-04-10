import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/lib/models/ProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";

export async function POST(req: NextRequest) {
  try {
    const { productCode } = await req.json();

    if (!productCode || typeof productCode !== "string") {
      return NextResponse.json(
        { message: "productCode is required and must be a string." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Try finding from ProductModel
    let product = await ProductModel.findOne({ productCode });

    // If not found, try from SetsProductModel
    if (!product) {
      product = await SetsProductModel.findOne({ productCode });
    }

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching product by code:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
