"use client";

/* eslint-disable */

import Link from "next/link";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/UserAvatar";
import { Zap, TrendingUp, AlertCircle, Download, Award, Briefcase, Flame, Target, Clock, Users } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useSession();

  const stats = [
    {
      label: "Weekly Progress",
      value: "72%",
      icon: TrendingUp,
      color: "bg-blue-500/10 text-blue-500",
      description: "Next: Data Structures @ 2:00 PM",
      status: "upcoming",
    },
    {
      label: "Pending Tasks",
      value: "7",
      icon: AlertCircle,
      color: "bg-amber-500/10 text-amber-500",
      description: "3 priority tasks remaining",
      status: "pending",
    },
    {
      label: "Upcoming Deadlines",
      value: "2",
      icon: Zap,
      color: "bg-rose-500/10 text-rose-500",
      description: "Physics Lab due tonight",
      status: "urgent",
    },
  ];

  const scholarships = [
    {
      id: 1,
      name: "STEM Excellence Grant",
      organization: "National Science Foundation",
      amount: "$5,000",
      daysLeft: "3 Days Left",
      urgent: true,
    },
    {
      id: 2,
      name: "Future Tech Leaders",
      organization: "Global Career Initiative",
      amount: "$2,500",
      daysLeft: "12 Days Left",
      urgent: false,
    },
  ];

  const internships = [
    {
      id: 1,
      title: "Product Design Intern",
      company: "Stripe",
      location: "Remote",
      match: "95%",
    },
    {
      id: 2,
      title: "Software Engineer",
      company: "Vercel",
      location: "Hybrid",
      match: "82%",
    },
  ];

  const resources = [
    {
      id: 1,
      title: "Algorithms_CheatSheet_V2.pdf",
      uploader: "Prof. Chen",
      time: "2h ago",
      type: "pdf",
      icon: "description",
    },
    {
      id: 2,
      title: "Intro to Machine Learning Recap",
      uploader: "Lecture Video",
      time: "5h ago",
      type: "video",
      icon: "play_circle",
    },
    {
      id: 3,
      title: "UX Case Study Templates",
      uploader: "External Resource",
      time: "1d ago",
      type: "link",
      icon: "link",
    },
  ];

  const studyGroups = [
    {
      id: 1,
      name: "Calculus III Midterm Prep",
      members: 4,
      active: true,
      totalMembers: 9,
    },
    {
      id: 2,
      name: "Modern Art History Club",
      members: 2,
      active: false,
      nextMeeting: "Friday @ 4:00 PM",
    },
  ];

  // Mock performance data
  const performanceData = [
    { day: "Mon", engagement: 60, average: 40 },
    { day: "Tue", engagement: 85, average: 50 },
    { day: "Wed", engagement: 45, average: 35 },
    { day: "Thu", engagement: 95, average: 65 },
    { day: "Fri", engagement: 75, average: 55 },
    { day: "Sat", engagement: 20, average: 15 },
    { day: "Sun", engagement: 10, average: 10 },
  ];

  const maxValue = 100;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="size-28 md:size-32 rounded-full border-4 border-[#FF6B00] p-1 bg-[#121212] shadow-2xl shadow-[#FF6B00]/20">
                <UserAvatar avatarUrl={user?.avatarUrl} size={120} className="rounded-full" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-black text-white">Welcome back,</h1>
              <p className="text-2xl md:text-3xl font-bold text-[#FF6B00] mt-1">Living Legend!</p>
              <p className="text-neutral-400 text-sm mt-3">{user?.userType || "Student"} • {user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col gap-3 rounded-2xl p-6 bg-[#121212] border border-[#262626] shadow-xl hover:border-[#FF6B00]/30 transition-all group">
                <div className="flex items-center justify-between">
                  <p className="text-neutral-400 text-sm font-medium">{stat.label}</p>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-white text-3xl font-bold">{stat.value}</p>
                <p className={`text-xs font-medium mt-1 ${stat.status === "urgent" ? "text-rose-400" : stat.status === "upcoming" ? "text-green-400" : "text-amber-400"}`}>
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Performance Chart */}
        <section className="mb-8 p-6 bg-[#121212] border border-[#262626] rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF6B00]" />
              <h2 className="text-white text-xl font-bold">User Performance</h2>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                <span className="size-2 rounded-full bg-[#FF6B00]"></span> Engagement
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                <span className="size-2 rounded-full bg-neutral-700"></span> Avg. Class
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between h-48 gap-2 px-2">
            {performanceData.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 gap-2">
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  <svg className="w-2 sm:w-4 h-full" viewBox="0 0 10 100" preserveAspectRatio="xMidYMax slice" aria-hidden>
                    <rect x="0" y={100 - Math.round((data.engagement / maxValue) * 100)} width="4" height={Math.round((data.engagement / maxValue) * 100)} rx="1" fill="#FF6B00" />
                    <rect x="6" y={100 - Math.round((data.average / maxValue) * 100)} width="4" height={Math.round((data.average / maxValue) * 100)} rx="1" fill="#374151" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-neutral-500 uppercase">{data.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Insights & Advanced Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Study Streak */}
          <div className="flex flex-col gap-3 rounded-2xl p-6 bg-[#121212] border border-[#262626] shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-neutral-400 text-sm font-medium">Study Streak</p>
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <p className="text-white text-3xl font-bold">12 days</p>
            <p className="text-xs text-green-400 font-medium mt-1">Keep it up! You&apos;re on fire 🔥</p>
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-2 flex-1 bg-green-500/40 rounded-full" />
              ))}
            </div>
          </div>

          {/* Focus Goals */}
          <div className="flex flex-col gap-3 rounded-2xl p-6 bg-[#121212] border border-[#262626] shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-neutral-400 text-sm font-medium">Focus Goals</p>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <p className="text-white text-3xl font-bold">6/8</p>
            <p className="text-xs text-blue-400 font-medium mt-1">Completed this week</p>
            <div className="mt-4 w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-500 h-full w-3/4" />
            </div>
          </div>

          {/* Time Invested */}
          <div className="flex flex-col gap-3 rounded-2xl p-6 bg-[#121212] border border-[#262626] shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-neutral-400 text-sm font-medium">Time Invested</p>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-white text-3xl font-bold">24.5h</p>
            <p className="text-xs text-purple-400 font-medium mt-1">This week</p>
            <p className="text-xs text-neutral-500 mt-2">Goal: 28 hours</p>
          </div>
        </section>

        {/* Smart Learning Recommendations */}
        <section className="mb-8 p-6 bg-gradient-to-r from-[#FF6B00]/20 to-transparent border border-[#FF6B00]/30 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FF6B00]" />
              <h2 className="text-white text-xl font-bold">AI-Powered Recommendations</h2>
            </div>
            <span className="bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-bold px-3 py-1 rounded-full border border-[#FF6B00]/30">
              Personalized
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Master Discrete Math",
                description: "Your performance dipped 15% this week. Review these 5 key concepts.",
                actions: "Review Now",
                color: "from-amber-500/20 to-amber-500/5",
              },
              {
                title: "Join Advanced Algorithms Group",
                description: "Based on your 95% match score, you'd excel in this peer study group.",
                actions: "Join Group",
                color: "from-green-500/20 to-green-500/5",
              },
              {
                title: "Claim Internship by Friday",
                description: "Stripe Product Design role closes in 3 days. Your match: 95%",
                actions: "Apply Now",
                color: "from-blue-500/20 to-blue-500/5",
              },
            ].map((rec, i) => (
              <div key={i} className={`bg-gradient-to-br ${rec.color} border border-white/10 p-4 rounded-xl`}>
                <h3 className="font-bold text-white text-sm mb-2">{rec.title}</h3>
                <p className="text-xs text-neutral-300 mb-4">{rec.description}</p>
                <button className="text-[#FF6B00] text-xs font-bold hover:text-[#FF6B00]/80 transition-colors">
                  {rec.actions} →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Scholarships & Internships Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Scholarships */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FF6B00]" />
                <h2 className="text-white text-xl font-bold">Available Scholarships</h2>
              </div>
              <Link href={`/roles/${user?.userType?.toLowerCase() || 'student'}/scholarships`} className="text-[#FF6B00] text-sm font-bold hover:text-[#FF6B00]/80 transition-colors">See All</Link>
            </div>
            <div className="flex flex-col gap-3">
              {scholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="bg-[#121212] border border-[#262626] p-4 rounded-2xl flex items-center justify-between hover:border-[#FF6B00] transition-all cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{scholarship.name}</h3>
                      <p className="text-xs text-neutral-500">{scholarship.organization}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white text-lg">{scholarship.amount}</p>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-0.5 ${scholarship.urgent ? "text-rose-400" : "text-neutral-500"}`}>
                      {scholarship.daysLeft}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Internships */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#FF6B00]" />
                <h2 className="text-white text-xl font-bold">Latest Internships</h2>
              </div>
              <Link href={`/roles/${user?.userType?.toLowerCase() || 'student'}/internships`} className="text-[#FF6B00] text-sm font-bold hover:text-[#FF6B00]/80 transition-colors">See All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {internships.map((internship) => (
                <div key={internship.id} className="bg-[#121212] border border-[#262626] p-5 rounded-2xl flex flex-col gap-4 shadow-lg hover:border-[#FF6B00]/30 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="size-12 bg-neutral-800 rounded-xl flex items-center justify-center border border-[#262626]">
                      <span className="material-symbols-outlined text-neutral-400">business</span>
                    </div>
                    <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#FF6B00]/20">
                      {internship.match} Match
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{internship.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      {internship.company} • {internship.location}
                    </p>
                  </div>
                  <button className="w-full bg-neutral-800 hover:bg-[#FF6B00] text-white py-2.5 rounded-xl text-xs font-bold transition-all border border-neutral-700 hover:border-[#FF6B00]">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-[#FF6B00]" />
                <h2 className="text-white text-xl font-bold">Recent Resources</h2>
              </div>
              <Link href={`/roles/${user?.userType?.toLowerCase() || 'student'}/resources`} className="text-[#FF6B00] text-sm font-bold hover:text-[#FF6B00]/80 transition-colors">Explore</Link>
            </div>
            <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
              <div className="flex flex-col divide-y divide-[#262626]">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="p-4 flex items-center justify-between hover:bg-neutral-900/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-lg flex items-center justify-center ${resource.type === "pdf" ? "bg-rose-500/10 text-rose-500" : resource.type === "video" ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500"}`}>
                        <span className="material-symbols-outlined">{resource.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-[#FF6B00] transition-colors">{resource.title}</p>
                        <p className="text-xs text-neutral-500">
                          {resource.uploader} • {resource.time}
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-neutral-600 group-hover:text-white transition-colors">
                      {resource.type === "pdf" ? "download" : resource.type === "video" ? "play_arrow" : "open_in_new"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Study Groups */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF6B00]" />
                <h2 className="text-white text-xl font-bold">My Study Groups</h2>
              </div>
              <Link href={`/roles/${user?.userType?.toLowerCase() || 'student'}/groups`} className="text-[#FF6B00] text-sm font-bold hover:text-[#FF6B00]/80 transition-colors">Manage</Link>
            </div>
            <div className="flex flex-col gap-3">
              {studyGroups.map((group) => (
                <div key={group.id} className="bg-[#121212] border border-[#262626] p-4 rounded-2xl flex items-center justify-between shadow-lg hover:border-[#FF6B00]/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[0, 1, 2].map((idx) => (
                        <div
                          key={idx}
                          className="size-10 rounded-full border-2 border-[#121212] bg-neutral-700 flex items-center justify-center text-xs font-bold text-white"
                        >
                          {idx + 1}
                        </div>
                      ))}
                      <div className="size-10 rounded-full bg-neutral-800 border-2 border-[#121212] flex items-center justify-center text-xs font-bold text-neutral-400">
                        +{group.totalMembers || (group.members + 2)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{group.name}</h3>
                      {group.active ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          <p className="text-xs text-green-500 font-medium">{group.members} members active</p>
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-500 mt-0.5">Next meeting: {group.nextMeeting}</p>
                      )}
                    </div>
                  </div>
                  <button className="px-5 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/80 text-black text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#FF6B00]/20">
                    Enter Room
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
