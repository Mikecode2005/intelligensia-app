"use client";

/* eslint-disable */

import { useState } from "react";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";
import { 
  ArrowLeft,
  Bell,
  Send,
  PlusCircle,
  Smile,
  Download,
  PlayCircle,
  FileText,
  Mail,
  MessageCircle,
  Phone,
  MoreHorizontal,
  X
} from "lucide-react";

// Mock classroom data
const CLASSROOM_DATA = {
  id: "class_1",
  name: "Advanced Quantum Computing",
  description: "Mastering quantum algorithms and their practical applications",
  field: { name: "Physics" },
  joinCode: "QC2024",
  memberCount: 156,
  assignmentCount: 8,
  resourceCount: 24,
  progress: 68,
  isEnrolled: true,
  userRole: "STUDENT",
  stats: {
    engagement: 92,
    activeLearners: 45,
    resourcesShared: 124
  },
  lecturer: {
    name: "Dr. Sarah Chen",
    role: "Lead Lecturer",
    avatar: null,
    online: true
  },
  members: [
    { id: 1, name: "Marcus Wright", role: "Teaching Assistant", avatar: null, online: false },
    { id: 2, name: "Elena Belova", role: "Teaching Assistant", avatar: null, online: true }
  ],
  resources: [
    { id: 1, title: "Quantum Operators.pdf", type: "pdf", size: "2.4 MB", category: "Lecture Materials" },
    { id: 2, title: "Wave Dynamics Lab", type: "video", size: "Video", category: "Video Walkthrough" },
    { id: 3, title: "Practice Problem Set 3", type: "document", size: "12 Tasks • 4MB", category: "Practice" }
  ],
  messages: [
    { id: 1, user: "Julian Dawkins", initials: "JD", time: "10:47 AM", content: "Could someone clarify the wave function normalization process for a 1D potential well? I'm getting stuck on the integration constant.", isLecturer: false },
    { id: 2, user: "Dr. Sarah Chen", initials: "SC", time: "10:49 AM", content: "Julian, check page 12 of these notes. I've highlighted the boundary condition steps.", isLecturer: true, hasAttachment: true, attachmentName: "Lecture_Notes_Week_4.pdf", attachmentSize: "2.4 MB" }
  ]
};

