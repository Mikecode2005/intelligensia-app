"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpenIcon, ClockIcon, GraduationCapIcon, TrophyIcon, BrainIcon, TargetIcon, Flame } from "lucide-react";
import CircularProgress from "@/components/CircularProgress";
import StreakDisplay from "@/components/StreakDisplay";
import { useEffect, useState } from "react";

interface PerformanceMetricsProps {
  performance: {
    studyHours: number;
    completedAssignments: number;
    totalAssignments: number;
    averageGrade: number | null;
    loginStreak: number;
  } | null;
}

export default function PerformanceMetrics({ performance }: PerformanceMetricsProps) {
  // Default values if performance data is not available
  const data = performance || {
    studyHours: 0,
    completedAssignments: 0,
    totalAssignments: 0,
    averageGrade: null,
    loginStreak: 0,
  };
  
  // Calculate completion percentage
  const completionPercentage = data.totalAssignments > 0
    ? Math.round((data.completedAssignments / data.totalAssignments) * 100)
    : 0;
  
  // Animation states
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="border-orange-100 dark:border-orange-900/30 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <TrophyIcon className="h-5 w-5 text-orange-500" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Circular Progress for Study Hours */}
          <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 flex flex-col items-center justify-center">
            <CircularProgress
              percentage={Math.min(data.studyHours * 5, 100)}
              value={`${data.studyHours}h`}
              label="Study Hours"
              color="#ea580c"
              bgColor="#ffedd5"
              animate={animate}
            />
          </div>
          
          {/* Circular Progress for Assignment Completion */}
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 flex flex-col items-center justify-center">
            <CircularProgress
              percentage={completionPercentage}
              value={`${data.completedAssignments}/${data.totalAssignments}`}
              label="Assignments"
              color="#f59e0b"
              bgColor="#fef3c7"
              animate={animate}
            />
          </div>
          
          {/* Circular Progress for Average Grade */}
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 flex flex-col items-center justify-center">
            <CircularProgress
              percentage={data.averageGrade || 0}
              value={data.averageGrade ? `${data.averageGrade}%` : 'N/A'}
              label="Average Grade"
              color="#10b981"
              bgColor="#d1fae5"
              animate={animate}
            />
          </div>
          
          {/* Circular Progress for Participation */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 flex flex-col items-center justify-center">
            <CircularProgress
              percentage={95}
              value="95%"
              label="Participation"
              color="#3b82f6"
              bgColor="#dbeafe"
              animate={animate}
            />
          </div>
        </div>
        
        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Login Streak */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Login Streak
            </h3>
            <StreakDisplay 
              streak={data.loginStreak} 
              maxStreak={Math.max(data.loginStreak, 10)} 
              animate={animate}
            />
          </div>
          
          {/* Focus Score */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <TargetIcon className="h-4 w-4 text-purple-500" />
              Focus Score
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Weekly Average</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">78/100</span>
              </div>
              <Progress value={78} className="h-2 bg-purple-100 dark:bg-purple-950">
                <div className="h-full bg-purple-500 rounded-full" />
              </Progress>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}