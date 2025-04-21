import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // you already have dbConnect in your services
import ProductModel from "@/lib/models/ProductModel"; // your given schema

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ products: [] });
    }

    await dbConnect();

    const products = await ProductModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Match name
        { category: { $regex: query, $options: "i" } }, // Match category
        { collectionType: { $regex: query, $options: "i" } }, // Match collectionType
      ],
    })
      .select("_id name slug productCode category collectionType image") // Only select what frontend needs
      .limit(10)
      .lean();

    return NextResponse.json({ products });
  } catch (error) {
    console.error("❌ Search Products API Error:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
