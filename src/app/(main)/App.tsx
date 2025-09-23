"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from "@/assets/Intelligwntia.png"; // Corrected typo in filename
import {
  Home,
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Search,
  Bell,
  MessageCircle,
  Settings,
  Plus,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  TrendingUp,
  Calendar,
  Clock,
  Menu,
  X,
  UserPlus,
  MessageSquare,
  Trophy,
  Star,
  Target,
} from "lucide-react";

interface CircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color: string;
  label: string;
  value: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size,
  strokeWidth,
  color,
  label,
  value,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{percentage}%</div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>
    </div>
  );
};

interface HorizontalBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  icon: React.ReactNode;
}

const HorizontalBar: React.FC<HorizontalBarProps> = ({
  label,
  value,
  maxValue,
  color,
  icon,
}) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm text-gray-500">
          {value}/{maxValue}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

interface InfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoPopup: React.FC<InfoPopupProps> = ({ isOpen, onClose }) => {
  const trendingTopics = [
    { topic: "#FinalExams", posts: "2.4k posts" },
    { topic: "#StudyTips", posts: "1.8k posts" },
    { topic: "#CampusLife", posts: "3.1k posts" },
    { topic: "#Internships", posts: "947 posts" },
    { topic: "#ResearchOpportunity", posts: "612 posts" },
  ];

