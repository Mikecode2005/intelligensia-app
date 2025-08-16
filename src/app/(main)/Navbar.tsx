"use client";

import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import { useState } from "react";
import { TrendingUp, Users, Bell, X, Hash, Eye, MessageCircle, Heart } from "lucide-react";

interface TrendingPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

function TrendingPopup({ isOpen, onClose }: TrendingPopupProps) {
  const trendingTopics = [
    { topic: "#TechTrends", posts: "12.4k posts", growth: "+15%" },
    { topic: "#StudyTips", posts: "8.7k posts", growth: "+23%" },
    { topic: "#CareerAdvice", posts: "6.2k posts", growth: "+8%" },
    { topic: "#Innovation", posts: "4.9k posts", growth: "+12%" },
    { topic: "#Learning", posts: "3.8k posts", growth: "+18%" },
  ];

  const userStats = {
    followers: "2,847",
    following: "1,234",
    posts: "156",
    likes: "12.3k",
    views: "45.2k"
  };

  const quickInfo = [
    { label: "Profile Views", value: "1,234", icon: Eye, change: "+12%" },
    { label: "Post Engagement", value: "8.7%", icon: Heart, change: "+2.3%" },
    { label: "New Messages", value: "23", icon: MessageCircle, change: "+5" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/20 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="h-6 w-6 text-orange-600 mr-2" />
            Trending & Stats
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* User Stats */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Your Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.followers}</div>
                <div className="text-orange-100 text-sm">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.following}</div>
                <div className="text-orange-100 text-sm">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.posts}</div>
                <div className="text-orange-100 text-sm">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.likes}</div>
                <div className="text-orange-100 text-sm">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.views}</div>
                <div className="text-orange-100 text-sm">Views</div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-5 w-5 text-orange-600" />
                      <span className="text-sm text-green-600 font-medium">{info.change}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{info.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{info.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trending Topics */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Hash className="h-5 w-5 text-orange-600 mr-2" />
              Trending Topics
            </h3>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{topic.topic}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{topic.posts}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-green-600 font-medium">{topic.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              View Full Analytics
            </button>
            <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isTrendingOpen, setIsTrendingOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 bg-card shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
          <Link href="/" className="text-2xl font-bold text-orange-600">
            Intelligensia
          </Link>
          <SearchField />
          
          {/* Trending Button */}
          <button
            onClick={() => setIsTrendingOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trending</span>
          </button>

          <UserButton className="sm:ms-auto" />
        </div>
      </header>

      <TrendingPopup isOpen={isTrendingOpen} onClose={() => setIsTrendingOpen(false)} />
    </>
  );
}