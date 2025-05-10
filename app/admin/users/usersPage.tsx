"use client";

import useSWR from "swr";
import { User } from "@/lib/models/UserModel";
import { UserTable } from "./Users";

export default function UsersPage() {
  const { data: users, error, mutate } = useSWR<User[]>("/api/admin/users");

  if (error) return <div className="text-red-600">Error loading users</div>;

  if (!users)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-4 pt-[20px]">
      <UserTable users={users} mutate={mutate} />
    </div>
  );
}
