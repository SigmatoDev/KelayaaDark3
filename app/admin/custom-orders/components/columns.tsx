"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ImageWithFallback = ({ src, alt }: { src: string; alt: string }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
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
        className="object-cover rounded-md"
        sizes="40px"
        onError={() => setError(true)}
      />
    </div>
  );
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/admin/custom-orders/${row.getValue("orderNumber")}`}
          className="text-blue-600 hover:underline"
        >
          {row.getValue("orderNumber")}
        </Link>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact",
    cell: ({ row }) => row.getValue("contactNumber") || "N/A",
  },
  {
    accessorKey: "customImage",
    header: "Design Image",
    cell: ({ row }) => {
      const imageUrl = row.original.customImage;
      return <ImageWithFallback src={imageUrl} alt="Design" />;
    },
  },
  {
    accessorKey: "designType",
    header: "Design Type",
  },
  {
    accessorKey: "budget",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Budget
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("budget"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <StatusBadge status={row.getValue("status")} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleString("en-IN", {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    },
  },
]; 