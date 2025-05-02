const axios = require("axios");
require("dotenv").config(); // Load .env variables

const API_KEY = process.env.GOLD_API_KEY;
const API_URL = "https://www.goldapi.io/api/XAU/INR";

// Calculate the final price with purity, duties, and GST
const calculateAdjustedPrice = (pricePerGram, purityFactor) => {
  // Step 1: Adjust for purity (specific purity factor for each gold type)
  const priceAfterPurity = pricePerGram * purityFactor;
  console.log(
    `🔹 Raw Price (After Purity Adjustment, Purity Factor ${purityFactor}): ₹${priceAfterPurity.toFixed(2)}`
  );

  // Step 2: Add Import Duties (15% total)
  const priceAfterDuties = priceAfterPurity * 1.15; // 15% Import Duties
  console.log(
    `🔸 Price after Import Duties (15%): ₹${priceAfterDuties.toFixed(2)} (Raw Price + 15% Duties)`
  );

  // Step 3: Add GST (3% GST)
  const priceAfterGST = priceAfterDuties * 1.03; // 3% GST
  console.log(
    `🔶 Price after GST (3%): ₹${priceAfterGST.toFixed(2)} (Price after Duties + 3% GST)`
  );

  return priceAfterGST;
};

// Fetch gold prices and calculate the adjusted prices
const getGoldPrice = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "x-access-token": API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("📥 API Response Data:", response.data);

    const {
      price_gram_24k,
      price_gram_22k,
      price_gram_18k,
      price_gram_14k,
    } = response.data;

    // Log headings for calculations
    console.log("\n==================== Gold Price Calculation ====================");

    // Purity factors for each gold type
    const purityFactor24K = 1.0; // 24K is 100% pure
    const purityFactor22K = 0.9167; // 22K is 91.67% pure
    const purityFactor18K = 0.75; // 18K is 75% pure
    const purityFactor14K = 0.5833; // 14K is 58.33% pure

    // Calculate the final price for each type of gold
    const finalPrice24K = calculateAdjustedPrice(price_gram_24k, purityFactor24K);
    const finalPrice22K = calculateAdjustedPrice(price_gram_22k, purityFactor22K);
    const finalPrice18K = calculateAdjustedPrice(price_gram_18k, purityFactor18K);
    const finalPrice14K = calculateAdjustedPrice(price_gram_14k, purityFactor14K);

    // Final Result in Tabular Format
    console.log("\n==================== Final Gold Prices ======================");
    console.table({
      "Gold Type": ["24K", "22K", "18K", "14K"],
      "Final Price (₹)": [
        finalPrice24K.toFixed(2),
        finalPrice22K.toFixed(2),
        finalPrice18K.toFixed(2),
        finalPrice14K.toFixed(2),
      ],
    });
  } catch (error) {
    console.error("❌ Error fetching gold prices:", error.message);
  }
};

getGoldPrice();
