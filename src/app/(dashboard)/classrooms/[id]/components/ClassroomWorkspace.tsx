"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FolderIcon, 
  UsersIcon, 
  FileTextIcon, 
  PlusIcon, 
  ClockIcon, 
  CheckCircleIcon,
  GitBranchIcon,
  CodeIcon,
  Share2Icon,
  MessageSquareIcon,
  CalendarIcon,
  LayoutGridIcon,
  ListIcon
} from "lucide-react";
import { useState } from "react";

interface ClassroomWorkspaceProps {
  classroomId: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  members: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  }[];
  lastUpdated: string;
  status: 'active' | 'completed' | 'archived';
  progress: number;
  dueDate?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  assignee?: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
}

export default function ClassroomWorkspace({ classroomId }: ClassroomWorkspaceProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Sample projects data
  const projects: Project[] = [
    {
      id: "1",
      name: "Sorting Algorithms Visualization",
      description: "Create an interactive visualization of different sorting algorithms.",
      members: [
        { id: "1", name: "Sarah Chen", avatar: "https://placehold.co/100x100?text=SC", role: "Leader" },
        { id: "2", name: "Marcus Johnson", avatar: "https://placehold.co/100x100?text=MJ", role: "Developer" },
        { id: "3", name: "Alex Wong", avatar: "https://placehold.co/100x100?text=AW", role: "Designer" }
      ],
      lastUpdated: "2025-09-22T14:30:00Z",
      status: "active",
      progress: 65,
      dueDate: "2025-10-15T23:59:59Z"
    },
    {
      id: "2",
      name: "Data Structures Implementation",
      description: "Implement various data structures in Python and analyze their performance.",
      members: [
        { id: "4", name: "Elena Rodriguez", avatar: "https://placehold.co/100x100?text=ER", role: "Leader" },
        { id: "5", name: "David Kim", avatar: "https://placehold.co/100x100?text=DK", role: "Developer" }
      ],
      lastUpdated: "2025-09-20T10:15:00Z",
      status: "active",
      progress: 40,
      dueDate: "2025-10-20T23:59:59Z"
    },
    {
      id: "3",
      name: "Algorithm Complexity Analysis",
      description: "Research and document the time and space complexity of common algorithms.",
      members: [
        { id: "6", name: "Jamie Lee", avatar: "https://placehold.co/100x100?text=JL", role: "Leader" },
        { id: "7", name: "Taylor Kim", avatar: "https://placehold.co/100x100?text=TK", role: "Researcher" },
        { id: "8", name: "Jordan Smith", avatar: "https://placehold.co/100x100?text=JS", role: "Writer" }
      ],
      lastUpdated: "2025-09-18T16:45:00Z",
      status: "completed",
      progress: 100
    }
  ];
  
  // Sample tasks data
  const tasks: Task[] = [
    {
      id: "1",
      title: "Implement Bubble Sort Visualization",
      description: "Create the visualization for bubble sort algorithm with step-by-step animation.",
      status: "completed",
      assignee: { id: "2", name: "Marcus Johnson", avatar: "https://placehold.co/100x100?text=MJ" },
      dueDate: "2025-09-20T23:59:59Z",
      priority: "high",
      projectId: "1"
    },
    {
      id: "2",
      title: "Implement Quick Sort Visualization",
      description: "Create the visualization for quick sort algorithm with step-by-step animation.",
      status: "in-progress",
      assignee: { id: "2", name: "Marcus Johnson", avatar: "https://placehold.co/100x100?text=MJ" },
      dueDate: "2025-09-25T23:59:59Z",
      priority: "medium",
      projectId: "1"
    },
    {
      id: "3",
      title: "Design UI for Algorithm Controls",
      description: "Design the user interface for controlling the visualization speed and steps.",
      status: "review",
      assignee: { id: "3", name: "Alex Wong", avatar: "https://placehold.co/100x100?text=AW" },
      dueDate: "2025-09-22T23:59:59Z",
      priority: "medium",
      projectId: "1"
    },
    {
      id: "4",
      title: "Implement Linked List",
      description: "Create a Python implementation of a linked list with all basic operations.",
      status: "completed",
      assignee: { id: "5", name: "David Kim", avatar: "https://placehold.co/100x100?text=DK" },
      dueDate: "2025-09-18T23:59:59Z",
      priority: "high",
      projectId: "2"
    },
    {
      id: "5",
      title: "Implement Binary Search Tree",
      description: "Create a Python implementation of a binary search tree with all basic operations.",
      status: "in-progress",
      assignee: { id: "5", name: "David Kim", avatar: "https://placehold.co/100x100?text=DK" },
      dueDate: "2025-09-28T23:59:59Z",
      priority: "high",
      projectId: "2"
    },
    {
      id: "6",
      title: "Write Performance Analysis Report",
      description: "Document the performance characteristics of each data structure implementation.",
      status: "todo",
      assignee: { id: "4", name: "Elena Rodriguez", avatar: "https://placehold.co/100x100?text=ER" },
      dueDate: "2025-10-05T23:59:59Z",
      priority: "medium",
      projectId: "2"
    }
  ];
  
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
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "todo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Workspace</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Collaborate on projects and assignments with your classmates
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-800' : ''}>
            <LayoutGridIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-800' : ''}>
            <ListIcon className="h-4 w-4" />
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>
      
      {/* Workspace tabs */}
      <Tabs defaultValue="projects">
        <TabsList className="mb-6">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
              
              {/* Add New Project Card */}
              <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-colors">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[250px]">
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                    <PlusIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Create New Project
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                    Start a new collaborative project with your classmates
                  </p>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    New Project
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map(project => (
                <ProjectListItem key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="tasks">
          <div className="space-y-6">
            {/* Task filters */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="bg-gray-100 dark:bg-gray-800">All Tasks</Button>
              <Button variant="outline">My Tasks</Button>
              <Button variant="outline">To Do</Button>
              <Button variant="outline">In Progress</Button>
              <Button variant="outline">Review</Button>
              <Button variant="outline">Completed</Button>
            </div>
            
            {/* Tasks list */}
            <div className="space-y-4">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-orange-500" />
                Project Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Calendar view is under development.
                </p>
                <Button variant="link" className="mt-2 text-orange-600 dark:text-orange-400">
                  View project deadlines
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    members: {
      id: string;
      name: string;
      avatar: string;
      role: string;
    }[];
    lastUpdated: string;
    status: 'active' | 'completed' | 'archived';
    progress: number;
    dueDate?: string;
  };
}

function ProjectCard({ project }: ProjectCardProps) {
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  return (
    <Card className="hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <FolderIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          
          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {project.name}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
              <span className="text-xs font-medium">{project.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
          
          {/* Team members */}
          <div className="flex items-center">
            <div className="flex -space-x-2 mr-2">
              {project.members.slice(0, 3).map((member, index) => (
                <div 
                  key={member.id}
                  className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium"
                  title={member.name}
                >
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>
              ))}
              
              {project.members.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                  +{project.members.length - 3}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {project.members.length} member{project.members.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Due date and last updated */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
            {project.dueDate && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                <span>Due: {formatDate(project.dueDate)}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              <span>Updated: {formatDate(project.lastUpdated)}</span>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" size="sm" className="gap-1">
            <Share2Icon className="h-4 w-4" />
            <span>Share</span>
          </Button>
          
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            Open Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectListItemProps {
  project: {
    id: string;
    name: string;
    description: string;
    members: {
      id: string;
      name: string;
      avatar: string;
      role: string;
    }[];
    lastUpdated: string;
    status: 'active' | 'completed' | 'archived';
    progress: number;
    dueDate?: string;
  };
}

function ProjectListItem({ project }: ProjectListItemProps) {
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  return (
    <Card className="hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <FolderIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {project.name}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
              {project.description}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((member) => (
                  <div 
                    key={member.id}
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium"
                    title={member.name}
                  >
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                ))}
                
                {project.members.length > 3 && (
                  <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-1">
              <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="text-xs font-medium">{project.progress}%</span>
            </div>
            
            {project.dueDate && (
              <div className="hidden md:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <CalendarIcon className="h-3 w-3" />
                <span>{formatDate(project.dueDate)}</span>
              </div>
            )}
            
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              Open
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'review' | 'completed';
    assignee?: {
      id: string;
      name: string;
      avatar: string;
    };
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
    projectId: string;
  };
}

function TaskCard({ task }: TaskCardProps) {
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "todo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <ClockIcon className="h-4 w-4 text-blue-500" />;
      case "review":
        return <GitBranchIcon className="h-4 w-4 text-purple-500" />;
      case "todo":
        return <FileTextIcon className="h-4 w-4 text-gray-500" />;
      default:
        return <FileTextIcon className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  return (
    <Card className="hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            {getStatusIcon(task.status)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                {task.title}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}>
                {task.status === "in-progress" ? "In Progress" : 
                 task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {task.description}
            </p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
              {task.assignee && (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                    {task.assignee.avatar ? (
                      <img src={task.assignee.avatar} alt={task.assignee.name} className="w-full h-full object-cover" />
                    ) : (
                      task.assignee.name.charAt(0)
                    )}
                  </div>
                  <span>{task.assignee.name}</span>
                </div>
              )}
              
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  <span>Due: {formatDate(task.dueDate)}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <MessageSquareIcon className="h-3 w-3" />
                <span>0 comments</span>
              </div>
            </div>
          </div>
          
          <div>
            <Button variant="outline" size="sm">
              {task.status === "completed" ? "View" : "Update"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}