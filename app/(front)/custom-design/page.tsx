"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CustomDesignForm from "@/components/custom-design/CustomDesignForm";
import LoginPrompt from "@/components/custom-design/LoginPrompt";

export default function CustomDesignPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return <LoginPrompt />;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      
      <CustomDesignForm />
    </div>
  );
} 