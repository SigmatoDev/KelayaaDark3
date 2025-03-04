import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "@/lib/dbConnect";
import GoldPriceSchema from "@/lib/models/GoldPriceSchema";

interface GoldPriceResponse {
  price_gram_18k: number;
  price_gram_22k: number;
  price_gram_24k: number;
}

export async function GET() {
  console.log("🔹 API Request Received: Fetching Gold Prices...");

  await dbConnect();
  console.log("✅ Connected to MongoDB");

  try {
    const API_KEY = process.env.GOLD_API_KEY;
    const API_URL = `https://www.goldapi.io/api/XAU/INR`;

    console.log(`🌍 Fetching gold prices from API: ${API_URL}`);

    const response = await axios.get<GoldPriceResponse>(API_URL, {
      headers: {
        "x-access-token": API_KEY as string,
        "Content-Type": "application/json",
      },
    });

    console.log("📥 API Response Data:", response.data);

    const { price_gram_18k, price_gram_22k, price_gram_24k } = response.data;

    const prices = [
      { karat: "18K", price: price_gram_18k },
      { karat: "22K", price: price_gram_22k },
      { karat: "24K", price: price_gram_24k },
    ];

    console.log("🔄 Updating Database with Latest Gold Prices...");

    await Promise.all(
      prices.map(async ({ karat, price }) => {
        // Find the previous record
        const existingRecord = await GoldPriceSchema.findOne({ karat });

        let previousPrice = existingRecord?.price || null;
        let percentageChange = null;

        if (previousPrice !== null) {
          percentageChange = ((price - previousPrice) / previousPrice) * 100;
        }

        const updatedRecord = await GoldPriceSchema.findOneAndUpdate(
          { karat },
          {
            $set: {
              price,
              previousPrice,
              percentageChange,
              updatedAt: new Date(),
            },
          },
          { upsert: true, new: true }
        );

        console.log(
          `📌 Updated ${karat} Price in DB: ₹${price} (Previous: ₹${previousPrice})`,
          updatedRecord
        );
      })
    );

    console.log("✅ Gold Prices Successfully Updated in Database");

    return NextResponse.json({ success: true, data: prices }, { status: 200 });
  } catch (error) {
    console.error("❌ Error Fetching Gold Prices:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch gold prices" },
      { status: 500 }
    );
  }
}
