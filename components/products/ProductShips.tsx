import Image from "next/image";
import React from "react";

interface ProductShipsImageProps {
  src: string;
  alt?: string;
  height?: number;
  className?: string;
}

const ProductShips: React.FC<ProductShipsImageProps> = ({
  src,
  alt = "Gift Image",
  height = 200,
  className = "",
}) => {
  return (
    <div className={`w-full flex justify-center items-center ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={0} // Required for responsive images
        height={height}
        layout="responsive" // Makes the image take full width
        objectFit="cover" // Ensures the image fills the space properly
        className="rounded"
      />
    </div>
  );
};

export default ProductShips;
