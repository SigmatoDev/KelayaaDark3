// components/ImageGallery.js
"use client";

import { useState } from "react";
import Image from "next/image";

const images = [
  "/images/ring1.png",
  "/images/ring2.png",
  "/images/ring3.png",
  "/images/ring4.png",
  "/images/ring5.png",
];

const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
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
              alt={`Ring ${index + 1}`}
              width={60}
              height={60}
              className="rounded-md"
            />
          </button>
        ))}
      </div>
      <div className="flex-grow">
        <Image
          src={selectedImage}
          alt="Selected Ring"
          width={500}
          height={500}
          className="rounded-md w-full"
        />
      </div>
    </div>
  );
};

export default ImageGallery;
