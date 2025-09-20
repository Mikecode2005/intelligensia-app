"use client";

import { Session } from "next-auth";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BellIcon,
  MessageSquareIcon,
  SearchIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainNavProps {
  user: Session["user"];
}

export default function MainNav({ user }: MainNavProps) {
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { logout } = useAuth();
  
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </Button>
          
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-orange-600 dark:text-orange-500">
              Intelligensia
            </span>
          </Link>
        </div>
        
        {/* Search Bar - Hidden on Mobile */}
        <div className="hidden md:flex items-center max-w-md w-full mx-4">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500"
            />
          </div>
        </div>
        
        {/* Navigation Icons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500">
            <BellIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500">
            <MessageSquareIcon className="h-5 w-5" />
          </Button>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Profile"}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-orange-100 text-orange-600 text-sm font-bold rounded-full">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user.displayName || user.name || user.email?.split('@')[0] || "User"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => logout()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full mb-4"
            />
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className={`block p-2 rounded-md ${
                  pathname === "/dashboard"
                    ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/scholarships"
                className={`block p-2 rounded-md ${
                  pathname === "/scholarships"
                    ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Scholarships
              </Link>
              <Link
                href="/internships"
                className={`block p-2 rounded-md ${
                  pathname === "/internships"
                    ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Internships
              </Link>
              <Link
                href="/classrooms"
                className={`block p-2 rounded-md ${
                  pathname === "/classrooms"
                    ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Classrooms
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}