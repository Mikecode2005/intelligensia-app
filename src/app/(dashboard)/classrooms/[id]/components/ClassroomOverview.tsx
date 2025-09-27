"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpenIcon, 
  CalendarIcon, 
  ClockIcon, 
  FileTextIcon, 
  MessageSquareIcon, 
  UsersIcon 
} from "lucide-react";
import { useEffect, useState } from "react";

interface ClassroomOverviewProps {
  classroomId: string;
}

export default function ClassroomOverview({ classroomId }: ClassroomOverviewProps) {
  // In a real app, you would fetch this data from an API
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Sample data
  const stats = {
    activeStudents: 38,
    totalStudents: 45,
    completedAssignments: 12,
    totalAssignments: 15,
    discussionThreads: 24,
    resources: 18,
    upcomingDeadlines: [
      {
        id: "1",
        title: "Algorithm Analysis Assignment",
        dueDate: "2025-10-05T23:59:59Z"
      },
      {
        id: "2",
        title: "Data Structures Quiz",
        dueDate: "2025-10-10T23:59:59Z"
      },
      {
        id: "3",
        title: "Programming Project: Sorting Algorithms",
        dueDate: "2025-10-15T23:59:59Z"
      }
    ],
    recentActivities: [
      {
        id: "1",
        type: "assignment",
        title: "New assignment: Algorithm Analysis",
        timestamp: "2025-09-22T14:30:00Z"
      },
      {
        id: "2",
        type: "discussion",
        title: "New discussion: Recursion vs Iteration",
        timestamp: "2025-09-21T10:15:00Z"
      },
      {
        id: "3",
        type: "resource",
        title: "New resource: Big O Notation Cheat Sheet",
        timestamp: "2025-09-20T09:45:00Z"
      }
    ]
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Calculate days remaining
  const getDaysRemaining = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
  };
  
  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <FileTextIcon className="h-4 w-4 text-blue-500" />;
      case "discussion":
        return <MessageSquareIcon className="h-4 w-4 text-green-500" />;
      case "resource":
        return <BookOpenIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-40"></div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-40"></div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-40"></div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Class Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-orange-500" />
            Class Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Active Students</span>
              <span className="font-medium">{stats.activeStudents}/{stats.totalStudents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Assignments Completed</span>
              <span className="font-medium">{stats.completedAssignments}/{stats.totalAssignments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Discussion Threads</span>
              <span className="font-medium">{stats.discussionThreads}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Resources</span>
              <span className="font-medium">{stats.resources}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-orange-500" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="border-l-2 border-orange-500 pl-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{deadline.title}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Due: {formatDate(deadline.dueDate)}
                  </span>
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                    {getDaysRemaining(deadline.dueDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-orange-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{activity.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}