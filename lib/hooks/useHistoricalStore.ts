import axios from 'axios'
import { create } from 'zustand'

// Define types for historical data entry
interface HistoricalEntry {
  timestamp: string; // ISO date string
  price: number;
}

// Define Zustand store type
interface HistoricalStore {
  historicalData: HistoricalEntry[];
  fetchHistoricalPrices: () => Promise<void>;
}

const useHistoricalStore = create<HistoricalStore>((set) => ({
  historicalData: [],

  fetchHistoricalPrices: async () => {
    try {
      const res = await axios.get<{ data: HistoricalEntry[] }>(
        "/api/historical-prices"
      );
      set({ historicalData: res.data.data });
    } catch (error) {
      console.error("❌ Failed to fetch historical data:", error);
    }
  },
}));

export default useHistoricalStore;
