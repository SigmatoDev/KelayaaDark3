import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import GoldPriceSchema from "@/lib/models/GoldPriceSchema";

export async function GET() {
  await dbConnect();

  try {
    const karats = ["14K", "18K", "22K", "24K"];
    const prices = await GoldPriceSchema.find({ karat: { $in: karats } });

    if (!prices.length) {
      return NextResponse.json(
        { success: false, message: "No gold prices found in the database" },
        { status: 404 }
      );
    }

    // Format and sort based on desired karat order (24, 22, 18, 14)
    const karatOrder = ["24K", "22K", "18K", "14K"];
    const formatted = prices
      .map((entry) => ({
        karat: entry.karat,
        price: entry.price,
        previousPrice: entry.previousPrice,
        percentageChange: entry.percentageChange,
        updatedAt: entry.updatedAt,
      }))
      .sort(
        (a, b) => karatOrder.indexOf(a.karat) - karatOrder.indexOf(b.karat)
      );

    return NextResponse.json(
      { success: true, data: formatted },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching gold prices from DB:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch gold prices from database" },
      { status: 500 }
    );
  }
}
