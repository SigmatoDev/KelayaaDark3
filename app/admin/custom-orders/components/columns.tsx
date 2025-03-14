"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import Image from "next/image";
import Link from "next/link";

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
      const imageUrl = row.getValue("customImage");
      return imageUrl ? (
        <div className="relative w-16 h-16">
          <Image
            src={imageUrl}
            alt="Design"
            fill
            className="object-cover rounded-md"
          />
        </div>
      ) : (
        <span className="text-gray-400">No image</span>
      );
    },
  },
  {
    accessorKey: "designType",
    header: "Design Type",
  },
  {
    accessorKey: "budget",
    header: "Budget",
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
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleString('en-IN', {
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