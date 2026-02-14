"use client";

/* eslint-disable */

import { useState, useEffect } from "react";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/UserAvatar";
import { 
  Book, 
  Search, 
  Plus, 
  Users, 
  Clock, 
  ArrowRight, 
  Play,
  Trophy,
  Flame,
  TrendingUp,
  Award,
  Calendar,
  FileText,
  MessageSquare,
  X,
  Check
} from "lucide-react";
import Link from "next/link";

// Mock classroom data for demonstration
const MOCK_CLASSROOMS = [
  {
    id: "class_1",
    name: "Advanced Quantum Computing",
    description: "Mastering quantum algorithms and their practical applications",
    field: { name: "Physics" },
    memberCount: 156,
    assignmentCount: 8,
    resourceCount: 24,
    progress: 68,
    isEnrolled: true,
    userRole: "STUDENT",
    nextSession: {
      title: "Quantum Fourier Transform",
      instructor: "Dr. Sarah Chen",
      isLive: true
    },
    assignments: [
      { id: 1, title: "Quantum Fourier Transform", dueDate: "Today", urgent: true },
      { id: 2, title: "Shor's Algorithm Implementation", dueDate: "3 days", urgent: false }
    ]
  },
  {
    id: "class_2",
    name: "Advanced Data Structures",
    description: "Graph theory, B-Trees, and complex algorithmic structures",
    field: { name: "Computer Science" },
    memberCount: 234,
    assignmentCount: 12,
    resourceCount: 45,
    progress: 24,
    isEnrolled: true,
    userRole: "STUDENT",
    nextSession: null,
    assignments: [
      { id: 1, title: "Graph Traversals Quiz", dueDate: "5 days", urgent: false }
    ]
  },
  {
    id: "class_3",
    name: "Neural Network Architectures",
    description: "Deep learning, transformers, and NLP applications",
    field: { name: "Computer Science" },
    memberCount: 189,
    assignmentCount: 6,
    resourceCount: 18,
    progress: 0,
    isEnrolled: false,
    userRole: null,
    nextSession: {
      title: "Introduction to Transformers",
      instructor: "Prof. Michael Lee",
      isLive: false
    },
    assignments: []
  },
  {
    id: "class_4",
    name: "Modern Machine Learning",
    description: "Supervised and unsupervised learning techniques",
    field: { name: "Computer Science" },
    memberCount: 312,
    assignmentCount: 10,
    resourceCount: 32,
    progress: 0,
    isEnrolled: false,
    userRole: null,
    nextSession: null,
    assignments: []
  }
];

// Activity data for the sidebar
const ACTIVITY_DATA = [
  { id: 1, user: "Elena R.", action: "replied to your question", context: "#quantum-theory", time: "2 hours ago", avatar: null },
  { id: 2, user: "System", action: "New Resource available", context: "Advanced Heuristics PDF", time: "5 hours ago", isSystem: true }
];

