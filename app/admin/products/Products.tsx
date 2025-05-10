"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Product } from "@/lib/models/ProductModel"; // Adjust to your model
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  OctagonAlertIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
// Fallback image component
const ImageWithFallback = ({ src, alt }: { src: string; alt: string }) => {
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");

  const handleImageClick = () => {
    if (src) {
      setImageSrc(src); // Set the clicked image source
      setIsModalOpen(true); // Open the modal
    }
  };

  if (error || !src) {
    return (
      <div
        className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center cursor-pointer"
        onClick={handleImageClick}
      >
        <span className="text-xs text-gray-500">No image</span>
      </div>
    );
  }

  return (
    <div className="relative w-10 h-10">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover rounded-md cursor-pointer"
        sizes="40px"
        onError={() => setError(true)}
        onClick={handleImageClick}
      />
      {/* Modal for image preview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-md">
            {/* Close Button in top-right corner of the modal */}
            <button
              className="absolute top-0 right-1 text-red-500 text-2xl"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <Image
              src={imageSrc}
              alt="Preview Image"
              width={500}
              height={500}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default function Products() {
  const {
    data: sortedProducts,
    error,
    isLoading,
    mutate,
  } = useSWR<Product[]>(`/api/admin/products`);
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
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

  const navigateToAddProduct = () => {
    router.push("/admin/products/add");
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

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "select", // Adding the checkbox column
        header: () => (
          <input
            type="checkbox"
            onChange={(e) =>
              setSelectedProducts(
                e.target.checked
                  ? sortedProducts.map((p: Product) => p._id)
                  : []
              )
            }
            checked={
              selectedProducts.length === sortedProducts?.length &&
              sortedProducts?.length > 0
            }
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            onChange={(e) => {
              const selectedId = row.original._id;
              if (e.target.checked) {
                setSelectedProducts((prev) => [...prev, selectedId]);
              } else {
                setSelectedProducts((prev) =>
                  prev.filter((id) => id !== selectedId)
                );
              }
            }}
            checked={selectedProducts.includes(row?.original._id)}
          />
        ),
      },
      {
        header: "Sl.No.",
        cell: ({ row }) => row?.index + 1,
      },
      {
        accessorKey: "name",
        header: "PRODUCT_NAME",
      },
      {
        accessorKey: "productCode",
        header: "PRODUCT_CODE",
      },
      {
        accessorKey: "productCategory",
        header: "CATEGORY",
      },
      {
        accessorKey: "subCategories",
        header: "Type",
        cell: ({ row }) =>
          `${row?.original?.subCategories?.length === 0 ? row?.original?.category : row?.original?.subCategories || "-"}`,
      },
      {
        accessorKey: "weight",
        header: "Weight(grms.)",
      },
      {
        accessorKey: "price_per_gram",
        header: "Price/gram",
      },
      {
        accessorKey: "price",
        header: "PRICE",
        cell: ({ row }) => `₹${row?.original.price.toLocaleString("en-IN")}`,
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
          <ImageWithFallback src={row?.original?.image} alt="Image" />
        ),
      },
      {
        accessorKey: "countInStock",
        header: "Stocks Available",
      },
      {
        accessorKey: "createdAt",
        header: () => <div className="cursor-pointer">CREATED_DATE</div>,
        cell: ({ row }) =>
          new Date(row?.original.createdAt).toLocaleDateString("en-IN"),
      },
      {
        accessorKey: "countInStock",
        header: "AVAILABILITY",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium ${
              row?.original?.countInStock > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row?.original?.countInStock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        ),
      },
      {
        header: "ACTION",
        cell: ({ row }) => (
          <>
            <Link
              href={`/admin/products/${row?.original?._id}`}
              className="btn btn-ghost btn-sm"
            >
              <PencilIcon className="h-4 w-5 text-blue-500" />
            </Link>
            &nbsp;
            <button
              onClick={() => openDeleteModal(row?.original?._id!)}
              className="btn btn-ghost btn-sm"
            >
              <Trash2Icon className="h-4 w-5 text-red-600" />
            </button>
          </>
        ),
      },
    ],
    [selectedProducts, sortedProducts]
  );

  const table = useReactTable({
    data: sortedProducts || [],
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (error) return <div className="text-red-600">Error loading products</div>;
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="py-2 space-y-2 p-4 pt-[25px]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold mb-4">
          Products ({sortedProducts?.length || 0})
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={navigateToAddProduct}
            className="btn bg-gray-700 text-gray-200 hover:bg-gray-800 btn-sm"
          >
            <PlusIcon className="h-4 w-5" /> Add New Product
          </button>
          <button
            onClick={deleteSelectedProducts}
            className="btn bg-red-600 text-white btn-sm"
          >
            <Trash2Icon className="h-4 w-5" /> Delete Selected
          </button>
        </div>
      </div>
      <Input
        placeholder="Search product by name..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm mb-4"
      />

      <div className="overflow-x-auto rounded-md border">
        <Table className="min-w-[1200px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap text-xs"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row?.id}
                  data-state={row?.getIsSelected() && "selected"}
                >
                  {row?.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="align-top max-w-[300px]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
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
