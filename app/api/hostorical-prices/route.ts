import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import GoldPrice from "@/lib/models/GoldPriceSchema";

// Define the response data type
interface HistoricalEntry {
  _id: string;
  karat: "18K" | "22K" | "24K";
  price: number;
  updatedAt: string; // ISO Date string
}

// GET handler (App Router requires named export)
export async function GET(req: NextRequest) {
  console.log("🔹 API Request Received: Fetching Historical Gold Prices...");

  try {
    await dbConnect();
    console.log("✅ Connected to MongoDB");

    // Fetch the last 10 price entries sorted by updatedAt
    const historicalPrices: HistoricalEntry[] = await GoldPrice.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean(); // Convert Mongoose documents to plain objects

    console.log(`📊 Retrieved ${historicalPrices.length} Historical Records`);
    historicalPrices.forEach((entry, index) => {
      console.log(
        `#${index + 1}: ${entry.karat} - ₹${entry.price} (Updated: ${entry.updatedAt})`
      );
    });

    console.log("✅ Successfully Fetched Historical Prices");

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