export default function StudentClassrooms() {
  const { user } = useSession();
  const [classrooms, setClassrooms] = useState(MOCK_CLASSROOMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [activeTab, setActiveTab] = useState<"enrolled" | "available">("enrolled");

  // Filter classrooms based on search and tab
  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          classroom.field?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "enrolled") {
      return classroom.isEnrolled && matchesSearch;
    } else {
      return !classroom.isEnrolled && matchesSearch;
    }
  });

  // Stats from the ui2.html design
  const stats = [
    { label: "Day Streak", value: "12 Days", icon: Flame, color: "text-primary" },
    { label: "Total XP", value: "4,850", icon: Trophy, color: "text-primary" },
    { label: "Badges", value: "8 Earned", icon: Award, color: "text-primary" },
    { label: "Rank", value: "Top 5%", icon: TrendingUp, color: "text-primary" }
  ];

  const handleJoinClass = () => {
    if (joinCode.trim()) {
      // In a real app, this would call the API
      alert(`Joining class with code: ${joinCode}`);
      setJoinCode("");
      setShowJoinDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Profile Cutout & Welcome Section */}
        <div className="relative pt-8 pb-8 flex flex-col items-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-[#050505] bg-[#1a1a1a] overflow-hidden orange-glow z-10">
            <UserAvatar 
              avatarUrl={user?.avatarUrl} 
              size={120} 
              className="rounded-full"
            />
          </div>
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(" ")[0] || "Student"}</h2>
            <p className="text-white/50 text-sm">Your learning journey continues</p>
          </div>
        </div>

        {/* IntelliBar Engagement Stats */}
        <div className="max-w-4xl mx-auto bg-[#1a1a1a] border border-[#FF8C00]/10 rounded-xl p-1 mb-8 flex items-center justify-around">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-1 items-center justify-center gap-3 py-3 border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer first:rounded-l-xl last:rounded-r-xl"
              >
                <Icon className={stat.color} />
                <div>
                  <p className="text-xs text-white/40 uppercase font-bold tracking-wider">{stat.label}</p>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left & Center Column: Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Session Hero */}
            {classrooms.some(c => c.isEnrolled && c.nextSession?.isLive) && (
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#050505] border border-[#FF8C00]/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6 group">
                <div className="relative z-10 flex-1">
                  <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Live Now</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {classrooms.find(c => c.isEnrolled && c.nextSession?.isLive)?.nextSession?.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-6 max-w-md">
                    Join {classrooms.find(c => c.isEnrolled && c.nextSession?.isLive)?.nextSession?.instructor} for a deep dive into the topic.
                  </p>
                  <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 orange-glow transition-all active:scale-95">
                    <Play className="w-5 h-5" />
                    Join Live Session
                  </button>
                </div>
                <div className="relative z-10 w-full md:w-1/3 aspect-video rounded-lg bg-black/40 flex items-center justify-center border border-white/5 overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
                  <span className="material-symbols-outlined text-white/20 text-5xl">podcasts</span>
                </div>
              </div>
            )}

            {/* Tabs and Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-[#121212] rounded-xl p-1 border border-[#262626]">
                <button
                  onClick={() => setActiveTab("enrolled")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === "enrolled" 
                      ? "bg-primary text-black" 
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  My Classes
                </button>
                <button
                  onClick={() => setActiveTab("available")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === "available" 
                      ? "bg-primary text-black" 
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Browse Classes
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search classes..."
                    className="bg-white/5 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary w-full sm:w-64 text-white placeholder-white/40"
                  />
                </div>
                <button 
                  onClick={() => setShowJoinDialog(true)}
                  className="p-2 bg-primary hover:bg-primary/90 text-black rounded-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Active Courses */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Book className="text-primary" />
                  {activeTab === "enrolled" ? "My Active Courses" : "Available Courses"}
                </h3>
              </div>
              
              {filteredClassrooms.length === 0 ? (
                <div className="text-center py-12 bg-[#121212] rounded-xl border border-[#262626]">
                  <Book className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">No classes found</p>
                  {activeTab === "available" && (
                    <button 
                      onClick={() => setShowJoinDialog(true)}
                      className="mt-4 text-primary font-bold hover:underline"
                    >
                      Join a class with code
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredClassrooms.map((classroom) => (
                    <div 
                      key={classroom.id}
                      className="bg-[#1a1a1a] border border-[#FF8C00]/20 rounded-xl p-5 hover:bg-[#252525] hover:border-[#FF8C00]/40 transition-all group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Book className="text-primary w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-white/40">
                          {classroom.field?.name}
                        </span>
                      </div>
                      <h4 className="text-white font-bold mb-1">{classroom.name}</h4>
                      <p className="text-white/40 text-xs mb-4 line-clamp-2">{classroom.description}</p>
                      
                      {classroom.isEnrolled && (
                        <div className="space-y-2 mb-6">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white/60">Progress</span>
                            <span className="text-primary font-bold">{classroom.progress}%</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-primary h-full rounded-full" 
                              style={{ width: `${classroom.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {classroom.memberCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {classroom.assignmentCount}
                          </span>
                        </div>
                        {classroom.isEnrolled ? (
                          <Link href={`/roles/student/classrooms/${classroom.id}`} className="py-2 bg-white/5 hover:bg-primary hover:text-white text-white/80 rounded-lg text-sm font-bold transition-all flex items-center gap-1">
                            Continue 
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <button className="py-2 bg-white/5 hover:bg-primary hover:text-white text-white/80 rounded-lg text-sm font-bold transition-all flex items-center gap-1">
                            Join 
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Assignments */}
            <div className="bg-[#1a1a1a] border border-[#FF8C00]/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="text-primary" />
                Deadlines
              </h3>
              <div className="space-y-4">
                {classrooms
                  .filter(c => c.isEnrolled && c.assignments.length > 0)
                  .flatMap(c => c.assignments.map(a => ({ ...a, className: c.name })))
                  .slice(0, 5)
                  .map((assignment) => (
                    <div 
                      key={assignment.id}
                      className={`flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-l-2 ${
                        assignment.urgent ? "border-primary" : "border-white/10"
                      }`}
                    >
                      <div className="flex-1">
                        <h5 className="text-sm font-bold text-white">{assignment.title}</h5>
                        <p className="text-xs text-white/40">Course: {assignment.className}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold uppercase ${
                          assignment.urgent ? "text-primary" : "text-white/40"
                        }`}>
                          {assignment.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
              <button className="w-full mt-6 py-2 border border-white/5 hover:border-primary/40 text-white/60 hover:text-primary rounded-lg text-xs font-bold transition-all uppercase tracking-widest">
                See Schedule
              </button>
            </div>

            {/* Community Updates */}
            <div className="bg-[#1a1a1a] border border-[#FF8C00]/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="text-primary" />
                Recent Activity
              </h3>
              <div className="space-y-6">
                {ACTIVITY_DATA.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="size-8 rounded-full bg-white/5 shrink-0 flex items-center justify-center">
                      {activity.isSystem ? (
                        <span className="material-symbols-outlined text-white/40 text-sm">school</span>
                      ) : (
                        <span className="text-xs font-bold text-white/40">
                          {activity.user.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-white/80 leading-relaxed">
                        <span className="font-bold">{activity.user}</span> {activity.action} {activity.context && <span className="text-primary">in {activity.context}</span>}
                      </p>
                      <span className="text-[10px] text-white/30 uppercase">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Banner */}
            <div className="rounded-xl p-6 bg-primary overflow-hidden relative group cursor-pointer">
              <div className="relative z-10">
                <h4 className="text-white font-bold mb-2">Upgrade to Elite</h4>
                <p className="text-white/90 text-xs mb-4 leading-relaxed">
                  Get 1-on-1 mentorship and access to exclusive lab environments.
                </p>
                <span className="text-xs font-bold bg-white text-primary px-3 py-1.5 rounded flex items-center w-fit gap-2">
                  Explore Benefits <ArrowRight className="text-sm" />
                </span>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-white/20 text-8xl group-hover:rotate-12 transition-transform">
                workspace_premium
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Join Class Dialog */}
      {showJoinDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Join a Class</h3>
              <button 
                onClick={() => setShowJoinDialog(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">Enter Class Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g., ABC123"
                  className="w-full bg-white/5 border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-white/40 focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-white/40 mt-2">
                  Ask your instructor for the class code
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowJoinDialog(false)}
                  className="flex-1 py-3 border border-white/10 text-white/60 rounded-xl font-bold hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleJoinClass}
                  disabled={!joinCode.trim()}
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-black rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Join Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
