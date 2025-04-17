"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { Upload, CheckCircle } from "lucide-react";
import useSWRMutation from "swr/mutation";

export default function UploadProductExcelFile() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { trigger: createProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { products: any[] } }) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      console.log("data", data);
      if (!res.ok) throw new Error(data.message);
      return data;
    }
  );

  const uploadExcelFile = async (e: any) => {
    console.log("File input triggered", e.target.files);
    const file = e.target.files[0];

    if (!file) {
      console.log("No file selected");
      return;
    }

    setFileName(file.name);
    console.log("Selected file:", file);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target?.result;
      if (!data) {
        console.log("Failed to read file data");
        return;
      }

      try {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const products = XLSX.utils.sheet_to_json(sheet);

        if (products.length === 0) {
          toast.error("No products found in the file.");
          return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        // Fetch S3 images before processing
        const s3ImagesResponse = await fetch("/api/admin/get-s3-images");
        const s3ImagesData = await s3ImagesResponse.json();

        if (!s3ImagesResponse.ok) {
          toast.error("Failed to fetch S3 images.");
          return;
        }

        const S3_BUCKET_URL =
          "https://kelayaaimages.s3.ap-south-1.amazonaws.com/uploads/";

        // Map filenames to full S3 URLs
        // Map filenames to full S3 URLs
        const s3ImageMap = new Map<string, string>();
        s3ImagesData.images.forEach(
          (file: { filename: string; url: string }) => {
            // Extract only the base filename (remove 'uploads/' prefix)
            const baseName = file.filename
              .replace(/^uploads\//, "")
              .replace(/\.\w+$/, "")
              .toLowerCase();
            s3ImageMap.set(baseName, file.url);
          }
        );

        console.log("S3 Image Map:", s3ImageMap);

        const productData = products.map((product: any) => {
          const rawImages = product.image
            ? product.image.split(",").map((img: string) => img.trim())
            : [];

          console.log("Raw images from Excel:", rawImages);

          // Normalize and match filenames
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

          return {
            ...product,
            productCategory: sheetName,
            image: firstImage, // Full URL
            images: allImages, // Array of full URLs
          };
        });

        console.log("Final Processed Product Data:", productData);

        setTimeout(async () => {
          await createProduct({ products: productData });
          setUploadComplete(true);
          setIsUploading(false);
          toast.success("Products uploaded successfully!");
          router.push(`/admin/products`);
        }, 2000);
      } catch (error) {
        console.log("Error parsing Excel file:", error);
        toast.error("Failed to parse Excel file.");
      }
    };

    reader.onerror = (error) => {
      console.log("FileReader error:", error);
      toast.error("Error reading the file.");
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6">
      <h1 className="text-2xl text-orange-500">Upload Products via Excel</h1>

      <div
        className="w-80  h-48 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-blue-500 hover:bg-transparent hover:shadow-lg hover:text-blue-500 relative"
        onClick={() => fileInputRef.current?.click()}
      >
        <label
          htmlFor="image"
          className="flex items-center justify-center gap-2 cursor-pointer"
        >
          <Upload className="h-10 w-10 text-gray-500 mb-2" />
          <span className="text-sm text-orange-600 font-medium">
            Click to upload an Excel file
          </span>
          <p className="text-xs text-gray-400">(Accepted: .xlsx, .xls)</p>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          id="excel-file"
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
