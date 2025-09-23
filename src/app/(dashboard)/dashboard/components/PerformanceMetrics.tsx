"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpenIcon, ClockIcon, GraduationCapIcon, TrophyIcon } from "lucide-react";

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
  
  return (
    <Card className="border-orange-100 dark:border-orange-900/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <TrophyIcon className="h-5 w-5 text-orange-500" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Study Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Study Hours
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {data.studyHours} hrs
              </span>
            </div>
            <Progress value={Math.min(data.studyHours * 5, 100)} className="h-2 bg-orange-100 dark:bg-orange-950">
              <div className="h-full bg-orange-500 rounded-full" />
            </Progress>
          </div>
          
          {/* Assignment Completion */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assignments
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {data.completedAssignments}/{data.totalAssignments}
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2 bg-orange-100 dark:bg-orange-950">
              <div className="h-full bg-orange-500 rounded-full" />
            </Progress>
          </div>
          
          {/* Average Grade */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <GraduationCapIcon className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Average Grade
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {data.averageGrade ? `${data.averageGrade}%` : 'N/A'}
              </span>
            </div>
            <Progress 
              value={data.averageGrade || 0} 
              className="h-2 bg-orange-100 dark:bg-orange-950"
            >
              <div className="h-full bg-orange-500 rounded-full" />
            </Progress>
          </div>
          
          {/* Login Streak */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrophyIcon className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Login Streak
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {data.loginStreak} days
              </span>
            </div>
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < data.loginStreak % 7 ? 'bg-orange-500' : 'bg-orange-100 dark:bg-orange-950'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}