  const upcomingEvents = [
    { title: "Career Fair", date: "Dec 15", time: "10:00 AM" },
    { title: "Study Session", date: "Dec 16", time: "2:00 PM" },
    { title: "Club Meeting", date: "Dec 18", time: "6:00 PM" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Info</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-orange-500 mx-auto flex items-center justify-center">
              <span className="text-white text-xl font-medium">JD</span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">John Doe</h3>
            <p className="text-sm text-gray-500">Computer Science • MIT</p>
            <div className="mt-4 flex justify-center space-x-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">245</span>
                <p className="text-gray-500">Posts</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">1.2k</span>
                <p className="text-gray-500">Following</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">892</span>
                <p className="text-gray-500">Followers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Trending</h3>
          </div>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div
                key={index}
                className="flex justify-between items-center hover:bg-gray-50 p-2 rounded-md cursor-pointer transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{topic.topic}</p>
                  <p className="text-sm text-gray-500">{topic.posts}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Upcoming</h3>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer transition-colors"
              >
                <div className="flex-shrink-0">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {event.date} • {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const studyProgress = [
    { subject: "Mathematics", completed: 8, total: 12, color: "#ea580c" },
    { subject: "Physics", completed: 6, total: 10, color: "#f59e0b" },
    { subject: "Chemistry", completed: 9, total: 12, color: "#10b981" },
    { subject: "Computer Science", completed: 11, total: 15, color: "#3b82f6" },
    { subject: "Literature", completed: 7, total: 8, color: "#8b5cf6" },
  ];

  const weeklyActivity = [
    { day: "Mon", posts: 3, study: 4 },
    { day: "Tue", posts: 5, study: 6 },
    { day: "Wed", posts: 2, study: 3 },
    { day: "Thu", posts: 7, study: 8 },
    { day: "Fri", posts: 4, study: 5 },
    { day: "Sat", posts: 6, study: 2 },
    { day: "Sun", posts: 3, study: 7 },
  ];

  const maxActivity = Math.max(...weeklyActivity.map((d) => Math.max(d.posts, d.study)));

  const joinedGroups = [
    {
      name: "CS Study Group",
      members: 24,
      avatar: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      name: "Math Tutoring",
      members: 18,
      avatar: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      name: "Physics Lab",
      members: 31,
      avatar: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      name: "Book Club",
      members: 12,
      avatar: "https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
  ];

  const friends = [
    {
      name: "Sarah Chen",
      school: "MIT",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      name: "Marcus Johnson",
      school: "Stanford",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      name: "Elena Rodriguez",
      school: "Harvard",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      name: "David Kim",
      school: "Caltech",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
  ];

  const achievements = [
    {
      title: "Study Streak",
      description: "7 days in a row",
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      color: "bg-yellow-50",
    },
    {
      title: "Top Contributor",
      description: "Most helpful posts",
      icon: <Star className="h-6 w-6 text-orange-500" />,
      color: "bg-orange-50",
    },
    {
      title: "Quiz Master",
      description: "95% average score",
      icon: <Target className="h-6 w-6 text-green-500" />,
      color: "bg-green-50",
    },
    {
      title: "Social Butterfly",
      description: "50+ connections",
      icon: <Users className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <img
              src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
              alt="Profile"
              className="h-20 w-20 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">Welcome back, John!</h1>
              <p className="text-orange-100 mt-1">Computer Science • MIT • Class of 2025</p>
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined March 2023</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Last active 2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Level 12</div>
            <div className="text-orange-100">Academic Explorer</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4">
            <Users className="h-6 w-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">1,247</div>
          <div className="text-sm text-gray-500">Followers</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">892</div>
          <div className="text-sm text-gray-500">Following</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
            <MessageSquare className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">156</div>
          <div className="text-sm text-gray-500">Posts</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
            <BookOpen className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-sm text-gray-500">Groups</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Academic Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-orange-50 rounded-lg p-4">
                <CircularProgress
                  percentage={85}
                  size={120}
                  strokeWidth={8}
                  color="#ea580c"
                  label="Overall GPA"
                  value="3.4"
                />
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <CircularProgress
                  percentage={92}
                  size={120}
                  strokeWidth={8}
                  color="#f59e0b"
                  label="Attendance"
                  value="92%"
                />
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <CircularProgress
                  percentage={78}
                  size={120}
                  strokeWidth={8}
                  color="#10b981"
                  label="Assignments"
                  value="78%"
                />
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <CircularProgress
                  percentage={95}
                  size={120}
                  strokeWidth={8}
                  color="#3b82f6"
                  label="Participation"
                  value="95%"
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Subject Progress</h3>
            <div className="space-y-4">
              {studyProgress.map((subject, index) => (
                <HorizontalBar
                  key={index}
                  label={subject.subject}
                  value={subject.completed}
                  maxValue={subject.total}
                  color={subject.color}
                  icon={<BookOpen className="h-4 w-4" style={{ color: subject.color }} />}
                />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Activity</h3>
            <div className="flex items-end justify-between h-48 space-x-2">
              {weeklyActivity.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                  <div className="flex flex-col items-center space-y-1 w-full">
                    <div
                      className="w-full bg-orange-500 rounded-t transition-all duration-1000 ease-out"
                      style={{ height: `${(day.posts / maxActivity) * 100}%` }}
                    />
                    <div
                      className="w-full bg-blue-500 rounded-b transition-all duration-1000 ease-out"
                      style={{ height: `${(day.study / maxActivity) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-sm text-gray-600">Posts</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Study Hours</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${achievement.color}`}>
                  {achievement.icon}
                  <div>
                    <p className="font-medium text-gray-900">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Joined Groups</h3>
              <span className="text-sm text-gray-500">{joinedGroups.length} groups</span>
            </div>
            <div className="space-y-3">
              {joinedGroups.map((group, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <img
                    src={group.avatar}
                    alt={group.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{group.name}</p>
                    <p className="text-sm text-gray-500">{group.members} members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Friends</h3>
              <span className="text-sm text-gray-500">{friends.length} friends</span>
            </div>
            <div className="space-y-3">
              {friends.map((friend, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{friend.name}</p>
                    <p className="text-sm text-gray-500">{friend.school}</p>
                  </div>
                  <button className="text-orange-600 hover:text-orange-700 transition-colors">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleBookmark = (postId: number) => {
    setBookmarkedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "communities", label: "Communities", icon: Users },
    { id: "schools", label: "Schools", icon: GraduationCap },
    { id: "scholarships", label: "Scholarships", icon: Award },
    { id: "class", label: "Class", icon: BookOpen },
  ];

  const samplePosts = [
    {
      id: 1,
      author: "Sarah Chen",
      authorAvatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      school: "MIT",
      major: "Computer Science",
      timeAgo: "2 hours ago",
      content:
        "Just finished my Machine Learning final project! Built an AI model that predicts student performance based on study habits. The results were fascinating - consistency beats intensity every time! 📊🤖",
      likes: 42,
      comments: 8,
      shares: 3,
      tags: ["#MachineLearning", "#AI", "#StudentLife"],
    },
    {
      id: 2,
      author: "Marcus Johnson",
      authorAvatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      school: "Stanford",
      major: "Biology",
      timeAgo: "4 hours ago",
      content:
        "Study group for Organic Chemistry forming! We meet every Tuesday and Thursday at the library. DM me if you want to join. Already have 6 committed members! 🧪📚",
      likes: 28,
      comments: 12,
      shares: 7,
      tags: ["#StudyGroup", "#OrganicChemistry", "#Stanford"],
    },
    {
      id: 3,
      author: "Elena Rodriguez",
      authorAvatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      school: "Harvard",
      major: "Psychology",
      timeAgo: "6 hours ago",
      content:
        "Amazing guest lecture today by Dr. Peterson on cognitive behavioral therapy! Key takeaway: our thoughts shape our reality more than we realize. Anyone else attended? Would love to discuss! 🧠✨",
      likes: 56,
      comments: 15,
      shares: 4,
      tags: ["#Psychology", "#CBT", "#GuestLecture"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Image
                src={logo}
                alt="Intelligensia Logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-contain"
              />
              <span className="ml-3 text-2xl font-bold text-gray-900">Intelligensia</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 ml-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      activeTab === item.id
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              {isMobile ? (
                <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                  <Search className="h-5 w-5" />
                </button>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              )}

              {/* Info Popup Button */}
              <button
                onClick={() => setIsInfoPopupOpen(true)}
                className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
              >
                <Users className="h-5 w-5" />
              </button>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>

              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-1">
                <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium ${
                        activeTab === item.id
                          ? "bg-orange-50 text-orange-600"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-5">
                  <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">JD</span>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">John Doe</div>
                    <div className="text-sm font-medium text-gray-500">MIT</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <button
                    onClick={() => setIsInfoPopupOpen(true)}
                    className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100"
                  >
                    <Users className="h-5 w-5 mr-3" />
                    Your Info
                  </button>
                  <button className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100">
                    <Bell className="h-5 w-5 mr-3" />
                    Notifications
                  </button>
                  <button className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100">
                    <MessageCircle className="h-5 w-5 mr-3" />
                    Messages
                  </button>
                  <button className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100">
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Info Popup */}
      <InfoPopup isOpen={isInfoPopupOpen} onClose={() => setIsInfoPopupOpen(false)} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {activeTab === "dashboard" ? (
            <Dashboard />
          ) : activeTab === "home" ? (
            <>
              {/* Post Creation */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">JD</span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Share your thoughts with fellow students..."
                      className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex space-x-4 text-gray-500">
                        <button className="hover:text-orange-600 transition-colors">
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                      <button className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors font-medium">
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Feed */}
              <div className="space-y-6">
                {samplePosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <img
                            src={post.authorAvatar}
                            alt={post.author}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{post.author}</h3>
                            <p className="text-sm text-gray-500">
                              {post.major} • {post.school}
                            </p>
                            <p className="text-sm text-gray-400">{post.timeAgo}</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="px-6 pb-4">
                      <p className="text-gray-900 leading-relaxed">{post.content}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-orange-600 text-sm hover:text-orange-700 cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="px-6 py-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-2 transition-colors ${
                              likedPosts.includes(post.id)
                                ? "text-red-500"
                                : "text-gray-500 hover:text-red-500"
                            }`}
                          >
                            <Heart
                              className={`h-5 w-5 ${likedPosts.includes(post.id) ? "fill-current" : ""}`}
                            />
                            <span className="text-sm">
                              {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                            </span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                            <Share2 className="h-5 w-5" />
                            <span className="text-sm">{post.shares}</span>
                          </button>
                        </div>
                        <button
                          onClick={() => handleBookmark(post.id)}
                          className={`transition-colors ${
                            bookmarkedPosts.includes(post.id)
                              ? "text-orange-600"
                              : "text-gray-400 hover:text-orange-600"
                          }`}
                        >
                          <Bookmark
                            className={`h-5 w-5 ${bookmarkedPosts.includes(post.id) ? "fill-current" : ""}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;