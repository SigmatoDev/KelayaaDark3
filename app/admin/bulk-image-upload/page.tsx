"use client";
import { useState } from "react";
import axios from "axios";

const ImageUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResults, setUploadResults] = useState<
    { fileName: string; status: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) {
      setError("Please select files to upload.");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadResults([]);

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("image reposne", response);
      setUploadResults(response.data.uploadResults);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center my-8">
      <div className="p-4 border rounded-lg shadow-md w-96 bg-gray-800 ">
        <h2 className="text-xl font-semibold mb-4">Upload Images to S3</h2>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full border p-2 mb-3 rounded-md"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full p-2 rounded-md text-white ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        {uploadResults.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium">Upload Results:</h3>
            <ul className="list-disc pl-5">
              {uploadResults.map((file, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {file.fileName} - {file.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
