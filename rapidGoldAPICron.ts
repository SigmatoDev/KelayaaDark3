import axios from "axios";
import dotenv from "dotenv";
import dbConnect from "./lib/dbConnect";
import GoldPrice from "./lib/models/GoldPriceSchema";
import cron from "node-cron";
dotenv.config();

const API_KEY = process.env.RAPID_API_KEY;
const API_HOST = "indian-gold-and-silver-price.p.rapidapi.com";

const getGoldPrice = async (city = "Bangalore") => {
  const API_URL = `https://${API_HOST}/gold?city=${city}`;

  try {
    await dbConnect();

    console.log(`📦 Fetching gold prices for city: ${city}...`);

    const response = await axios.get(API_URL, {
      headers: {
        "X-RapidAPI-Key": API_KEY!,
        "X-RapidAPI-Host": API_HOST,
      },
    });

    const data = response.data;
    console.log("📥 Full API Response:");
    console.dir(data, { depth: null });

    const price24k = data["24k"];
    const price22k = data["22k"];
    const price18k = price24k * 0.75;
    const price14k = price24k * 0.5833;

    const prices = [
      { karat: "24K", price: price24k },
      { karat: "22K", price: price22k },
      { karat: "18K", price: price18k },
      { karat: "14K", price: price14k },
    ];

    for (const { karat, price } of prices) {
      const existing = await GoldPrice.findOne({ karat });
      const previousPrice = existing?.price ?? null;
      const percentageChange =
        previousPrice !== null
          ? ((price - previousPrice) / previousPrice) * 100
          : null;

      await GoldPrice.findOneAndUpdate(
        { karat },
        {
          $set: {
            price,
            previousPrice,
            percentageChange,
            updatedAt: new Date(),
          },
          $setOnInsert: { timestamp: new Date() },
        },
        { upsert: true }
      );

      console.log(
        `✅ ${karat} updated: ₹${price} (Prev: ₹${previousPrice}, Change: ${percentageChange?.toFixed(2)}%)`
      );
    }

    console.log("✅ All prices updated.");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Error fetching/updating prices:", err);
    process.exit(1);
  }
};

// Run at 9AM, 2PM, and 7PM IST (3:30, 8:30, 13:30 UTC)
cron.schedule("30 3,8,13 * * *", async () => {
  const city = "Bangalore";
  const cityArg = process.argv[2];
  getGoldPrice(cityArg);
  console.log("✅ Scheduled gold price fetch complete.");
});
const cityArg = process.argv[2];
getGoldPrice(cityArg);
