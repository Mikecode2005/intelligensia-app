"use client";

import { useUserStats, UserStats } from "@/hooks/useUserStats";

interface IntellibarNavbarProps {
  initialStats?: Partial<UserStats>;
}

export default function IntellibarNavbar({ initialStats }: IntellibarNavbarProps) {
  const { data: realStats, isLoading } = useUserStats();

  // Use real data or fallback to initial stats
  const statsData = realStats || {
    followers: initialStats?.followers || 0,
    following: initialStats?.following || 0,
    posts: initialStats?.posts || 0,
    totalLikes: initialStats?.totalLikes || 0,
  };

  if (isLoading || !statsData) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-6 md:gap-8 text-white text-sm">
      <div className="flex flex-col items-center gap-0.5 hover:text-[#FF6B00] transition-colors cursor-pointer">
        <span className="text-xs text-[#9da6b9]">Followers</span>
        <span className="font-bold">{statsData.followers || 0}</span>
      </div>

      <div className="w-px h-8 bg-[#282e39]/50"></div>

      <div className="flex flex-col items-center gap-0.5 hover:text-[#FF6B00] transition-colors cursor-pointer">
        <span className="text-xs text-[#9da6b9]">Following</span>
        <span className="font-bold">{statsData.following || 0}</span>
      </div>

      <div className="w-px h-8 bg-[#282e39]/50"></div>

      <div className="flex flex-col items-center gap-0.5 hover:text-[#FF6B00] transition-colors cursor-pointer">
        <span className="text-xs text-[#9da6b9]">Posts</span>
        <span className="font-bold">{statsData.posts || 0}</span>
      </div>

      <div className="w-px h-8 bg-[#282e39]/50"></div>

      <div className="flex flex-col items-center gap-0.5 hover:text-[#FF6B00] transition-colors cursor-pointer">
        <span className="text-xs text-[#9da6b9]">Likes</span>
        <span className="font-bold">{statsData.totalLikes || 0}</span>
      </div>
    </div>
  );
}
