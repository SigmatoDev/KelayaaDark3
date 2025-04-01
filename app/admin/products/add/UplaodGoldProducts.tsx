"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { Upload } from "lucide-react";
import useSWRMutation from "swr/mutation";

export default function UploadGoldProductExcelFile() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { trigger: createProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { products: any[] } }) => {
      console.log("Sending data to API:", arg);
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

        console.log("Parsed products from Excel:", products);

        if (products.length === 0) {
          toast.error("No products found in the file.");
          return;
        }

        setIsUploading(true);

        // Fetch S3 image mappings
        const s3ImagesResponse = await fetch("/api/admin/get-s3-images");
        const s3ImagesData = await s3ImagesResponse.json();
        if (!s3ImagesResponse.ok) {
          toast.error("Failed to fetch S3 images.");
          return;
        }

        console.log("Fetched S3 images:", s3ImagesData);

        const s3ImageMap = new Map<string, string>();
        s3ImagesData.images.forEach(
          (file: { filename: string; url: string }) => {
            const baseName = file.filename
              .replace(/^uploads\//, "")
              .replace(/\.\w+$/, "")
              .toLowerCase();
            s3ImageMap.set(baseName, file.url);
          }
        );

        console.log("Mapped S3 image URLs:", s3ImageMap);

        // Process products
        const productData = products.map((product: any) => {
          const rawImages = product.image
            ? product.image.split(",").map((img: string) => img.trim())
            : [];
          const firstImageKey =
            rawImages.length > 0
              ? rawImages[0].replace(/\.\w+$/, "").toLowerCase()
              : "";
          const firstImage =
            firstImageKey && s3ImageMap.has(firstImageKey)
              ? s3ImageMap.get(firstImageKey)
              : "";
          const allImages = rawImages.map((img: string) => {
            const key = img.replace(/\.\w+$/, "").toLowerCase();
            return s3ImageMap.has(key) ? s3ImageMap.get(key) : img;
          });

          console.log("Processed product:", {
            name: product.name,
            productCode: product.productCode,
            image: firstImage,
            images: allImages,
          });

          return {
            name: product.name,
            productCode: product.productCode,
            productCategory: product.productCategory,
            image: firstImage,
            images: allImages,
            description: product.description,
            goldPurity: product.goldPurity,
            gemCut: product.gemCut,
            carats: product.carats,
            clarity: product.clarity,
            color: product.color,
            subCategories: product.subCategories || null,
            productType: product.productCategory,
          };
        });

        console.log("Final product data before upload:", productData);

        await createProduct({ products: productData });
        setIsUploading(false);
        toast.success("Products uploaded successfully!");
        router.push(`/admin/products`);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
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
