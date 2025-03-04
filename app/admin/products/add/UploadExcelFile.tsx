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
  const [isUploading, setIsUploading] = useState(false); // Track if upload is in progress
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // SWR Mutation hook to create a batch of products
  const { trigger: createProduct } = useSWRMutation(
    `/api/admin/products`,
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

  const uploadExcelFile = (e: any) => {
    console.log("File input triggered", e.target.files); // Check if files are passed

    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    setFileName(file.name);
    console.log("Selected file:", file); // Log selected file details

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target?.result;
      if (!data) {
        console.log("Failed to read file data");
        return;
      }

      try {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Get the first sheet name
        const sheet = workbook.Sheets[sheetName];
        const products = XLSX.utils.sheet_to_json(sheet);

        console.log("Extracted products:", products); // Log the extracted product data
        console.log("Sheet name:", sheetName); // Log the sheet name

        if (products.length === 0) {
          console.log("No products found in the sheet");
          toast.error("No products found in the file.");
          return;
        }

        setIsUploading(true);
        setUploadProgress(0); // Reset progress to 0 at the start

        // Simulate upload progress with buffer time
        let progress = 0;
        const uploadInterval = setInterval(() => {
          if (progress < 100) {
            progress += 10; // Increase progress by 10% every 500ms
            setUploadProgress(progress);
          } else {
            clearInterval(uploadInterval);
            setUploadComplete(true);
            setIsUploading(false);
            toast.success("Products uploaded successfully!"); // This toast will show only when upload is complete
            router.push(`/admin/products`);
          }
        }, 500);

        // Prepare products for batch creation with sheetName as productCategory
        const productData = products.map((product: any) => ({
          ...product,
          productCategory: sheetName, // Assign sheet name as product category
          image: product.image || "", // Ensure image is present or default to empty
        }));

        // Simulate delay and then trigger the API call
        setTimeout(async () => {
          await createProduct({ products: productData }); // Send products array to API
        }, 2000); // 2 second delay for the simulation
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

  const handleFileInputClick = () => {
    fileInputRef.current?.click(); // Trigger file input click
  };

  // Circular Progress SVG
  const CircularProgress = () => {
    const strokeColor = uploadProgress === 100 ? "#34D399" : "#e65100"; // Green for complete, Blue for progress

    return (
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        xmlns="http://www.w3.org/2000/svg"
        className="relative"
      >
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke={strokeColor}
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${(2 * Math.PI * 40 * uploadProgress) / 100} ${2 * Math.PI * 40}`}
          transform="rotate(-90 48 48)"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          fontSize="18"
          fontWeight="bold"
          fill={uploadProgress === 100 ? "green" : "white"}
        >
          {uploadProgress === 100 ? (
            <CheckCircle className="text-green-500 h-6 w-6" />
          ) : (
            `${uploadProgress}%`
          )}
        </text>
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6">
      <h1 className="text-2xl text-orange-500">Upload Products via Excel</h1>

      <div
        className="w-96 h-48 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-blue-500 hover:bg-transparent hover:shadow-lg hover:text-blue-500 relative"
        onClick={handleFileInputClick} // Trigger file input on click anywhere inside the box
      >
        {/* Hide the text and show progress or success design */}
        {!isUploading && !uploadComplete && (
          <>
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
          </>
        )}

        {/* Show circular progress bar during upload */}
        {isUploading && (
          <div className="absolute inset-0 flex justify-center items-center">
            <CircularProgress />
          </div>
        )}

        {/* Show success message after upload */}
        {uploadComplete && !isUploading && (
          <div className="absolute inset-0 flex justify-center items-center text-green-600">
            <CheckCircle className="h-10 w-10 text-green-500" />
            <p className="text-lg ml-2">Upload Completed!</p>
          </div>
        )}

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
