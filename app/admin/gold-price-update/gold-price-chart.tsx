"use client"
import { useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useHistoricalStore from "@/lib/hooks/useHistoricalStore";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GoldPriceChart: React.FC = () => {
  const { historicalData, fetchHistoricalPrices } = useHistoricalStore();

  useEffect(() => {
    fetchHistoricalPrices();
    const interval = setInterval(fetchHistoricalPrices, 10000); // Auto-update every 10s
    return () => clearInterval(interval);
  }, [fetchHistoricalPrices]);

  // Prepare data for chart
  const labels: string[] = historicalData.map((entry) =>
    new Date(entry.timestamp).toLocaleTimeString()
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Gold Price (₹)",
        data: historicalData.map((entry) => entry.price),
        borderColor: "gold",
        backgroundColor: "rgba(255, 215, 0, 0.5)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2>📊 Gold Price Trend</h2>
      <Line data={data} />

      <style jsx>{`
        .chart-container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          text-align: center;
          background: #fff;
        }
      `}</style>
    </div>
  );
};

export default GoldPriceChart;
