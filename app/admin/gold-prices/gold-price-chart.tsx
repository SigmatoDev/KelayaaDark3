"use client";

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
  Filler,
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
  Legend,
  Filler
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
    new Date(entry.updatedAt).toLocaleTimeString()
  );

  // Highlight points with significant price change
  const priceChanges = historicalData.map((entry, index) => {
    if (index > 0) {
      const change =
        ((entry.price - historicalData[index - 1].price) /
          historicalData[index - 1].price) *
        100;
      return Math.abs(change) > 2 ? change : 0; // Highlight if price change is greater than 2%
    }
    return 0;
  });

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
        pointRadius: 5,
        pointBackgroundColor: (context: any) => {
          const index = context.dataIndex;
          return priceChanges[index] > 2
            ? priceChanges[index] > 0
              ? "green"
              : "red"
            : "gold";
        },
        pointHoverRadius: 8,
        pointHoverBackgroundColor: (context: any) => {
          const index = context.dataIndex;
          return priceChanges[index] > 2
            ? priceChanges[index] > 0
              ? "green"
              : "red"
            : "gold";
        },
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2>📊 Gold Price Trend</h2>
      <Line data={data} options={chartOptions} />

      <style jsx>{`
        .chart-container {
          max-width: 800px;
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

// Chart options to enable tooltips and responsive design
const chartOptions = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        title: (tooltipItems: any) => {
          return `Price at ${tooltipItems[0].label}`;
        },
        label: (tooltipItem: any) => {
          return `₹${tooltipItem.raw.toFixed(2)}`;
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Time",
      },
    },
    y: {
      title: {
        display: true,
        text: "Price (₹)",
      },
      ticks: {
        beginAtZero: false,
        callback: function (value: any) {
          return "₹" + value.toFixed(2);
        },
      },
    },
  },
};

export default GoldPriceChart;
