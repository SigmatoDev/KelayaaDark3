"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { Upload } from "lucide-react";
import useSWRMutation from "swr/mutation";

export default function UploadGoldDiamondProductPricingExcelFile() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { trigger: createProduct } = useSWRMutation(
    `/api/admin/products/pricing-details`,
    async (url, { arg }: { arg: { products: any[] } }) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    }
  );

  const uploadExcelFile = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = event.target?.result;
      if (!data) return;

      try {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const products = XLSX.utils.sheet_to_json(sheet);
        console.log("products....", products);

        if (products.length === 0) {
          toast.error("No products found in the file.");
          return;
        }

        setIsUploading(true);

        // Map Excel data to MongoDB schema
        const productData = products.map((product: any) => ({
          productName: product["Product Name"] || "",
          productCode: product["Product Code"] || "",
          productType: product["Product Type"] || "",
          gemCut: product["Gem Cut"] || "",
          size: product["Size"] || "",
          ringSize: Number(product["Ring Size"]) || 0,
          carats: Number(product["Carats"]) || 0,
          diamondPrice: Number(product["Diamond Price"]) || 0,
          clarity: product["Clarity"] || "",
          color: product["Color "] || "",
          goldPurity: product["Gold Purity"] || "",
          goldPrice: Number(product["Gold price"]) || 0,
          grossWeight: Number(product["Gross Weight"]) || 0,
          pricePerGram: Number(product["Price/gram"]) || 0,
          makingCharge: Number(product["Making Charge"]) || 0,
          diamondTotal: Number(product["Diamond Total"]) || 0,
          goldTotal: Number(product["Gold Total"]) || 0,
          totalPrice: Number(product["Total Price"]) || 0,
        }));

        await createProduct({ products: productData });
        setIsUploading(false);
        toast.success("Products uploaded successfully!");
        // router.push(`/admin/products`);
      } catch (error) {
        toast.error("Failed to parse Excel file.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6">
      <h1 className="text-2xl text-orange-500">
        Upload Gold & Diamond Products
      </h1>
      <div
        className="w-80 h-48 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
        onClick={() => fileInputRef.current?.click()}
      >
        <label className="flex items-center justify-center gap-2 cursor-pointer">
          <Upload className="h-10 w-10 text-gray-500 mb-2" />
          <span className="text-sm text-orange-600 font-medium">
            Click to upload an Excel file
          </span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          onChange={uploadExcelFile}
          className="hidden"
          accept=".xlsx, .xls"
        />
      </div>
      {fileName && (
        <p className="mt-2 text-sm text-gray-700">File: {fileName}</p>
      )}
    </div>
  );
}
