// useGoldPriceStore.ts
import { create } from "zustand";
import axios from "axios";

interface GoldPrice {
  karat: string;
  price: number;
  previousPrice: number;
  percentageChange: number;
  direction: "up" | "down" | "same";
}

interface GoldPriceState {
  goldPrices: GoldPrice[];
  highLow: { highest: number; lowest: number };
  fetchGoldPrices: () => Promise<void>;
}

const useGoldPriceStore = create<GoldPriceState>((set) => ({
  goldPrices: [],
  highLow: { highest: 0, lowest: Infinity },

  fetchGoldPrices: async () => {
    try {
      const res = await axios.get<{
        data: {
          karat: string;
          price: number;
          previousPrice: number;
          percentageChange: number;
        }[];
      }>("/api/gold-price");

      const pricesWithDirection = res.data.data.map((item) => ({
        ...item,
        direction:
          item.percentageChange > 0
            ? "up"
            : item.percentageChange < 0
              ? "down"
              : "same",
      }));

      const highest = Math.max(...pricesWithDirection.map((p) => p.price));
      const lowest = Math.min(...pricesWithDirection.map((p) => p.price));

      set({
        goldPrices: pricesWithDirection,
        highLow: { highest, lowest },
      });
    } catch (error) {
      console.error("❌ Failed to fetch gold prices:", error);
    }
  },
}));

export default useGoldPriceStore;
