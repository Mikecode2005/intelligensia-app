"use client";

import PostEditor from "@/components/posts/editor/PostEditor";
import FloatingPostButton from "@/components/FloatingPostButton";
import TrendsSidebar from "@/components/TrendsSidebar";
import FollowingFeed from "./FollowingFeed";
import ForYouFeed from "./ForYouFeed";
import AdCarousel from "@/components/AdCarousel";
import { useSession } from "./SessionProvider";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";

export default function Home() {
  const { user } = useSession();

  return (
    <>
      <FloatingPostButton />
      <main className="w-full grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[260px_1fr_320px] gap-4 md:gap-6 px-2 sm:px-4 md:px-8 lg:px-10 py-4 md:py-6 max-w-full">
      {/* Left Sidebar */}
      <aside className="hidden md:flex flex-col gap-8 sticky top-24 self-start h-[calc(100vh-120px)]">
        <div className="flex flex-col gap-1.5">
          <Link href="/">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#FF6B00] text-black cursor-pointer group shadow-lg shadow-[#FF6B00]/5">
              <span className="material-symbols-outlined">rss_feed</span>
              <p className="text-sm font-bold">Feed</p>
            </div>
          </Link>

          <Link href="/dashboard">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-[#121212] hover:text-[#FF6B00] cursor-pointer transition-all">
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium">Dashboard</p>
            </div>
          </Link>

          <Link href="/resources">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-[#121212] hover:text-[#FF6B00] cursor-pointer transition-all">
              <span className="material-symbols-outlined">library_books</span>
              <p className="text-sm font-medium">Library</p>
            </div>
          </Link>

          <Link href="/bookmarks">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-[#121212] hover:text-[#FF6B00] cursor-pointer transition-all">
              <span className="material-symbols-outlined">bookmark</span>
              <p className="text-sm font-medium">Bookmarks</p>
            </div>
          </Link>

          <Link href="/messages">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-[#121212] hover:text-[#FF6B00] cursor-pointer transition-all">
              <span className="material-symbols-outlined">chat_bubble</span>
              <p className="text-sm font-medium">Messages</p>
            </div>
          </Link>

          <Link href="/connect">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-[#121212] hover:text-[#FF6B00] cursor-pointer transition-all">
              <span className="material-symbols-outlined">group</span>
              <p className="text-sm font-medium">Groups</p>
            </div>
          </Link>

          <Link href="/notifications">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-[#121212] hover:text-[#FF6B00] cursor-pointer transition-all">
              <span className="material-symbols-outlined">notifications</span>
              <p className="text-sm font-medium">Notifications</p>
            </div>
          </Link>

          <Link href="/settings">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-[#121212] hover:text-[#FF6B00] cursor-pointer transition-all">
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium">Settings</p>
            </div>
          </Link>
        </div>
        
        {/* Profile Card */}
        <div className="mt-auto p-5 bg-[#121212] rounded-xl border border-[#262626]">
          <div className="flex gap-3 mb-4">
            <UserAvatar
              avatarUrl={user?.image || null}
              size={40}
              className="rounded-lg"
            />
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-white text-sm font-bold truncate">
                {user?.name || "Guest User"}
              </h1>
              <p className="text-neutral-500 text-xs truncate">
                {user?.userType || "Student"}
              </p>
            </div>
          </div>
          <Link href="/resources/new">
            <button className="w-full flex items-center justify-center rounded-lg h-9 px-4 bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold hover:bg-[#FF6B00]/20 transition-all border border-[#FF6B00]/20">
              Create Resource
            </button>
          </Link>
        </div>
      </aside>

      {/* Center Feed Column */}
      <section className="flex flex-col gap-4 md:gap-6 w-full overflow-hidden">
        <div className="bg-[#121212] rounded-xl border border-[#262626] p-3 sm:p-5">
          <PostEditor />
        </div>

        {/* Feeds */}
        <ForYouFeed />
        <AdCarousel />
        <FollowingFeed />
      </section>

      {/* Right Sidebar */}
      <aside className="hidden lg:flex flex-col gap-6 sticky top-24 self-start">
        <TrendsSidebar />
      </aside>
    </main>
    </>
  );
}
