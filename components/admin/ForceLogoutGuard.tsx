"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function ForceLogoutGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const forceLogout = localStorage.getItem("forceLogout");
      if (forceLogout === "true") {
        setShowLogoutModal(true);
      }
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("forceLogout");
    setShowLogoutModal(false);
    await signOut({ redirect: false });
    router.push("/signin");
  };

  if (showLogoutModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl w-[400px] space-y-4">
          <h2 className="text-lg font-semibold text-red-600">
            Re-login Required
          </h2>
          <p className="text-sm text-gray-700">
            You’ve changed your admin email or password. For security, you must
            sign in again.
          </p>
          <div className="flex justify-end">
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
