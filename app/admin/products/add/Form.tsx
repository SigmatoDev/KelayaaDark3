"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ValidationRule, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWRMutation from "swr/mutation";
import { Product } from "@/lib/models/ProductModel";
import { Upload } from "lucide-react";

export default function ProductCreateForm() {
  const router = useRouter();
  const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }) => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success("Product created successfully");
      router.push(`/admin/products`);
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Product>();

  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [additionalFields, setAdditionalFields] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const categoryMapping: { [key: string]: string[] } = {
    Men: ["Ring", "Earring", "Bracelet"],
    Women: ["Necklace", "Earring", "Bangle", "Ring"],
    Children: ["Ring", "Pendant", "Charm"],
  };

  const productTypes: string[] = [
    "Pendants",
    "Rings",
    "Earrings",
    "Bangles",
    "Bracelets",
    "Sets",
    "Toe Rings",
    "Necklaces",
    "Chain",
  ];

  const categoryTypes: string[] = [
    "Turquoise",
    "Silver",
    "Enamel",
    "Coral",
    "Moon Stone",
    "Semi-Precious Stones",
    "Amathyst",
    "Garnet",
    "Agate",
    "Onyx",
    "Agate and Semi Precious Stones",
    "Synthetic Stones",
    "Crystal",
    "Rose Quartz",
    "Pearl",
    "Topaz",
    "AD",
    "Ox-Silver",
    "Lapis Lazuli",
    "Ox-Silver (Beads)",
  ];

  const ringCategoryTypes: string[] = [
    "Cocktail Ring",
    "Silver",
    "Minimalist",
  ];

  const additionalFieldMapping: {
    [key: string]: { name: string; type: string };
  } = {
    ringSize: { name: "Ring Size", type: "text" },
    grossWeight: { name: "Gross Weight", type: "number" },
    goldWeight: { name: "Gold Weight", type: "number" },
  };

  const selectedProductCategory = watch("productCategory");

  useEffect(() => {
    if (selectedProductCategory) {
      setSubcategories(categoryMapping[selectedProductCategory] || []);
    }
  }, [selectedProductCategory]);

  useEffect(() => {
    if (selectedProductCategory === "Ring") {
      setAdditionalFields(["ringSize", "grossWeight", "goldWeight"]);
    } else {
      setAdditionalFields([]);
    }
  }, [selectedProductCategory]);

  // Dynamically calculate price
  useEffect(() => {
    const weight = Number(watch("weight") || "0");
    const pricePerGram = Number(watch("price_per_gram") || "0");
    const calculatedPrice = weight * pricePerGram;

    if (!isNaN(calculatedPrice)) {
      // Convert the calculated price to string and set it
      setValue("price", parseFloat(calculatedPrice.toFixed(2)));
    }
  }, [watch("weight"), watch("price_per_gram")]);

  const formSubmit = async (formData: any) => {
    // Ensure price is a string when submitting
    formData.price = formData.price.toString();

    await createProduct(formData);
  };

  const uploadHandler = async (e: any) => {
    const toastId = toast.loading("Uploading image...");
    try {
      const resSign = await fetch("/api/cloudinary-sign", {
        method: "POST",
      });
      const { signature, timestamp } = await resSign.json();
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setValue("image", data.secure_url);
      setFileName(file.name); // Set file name
      setImageUrl(data.secure_url); // Set image URL for preview
      toast.success("File uploaded successfully", {
        id: toastId,
      });
    } catch (err: any) {
      toast.error(err.message, {
        id: toastId,
      });
    }
  };

  const FormInput = ({
    id,
    name,
    required,
    pattern,
    type = "text",
    options,
    className = "",
  }: {
    id: keyof Product;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
    type?: string;
    options?: { label: string; value: string }[];
    className?: string;
  }) => (
    <div className="mb-1">
      <label className="label text-sm" htmlFor={id}>
        {name}
      </label>
      <div className="w-full">
        {options ? (
          <select
            {...register(id, {
              required: required && `${name} is required`,
            })}
            className={`select select-bordered w-full ${className}`}
          >
            <option value="">Select {name}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={id}
            {...register(id, {
              required: required && `${name} is required`,
              pattern,
            })}
            className={`input input-bordered w-full ${className}`}
          />
        )}
        {errors[id]?.message && (
          <div className="text-error">{errors[id]?.message}</div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className=" text-2xl text-orange-500">Create Product</h1>
      <form
        onSubmit={handleSubmit(formSubmit)}
        className="grid grid-cols-1 gap-4 sm:grid-cols-4"
      >
        <FormInput
          name="Product Category"
          id="productCategory"
          required
          options={productTypes.map((type) => ({
            label: type,
            value: type,
          }))}
        />
        <FormInput name="Name" id="name" required />
        <FormInput name="ProductCode" id="productCode" required />
        <FormInput name="Weight (Grms)" id="weight" required />
        <FormInput name="Price/gram" id="price_per_gram" required />
        <FormInput
          name="Price"
          id="price"
          required
          className="w-f input input-bordered  text-red-500"
        />
        <FormInput
          name="Info"
          id="info"
          required
          options={categoryTypes.map((type) => ({
            label: type,
            value: type,
          }))}
        />
        {selectedProductCategory === "Rings" && (
          <FormInput
            name="Category"
            id="category"
            required
            options={ringCategoryTypes.map((type) => ({
              label: type,
              value: type,
            }))}
          />
        )}

        <FormInput name="Slug" id="slug" required />

        {additionalFields.map((field) => (
          <FormInput
            key={field}
            id={field as keyof Product}
            name={additionalFieldMapping[field].name}
            type={additionalFieldMapping[field].type}
            required
          />
        ))}
        <FormInput name="Description" id="description" required />
        <FormInput name="Stocks Availbale" id="countInStock" required />
        <div className="">
          <label className="label text-sm" htmlFor="image">
            Upload Image
          </label>
          <label
            htmlFor="image"
            style={{ padding: "12px" }}
            className="flex items-center justify-center gap-2 cursor-pointer border border-gray-300 rounded-md p-2 hover:bg-gray-100"
          >
            <Upload className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">Upload</span>
            <input
              type="file"
              id="image"
              onChange={uploadHandler}
              className="hidden py-4"
            />
          </label>
          {fileName && (
            <div className="mt-2 text-sm text-gray-700">
              <span>File: {fileName}</span>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="ml-4 text-blue-600"
              >
                Preview
              </button>
            </div>
          )}
        </div>

        {/* Image Preview Modal */}
        {isPreviewOpen && imageUrl && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-md max-w-sm w-full">
              <h2 className="text-lg font-semibold">Image Preview</h2>
              <img src={imageUrl} alt="File Preview" className="w-full h-auto mt-4" />
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="bg-red-500 text-white py-1 px-4 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="col-span-3 my-3 flex gap-4 justify-start">
          <button
            type="submit"
            disabled={isCreating}
            className="btn btn-primary w-[100px]"
          >
            {isCreating && <span className="loading loading-spinner"></span>}
            Create
          </button>
          <Link
            className="btn bg-red-600 text-white w-[100px]"
            href="/admin/products"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
