import axios from "axios";
import { create } from "zustand";

// Define types for historical data entry
interface HistoricalEntry {
  _id: string;
  price: number;
  updatedAt: string; // ISO Date string
}

interface HistoricalDataByKarat {
  updatedAt: string | number | Date;
  price: any;
  karat: "18K" | "22K" | "24K" | "14K";
  history: HistoricalEntry[];
}

// Define Zustand store type
interface HistoricalStore {
  historicalData: HistoricalDataByKarat[];
  fetchHistoricalPrices: () => Promise<void>;
}

const useHistoricalStore = create<HistoricalStore>((set) => ({
  historicalData: [],

  fetchHistoricalPrices: async () => {
    try {
      const res = await axios.get<{ data: HistoricalDataByKarat[] }>(
        "/api/historical-prices"
      );
      set({ historicalData: res.data.data });
    } catch (error) {
      console.error("❌ Failed to fetch historical data:", error);
    }
  },
}));

export default useHistoricalStore;
