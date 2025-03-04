"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  OctagonAlertIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { Product } from "@/lib/models/ProductModel";

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10); // Default value set to 10
  const { data: products, error, mutate } = useSWR(`/api/admin/products`);
  const router = useRouter();

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const { trigger: deleteProducts } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { productIds: string[] } }) => {
      const toastId = toast.loading("Deleting selected products...");
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds: arg.productIds }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Products deleted successfully", { id: toastId });
        mutate(); // Refresh the product list
      } else {
        toast.error(data.message, { id: toastId });
      }
    }
  );

  const navigateToAddProduct = () => {
    router.push("/admin/products/add");
  };

  const openDeleteModal = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProductId) {
      deleteProducts({ productIds: [selectedProductId] });
    }
    setIsModalOpen(false);
  };

  const handleCheckboxChange = (productId: string) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const deleteSelectedProducts = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select products to delete.");
      return;
    }
    deleteProducts({ productIds: selectedProducts });
    setSelectedProducts([]); // Clear selection after deletion
  };

  const totalProducts = products?.length || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Calculate the starting and ending index for pagination
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  // Slice the products to display only the current page's products
  const productsToDisplay = products?.slice(startIndex, endIndex);

  if (error) return "An error has occurred.";
  if (!products) return "Loading...";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Products</h1>
        <div className="flex space-x-2">
          <button
            onClick={navigateToAddProduct}
            className="btn btn-primary btn-sm"
          >
            <PlusIcon className="h-4 w-5" /> Add New Product
          </button>
          <button
            onClick={deleteSelectedProducts}
            className="btn btn-error btn-sm"
          >
            <Trash2Icon className="h-4 w-5" /> Delete Selected
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="table table-zebra border border-gray-600">
          <thead className="text-orange-500">
            <tr>
              <th className="border border-gray-600">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedProducts(
                      e.target.checked
                        ? products.map((p: Product) => p._id)
                        : []
                    )
                  }
                  checked={
                    selectedProducts.length === products.length &&
                    products.length > 0
                  }
                />
              </th>
              <th className="border border-gray-600">Sl.No.</th>
              <th className="border border-gray-600">Product Category</th>
              <th className="border border-gray-600">Name</th>
              <th className="border border-gray-600">Product Code</th>
              <th className="border border-gray-600">Weight (Grms)</th>
              <th className="border border-gray-600">Price/gram</th>
              <th className="border border-gray-600">Price</th>
              <th className="border border-gray-600">Info</th>
              <th className="border border-gray-600">Category</th>
              <th className="border border-gray-600">Slug</th>
              <th className="border border-gray-600">Image</th>
              {/* <th className="border border-gray-600">Stocks Available</th> */}
              <th className="border border-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {productsToDisplay.map((product: Product, index: number) => (
              <tr key={product._id}>
                <td className="border border-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id!)} // Add "!"
                    onChange={() => handleCheckboxChange(product._id!)} // Add "!"
                  />
                </td>
                <td className="border border-gray-600">
                  {startIndex + index + 1}
                </td>
                <td className="border border-gray-600">
                  {product?.productCategory}
                </td>
                <td className="border border-gray-600">{product?.name}</td>
                <td className="border border-gray-600">
                  {product?.productCode}
                </td>
                <td className="border border-gray-600">{product?.weight}</td>
                <td className="border border-gray-600">
                  {product?.price_per_gram}
                </td>
                <td className="border border-gray-600">
                  ₹{product?.price.toFixed(2)}
                </td>
                <td className="border border-gray-600">{product?.info}</td>
                <td className="border border-gray-600">
                  {product?.category || "-"}
                </td>
                <td className="border border-gray-600">{product?.slug}</td>
                <td className="border border-gray-600">
                  {product?.image ? (
                    <a
                      href={product.image}
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      View Image
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                {/* <td className="border border-gray-600 text-green-500 text-center">
                  {product?.countInStock}
                </td> */}
                <td className="border border-gray-600">
                  <Link
                    href={`/admin/products/${product._id}`}
                    className="btn btn-ghost btn-sm"
                  >
                    <PencilIcon className="h-4 w-5 text-blue-500" />
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => openDeleteModal(product._id!)}
                    className="btn btn-ghost btn-sm"
                  >
                    <Trash2Icon className="h-4 w-5 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="btn btn-sm"
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-4 w-4 mr-2" /> Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <span>
          Total : <span className="text-orange-500">{products?.length}</span>
        </span>

        {/* Dropdown for selecting number of items per page */}
        <div className=" flex justify-between items-center">
          <label htmlFor="itemsPerPage" className="mr-2">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            className="select select-bordered select-sm"
            value={productsPerPage}
            onChange={(e) => {
              setProductsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to page 1 when per-page value changes
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="btn btn-sm text-orange-400"
          disabled={currentPage === totalPages}
        >
          Next <ChevronRightIcon className="h-4 w-4 mr-2" />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
            <h2 className="flex items-center text-lg font-bold text-red-600">
              <OctagonAlertIcon className="mr-1 h-5 w-5" /> Confirm Delete
            </h2>
            <p>Are you sure you want to delete this product?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm bg-gray-100 text-black"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-error btn-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
