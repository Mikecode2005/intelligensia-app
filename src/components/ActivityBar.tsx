"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Bell,
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Heart,
  Bookmark,
  Share2,
  Eye,
  Zap,
  Award,
  Flame
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "notification" | "message" | "achievement" | "trending" | "reminder";
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  color: string;
  isNew?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ActivityBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "notification",
    title: "New message from Sarah",
    description: "Hey! I found your study notes really helpful. Can we discuss the upcoming exam?",
    time: "2 min ago",
    icon: <MessageSquare className="h-4 w-4" />,
    color: "text-blue-500",
    isNew: true,
    action: { label: "Reply", onClick: () => console.log("Reply to Sarah") }
  },
  {
    id: "2",
    type: "achievement",
    title: "Study Streak Unlocked!",
    description: "You've maintained a 7-day study streak. Keep it up!",
    time: "15 min ago",
    icon: <Award className="h-4 w-4" />,
    color: "text-yellow-500"
  },
  {
    id: "3",
    type: "trending",
    title: "Your post is trending",
    description: "Your React hooks tutorial is getting 2.3k views",
    time: "1 hour ago",
    icon: <TrendingUp className="h-4 w-4" />,
    color: "text-green-500"
  },
  {
    id: "4",
    type: "reminder",
    title: "Study session reminder",
    description: "Your CS study group starts in 30 minutes",
    time: "2 hours ago",
    icon: <Calendar className="h-4 w-4" />,
    color: "text-purple-500"
  },
  {
    id: "5",
    type: "message",
    title: "New classroom invitation",
    description: "You've been invited to join the Advanced ML classroom",
    time: "3 hours ago",
    icon: <Users className="h-4 w-4" />,
    color: "text-orange-500"
  }
];

const ActivityBar = ({ isOpen, onClose }: ActivityBarProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [activeTab, setActiveTab] = useState("all");
  const [isAnimating, setIsAnimating] = useState(false);

  const filteredActivities = activities.filter(activity => {
    if (activeTab === "all") return true;
    return activity.type === activeTab;
  });

  const tabs = [
    { id: "all", label: "All", icon: <Zap className="h-4 w-4" /> },
    { id: "notification", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "message", label: "Messages", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "achievement", label: "Achievements", icon: <Award className="h-4 w-4" /> }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "notification": return <Bell className="h-5 w-5" />;
      case "message": return <MessageSquare className="h-5 w-5" />;
      case "achievement": return <Award className="h-5 w-5" />;
      case "trending": return <TrendingUp className="h-5 w-5" />;
      case "reminder": return <Calendar className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "notification": return "from-blue-500 to-cyan-500";
      case "message": return "from-green-500 to-emerald-500";
      case "achievement": return "from-yellow-500 to-amber-500";
      case "trending": return "from-purple-500 to-violet-500";
      case "reminder": return "from-orange-500 to-red-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Activity Bar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-96 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Activity Center
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 text-xs",
                      activeTab === tab.id && "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                    )}
                  >
                    {tab.icon}
                    <span className="ml-1">{tab.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-3">
                {filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "p-4 glass-strong hover:shadow-md transition-all duration-300",
                      "border-l-4",
                      `border-l-${activity.color.split("-")[1]}-500`
                    )}>
                      <div className="flex items-start space-x-3">
                        <div className={cn(
                          "p-2 rounded-lg bg-gradient-to-r",
                          getActivityColor(activity.type)
                        )}>
                          {getActivityIcon(activity.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                {activity.title}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {activity.description}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {activity.time}
                              </p>
                            </div>
                            
                            {activity.isNew && (
                              <Badge className="bg-orange-500 text-white text-xs">
                                New
                              </Badge>
                            )}
                          </div>

                          {activity.action && (
                            <div className="mt-3">
                              <Button
                                size="sm"
                                onClick={activity.action.onClick}
                                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs"
                              >
                                {activity.action.label}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredActivities.length} activities
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-500 hover:text-orange-600"
                >
                  Mark all as read
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActivityBar;