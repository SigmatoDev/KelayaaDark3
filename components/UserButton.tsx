"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function UserButton() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Link href="/auth/signin">
        <Button variant="ghost" size="sm">
          <User className="h-5 w-5 mr-2" />
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <User className="h-5 w-5 mr-2" />
          {session.user?.name || 'Account'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer">
            Profile Settings
          </DropdownMenuItem>
        </Link>

        <Link href="/order-history">
          <DropdownMenuItem className="cursor-pointer">
            Order History
          </DropdownMenuItem>
        </Link>

        <Link href="/custom-orders">
          <DropdownMenuItem className="cursor-pointer">
            Custom Orders
          </DropdownMenuItem>
        </Link>

        <Link href="/wishlist">
          <DropdownMenuItem className="cursor-pointer">
            Wishlist
          </DropdownMenuItem>
        </Link>

        {session.user?.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <Link href="/admin/dashboard">
              <DropdownMenuItem className="cursor-pointer">
                Admin Dashboard
              </DropdownMenuItem>
            </Link>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 