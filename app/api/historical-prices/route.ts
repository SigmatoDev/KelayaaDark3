import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import GoldPrice from "@/lib/models/GoldPriceSchema";
import { Types } from "mongoose";

// Define the response data type
interface HistoricalEntry {
  _id: string;
  karat: "18K" | "22K" | "24K";
  price: number;
  updatedAt: string; // ISO Date string
}

// Create an interface that matches the Mongoose document structure
interface GoldPriceDocument {
  _id: Types.ObjectId;
  karat: "18K" | "22K" | "24K";
  price: number;
  updatedAt: Date;
  __v: number;
  [key: string]: any; // For any other fields that might be present
}

// GET handler (App Router requires named export)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Fetch the last 10 price entries sorted by updatedAt
    const rawHistoricalPrices = (await GoldPrice.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean()) as GoldPriceDocument[]; // Type assertion here

    // Transform the raw data to match your interface
    const historicalPrices: HistoricalEntry[] = rawHistoricalPrices.map(
      (item) => ({
        _id: item._id.toString(),
        karat: item.karat,
        price: item.price,
        updatedAt:
          item.updatedAt instanceof Date
            ? item.updatedAt.toISOString()
            : String(item.updatedAt),
      })
    );

    historicalPrices.forEach((entry, index) => {});

    return NextResponse.json(
      { success: true, data: historicalPrices },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error Fetching Historical Prices:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
