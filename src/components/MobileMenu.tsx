"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "./UserAvatar";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSession();

  const menuItems = [
    { href: "/", icon: "rss_feed", label: "Feed" },
    { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/resources", icon: "library_books", label: "Library" },
    { href: "/bookmarks", icon: "bookmark", label: "Bookmarks" },
    { href: "/messages", icon: "chat_bubble", label: "Messages" },
    { href: "/connect", icon: "group", label: "Groups" },
    { href: "/notifications", icon: "notifications", label: "Notifications" },
    { href: "/settings", icon: "settings", label: "Settings" },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-[#FF6B00] hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed left-0 top-0 h-screen w-72 bg-[#121212] border-r border-[#262626] z-40 md:hidden overflow-y-auto"
            >
              <div className="p-6 flex flex-col h-full">
                {/* Logo */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white">Intelligentsia</h2>
                </div>

                {/* Menu Items */}
                <nav className="flex flex-col gap-2 flex-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-[#1c1f27] hover:text-[#FF6B00] transition-all"
                    >
                      <span className="material-symbols-outlined">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* Profile Card */}
                <div className="pt-6 border-t border-[#262626]">
                  {user && (
                    <div className="flex gap-3 mb-4">
                      <UserAvatar
                        avatarUrl={user.image || null}
                        size={40}
                        className="rounded-lg flex-shrink-0"
                      />
                      <div className="flex flex-col overflow-hidden">
                        <h1 className="text-white text-sm font-bold truncate">
                          {user.name || "Guest User"}
                        </h1>
                        <p className="text-neutral-500 text-xs truncate">
                          {user.userType || "Student"}
                        </p>
                      </div>
                    </div>
                  )}
                  <Link href="/resources/new">
                    <button className="w-full flex items-center justify-center rounded-lg h-9 px-4 bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold hover:bg-[#FF6B00]/20 transition-all border border-[#FF6B00]/20">
                      Create Resource
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
