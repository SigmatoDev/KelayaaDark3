"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ProductCreateForm = () => {
  const [formData, setFormData] = useState<any>({
    name: "",
    productCode: "",
    productCategory: "",
    productType: "",
    materialType: "",
    price: "",
    countInStock: "",
    description: "",
    image: "",
    images: [],
    size: "",
    ring_size: "",
    weight: "",
    price_per_gram: "",
    info: "",
  });

  const [pricingData, setPricingData] = useState<any>({
    gemCut: "",
    carats: "",
    clarity: "",
    color: "",
    goldPurity: "",
    // goldPrice: "",
    grossWeight: "",
    pricePerGram: "",
    makingCharge: "",
    diamondPrice: "",
    diamondTotal: "",
    goldTotal: "",
    totalPrice: "",
  });

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePricingChange = (e: any) => {
    const { name, value } = e.target;
    setPricingData((prev: any) => ({ ...prev, [name]: value }));
  };

  const uploadToS3 = async (file: File) => {
    const data = new FormData();
    data.append("files", file);
    const res = await axios.post("/api/upload", data);
    const fileName = res.data.uploadResults[0].fileName;
    return `https://kelayaaimages.s3.ap-south-1.amazonaws.com/uploads/${fileName}`;
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "productCode",
      "productCategory",
      "productType",
      "materialType",
      "countInStock",
      "description",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`${field} is required.`);
        return false;
      }
    }

    // For Ring or Bangle type, size or ring_size should not be empty
    if (
      (formData.productType === "Ring" && !formData.ring_size) ||
      (formData.productType === "Bangle" && !formData.size)
    ) {
      toast.error("Size or Ring Size is required.");
      return false;
    }

    // If material is gold, check pricing details
    if (formData.materialType === "gold") {
      const pricingFields = [
        "gemCut",
        "carats",
        "clarity",
        "color",
        "goldPurity",
        // "goldPrice",
        "grossWeight",
        // "pricePerGram",
        "makingCharge",
        "diamondPrice",
        // "diamondTotal",
        // "goldTotal",
        // "totalPrice",
      ];

      for (let field of pricingFields) {
        if (!pricingData[field]) {
          toast.error(`${field} is required in Gold Pricing Details.`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    // Validate form before submitting
    if (!validateForm()) {
      setUploading(false);
      return;
    }

    try {
      const mainImageUrl = mainImageFile ? await uploadToS3(mainImageFile) : "";
      const galleryImageUrls = await Promise.all(galleryFiles.map(uploadToS3));

      const payload: any = {
        ...formData,
        image: mainImageUrl,
        images: galleryImageUrls,
      };

      // Attach pricing only if materialType is gold
      if (formData.materialType === "gold") {
        payload.pricingDetails = {
          ...pricingData,
          productCode: formData.productCode,
          productName: formData.name,
        };
      }

      const res = await axios.post("/api/admin/products", {
        products: [payload],
      });

      toast.success("Product created successfully!");
      setFormData({});
      setPricingData({});
      setGalleryFiles([]);
      setMainImageFile(null);
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error("Error occurred!");
    } finally {
      setUploading(false);
    }
  };

  const showRingSize =
    formData.productType === "Ring" || formData.productCategory === "Rings";
  const showSize = formData.productType === "Bangles";
  const isGold = formData.materialType === "gold";
  const isSilver = formData.materialType === "silver";

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setGalleryFiles((prev) => [
      ...prev,
      ...Array.from(files).filter((file) => file.type.startsWith("image")),
    ]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    const updatedFiles = galleryFiles.filter((_, i) => i !== index);
    setGalleryFiles(updatedFiles);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full mx-auto p-0 bg-white rounded-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-500">
        Create New Product
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          name="materialType"
          value={formData.materialType}
          onChange={handleInputChange}
          className="px-4 py-2 border rounded w-full"
        >
          <option value="">Select Material Type</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
        </select>

        {[
          "name",
          "productCode",
          "productCategory",
          "productType",
          "countInStock",
          "description",
        ].map((field) => (
          <input
            key={field}
            name={field}
            value={formData[field] || ""}
            onChange={handleInputChange}
            placeholder={field}
            className="px-4 py-2 border rounded w-full mb-2"
          />
        ))}

        {/* subCategories as comma-separated input */}
        <input
          name="subCategories"
          value={(formData.subCategories || []).join(", ")}
          onChange={(e) =>
            handleInputChange({
              target: {
                name: "subCategories",
                value: e.target.value.split(",").map((s) => s.trim()),
              },
            })
          }
          placeholder="Sub Categories (comma separated)"
          className="px-4 py-2 border rounded w-full mb-2"
        />

        {showRingSize && (
          <input
            name="ring_size"
            value={formData.ring_size || ""}
            onChange={handleInputChange}
            placeholder="Ring Size"
            className="px-4 py-2 border rounded w-full mb-2"
          />
        )}

        {showSize && (
          <input
            name="size"
            value={formData.size || ""}
            onChange={handleInputChange}
            placeholder="Size"
            className="px-4 py-2 border rounded w-full"
          />
        )}

        {isSilver && (
          <>
            <input
              name="weight"
              value={formData.weight || ""}
              onChange={handleInputChange}
              placeholder="Weight"
              className="px-4 py-2 border rounded w-full"
            />
            <input
              name="price_per_gram"
              value={formData.price_per_gram || ""}
              onChange={handleInputChange}
              placeholder="Price per gram"
              className="px-4 py-2 border rounded w-full"
            />
            <input
              name="info"
              value={formData.info || ""}
              onChange={handleInputChange}
              placeholder="Info"
              className="px-4 py-2 border rounded w-full"
            />
          </>
        )}
      </div>

      {/* info as textarea */}
      <textarea
        name="info"
        value={formData.info || ""}
        onChange={handleInputChange}
        placeholder="Info"
        className="px-4 py-2 border rounded w-full mb-2"
      />

      {/* GOLD PRICING SECTION */}
      {isGold && (
        <div className="space-y-4 bg-gray-50 p-4 border rounded-md">
          <h3 className="text-lg font-semibold">Gold Pricing Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "gemCut",
              "carats",
              "clarity",
              "color",
              "goldPurity",
              "grossWeight",
              "makingCharge",
              "diamondPrice",
            ].map((field) =>
              field === "goldPurity" ? (
                <select
                  key={field}
                  name={field}
                  value={pricingData[field] || ""}
                  onChange={handlePricingChange}
                  className="px-4 py-2 border rounded w-full"
                >
                  <option value="">Select Gold Purity</option>
                  <option value="14K">14K</option>
                  <option value="18K">18K</option>
                  <option value="22K">22K</option>
                  <option value="24K">24K</option>
                </select>
              ) : (
                <input
                  key={field}
                  name={field}
                  value={pricingData[field] || ""}
                  onChange={handlePricingChange}
                  placeholder={field}
                  className="px-4 py-2 border rounded w-full"
                />
              )
            )}
          </div>
        </div>
      )}

      {/* MAIN IMAGE */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-700">Main Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
        />
        {mainImageFile && (
          <img
            src={URL.createObjectURL(mainImageFile)}
            alt="Main preview"
            className="mt-2 w-28 h-28 object-cover border"
          />
        )}
      </div>

      {/* GALLERY IMAGES */}
      <div
        className="space-y-2 border-dashed border-2 p-4 border-gray-400 rounded-md"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <label className="block font-medium text-gray-700">
          Gallery Images
        </label>
        <div className="flex flex-wrap gap-4 items-center">
          {galleryFiles.map((file, idx) => (
            <div
              key={idx}
              className="relative w-24 h-24 border rounded overflow-hidden"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
              >
                X
              </button>
            </div>
          ))}
          <label
            htmlFor="gallery-upload"
            className="flex items-center justify-center w-24 h-24 border border-dashed rounded cursor-pointer text-gray-400 hover:text-blue-600 hover:border-blue-600"
            title="Add more images"
          >
            <span className="text-3xl font-bold">+</span>
            <input
              id="gallery-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setGalleryFiles((prev) => [
                  ...prev,
                  ...Array.from(e.target.files || []).filter((file) =>
                    file.type.startsWith("image")
                  ),
                ])
              }
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded-md"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Submit Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductCreateForm;
