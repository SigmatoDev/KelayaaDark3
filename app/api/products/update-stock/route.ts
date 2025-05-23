// /app/api/products/update-stock/route.ts
import dbConnect from "@/lib/dbConnect";
import BanglesProductModel from "@/lib/models/BanglesProductSchema";
import BeadsProductModel from "@/lib/models/BeadsProductModel";
import ProductModel from "@/lib/models/ProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const { productCode, countInStock } = await req.json();

    if (!productCode || typeof countInStock !== "number") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Try updating in ProductModel first
    let product = await ProductModel.findOneAndUpdate(
      { productCode },
      { countInStock: String(countInStock) },
      { new: true }
    );

    // If not found in ProductModel, try in SetsProductModel
    if (!product) {
      product = await SetsProductModel.findOneAndUpdate(
        { productCode },
        { countInStock: String(countInStock) },
        { new: true }
      );
    }

    // If not found in SetsProductModel, try in BangleProductModel
    if (!product) {
      product = await BanglesProductModel.findOneAndUpdate(
        { productCode },
        { countInStock: String(countInStock) },
        { new: true }
      );
    }

    // If not found in BangleProductModel, try in BeadsProductModel
    if (!product) {
      product = await BeadsProductModel.findOneAndUpdate(
        { productCode },
        { countInStock: String(countInStock) },
        { new: true }
      );
      console.log("product", product);
    }

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Stock updated successfully", product },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating stock:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
