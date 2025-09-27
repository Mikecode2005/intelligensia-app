"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  FileTextIcon,
  AlertCircleIcon,
  FilterIcon,
  SortAscIcon
} from "lucide-react";
import { useState } from "react";

interface ClassroomAssignmentsProps {
  classroomId: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'not-started' | 'overdue';
  grade?: number;
  maxGrade: number;
  attachments: number;
  submissionType: 'file' | 'text' | 'both';
}

export default function ClassroomAssignments({ classroomId }: ClassroomAssignmentsProps) {
  const [filter, setFilter] = useState<string | null>(null);
  
  // Sample assignments data
  const assignments: Assignment[] = [
    {
      id: "1",
      title: "Algorithm Analysis Assignment",
      description: "Analyze the time and space complexity of the provided algorithms.",
      dueDate: "2025-10-05T23:59:59Z",
      status: "in-progress",
      maxGrade: 100,
      attachments: 2,
      submissionType: "file"
    },
    {
      id: "2",
      title: "Data Structures Quiz",
      description: "Complete the online quiz covering linked lists, trees, and graphs.",
      dueDate: "2025-10-10T23:59:59Z",
      status: "not-started",
      maxGrade: 50,
      attachments: 0,
      submissionType: "text"
    },
    {
      id: "3",
      title: "Programming Project: Sorting Algorithms",
      description: "Implement three different sorting algorithms and compare their performance.",
      dueDate: "2025-10-15T23:59:59Z",
      status: "not-started",
      maxGrade: 100,
      attachments: 1,
      submissionType: "both"
    },
    {
      id: "4",
      title: "Recursion Practice Problems",
      description: "Solve the set of recursion problems and submit your solutions.",
      dueDate: "2025-09-20T23:59:59Z",
      status: "completed",
      grade: 92,
      maxGrade: 100,
      attachments: 1,
      submissionType: "file"
    },
    {
      id: "5",
      title: "Big O Notation Worksheet",
      description: "Complete the worksheet on Big O notation and algorithm efficiency.",
      dueDate: "2025-09-15T23:59:59Z",
      status: "completed",
      grade: 85,
      maxGrade: 100,
      attachments: 1,
      submissionType: "file"
    },
    {
      id: "6",
      title: "Binary Search Trees Implementation",
      description: "Implement a binary search tree with insert, delete, and search operations.",
      dueDate: "2025-09-10T23:59:59Z",
      status: "overdue",
      maxGrade: 100,
      attachments: 1,
      submissionType: "file"
    }
  ];
  
  // Filter assignments based on status
  const filteredAssignments = filter 
    ? assignments.filter(assignment => assignment.status === filter)
    : assignments;
  
  // Group assignments by status
  const upcomingAssignments = filteredAssignments.filter(a => 
    a.status === "not-started" || a.status === "in-progress"
  ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  const completedAssignments = filteredAssignments.filter(a => a.status === "completed")
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  
  const overdueAssignments = filteredAssignments.filter(a => a.status === "overdue")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  // Calculate completion stats
  const totalAssignments = assignments.length;
  const completedCount = assignments.filter(a => a.status === "completed").length;
  const overdueCount = assignments.filter(a => a.status === "overdue").length;
  const completionPercentage = Math.round((completedCount / totalAssignments) * 100);
  
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
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "in-progress":
        return "text-blue-500";
      case "not-started":
        return "text-gray-500";
      case "overdue":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case "not-started":
        return <FileTextIcon className="h-5 w-5 text-gray-500" />;
      case "overdue":
        return <AlertCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <FileTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Progress summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Assignment Progress</h3>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {completedCount}/{totalAssignments}
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2">
                <div className="h-full bg-orange-500 rounded-full" />
              </Progress>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{completionPercentage}% Complete</span>
                <span>{totalAssignments - completedCount - overdueCount} Remaining</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{completedCount}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{overdueCount}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Overdue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {upcomingAssignments.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Upcoming</div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FilterIcon className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <SortAscIcon className="h-4 w-4" />
                <span>Sort</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Assignments tabs */}
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="space-y-4">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            ) : (
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                No upcoming assignments.
              </p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="space-y-4">
            {completedAssignments.length > 0 ? (
              completedAssignments.map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            ) : (
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                No completed assignments.
              </p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="overdue">
          <div className="space-y-4">
            {overdueAssignments.length > 0 ? (
              overdueAssignments.map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            ) : (
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                No overdue assignments.
              </p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          <div className="space-y-4">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            ) : (
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                No assignments found.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface AssignmentCardProps {
  assignment: Assignment;
}

function AssignmentCard({ assignment }: AssignmentCardProps) {
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
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "in-progress":
        return "text-blue-500";
      case "not-started":
        return "text-gray-500";
      case "overdue":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case "not-started":
        return <FileTextIcon className="h-5 w-5 text-gray-500" />;
      case "overdue":
        return <AlertCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <FileTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "not-started":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  return (
    <Card className={`hover:border-orange-200 dark:hover:border-orange-800 transition-colors ${
      assignment.status === "overdue" ? "border-red-200 dark:border-red-800" : ""
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {getStatusIcon(assignment.status)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {assignment.title}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadgeClass(assignment.status)}`}>
                {assignment.status === "in-progress" ? "In Progress" : 
                 assignment.status === "not-started" ? "Not Started" : 
                 assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {assignment.description}
            </p>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <CalendarIcon className="h-4 w-4" />
                <span>Due: {formatDate(assignment.dueDate)}</span>
              </div>
              
              {assignment.status !== "completed" && assignment.status !== "overdue" && (
                <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                  <ClockIcon className="h-4 w-4" />
                  <span>{getDaysRemaining(assignment.dueDate)}</span>
                </div>
              )}
              
              {assignment.status === "completed" && assignment.grade !== undefined && (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Grade: {assignment.grade}/{assignment.maxGrade}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            {assignment.status === "completed" ? (
              <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                View Submission
              </Button>
            ) : assignment.status === "overdue" ? (
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Submit Late
              </Button>
            ) : (
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                {assignment.status === "in-progress" ? "Continue" : "Start"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}