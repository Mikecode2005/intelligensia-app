"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BookOpen,
  Grid3X3,
  Award,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  TrendingUp,
  Home,
  Menu,
  X,
} from "lucide-react";

interface DashboardSidebarProps {
  user: {
    userType?: string;
  } | null;
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showBlink, setShowBlink] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowBlink(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const role = user?.userType?.toLowerCase() || "student";

  const navItems = [
    { label: "Feed", href: "/", icon: Home },
    { label: "Dashboard", href: `/roles/${role}/dashboard`, icon: Grid3X3 },
    { label: "My Classroom", href: `/roles/${role}/classrooms`, icon: BookOpen },
    { label: "Scholarships", href: `/roles/${role}/scholarships`, icon: Award },
    { label: "Internships", href: `/roles/${role}/internships`, icon: Briefcase },
    { label: "Resources", href: `/roles/${role}/resources`, icon: FileText },
    { label: "Analysis", href: `/roles/${role}/analysis`, icon: TrendingUp },
  ];

  const settingsItems = [{ label: "Settings", href: "/settings", icon: Settings }];

  const isActive = (href: string) => href === pathname || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile Toggle Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-30 md:hidden bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-black p-3 rounded-full shadow-lg shadow-[#FF6B00]/20 transition-all ${
          showBlink ? "animate-pulse" : ""
        }`}
        title="Toggle sidebar"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-10 md:hidden bg-black/50"
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar - Fixed below navbar on all screens */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 flex-shrink-0 border-r border-[#262626] bg-[#0a0a0a] flex flex-col overflow-y-auto transition-all z-20 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Close button - Only visible on mobile */}
        <div className="p-4 border-b border-[#262626] flex items-center justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon as React.ElementType;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  active
                    ? "bg-[#FF6B00] text-black shadow-lg shadow-[#FF6B00]/20"
                    : "text-neutral-400 hover:text-white hover:bg-[#1a1a1a]"
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="border-t border-[#262626] p-4 flex flex-col gap-3">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-3">
            Quick Actions
          </p>
          <Link href="/posts/create" className="w-full">
            <div className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-black py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#FF6B00]/20">
              <span className="material-symbols-outlined text-lg">add_box</span>
              Create Post
            </div>
          </Link>
          <Link href={`/roles/${role}/groups`} className="w-full">
            <div className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all border border-neutral-700">
              <span className="material-symbols-outlined text-lg">group_add</span>
              Join Group
            </div>
          </Link>
        </div>

        {/* Settings & Logout */}
        <div className="border-t border-[#262626] p-4 flex flex-col gap-1">
          {settingsItems.map((item) => {
            const Icon = item.icon as React.ElementType;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-neutral-400 hover:text-white hover:bg-[#1a1a1a] rounded-xl transition-all"
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-3 py-2 text-rose-500/80 hover:text-rose-400 hover:bg-[#1a1a1a] rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
