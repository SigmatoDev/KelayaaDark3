import { create } from 'zustand'
import axios from 'axios'

// Define State
interface GoldPriceState {
  goldPrices: { karat: string; price: number }[];
  highLow: { highest: number; lowest: number };
  fetchGoldPrices: () => Promise<void>;
}

// Create Zustand Store
const useGoldPriceStore = create<GoldPriceState>((set) => ({
  goldPrices: [],
  highLow: { highest: 0, lowest: Infinity },

  fetchGoldPrices: async () => {
    try {
      const now = new Date();
      const currentHour = now.getHours();
      console.log(
        `⏰ Checking time: ${now.toLocaleTimeString()} (Hour: ${currentHour})`
      );

      // Fetch only if it's 9 AM, 3 PM, 5 PM, or 9 PM
      if ([9, 15, 17, 21].includes(currentHour)) {
        console.log("✅ Fetching gold prices from API...");

        const res = await axios.get<{
          data: { karat: string; price: number }[];
        }>("/api/gold-price");

        console.log("📥 API Response:", res.data);

        const prices = res.data.data;
        const highest = Math.max(...prices.map((p) => p.price));
        const lowest = Math.min(...prices.map((p) => p.price));

        console.log(
          `🔺 Highest Price: ₹${highest}, 🔻 Lowest Price: ₹${lowest}`
        );

        set({ goldPrices: prices, highLow: { highest, lowest } });
      } else {
        console.log(
          "⏳ Not fetching now. Will fetch at 9 AM, 3 PM, 5 PM, or 9 PM."
        );
      }
    } catch (error) {
      console.error("❌ Failed to fetch gold prices:", error);
    }
  },
}));

export default useGoldPriceStore;
