"use client";

import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import Intellibar from "@/components/Intellibar";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            className="relative h-8 w-8"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 blur-sm" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600">
              <span className="text-sm font-bold text-white">I</span>
            </div>
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Intelligensia
          </span>
        </Link>
        <SearchField />
        <Intellibar
          followers={1234}
          following={567}
          posts={89}
          classes={12}
          achievements={15}
          streak={7}
        />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}