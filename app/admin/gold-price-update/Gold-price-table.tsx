"use client";
import useGoldPriceStore from "@/lib/hooks/useGoldPriceStore";
import { useEffect } from "react";

const GoldPriceTable: React.FC = () => {
  const { goldPrices, highLow, fetchGoldPrices } = useGoldPriceStore();

  useEffect(() => {
    fetchGoldPrices();

    // Auto-update prices every 10 seconds
    const interval = setInterval(fetchGoldPrices, 36000000);
    return () => clearInterval(interval);
  }, [fetchGoldPrices]);

  return (
    <div className="container">
      <h2>📈 Live Gold Prices (INR per Gram)</h2>
      <table className="gold-table">
        <thead>
          <tr>
            <th>Karat</th>
            <th>Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          {goldPrices.map((price) => (
            <tr key={price.karat}>
              <td>{price.karat}</td>
              <td>₹{price.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 
      <div className="high-low">
        <p>🔺 Highest Price: ₹{highLow.highest}</p>
        <p>🔻 Lowest Price: ₹{highLow.lowest}</p>
      </div> */}

      <style jsx>{`
        .container {
          max-width: 500px;
          margin: auto;
          padding: 20px;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 10px;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
        }
        .gold-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .gold-table th,
        .gold-table td {
          border: 1px solid #ddd;
          padding: 10px;
        }
        .high-low {
          margin-top: 10px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default GoldPriceTable;
