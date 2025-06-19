"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import AccountLayout from "@/components/AccountLayout";
import { useSearchParams } from "next/navigation";

// Lazy load components based on tab param
const componentMap: Record<string, any> = {
  orders: dynamic(() => import("../my-orders/page")),
  profile: dynamic(() => import("../profile/Form")),
  wishlist: dynamic(() => import("../wishlist/page")),
  // more tabs...
};

export default function AccountPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "orders";

  const Component = componentMap[tab] || componentMap["orders"];

  return (
    <AccountLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    </AccountLayout>
  );
}
