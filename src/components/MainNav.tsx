"use client";

import { Session } from "next-auth";
import { useState } from "react";
import { cn } from '@/lib/utils';
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
  HomeIcon,
  LayoutDashboardIcon,
  BookOpenIcon,
  BookmarkIcon,
  UserIcon,
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
import Intellibar from "@/components/Intellibar";
import { motion, AnimatePresence } from "framer-motion";

interface MainNavProps {
  user: Session["user"];
}

export default function MainNav({ user }: MainNavProps) {
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { logout } = useAuth();

  const navigationItems = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
    { href: "/classrooms", label: "Classroom", icon: BookOpenIcon },
    { href: "/messages", label: "Messages", icon: MessageSquareIcon },
    { href: "/notifications", label: "Notifications", icon: BellIcon },
    { href: "/bookmarks", label: "Bookmarks", icon: BookmarkIcon },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-orange-100 dark:hover:bg-orange-900/20"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>

            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 blur-sm" />
                <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600">
                  <span className="text-sm font-bold text-white">I</span>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Intelligensia
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "relative",
                    isActive(item.href)
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                  {isActive(item.href) && (
                    <motion.div
                      className="absolute inset-0 bg-orange-500 rounded-md"
                      layoutId="active-nav"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Search and Stats */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center max-w-xs">
              <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-full focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Intellibar */}
            <Intellibar
              followers={1234}
              following={567}
              posts={89}
              classes={12}
              achievements={15}
              streak={7}
            />

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/20"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Profile"}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white text-sm font-bold rounded-full">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "Profile"}
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white text-sm font-bold rounded-full">
                          {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {user.displayName || user.name || user.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.username || 'me'}`} className="cursor-pointer">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                  onClick={() => logout()}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 space-y-4">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-full"
                  />
                </div>
                
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive(item.href) ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-full justify-start text-left",
                          isActive(item.href)
                            ? "bg-orange-500 text-white"
                            : "text-gray-700 dark:text-gray-300"
                        )}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}