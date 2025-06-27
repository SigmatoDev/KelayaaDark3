"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm text-gray-800 rounded"
    >
      ← {label}
    </button>
  );
}
