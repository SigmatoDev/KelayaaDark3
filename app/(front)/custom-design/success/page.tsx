"use client";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center p-8 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-4">Design Request Submitted!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for submitting your custom design request. Our team will
          review your request and contact you soon.
        </p>
        <Link
          href="/account/custom-designs"
          className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-2 rounded-lg hover:opacity-90 transition inline-block"
        >
          View My Design Requests
        </Link>
      </div>
    </div>
  );
} 