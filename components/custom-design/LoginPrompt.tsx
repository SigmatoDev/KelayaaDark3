"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPrompt() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError("");
      
      const result = await signIn('credentials', {
        email: 'admin@example.com',
        password: '123456',
        redirect: false,
      });

      if (result?.error) {
        setError("Login failed. Please try again.");
        return;
      }

      router.refresh();
      router.push('/custom-design');
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">
          Please login to create your custom design request
        </p>
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Demo Login"}
        </button>
        <p className="mt-4 text-sm text-gray-500">
          Demo Credentials:<br />
          Email: admin@example.com<br />
          Password: 123456
        </p>
      </div>
    </div>
  );
} 