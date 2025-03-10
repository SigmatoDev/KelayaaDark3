"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const ImageGallery = ({ productName }: { productName: string }) => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const res = await fetch(
          `/api/productImages?name=${encodeURIComponent(productName)}`
        );
        const data = await res.json();
        console.log("data", data);
        if (data && data.images.length > 0) {
          setImages(data.images);
          setSelectedImage(data.images[0]); // Set first image as default
        }
      } catch (error) {
        console.error("Error fetching product images:", error);
      }
    };

    fetchProductImages();
  }, [productName]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {images.length > 0 ? (
        <>
          <div className="flex md:flex-col gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`border-2 p-1 rounded-md ${
                  selectedImage === img ? "border-pink-500" : "border-gray-200"
                }`}
              >
                <Image
                  src={img}
                  alt={`Product ${index + 1}`}
                  width={60}
                  height={60}
                  className="rounded-md"
                />
              </button>
            ))}
          </div>
          <div className="flex-grow">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Selected Product"
                width={500}
                height={500}
                className="rounded-md w-full"
              />
            )}
          </div>
        </>
      ) : (
        <p>No images found for this product.</p>
      )}
    </div>
  );
};

export default ImageGallery;
