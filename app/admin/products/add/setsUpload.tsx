"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { Upload } from "lucide-react";
import useSWRMutation from "swr/mutation";

export default function UploadSetProductExcelFile() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { trigger: createSetProduct } = useSWRMutation(
    `/api/admin/products/sets`,
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
        const rawRows = XLSX.utils.sheet_to_json(sheet);

        if (rawRows.length === 0) {
          toast.error("No data found in Excel file.");
          return;
        }

        console.log("📦 Raw Excel Rows:", rawRows);

        setIsUploading(true);

        // Fetch S3 images
        const s3Res = await fetch("/api/admin/get-s3-images");
        const s3Data = await s3Res.json();
        if (!s3Res.ok) {
          toast.error("Failed to fetch S3 images.");
          return;
        }

        console.log("🖼️ S3 Images Fetched:", s3Data.images);

        const s3ImageMap = new Map<string, string>();
        s3Data.images.forEach((file: { filename: string; url: string }) => {
          const base = file.filename
            .replace(/^uploads\//, "")
            .replace(/\.\w+$/, "")
            .toLowerCase();
          s3ImageMap.set(base, file.url);
        });

        console.log("🗺️ S3 Image Map:", s3ImageMap);

        // Group by SL No
        const groupedProducts = new Map<string, any>();

        rawRows.forEach((row: any, index: number) => {
          const slNo = row["SL No"];
          const item = {
            productCategory: row.productCategory || null,
            gemCut: row.gemCut || null,
            carats: row.carats ? Number(row.carats) : null,
            clarity: row.clarity || null,
            color: row.color || null,
            goldPurity: row.goldPurity || null,
          };

          if (slNo) {
            const rawImages = row.image
              ? row.image.split(",").map((img: string) => img.trim())
              : [];
            const allImages = rawImages.map((img: string) => {
              const key = img.replace(/\.\w+$/, "").toLowerCase();
              return s3ImageMap.get(key) || img;
            });

            const fallbackName = row.name?.trim() || "Unnamed Set";
            const fallbackSlug = fallbackName
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]+/g, "");

            const product = {
              name: fallbackName,
              slug: fallbackSlug,
              productCode: row.productCode?.trim() || null,
              description: row.description || "",
              subCategories:
                typeof row.subCategories === "string"
                  ? row.subCategories
                      .split("/")
                      .slice(0, 2) // limit to 2 levels
                      .map((s: string) => s.trim())
                      .filter((s: string) => s.length > 0)
                  : [],

              price: row.price ? Number(row.price) : 0,
              countInStock: row.countInStock ? Number(row.countInStock) : 0,
              image: allImages[0] || "",
              images: allImages,
              items: [item],
              productType: "Sets",
            };

            groupedProducts.set(slNo, product);

            console.log(
              `🧩 New Jewelry Set Started for SL No: ${slNo}`,
              product
            );
          } else {
            // No SL No means it's a continuation of the previous set
            const lastKey = Array.from(groupedProducts.keys()).pop();
            if (lastKey && groupedProducts.has(lastKey)) {
              groupedProducts.get(lastKey).items.push(item);
              console.log(`➕ Appended item to SL No ${lastKey}:`, item);
            }
          }
        });

        const finalProducts = Array.from(groupedProducts.values());

        console.log(
          "✅ Final Grouped Jewelry Sets Ready for Upload:",
          finalProducts
        );

        await createSetProduct({ products: finalProducts });

        toast.success("Jewelry sets uploaded successfully!");
        router.push("/admin/products");
      } catch (error) {
        console.error("❌ Excel processing failed:", error);
        toast.error("Failed to process Excel file.");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6">
      <h1 className="text-2xl text-orange-500">Upload Jewelry Sets (Excel)</h1>
      <div
        className="w-80 h-48 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
        onClick={() => fileInputRef.current?.click()}
      >
        <label className="flex items-center justify-center gap-2 cursor-pointer">
          <Upload className="h-10 w-10 text-gray-500 mb-2" />
          <span className="text-sm text-orange-600 font-medium">
            Click to upload Excel file
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
      {fileName && <p className="text-sm text-gray-700">File: {fileName}</p>}
      {isUploading && (
        <p className="text-sm text-blue-500 animate-pulse">Uploading...</p>
      )}
    </div>
  );
}
