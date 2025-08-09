"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  Award, 
  BookOpen, 
  Target,
  Calendar,
  Clock,
  Trophy,
  Star,
  MessageSquare,
  UserPlus,
  GraduationCap,
  Briefcase,
  ChevronUp,
  ChevronDown
} from "lucide-react";

interface CircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color: string;
  label: string;
  value: string;
  animated?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size,
  strokeWidth,
  color,
  label,
  value,
  animated = true,
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(animatedPercentage / 100) * circumference} ${circumference}`;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedPercentage(percentage);
    }
  }, [percentage, animated]);

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
            className="transition-all duration-2000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{animatedPercentage.toFixed(0)}%</div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{label}</p>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {changeType === 'increase' ? (
              <ChevronUp className="h-4 w-4 text-green-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
          </div>
        </div>
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

interface ActivityBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

const ActivityBar: React.FC<ActivityBarProps> = ({ label, value, maxValue, color }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = (animatedValue / maxValue) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 200);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{animatedValue}/{maxValue}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-1500 ease-out"
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}40`
          }}
        />
      </div>
    </div>
  );
};

export default function ModernDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const academicProgress = [
    { subject: "Computer Science", completed: 14, total: 16, color: "#ea580c" },
    { subject: "Mathematics", completed: 12, total: 15, color: "#f59e0b" },
    { subject: "Physics", completed: 9, total: 12, color: "#10b981" },
    { subject: "Literature", completed: 8, total: 10, color: "#3b82f6" },
    { subject: "Chemistry", completed: 11, total: 14, color: "#8b5cf6" },
  ];

  const weeklyActivity = [
    { day: "Mon", hours: 6 },
    { day: "Tue", hours: 8 },
    { day: "Wed", hours: 5 },
    { day: "Thu", hours: 9 },
    { day: "Fri", hours: 7 },
    { day: "Sat", hours: 4 },
    { day: "Sun", hours: 6 },
  ];

  const maxHours = Math.max(...weeklyActivity.map(d => d.hours));

  const achievements = [
    {
      title: "Study Streak Champion",
      description: "14 days consecutive",
      icon: <Trophy className="h-6 w-6" />,
      color: "#f59e0b",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      title: "Top Contributor",
      description: "Most helpful posts this month",
      icon: <Star className="h-6 w-6" />,
      color: "#ea580c",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "Quiz Master",
      description: "98% average score",
      icon: <Target className="h-6 w-6" />,
      color: "#10b981",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Community Builder",
      description: "100+ connections made",
      icon: <Users className="h-6 w-6" />,
      color: "#3b82f6",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
  ];

  const upcomingEvents = [
    { title: "Career Fair - Tech Companies", date: "Dec 15", time: "10:00 AM", type: "career" },
    { title: "Study Group - Advanced Algorithms", date: "Dec 16", time: "2:00 PM", type: "study" },
    { title: "Scholarship Application Deadline", date: "Dec 18", time: "11:59 PM", type: "deadline" },
    { title: "Guest Lecture - AI in Healthcare", date: "Dec 20", time: "3:00 PM", type: "lecture" },
  ];

  if (!mounted) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
              <span className="text-2xl font-bold">JS</span>
            </div>
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
            <div className="text-3xl font-bold">Level 15</div>
            <div className="text-orange-100">Academic Explorer</div>
            <div className="mt-2 bg-white/20 rounded-full h-2 w-32">
              <div className="bg-white rounded-full h-2 w-24 transition-all duration-1000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Connections"
          value="1,247"
          change="+12.5%"
          changeType="increase"
          icon={<Users className="h-6 w-6" />}
          color="#ea580c"
        />
        <StatCard
          title="Study Hours This Week"
          value="45"
          change="+8.2%"
          changeType="increase"
          icon={<BookOpen className="h-6 w-6" />}
          color="#10b981"
        />
        <StatCard
          title="Scholarships Applied"
          value="12"
          change="+3"
          changeType="increase"
          icon={<Award className="h-6 w-6" />}
          color="#f59e0b"
        />
        <StatCard
          title="Internship Matches"
          value="8"
          change="+2"
          changeType="increase"
          icon={<Briefcase className="h-6 w-6" />}
          color="#3b82f6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Academic Progress */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <GraduationCap className="h-6 w-6 text-orange-600 mr-3" />
              Academic Progress
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6">
                <CircularProgress
                  percentage={88}
                  size={120}
                  strokeWidth={8}
                  color="#ea580c"
                  label="Overall GPA"
                  value="3.7"
                />
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6">
                <CircularProgress
                  percentage={94}
                  size={120}
                  strokeWidth={8}
                  color="#f59e0b"
                  label="Attendance"
                  value="94%"
                />
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
                <CircularProgress
                  percentage={82}
                  size={120}
                  strokeWidth={8}
                  color="#10b981"
                  label="Assignments"
                  value="82%"
                />
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                <CircularProgress
                  percentage={96}
                  size={120}
                  strokeWidth={8}
                  color="#3b82f6"
                  label="Participation"
                  value="96%"
                />
              </div>
            </div>
          </div>

          {/* Subject Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <BookOpen className="h-6 w-6 text-orange-600 mr-3" />
              Subject Progress
            </h3>
            <div className="space-y-6">
              {academicProgress.map((subject, index) => (
                <ActivityBar
                  key={index}
                  label={subject.subject}
                  value={subject.completed}
                  maxValue={subject.total}
                  color={subject.color}
                />
              ))}
            </div>
          </div>

          {/* Weekly Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <TrendingUp className="h-6 w-6 text-orange-600 mr-3" />
              Weekly Study Activity
            </h3>
            <div className="flex items-end justify-between h-64 space-x-4">
              {weeklyActivity.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center space-y-3">
                  <div
                    className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-1000 ease-out shadow-lg"
                    style={{ 
                      height: `${(day.hours / maxHours) * 100}%`,
                      minHeight: '20px',
                      filter: 'drop-shadow(0 4px 6px rgba(234, 88, 12, 0.3))'
                    }}
                  />
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{day.hours}h</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{day.day}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Trophy className="h-5 w-5 text-orange-600 mr-2" />
              Recent Achievements
            </h3>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl ${achievement.bgColor} border border-gray-100 dark:border-gray-600`}>
                  <div style={{ color: achievement.color }}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{achievement.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Calendar className="h-5 w-5 text-orange-600 mr-2" />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {event.date} • {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-sm p-6 text-white">
            <h3 className="text-lg font-bold mb-6">This Month</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-orange-100">Study Sessions</span>
                <span className="font-bold text-xl">28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-100">New Connections</span>
                <span className="font-bold text-xl">15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-100">Applications Sent</span>
                <span className="font-bold text-xl">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-100">Goals Completed</span>
                <span className="font-bold text-xl">12/15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}