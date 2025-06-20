"use client";

import React, { useState } from "react";
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

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...items];
    if (field in updatedItems[index]) {
      updatedItems[index][field] = value;
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

      const res = await axios.post("/api/admin/setsproducts", payload);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleFormChange}
          className="input"
        />
        <input
          name="productCode"
          placeholder="Product Code"
          value={formData.productCode}
          onChange={handleFormChange}
          className="input"
        />
        <input
          name="collectionType"
          placeholder="Collection Type"
          value={formData.collectionType}
          onChange={handleFormChange}
          className="input"
        />
        <input
          name="countInStock"
          placeholder="Count In Stock"
          value={formData.countInStock}
          onChange={handleFormChange}
          className="input"
        />
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
          className="input"
        />
      </div>

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleFormChange}
        className="input"
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
                className="input"
              />
              <input
                placeholder="Gem Cut"
                value={item.gemCut}
                onChange={(e) => handleItemChange(i, "gemCut", e.target.value)}
                className="input"
              />
              <input
                placeholder="Carats"
                value={item.carats}
                onChange={(e) => handleItemChange(i, "carats", e.target.value)}
                className="input"
              />
              <input
                placeholder="Clarity"
                value={item.clarity}
                onChange={(e) => handleItemChange(i, "clarity", e.target.value)}
                className="input"
              />
              <input
                placeholder="Color"
                value={item.color}
                onChange={(e) => handleItemChange(i, "color", e.target.value)}
                className="input"
              />
              <input
                placeholder="Gold Purity"
                value={item.goldPurity}
                onChange={(e) =>
                  handleItemChange(i, "goldPurity", e.target.value)
                }
                className="input"
              />
              <input
                placeholder="Diamond Price"
                value={item.pricing.diamondPrice}
                onChange={(e) =>
                  handleItemChange(i, "diamondPrice", e.target.value)
                }
                className="input"
              />
              <input
                placeholder="Gold Price"
                value={item.pricing.goldPrice}
                onChange={(e) =>
                  handleItemChange(i, "goldPrice", e.target.value)
                }
                className="input"
              />
              <input
                placeholder="Gross Weight"
                value={item.pricing.grossWeight}
                onChange={(e) =>
                  handleItemChange(i, "grossWeight", e.target.value)
                }
                className="input"
              />
              <input
                placeholder="Price per Gram"
                value={item.pricing.pricePerGram}
                onChange={(e) =>
                  handleItemChange(i, "pricePerGram", e.target.value)
                }
                className="input"
              />
              <input
                placeholder="Making Charges"
                value={item.pricing.makingCharges}
                onChange={(e) =>
                  handleItemChange(i, "makingCharges", e.target.value)
                }
                className="input"
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

      {/* Image Uploads */}
      <div>
        <label>Main Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
        />
        {mainImageFile && (
          <img
            src={URL.createObjectURL(mainImageFile)}
            className="w-24 h-24 mt-2"
          />
        )}
      </div>

      <div>
        <label>Gallery Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setGalleryFiles((prev) => [
              ...prev,
              ...Array.from(e.target.files || []),
            ])
          }
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {galleryFiles.map((file, i) => (
            <img
              key={i}
              src={URL.createObjectURL(file)}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
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
