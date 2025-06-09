"use client";

import Link from "next/link";
import useSWR from "swr";
import { useMemo, useState } from "react";
import { Order } from "@/lib/models/OrderModel";
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

export default function Orders() {
  const {
    data: orders,
    error,
    isLoading,
  } = useSWR<Order[]>(`/api/admin/orders`);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        header: "Sl.No.",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "orderNumber",
        header: "ORDER_ID",
      },
      {
        header: "USER",
        cell: ({ row }) => {
          const o = row.original;
          return (
            <div className="text-left">
              <div className="font-medium text-gray-800">
                {o.personalInfo?.email}
              </div>
              <div className="text-sm text-gray-500">
                {o.personalInfo?.mobileNumber}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: () => <div className="cursor-pointer">ORDER_DATE</div>,
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("en-IN"),
      },
      {
        accessorKey: "totalPrice",
        header: "TOTAL AMOUNT",
        cell: ({ row }) =>
          `₹${row.original.totalPrice.toLocaleString("en-IN")}`,
      },
      {
        accessorKey: "isPaid",
        header: "PAYMENT STATUS",
        cell: ({ row }) => {
          const paid = row.original.isPaid;
          return (
            <span
              className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium ${
                paid
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {paid ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Paid
                </>
              ) : (
                "X Pending"
              )}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "ORDER STATUS",
        cell: ({ row }) => {
          const status = row.original.status;
          console.log()
          return (
            <span
              className={`rounded-md px-2 py-1 text-xs ${
                status === "pending" || status === "processing"
                  ? "bg-purple-100 text-purple-800"
                  : status === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : status === "out-for-delivery"
                      ? "bg-yellow-100 text-yellow-800"
                      : status === "completed"
                        ? "bg-green-100 text-green-800"
                        : status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : status === "failed"
                            ? "bg-gray-200 text-gray-800"
                            : "bg-gray-100 text-gray-800"
              }`}
            >
              {status === "pending" || status === "processing"
                ? "Processing"
                : status === "shipped"
                  ? "Shipped"
                  : status === "out-for-delivery"
                    ? "Out for Delivery"
                    : status === "completed"
                      ? "Delivered"
                      : status === "cancelled"
                        ? "Cancelled"
                        : status === "failed"
                          ? "Failed"
                          : "Unknown"}
            </span>
          );
        },
      },
      {
        accessorKey: "deliveredAt",
        header: "DELIVERED_DATE",
        cell: ({ row }) =>
          row.original.isDelivered
            ? new Date(row.original.updatedAt).toLocaleDateString("en-IN")
            : "-",
      },
      {
        header: "ACTION",
        cell: ({ row }) => (
          <Link
            className="btn btn-primary btn-sm"
            href={`/admin/customer-order/${row.original._id}`}
          >
            Details
          </Link>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: orders || [],
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

  if (error) return <div className="text-red-600">Error loading orders</div>;
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="py-2 space-y-2 p-4 pt-[25px]">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>

      <Input
        placeholder="Search orders..."
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
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
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
    </div>
  );
}
