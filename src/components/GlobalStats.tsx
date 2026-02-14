"use client";

import { useEffect, useState } from "react";
import { Users, FileText, Globe } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalResources: number;
}

export default function GlobalStats() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPosts: 0,
    totalResources: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/global-stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-8">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-full"></div>
          <div className="h-4 w-16 bg-white/10 rounded"></div>
        </div>
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-full"></div>
          <div className="h-4 w-16 bg-white/10 rounded"></div>
        </div>
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-full"></div>
          <div className="h-4 w-16 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-[#FF6B00]" />
        <span className="text-white font-semibold">{formatNumber(stats.totalUsers)}</span>
        <span className="text-white/50 text-sm">Users</span>
      </div>
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-[#FF6B00]" />
        <span className="text-white font-semibold">{formatNumber(stats.totalPosts)}</span>
        <span className="text-white/50 text-sm">Posts</span>
      </div>
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-[#FF6B00]" />
        <span className="text-white font-semibold">{formatNumber(stats.totalResources)}</span>
        <span className="text-white/50 text-sm">Resources</span>
      </div>
    </div>
  );
}
