"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import Image from "next/image";
import Link from "next/link";

export type CustomOrderColumn = {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: string;
  designType: string;
  budget: number;
  status: string;
  contactNumber: string;
  customImage: string;
};

export const columns: ColumnDef<CustomOrderColumn>[] = [
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
    cell: ({ row }) => {
      const contact = row.getValue("contactNumber");
      return contact || "N/A";
    },
  },
  {
    accessorKey: "customImage",
    header: "Design Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("customImage");
      if (!imageUrl) return "No image";
      
      return (
        <div className="relative w-10 h-10 group">
          <Image
            src={imageUrl}
            alt="Design"
            fill
            className="object-cover rounded"
          />
          <Link
            href={imageUrl}
            target="_blank"
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded"
          >
            <Eye className="w-4 h-4 text-white" />
          </Link>
        </div>
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