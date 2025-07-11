import React, { Suspense } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/components/logout-button";
import { SettingsButton } from "@/components/settings-button";
import { AddMoreHouses } from "@/components/add-more-houses";

function SearchBarFallback() {
  return (
    <div className="flex-1 mx-8">
      <input
        type="text"
        placeholder="Search by city, region, country, or postal code..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent opacity-50"
        disabled
      />
    </div>
  );
}

function ProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
          <span className="font-semibold">P</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <AddMoreHouses />
        <DropdownMenuItem>
          <SettingsButton />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function FrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <Link href="/main" className="text-2xl font-bold">
          Kre.TN
        </Link>
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>
        <div className="flex items-center gap-6">
          <Link
            href="/favorites"
            className="text-gray-600 hover:text-black transition-colors"
          >
            ❤️ Favorites
          </Link>
          <ProfileDropdown />
        </div>
      </nav>
      {children}
    </div>
  );
}