export default function ClassroomDetail({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("");
  
  // Use real user data if available
  const userStats = {
    engagement: CLASSROOM_DATA.stats.engagement,
    activeLearners: CLASSROOM_DATA.stats.activeLearners,
    resourcesShared: CLASSROOM_DATA.stats.resourcesShared,
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would call an API
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 flex flex-col overflow-hidden font-display">
      {/* IntelliBar Metrics */}
      <nav className="h-auto min-[768px]:h-16 flex flex-col min-[768px]:flex-row items-center justify-between px-4 min-[768px]:px-8 py-3 min-[768px]:py-0 border-b border-white/5 bg-[#05070a]/80 backdrop-blur-md gap-2 min-[768px]:gap-0">
        <div className="flex items-center gap-3 w-full min-[768px]:w-auto justify-between min-[768px]:justify-start">
          <Link href="/roles/student/classrooms" className="flex items-center gap-2 text-slate-400 hover:text-[#ff8c00] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="material-symbols-outlined text-[#ff8c00] text-2xl min-[768px]:text-3xl">token</span>
          <span className="text-lg min-[768px]:text-xl font-bold tracking-tighter text-white">INTELLIGENTSIA</span>
        </div>
        
        {/* Metrics Center */}
        <div className="flex gap-4 min-[768px]:gap-12 text-sm font-medium w-full min-[768px]:w-auto overflow-x-auto pb-2 min-[768px]:pb-0">
          <div className="flex flex-col items-center min-w-[80px]">
            <span className="text-[#ff8c00] font-bold text-glow">{userStats.engagement}%</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500">Class Engagement</span>
          </div>
          <div className="flex flex-col items-center border-x border-white/10 min-[768px]:px-4">
            <span className="text-[#ff8c00] font-bold text-glow">{CLASSROOM_DATA.stats.activeLearners}</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500">Active Learners</span>
          </div>
          <div className="flex flex-col items-center min-w-[80px]">
            <span className="text-[#ff8c00] font-bold text-glow">{CLASSROOM_DATA.stats.resourcesShared}</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500">Resources Shared</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full min-[768px]:w-auto justify-between min-[768px]:justify-end">
          <button className="text-slate-400 hover:text-[#ff8c00] transition-colors" aria-label="Notifications">
            <Bell className="w-5 h-5" />
          </button>
          <button className="bg-[#135bec]/20 hover:bg-[#135bec]/30 text-[#135bec] border border-[#135bec]/40 px-3 min-[768px]:px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap">
            Live Session
          </button>
        </div>
      </nav>

      {/* Main Layout Container */}
      <main className="flex-1 flex overflow-hidden p-3 min-[768px]:p-6 gap-4 min-[768px]:gap-6 max-w-[1920px] mx-auto w-full flex-col min-[768px]:flex-row">
        {/* Center Column: Real-time Feed */}
        <section className="flex-1 flex flex-col glass-panel rounded-3xl overflow-hidden border-white/5 shadow-2xl min-h-[500px]">
          {/* Feed Header */}
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff8c00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff8c00]"></span>
              </span>
              <h2 className="text-sm font-bold uppercase tracking-tighter">Live discussion: Schrödinger's Equation</h2>
            </div>
            <div className="flex -space-x-2">
              <div className="size-6 rounded-full border-2 border-[#05070a] bg-slate-700 flex items-center justify-center text-[8px] font-bold">JD</div>
              <div className="size-6 rounded-full border-2 border-[#05070a] bg-[#135bec]/20 flex items-center justify-center text-[8px] font-bold text-[#135bec]">SC</div>
              <div className="size-6 rounded-full border-2 border-[#05070a] bg-slate-700 text-[8px] flex items-center justify-center">+42</div>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* System Message */}
            <div className="text-center">
              <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-slate-500 uppercase">Today - 10:45 AM</span>
            </div>
            
            {/* Messages */}
            {CLASSROOM_DATA.messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 max-w-[80%] ${msg.isLecturer ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`size-10 shrink-0 rounded-xl flex items-center justify-center text-xs font-bold border ${
                  msg.isLecturer 
                    ? 'bg-[#135bec]/20 text-[#135bec] border-[#135bec]/30' 
                    : 'bg-slate-800 text-white border-white/10'
                }`}>
                  {msg.initials}
                </div>
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 ${msg.isLecturer ? 'justify-end' : ''}`}>
                    <span className={`text-xs font-bold ${msg.isLecturer ? 'text-[#ff8c00]' : 'text-white'}`}>{msg.user}</span>
                    <span className="text-[10px] text-slate-500">{msg.time}</span>
                  </div>
                  <div className={`p-4 rounded-2xl border ${
                    msg.isLecturer 
                      ? 'bg-[#135bec]/10 rounded-tr-none border-[#135bec]/20' 
                      : 'bg-white/5 rounded-tl-none border-white/5'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    {msg.hasAttachment && (
                      <div className="flex items-center gap-3 bg-[#05070a]/80 p-3 rounded-xl border border-white/10 group cursor-pointer hover:border-[#ff8c00]/40 transition-colors mt-3">
                        <FileText className="text-[#ff8c00]" />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-medium truncate">{msg.attachmentName}</p>
                          <p className="text-[10px] text-slate-500">{msg.attachmentSize}</p>
                        </div>
                        <Download className="text-slate-500 group-hover:text-[#ff8c00] transition-colors" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Discussion Indicator */}
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <span className="text-[10px] text-[#ff8c00] font-bold tracking-widest uppercase">3 People are typing...</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t border-white/5 bg-[#05070a]/50">
            <div className="relative flex items-center">
              <button className="absolute left-4 text-slate-500 hover:text-[#ff8c00]" aria-label="Add attachment">
                <PlusCircle className="w-5 h-5" />
              </button>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-32 focus:ring-[#ff8c00] focus:border-[#ff8c00] text-sm text-white placeholder:text-slate-600 transition-all"
                placeholder="Type your question or insight..."
                type="text"
              />
              <div className="absolute right-3 flex items-center gap-2">
                <button className="text-slate-500 hover:text-white" aria-label="Add emoji">
                  <Smile className="w-5 h-5" />
                </button>
                  <button 
                  onClick={handleSendMessage}
                  className="bg-[#ff8c00] hover:bg-orange-500 text-black p-2 rounded-xl flex items-center justify-center transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 font-bold" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Resources & Faculty */}
        <aside className="w-full min-[768px]:w-80 flex flex-col gap-6">
          {/* Resources Available */}
          <div className="glass-panel p-5 rounded-3xl border-white/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Resources Available</h3>
              <MoreHorizontal className="text-slate-500 text-sm" />
            </div>
            <div className="space-y-3">
              {CLASSROOM_DATA.resources.map((resource) => (
                <div key={resource.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className={`size-10 rounded-lg flex items-center justify-center ${
                    resource.type === 'pdf' ? 'bg-red-500/10 text-red-500' :
                    resource.type === 'video' ? 'bg-[#135bec]/10 text-[#135bec]' :
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {resource.type === 'pdf' && <FileText className="w-5 h-5" />}
                    {resource.type === 'video' && <PlayCircle className="w-5 h-5" />}
                    {resource.type === 'document' && <FileText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold truncate">{resource.title}</p>
                    <p className="text-[10px] text-slate-500">{resource.category}</p>
                  </div>
                  {resource.type === 'video' ? (
                    <PlayCircle className="text-slate-600 group-hover:text-[#ff8c00] transition-colors" />
                  ) : (
                    <Download className="text-slate-600 group-hover:text-[#ff8c00] transition-colors" />
                  )}
                </div>
              ))}
            </div>
            <button className="w-full py-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 border border-dashed border-white/10 rounded-xl hover:text-white hover:border-white/30 transition-all">
              View All Resources
            </button>
          </div>

          {/* Faculty Section */}
          <div className="glass-panel p-5 rounded-3xl border-white/5 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Class Members</h3>
            
            {/* Main Lecturer */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Lecturers</p>
            <div className="relative rounded-2xl bg-gradient-to-br from-[#135bec]/20 to-transparent p-px">
              <div className="bg-[#05070a]/60 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full border-2 border-[#135bec]/50 p-0.5">
                    <UserAvatar avatarUrl={CLASSROOM_DATA.lecturer.avatar} size={44} className="rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{CLASSROOM_DATA.lecturer.name}</p>
                    <p className="text-[10px] text-[#135bec] uppercase font-bold tracking-wider">{CLASSROOM_DATA.lecturer.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 p-2 rounded-lg text-slate-300 transition-colors flex items-center justify-center" aria-label="Send email">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="flex-1 bg-white/5 hover:bg-white/10 p-2 rounded-lg text-slate-300 transition-colors flex items-center justify-center" aria-label="Send message">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="flex-1 bg-white/5 hover:bg-white/10 p-2 rounded-lg text-slate-300 transition-colors flex items-center justify-center" aria-label="Make call">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Teaching Assistants */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-4 mb-2">Members</p>
            <div className="space-y-3">
              {CLASSROOM_DATA.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <UserAvatar avatarUrl={member.avatar} size={32} className="rounded-full grayscale opacity-60" />
                      <div className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#05070a] ${
                        member.online ? 'bg-green-500' : 'bg-slate-500'
                      }`}></div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-300">{member.name}</p>
                      <p className="text-[9px] text-slate-500 uppercase">{member.role}</p>
                    </div>
                  </div>
                  <button className="text-slate-500 text-sm hover:text-white cursor-pointer" aria-label="Send message">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Discussion Activity Heatmap */}
          <div className="glass-panel p-5 rounded-3xl border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Class Velocity</h3>
            <div className="flex items-end gap-1 h-12">
              <div className="w-full bg-[#ff8c00]/20 h-[30%] rounded-sm"></div>
              <div className="w-full bg-[#ff8c00]/40 h-[60%] rounded-sm"></div>
              <div className="w-full bg-[#ff8c00]/10 h-[20%] rounded-sm"></div>
              <div className="w-full bg-[#ff8c00]/60 h-[80%] rounded-sm"></div>
              <div className="w-full bg-[#ff8c00] h-[100%] rounded-sm orange-glow"></div>
              <div className="w-full bg-[#ff8c00]/30 h-[45%] rounded-sm"></div>
              <div className="w-full bg-[#ff8c00]/10 h-[15%] rounded-sm"></div>
            </div>
          </div>
        </aside>
      </main>

      {/* Visual Polish: Decorative Accents */}
      <div className="fixed top-[-10%] left-[-10%] size-[500px] bg-[#135bec]/10 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] size-[400px] bg-[#ff8c00]/5 blur-[120px] pointer-events-none"></div>
    </div>
  );
}
