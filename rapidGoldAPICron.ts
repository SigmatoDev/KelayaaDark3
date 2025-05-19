import axios from "axios";
import dotenv from "dotenv";
import dbConnect from "./lib/dbConnect";
import GoldPrice from "./lib/models/GoldPriceSchema";
import cron from "node-cron";

dotenv.config();

const API_KEY = process.env.RAPID_API_KEY!;
const API_HOST = "indian-gold-and-silver-price.p.rapidapi.com";
const API_ENDPOINT_GOLD_PRODUCT = process.env.PRICE_UPDATE_API_URL!;

const getGoldPrice = async (city = "Bangalore") => {
  try {
    await dbConnect();

    console.log(
      `📦 Fetching gold prices for city: ${city} at ${new Date().toLocaleString()}...`
    );

    const API_URL = `https://${API_HOST}/gold?city=${city}`;

    const response = await axios.get(API_URL, {
      headers: {
        "X-RapidAPI-Key": API_KEY,
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
        `✅ ${karat} updated: ₹${price.toFixed(2)} (Prev: ₹${previousPrice?.toFixed(2) ?? "N/A"}, Change: ${percentageChange?.toFixed(2) ?? "N/A"}%)`
      );
    }

    console.log("✅ All prices updated.");

    // Call external API after updating prices
    if (!API_ENDPOINT_GOLD_PRODUCT) {
      console.error(
        "❌ PRICE_UPDATE_API_URL is not defined in environment variables."
      );
      return;
    }

    try {
      const apiResponse = await axios.get(API_ENDPOINT_GOLD_PRODUCT);
      console.log("✅ API call success:");
    } catch (apiErr) {
      if (apiErr instanceof Error) {
        console.error(
          "❌ Failed to call PRICE_UPDATE_API_URL:",
          apiErr.message
        );
      } else {
        console.error("❌ Failed to call PRICE_UPDATE_API_URL:", apiErr);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Error fetching/updating prices:", err.message);
    } else {
      console.error("❌ Error fetching/updating prices:", err);
    }
  }
};

// Run immediately once (optional)
const cityArg = process.argv[2] || "Bangalore";
// getGoldPrice(cityArg);

// Schedule the cron job: 9 AM, 3 PM, 9 PM IST (cron: '30 3,9,15 * * *')
console.log(
  `⏰ Scheduling price update job at 9 AM, 3 PM, 9 PM IST (cron: '30 3,9,15 * * *')`
);

// Define all your exact times
const scheduleTimes = [
  { minute: 30, hour: 9 }, // 9:30 AM IST
  { minute: 0, hour: 14 }, // 2:00 PM IST
  { minute: 15, hour: 15 }, // 3:15 PM IST
  { minute: 30, hour: 15 }, // 3:30 PM IST
];

scheduleTimes.forEach(({ minute, hour }) => {
  const cronTime = `${minute} ${hour} * * *`;
  cron.schedule(
    cronTime,
    () => {
      console.log(
        `\n⏰ Running scheduled job at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`
      );
      getGoldPrice(cityArg);
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
});
