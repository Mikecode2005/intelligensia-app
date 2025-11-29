"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Calendar,
  Target,
  Star,
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  Plus,
  Bell,
  Settings,
  Search,
  Home,
  LayoutDashboard,
  GraduationCap,
  MessageCircle,
  UserPlus,
  Activity,
  Zap,
  Brain,
  Trophy,
  Flame,
  Eye,
  Download,
  Upload,
  Play,
  Pause,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {value}
            </motion.div>
            <div className="text-xs text-gray-500">{percentage}%</div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
    </motion.div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
  trend?: "up" | "down" | "neutral";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  trend = "neutral",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 glass-strong hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <motion.p
              className="text-2xl font-bold text-gray-900 dark:text-white mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {value}
            </motion.p>
            {change && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${
                trend === "up" ? "text-green-600" : 
                trend === "down" ? "text-red-600" : 
                "text-gray-600"
              }`}>
                {trend === "up" && <TrendingUp className="h-3 w-3" />}
                {trend === "down" && <TrendingUp className="h-3 w-3 rotate-180" />}
                {change}
              </p>
            )}
          </div>
          <motion.div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ color }}>{icon}</div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLive, setIsLive] = useState(true);

  const metrics = [
    { title: "Total Posts", value: "1,247", change: "+12%", icon: <MessageSquare className="h-6 w-6" />, color: "#ea580c", trend: "up" as const },
    { title: "Study Hours", value: "156", change: "+8%", icon: <Clock className="h-6 w-6" />, color: "#f59e0b", trend: "up" as const },
    { title: "Connections", value: "892", change: "+24", icon: <Users className="h-6 w-6" />, color: "#10b981", trend: "up" as const },
    { title: "Achievements", value: "15", change: "+3", icon: <Trophy className="h-6 w-6" />, color: "#8b5cf6", trend: "up" as const },
  ];

  const studyProgress = [
    { subject: "Machine Learning", completed: 85, total: 100, color: "#ea580c", icon: <Brain className="h-4 w-4" /> },
    { subject: "Data Structures", completed: 92, total: 100, color: "#f59e0b", icon: <Zap className="h-4 w-4" /> },
    { subject: "Web Development", completed: 78, total: 100, color: "#10b981", icon: <Activity className="h-4 w-4" /> },
    { subject: "Mobile Apps", completed: 65, total: 100, color: "#3b82f6", icon: <Target className="h-4 w-4" /> },
  ];

  const recentActivity = [
    { type: "post", content: "Shared study notes on React hooks", time: "2 min ago", icon: <MessageSquare className="h-4 w-4" />, color: "#ea580c" },
    { type: "achievement", content: "Earned 'Study Streak' badge", time: "15 min ago", icon: <Trophy className="h-4 w-4" />, color: "#8b5cf6" },
    { type: "connection", content: "Connected with 3 new students", time: "1 hour ago", icon: <UserPlus className="h-4 w-4" />, color: "#10b981" },
    { type: "study", content: "Completed 2 hours of focused study", time: "2 hours ago", icon: <Clock className="h-4 w-4" />, color: "#f59e0b" },
  ];

  const upcomingEvents = [
    { title: "CS Study Group", date: "Today", time: "3:00 PM", type: "study", attendees: 12 },
    { title: "Career Fair Prep", date: "Tomorrow", time: "2:00 PM", type: "career", attendees: 45 },
    { title: "React Workshop", date: "Friday", time: "10:00 AM", type: "workshop", attendees: 28 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLive) {
        // Simulate real-time data updates
        const newMetrics = metrics.map(metric => ({
          ...metric,
          value: metric.title === "Study Hours" 
            ? (parseInt(metric.value) + 1).toString()
            : metric.value
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <motion.div
        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track your learning journey</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant={isLive ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLive(!isLive)}
                className={cn(
                  isLive && "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                )}
              >
                {isLive ? (
                  <>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                    Live
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Study Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 glass-strong">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Study Progress
                  </h3>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    <Flame className="h-3 w-3 mr-1" />
                    7 Day Streak
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {studyProgress.map((subject, index) => (
                    <motion.div
                      key={subject.subject}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <CircularProgress
                        percentage={subject.completed}
                        size={100}
                        strokeWidth={6}
                        color={subject.color}
                        label={subject.subject}
                        value={`${subject.completed}%`}
                      />
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 glass-strong">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Activity
                  </h3>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${activity.color}20` }}
                      >
                        <div style={{ color: activity.color }}>{activity.icon}</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">{activity.content}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-6 glass-strong">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Upcoming Events
                </h3>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.title}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{event.date}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{event.time}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {event.attendees} attending
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="p-6 glass-strong">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Study Session
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Progress
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;