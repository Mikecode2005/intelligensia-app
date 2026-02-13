"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Loader2, TrendingUp, UserPlus } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import FollowButton from "./FollowButton";
import UserAvatar from "./UserAvatar";
import UserTooltip from "./UserTooltip";

// Mock trending resources data
const trendingResources = [
  {
    rank: "01",
    title: "Machine Learning Ethics 2024",
    stats: "1.2k saves",
    tags: "#AI #Ethics",
  },
  {
    rank: "02",
    title: "Macroeconomics Review Set",
    stats: "850 saves",
    tags: "#Finance",
  },
  {
    rank: "03",
    title: "Organic Chemistry Synthesis",
    stats: "620 saves",
    tags: "#Chemistry",
  },
];

export default function TrendsSidebar() {
  return (
    <div className="flex flex-col gap-6 sticky top-24 self-start">
      <Suspense fallback={<TrendsSkeleton />}>
        <TrendingResources />
        <SuggestedPeers />
        <FooterLinks />
      </Suspense>
    </div>
  );
}

function TrendsSkeleton() {
  return (
    <div className="bg-[#121212] rounded-xl border border-[#262626] p-5">
      <Loader2 className="mx-auto animate-spin text-[#FF6B00]" size={24} />
    </div>
  );
}

function TrendingResources() {
  return (
    <div className="bg-[#121212] rounded-xl border border-[#262626] p-5">
      <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
        <TrendingUp className="text-[#FF6B00] text-xl" />
        Trending Resources
      </h3>
      <div className="flex flex-col gap-5">
        {trendingResources.map((resource) => (
          <div
            key={resource.rank}
            className="flex items-start gap-4 group cursor-pointer"
          >
            <div className="text-xs font-bold text-neutral-600 group-hover:text-[#FF6B00] transition-colors w-4 pt-1">
              {resource.rank}
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-[#FF6B00] transition-colors">
                {resource.title}
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5 tracking-wide">
                {resource.stats} • <span className="text-neutral-600">{resource.tags}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-2 border border-[#262626] rounded-lg text-xs font-bold text-[#FF6B00] hover:bg-[#FF6B00]/5 transition-all">
        View all trends
      </button>
    </div>
  );
}

async function SuggestedPeers() {
  try {
    const { user } = await validateRequest();

    if (!user) return null;

    const usersToFollow = await prisma.user.findMany({
      where: {
        NOT: {
          id: user.id,
        },
        followers: {
          none: {
            followerId: user.id,
          },
        },
      },
      select: getUserDataSelect(user.id),
      take: 3,
    });

    if (usersToFollow.length === 0) return null;

    return (
      <div className="bg-[#121212] rounded-xl border border-[#262626] p-5">
        <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
          <UserPlus className="text-[#FF6B00] text-xl" />
          Suggested Peers
        </h3>
        <div className="flex flex-col gap-5">
          {usersToFollow.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <UserAvatar
                  avatarUrl={user.avatarUrl}
                  size={36}
                  className="rounded-full border border-[#262626]"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">
                    {user.displayName}
                  </p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-tight">
                    @{user.username}
                  </p>
                </div>
              </div>
              <FollowButton
                userId={user.id}
                initialState={{
                  followers: user._count.followers,
                  isFollowedByUser: user.followers.some(
                    ({ followerId }) => followerId === user.id,
                  ),
                }}
                className="bg-white/5 text-white hover:bg-[#FF6B00] hover:text-black px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all border border-white/10"
              />
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in SuggestedPeers:", error);
    return null;
  }
}

function FooterLinks() {
  return (
    <footer className="flex flex-wrap gap-x-4 gap-y-2 px-2 opacity-60">
      <Link
        href="/privacy"
        className="text-[10px] text-neutral-500 hover:text-[#FF6B00] transition-colors"
      >
        Privacy Policy
      </Link>
      <Link
        href="/terms"
        className="text-[10px] text-neutral-500 hover:text-[#FF6B00] transition-colors"
      >
        Terms of Service
      </Link>
      <Link
        href="/cookies"
        className="text-[10px] text-neutral-500 hover:text-[#FF6B00] transition-colors"
      >
        Cookies
      </Link>
      <p className="text-[10px] text-neutral-600">© 2024 Intelligentsia Inc.</p>
    </footer>
  );
}

// Client component wrapper for SuggestedPeers
export function SuggestedPeersClient() {
  return (
    <Suspense fallback={<TrendsSkeleton />}>
      <SuggestedPeers />
    </Suspense>
  );
}
