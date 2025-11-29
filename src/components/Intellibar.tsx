"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Award, 
  X, 
  Maximize2, 
  Heart,
  Repeat2,
  Zap,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStats, UserStats } from "@/hooks/useUserStats";

interface IntellibarProps {
  initialStats?: Partial<UserStats>;
}

export default function Intellibar({ initialStats }: IntellibarProps) {
  const { data: realStats, isLoading, error } = useUserStats();
  const [isExpanded, setIsExpanded] = useState(false);
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('large');
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Use real data or fallback to initial stats
  const statsData = realStats || {
    followers: initialStats?.followers || 0,
    following: initialStats?.following || 0,
    posts: initialStats?.posts || 0,
    classes: initialStats?.classes || 0,
    achievements: initialStats?.achievements || 0,
    streak: initialStats?.streak || 0,
    totalLikes: initialStats?.totalLikes || 0,
    totalComments: initialStats?.totalComments || 0,
    totalRemixes: initialStats?.totalRemixes || 0,
    engagementRate: initialStats?.engagementRate || 0,
    weeklyActivity: initialStats?.weeklyActivity || 0,
  };

  const stats = [
    { 
      label: "Followers", 
      value: statsData.followers, 
      icon: Users, 
      color: "text-blue-500",
      description: "People following you"
    },
    { 
      label: "Following", 
      value: statsData.following, 
      icon: Users, 
      color: "text-green-500",
      description: "People you follow"
    },
    { 
      label: "Posts", 
      value: statsData.posts, 
      icon: MessageSquare, 
      color: "text-purple-500",
      description: "Total posts created"
    },
    { 
      label: "Classes", 
      value: statsData.classes, 
      icon: BookOpen, 
      color: "text-orange-500",
      description: "Active classes"
    },
    { 
      label: "Achievements", 
      value: statsData.achievements, 
      icon: Award, 
      color: "text-yellow-500",
      description: "Badges earned"
    },
    { 
      label: "Streak", 
      value: statsData.streak, 
      icon: Zap, 
      color: "text-red-500",
      description: "Consecutive active days"
    },
    { 
      label: "Total Likes", 
      value: statsData.totalLikes, 
      icon: Heart, 
      color: "text-pink-500",
      description: "Likes received"
    },
    { 
      label: "Total Comments", 
      value: statsData.totalComments, 
      icon: MessageSquare, 
      color: "text-indigo-500",
      description: "Comments received"
    },
    { 
      label: "Total Remixes", 
      value: statsData.totalRemixes, 
      icon: Repeat2, 
      color: "text-teal-500",
      description: "Posts remixed"
    },
    { 
      label: "Engagement Rate", 
      value: statsData.engagementRate, 
      icon: Activity, 
      color: "text-cyan-500",
      description: "Avg interactions per post",
      suffix: "per post"
    },
    { 
      label: "Weekly Activity", 
      value: statsData.weeklyActivity, 
      icon: TrendingUp, 
      color: "text-lime-500",
      description: "Posts this week"
    },
  ];

  const currentStat = stats[currentStatIndex];

  // Rotate through stats in collapsed view
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [stats.length]);

  // Update constraints on size change and resize
  useEffect(() => {
    const updateConstraints = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setConstraints({
          left: 0,
          right: window.innerWidth - rect.width,
          top: 0,
          bottom: window.innerHeight - rect.height,
        });
      }
    };

    const timeout = setTimeout(updateConstraints, 100);
    window.addEventListener('resize', updateConstraints);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateConstraints);
    };
  }, [size]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const formatEngagement = (value: number) => {
    return value.toFixed(1);
  };

  const statY = useTransform(y, (v) => v * 0.1);
  const statRotate = useTransform(x, (v) => v * 0.01);
  const progressY = useTransform(y, (v) => v * 0.05);
  const progressOpacity = useTransform(y, (v) => {
    const absV = Math.abs(v);
    return Math.max(0.8, 1 - absV / 200);
  });

  const sizeClasses = {
    small: "sm:max-w-xs min-h-[280px]",
    medium: "sm:max-w-sm min-h-[400px]",
    large: "sm:max-w-md min-h-[500px]",
  };

  const getPadding = () => {
    if (size === 'small') return 'p-2 sm:p-3';
    if (size === 'medium') return 'p-3 sm:p-4';
    return 'p-4 sm:p-5';
  };

  const getHeaderPadding = () => {
    if (size === 'small') return 'py-2 px-2';
    if (size === 'medium') return 'py-3 px-3';
    return 'py-4 px-4';
  };

  const getContentPadding = () => {
    if (size === 'small') return 'px-1 py-2';
    if (size === 'medium') return 'px-2 py-3';
    return 'px-3 py-4';
  };

  const getGap = () => {
    if (size === 'small') return 'gap-1';
    if (size === 'medium') return 'gap-2';
    return 'gap-3 sm:gap-4';
  };

  const getMaxHContent = () => {
    if (size === 'small') return 'max-h-[calc(100%-60px)]';
    if (size === 'medium') return 'max-h-[calc(100%-80px)]';
    return 'max-h-[calc(100%-100px)]';
  };

  const getGridCols = () => {
    if (size === 'small') return 'grid-cols-2';
    if (size === 'medium') return 'grid-cols-2 sm:grid-cols-3';
    return 'grid-cols-2 sm:grid-cols-3';
  };

  if (isLoading && !realStats) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 animate-pulse min-w-[140px] justify-center">
        <TrendingUp className="h-4 w-4" />
        <span className="text-sm">Loading stats...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-sm">
        <TrendingUp className="h-4 w-4" />
        <span>Stats unavailable</span>
      </div>
    );
  }

  return (
    <>
      {/* Collapsed State */}
      <motion.button
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-full",
          "bg-gradient-to-r from-orange-400 to-orange-500",
          "text-white font-medium text-sm",
          "shadow-lg hover:shadow-xl transition-all duration-300",
          "hover:from-orange-500 hover:to-orange-600",
          "focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2",
          "min-w-[140px] justify-center",
          "sm:min-w-[160px]"
        )}
        onClick={() => setIsExpanded(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          key={currentStatIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <currentStat.icon className="h-4 w-4" />
          <span className="font-bold whitespace-nowrap">
            {currentStat.label}: {currentStat.label === "Engagement Rate" ? formatEngagement(currentStat.value) : formatNumber(currentStat.value)}
            {currentStat.suffix && ` ${currentStat.suffix}`}
          </span>
        </motion.div>
      </motion.button>

      {/* Expanded Modal */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
            />

            {/* Draggable and Resizable Modal Card */}
            <motion.div
              ref={ref}
              style={{ x, y }}
              drag
              dragConstraints={constraints}
              dragElastic={0.2}
              whileDrag={{ scale: 1.02 }}
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
                "w-[95vw] sm:w-full max-h-[95vh]",
                sizeClasses[size as keyof typeof sizeClasses],
                getPadding()
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 400
              }}
            >
              <div 
                className={cn(
                  "bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden relative w-full h-full"
                )}
              >
                {/* Header */}
                <div className={cn("flex items-center justify-between border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10", getHeaderPadding())}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={cn("p-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex-shrink-0", size === 'large' ? 'p-2' : 'p-1')}>
                      <TrendingUp className={cn("text-orange-600 dark:text-orange-400", size === 'large' ? 'h-6 w-6' : size === 'medium' ? 'h-5 w-5' : 'h-4 w-4')} />
                    </div>
                    <div className="min-w-0">
                      <h3 className={cn("font-bold text-gray-900 dark:text-white truncate", size === 'large' ? 'text-xl' : size === 'medium' ? 'text-lg' : 'text-base')}>
                        Your Stats
                      </h3>
                      <p className={cn("text-gray-500 dark:text-gray-400 truncate", size === 'large' ? 'text-sm' : size === 'medium' ? 'text-xs' : 'text-xs')}>
                        Real-time performance metrics
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSize(prev => {
                          if (prev === 'large') return 'medium';
                          if (prev === 'medium') return 'small';
                          return 'large';
                        });
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Resize"
                    >
                      <Maximize2 className={cn("text-gray-500 dark:text-gray-400", size === 'large' ? 'h-5 w-5' : size === 'medium' ? 'h-4 w-4' : 'h-3 w-3')} />
                    </button>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Close"
                    >
                      <X className={cn("text-gray-500 dark:text-gray-400", size === 'large' ? 'h-5 w-5' : size === 'medium' ? 'h-4 w-4' : 'h-3 w-3')} />
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className={cn("overflow-y-auto", getMaxHContent())}>
                  <div className={cn("grid", getGridCols(), getGap(), getContentPadding())}>
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center p-2 sm:p-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: statY,
                          rotate: statRotate
                        }}
                        transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                        title={stat.description}
                      >
                        <div className={cn("rounded-lg bg-white dark:bg-gray-700 mb-2 p-1 sm:p-2", stat.color.replace('text-', 'bg-').replace('-500', '-100 dark:bg-opacity-20'))}>
                          <stat.icon 
                            className={cn(stat.color, size === 'large' ? 'h-5 w-5 sm:h-6 sm:w-6' : size === 'medium' ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-4 w-4')} 
                          />
                        </div>
                        <div className={cn("font-bold text-gray-900 dark:text-white mb-1", size === 'large' ? 'text-lg sm:text-xl' : size === 'medium' ? 'text-base sm:text-lg' : 'text-sm')}>
                          {stat.label === "Engagement Rate" ? formatEngagement(stat.value) : formatNumber(stat.value)}
                          {stat.suffix && <span className="text-xs opacity-70"> {stat.suffix}</span>}
                        </div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide line-clamp-1">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Section */}
                  <motion.div 
                    className={cn("border-t border-gray-200 dark:border-gray-700", getContentPadding(), "pb-2 sm:pb-4")}
                    animate={{ 
                      y: progressY,
                      opacity: progressOpacity
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn("font-medium text-gray-900 dark:text-white", size === 'large' ? 'text-sm' : 'text-xs')}>
                        Weekly Progress
                      </span>
                      <span className={cn("text-gray-500 dark:text-gray-400", size === 'large' ? 'text-sm' : 'text-xs')}>
                        {statsData.weeklyActivity}/10 posts
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full" style={{ height: size === 'large' ? '0.5rem' : size === 'medium' ? '0.375rem' : '0.25rem' }}>
                      <motion.div
                        className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                        style={{ height: size === 'large' ? '0.5rem' : size === 'medium' ? '0.375rem' : '0.25rem' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((statsData.weeklyActivity / 10) * 100, 100)}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </div>
                    <p className={cn("text-center text-gray-500 dark:text-gray-400 mt-2", size === 'large' ? 'text-sm' : 'text-xs')}>
                      {statsData.weeklyActivity >= 7 ? "🔥 Amazing week! Keep it up!" :
                       statsData.weeklyActivity >= 4 ? "📈 Good progress this week!" :
                       "💪 Start posting to build your streak!"}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}