"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import Image from "next/image";
import { useState } from "react";

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

const formatDate = (value: string | Date) => {
  const date = new Date(value);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const columns: ColumnDef<any>[] = [
  {
    header: "Sl. No.",
    cell: ({ row }) => row.index + 1,
  },
  { accessorKey: "gender", header: "Gender" },
  { accessorKey: "countryCode", header: "Code" },
  { accessorKey: "contactNumber", header: "Contact" },
  { accessorKey: "jewelryType", header: "Jewelry Type" },
  { accessorKey: "metalType", header: "Metal Type" },
  {
    accessorKey: "budget",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Budget
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("budget"));
      if (isNaN(amount)) return "N/A";
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
    },
  },
  { accessorKey: "occasion", header: "Occasion" },
  { accessorKey: "stoneType", header: "Stone Type" },
  { accessorKey: "additionalDetails", header: "Additional Details" },
  {
    accessorKey: "customImage",
    header: "Design Image",
    cell: ({ row }) => (
      <ImageWithFallback src={row.original.customImage} alt="Design Image" />
    ),
  },
  {
    accessorKey: "personalConsultation",
    header: "Consultation",
    cell: ({ row }) => {
      const value = row.getValue("personalConsultation");
      return (
        <StatusBadge
          status={value ? "yes" : "no"}
          className={
            value ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
          }
        />
      );
    },
  },
  {
    accessorKey: "appointmentDate",
    header: "Appointment",
    cell: ({ row }) =>
      row.getValue("appointmentDate")
        ? formatDate(row.getValue("appointmentDate"))
        : "N/A",
  },

  {
    accessorKey: "termsAccepted",
    header: "Terms Accepted",
    cell: ({ row }) => {
      const value = row.getValue("termsAccepted");
      return (
        <StatusBadge
          status={value ? "yes" : "no"}
          className={
            value ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
          }
        />
      );
    },
  },
  {
    accessorKey: "goldKarat",
    header: "Gold Karat",
    cell: ({ row }) => row.getValue("goldKarat") || "N/A",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
];
