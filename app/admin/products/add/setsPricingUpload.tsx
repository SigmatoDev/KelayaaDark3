// components/ExcelUploadPreview.tsx
"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

interface Pricing {
  diamondPrice: number;
  goldPrice: number;
  grossWeight: number;
  pricePerGram: number;
  makingCharges: number;
  diamondTotal: number;
  goldTotal: number;
  totalPrice: number;
}

interface ProductRow {
  pricing: Pricing;
}

const ExcelUploadPreview: React.FC = () => {
  const [data, setData] = useState<ProductRow[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const formatted: ProductRow[] = jsonData.map((row: any) => ({
        pricing: {
          diamondPrice: Number(row["Diamond Price"]),
          goldPrice: Number(row["Gold Price"]),
          grossWeight: Number(row["Gross Weight"]),
          pricePerGram: Number(row["Price/gram"]),
          makingCharges: Number(row["Making Charges"]),
          diamondTotal: Number(row["Diamond Total"]),
          goldTotal: Number(row["Gold Total"]),
          totalPrice: Number(row["Total Price (Rs)"]),
        },
      }));

      setData(formatted);
      setShowPreview(false);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Upload Excel & Preview Pricing
      </h2>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {data.length > 0 && (
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showPreview ? "Hide Preview" : "Preview"}
        </button>
      )}

      {showPreview && (
        <div className="mt-6 space-y-4">
          {data.map((item, index) => (
            <pre
              key={index}
              className="bg-gray-100 p-4 rounded border border-gray-300"
            >
              {JSON.stringify(item, null, 2)}
            </pre>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExcelUploadPreview;
