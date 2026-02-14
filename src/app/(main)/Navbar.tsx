"use client";

import { useSession } from "./SessionProvider";
import UserAvatar from "@/components/UserAvatar";
import IntellibarNavbar from "@/components/IntellibarNavbar";
import MobileMenu from "@/components/MobileMenu";
import Link from "next/link";
import { useState } from "react";
import { Search, GraduationCap } from "lucide-react";

export default function Navbar() {
  const { user } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-[#FF6B00]/20 px-4 md:px-10 py-3 flex items-center justify-between">
      {/* Left Section - Mobile Menu + Logo & Search */}
      <div className="flex items-center gap-2 md:gap-8 flex-1 md:flex-none">
        {/* Mobile Menu */}
        <MobileMenu />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="size-8 bg-[#FF6B00] rounded-lg flex items-center justify-center">
            <GraduationCap className="text-black w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block">
            Intelligentsia
          </h2>
        </Link>

        {/* Search Bar - Responsive */}
        <div className="relative hidden sm:block w-64 md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-[#9da6b9] w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources, papers, or peers..."
            className="block w-full pl-10 pr-3 py-2 border-none bg-[#1c1f27] text-white placeholder-[#9da6b9] focus:ring-1 focus:ring-[#FF6B00] rounded-lg text-sm transition-all"
          />
        </div>

        {/* Mobile Search Icon */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="sm:hidden text-[#FF6B00] hover:text-[#FF6B00]/80 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Mobile Search Input */}
        {isSearchOpen && (
          <div className="sm:hidden absolute left-4 right-4 top-full mt-2 z-50 bg-[#1c1f27] rounded-lg border border-[#FF6B00]/20">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-[#9da6b9] w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border-none bg-transparent text-white placeholder-[#9da6b9] focus:outline-none text-sm"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Center - Intellibar */}
      <div className="hidden md:block flex-1">
        <IntellibarNavbar />
      </div>

      {/* Right Section - Navigation & Actions */}
      <div className="flex items-center gap-4 lg:gap-8">
        {/* Navigation Links - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/explore"
            className="text-white text-sm font-medium hover:text-[#FF6B00] transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/connect"
            className="text-[#9da6b9] text-sm font-medium hover:text-white transition-colors"
          >
            Collaborate
          </Link>
        </nav>

        {/* User Avatar */}
        <Link href={`/users/${user?.username || "profile"}`}>
          <div className="relative">
            <UserAvatar
                   avatarUrl={user.avatarUrl}
                   size={40}
                   className="mx-auto size-full max-h-60 max-w-60 rounded-full"
                 />
          </div>
        </Link>
      </div>
    </header>
  );
}
