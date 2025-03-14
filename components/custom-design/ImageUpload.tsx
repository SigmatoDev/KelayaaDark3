"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface ImageUploadProps {
  imageUrl?: string;
  onImageUploaded: (url: string) => void;
  setIsUploading: (isUploading: boolean) => void;
}

export default function ImageUpload({
  imageUrl,
  onImageUploaded,
  setIsUploading
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const formData = new FormData();
    formData.append('files', file);

    try {
      setIsUploading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const uploadedUrl = `https://kelayaaimages.s3.ap-south-1.amazonaws.com/uploads/${data.uploadResults[0].fileName}`;
      onImageUploaded(uploadedUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
        dragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleUpload(e.dataTransfer.files);
      }}
    >
      {imageUrl ? (
        <div className="relative h-64 w-full">
          <Image
            src={imageUrl}
            alt="Uploaded design"
            fill
            className="object-contain rounded-lg"
          />
          <button
            onClick={() => onImageUploaded('')}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            />
          </svg>
          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-white px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Choose file
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            or drag and drop your design image here
          </p>
        </div>
      )}
    </div>
  );
} 