"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { PencilIcon, Trash2Icon, OctagonAlertIcon, Search } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import useSWRMutation from "swr/mutation";
import { formatId } from "@/lib/utils";
import { User } from "@/lib/models/UserModel";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserTableProps {
  users: User[];
  mutate: () => void;
}

export function UserTable({ users, mutate }: UserTableProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState("");

  const { trigger: deleteUser } = useSWRMutation(
    `/api/admin/users`,
    async (url, { arg }: { arg: { userId: string } }) => {
      const toastId = toast.loading("Deleting user...");
      const res = await fetch(`${url}/${arg.userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("User deleted successfully", { id: toastId });
        mutate();
      } else {
        toast.error(data.message, { id: toastId });
      }
    }
  );

  const columns: ColumnDef<User>[] = [
    {
      header: "Sl. No",
      cell: ({ row }) => {
        return (row.index + 1).toString();
      },
    },
    {
      header: "Name",
      accessorKey: "name",
      filterFn: "includesString",
    },
    {
      header: "Email",
      accessorKey: "email",
      filterFn: "includesString",
    },
    {
      header: "User Type",
      accessorKey: "isAdmin",
      cell: ({ getValue }) =>
        getValue() ? (
          <span className="text-green-600 font-semibold">Admin</span>
        ) : (
          <span className="text-red-500 font-semibold">User</span>
        ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/users/${row.original._id}`}
            className="text-blue-500 hover:underline"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => {
              setSelectedUserId(row.original._id!);
              setIsModalOpen(true);
            }}
          >
            <Trash2Icon className="h-4 w-4 text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  const sortedUsers = [...users].sort((a, b) => {
    // Admins come first: true (1) becomes less than false (0) => put Admins up top
    return Number(b.isAdmin) - Number(a.isAdmin);
  });

  const table = useReactTable({
    data: sortedUsers,
    columns,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="py-2 space-y-2">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>

      {/* 🔍 Search bar */}
      <div className="relative max-w-sm mb-4">
        <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
          {/* Adjusted icon positioning */}
          <Search className="w-4 h-4" />
        </span>
        <Input
          placeholder="Search users..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-10" // Adjusted padding left to accommodate the icon
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table className="min-w-[1200px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap text-xs"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="align-top max-w-[300px]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg max-w-sm">
            <h2 className="flex items-center text-lg font-bold text-red-600 mb-2">
              <OctagonAlertIcon className="mr-2 h-5 w-5" /> Confirm Delete
            </h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm bg-gray-200 text-black px-4 py-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedUserId) deleteUser({ userId: selectedUserId });
                  setIsModalOpen(false);
                }}
                className="btn btn-sm bg-red-600 text-white px-4 py-1"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
