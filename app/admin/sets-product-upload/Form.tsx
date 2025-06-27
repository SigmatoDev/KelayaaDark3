"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const SetProductCreateForm = () => {
  const [formData, setFormData] = useState<any>({
    name: "",
    productCode: "",
    collectionType: "",
    description: "",
    materialType: "gold",
    productType: "Sets",
    countInStock: "",
    subCategories: [],
    image: "",
    images: [],
  });

  const [items, setItems] = useState<any[]>([
    {
      productCategory: "",
      gemCut: "",
      carats: "",
      clarity: "",
      color: "",
      goldPurity: "",
      pricing: {
        diamondPrice: "",
        goldPrice: "",
        grossWeight: "",
        pricePerGram: "",
        makingCharges: "",
      },
    },
  ]);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  const fetchGoldPrice = async (karat: string, index: number) => {
    try {
      const res = await axios.get("/api/gold-price");
      const goldData = res.data?.data || [];

      const priceEntry = goldData.find((entry: any) => entry.karat === karat);
      if (!priceEntry) return toast.error("Gold price not found for " + karat);

      const updated = [...items];
      updated[index].pricing.goldPrice = priceEntry.price;
      setItems(updated);
    } catch (err) {
      console.error("Error fetching gold price:", err);
      toast.error("Failed to fetch gold price");
    }
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...items];
    if (field in updatedItems[index]) {
      updatedItems[index][field] = value;
      if (field === "goldPurity") fetchGoldPrice(value, index);
    } else {
      updatedItems[index].pricing[field] = value;
    }
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        productCategory: "",
        gemCut: "",
        carats: "",
        clarity: "",
        color: "",
        goldPurity: "",
        pricing: {
          diamondPrice: "",
          goldPrice: "",
          grossWeight: "",
          pricePerGram: "",
          makingCharges: "",
        },
      },
    ]);
  };

  const removeItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const uploadToS3 = async (file: File) => {
    const data = new FormData();
    data.append("files", file);
    const res = await axios.post("/api/upload", data);
    const fileName = res.data.uploadResults[0].fileName;
    return `https://kelayaaimages.s3.ap-south-1.amazonaws.com/uploads/${fileName}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const image = mainImageFile ? await uploadToS3(mainImageFile) : "";
      const images = await Promise.all(galleryFiles.map(uploadToS3));

      const payload = {
        ...formData,
        image,
        images,
        items,
      };

      await axios.post("/api/admin/products/setsproducts", payload);
      toast.success("Set product created!");

      setFormData({
        name: "",
        productCode: "",
        collectionType: "",
        description: "",
        materialType: "gold",
        productType: "Sets",
        countInStock: "",
        subCategories: [],
        image: "",
        images: [],
      });
      setItems([]);
      setGalleryFiles([]);
      setMainImageFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Error creating product");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">Create Set Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["name", "productCode", "collectionType", "countInStock"].map(
          (field) =>
            field === "collectionType" ? (
              <select
                key={field}
                name={field}
                value={formData[field]}
                onChange={handleFormChange}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Collection Type</option>
                <option value="Air">Air</option>
                <option value="Water">Water</option>
                <option value="Earth">Earth</option>
                <option value="Fire">Fire</option>
              </select>
            ) : (
              <input
                key={field}
                name={field}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={formData[field]}
                onChange={handleFormChange}
                className="border rounded px-3 py-2"
              />
            )
        )}

        <input
          name="subCategories"
          placeholder="Sub Categories (comma separated)"
          value={(formData.subCategories || []).join(", ")}
          onChange={(e) =>
            handleFormChange({
              target: {
                name: "subCategories",
                value: e.target.value.split(",").map((s) => s.trim()),
              },
            })
          }
          className="border rounded px-3 py-2"
        />
      </div>

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleFormChange}
        className="border rounded px-3 py-2 w-full"
      />

      <div className="space-y-4">
        <h3 className="font-semibold">Set Items</h3>
        {items.map((item, i) => (
          <div key={i} className="p-4 border rounded space-y-2 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                placeholder="Product Category"
                value={item.productCategory}
                onChange={(e) =>
                  handleItemChange(i, "productCategory", e.target.value)
                }
                className="border rounded px-3 py-2"
              />
              <input
                placeholder="Gem Cut"
                value={item.gemCut}
                onChange={(e) => handleItemChange(i, "gemCut", e.target.value)}
                className="border rounded px-3 py-2"
              />
              <input
                placeholder="Carats"
                value={item.carats}
                onChange={(e) => handleItemChange(i, "carats", e.target.value)}
                className="border rounded px-3 py-2"
              />
              <input
                placeholder="Clarity"
                value={item.clarity}
                onChange={(e) => handleItemChange(i, "clarity", e.target.value)}
                className="border rounded px-3 py-2"
              />
              <input
                placeholder="Color"
                value={item.color}
                onChange={(e) => handleItemChange(i, "color", e.target.value)}
                className="border rounded px-3 py-2"
              />

              {/* Gold Purity Dropdown */}
              <select
                value={item.goldPurity}
                onChange={(e) =>
                  handleItemChange(i, "goldPurity", e.target.value)
                }
                className="border rounded px-3 py-2"
              >
                <option value="">Select Gold Purity</option>
                <option value="14K">14K</option>
                <option value="18K">18K</option>
                <option value="22K">22K</option>
              </select>

              <input
                placeholder="Diamond Price"
                value={item.pricing.diamondPrice}
                onChange={(e) =>
                  handleItemChange(i, "diamondPrice", e.target.value)
                }
                className="border rounded px-3 py-2"
              />
              <input
                placeholder="Gold Price"
                value={item.pricing.goldPrice}
                readOnly
                className="border rounded px-3 py-2 bg-gray-100"
              />
              <input
                placeholder="Gross Weight"
                value={item.pricing.grossWeight}
                onChange={(e) =>
                  handleItemChange(i, "grossWeight", e.target.value)
                }
                className="border rounded px-3 py-2"
              />
              <input
                placeholder="Price per Gram"
                value={item.pricing.pricePerGram}
                onChange={(e) =>
                  handleItemChange(i, "pricePerGram", e.target.value)
                }
                className="border rounded px-3 py-2"
              />
              <input
                placeholder="Making Charges"
                value={item.pricing.makingCharges}
                onChange={(e) =>
                  handleItemChange(i, "makingCharges", e.target.value)
                }
                className="border rounded px-3 py-2"
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-red-600 underline"
              >
                Remove Item
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          + Add Item
        </button>
      </div>

      {/* MAIN IMAGE */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-700">Main Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
        />
        {mainImageFile && (
          <div className="relative w-28 h-28 mt-2 border rounded overflow-hidden">
            <img
              src={URL.createObjectURL(mainImageFile)}
              alt="Main preview"
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={() => setMainImageFile(null)}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
            >
              X
            </button>
          </div>
        )}
      </div>

      {/* GALLERY IMAGES */}
      <div
        className="space-y-2 border-dashed border-2 p-4 border-gray-400 rounded-md"
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files || []).filter((file) =>
            file.type.startsWith("image")
          );
          setGalleryFiles((prev) => [...prev, ...files]);
        }}
        onDragOver={(e) => e.preventDefault()}
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
                onClick={() =>
                  setGalleryFiles((prev) => prev.filter((_, i) => i !== idx))
                }
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
              >
                X
              </button>
            </div>
          ))}

          {/* Add More Images Button */}
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

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded"
        disabled={uploading}
      >
        {uploading ? "Submitting..." : "Submit Set Product"}
      </button>
    </form>
  );
};

export default SetProductCreateForm;
