"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SearchIcon, 
  UserPlusIcon, 
  UsersIcon, 
  MailIcon, 
  MessageSquareIcon,
  MoreHorizontalIcon,
  UserIcon,
  ShieldIcon,
  StarIcon
} from "lucide-react";
import { useState } from "react";

interface ClassroomMembersProps {
  classroomId: string;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  joinDate: string;
  lastActive: string;
  status: 'online' | 'offline' | 'away';
}

export default function ClassroomMembers({ classroomId }: ClassroomMembersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  
  // Sample members data
  const members: Member[] = [
    {
      id: "1",
      name: "Dr. Alan Turing",
      avatar: "https://placehold.co/200x200?text=AT",
      email: "alan.turing@example.com",
      role: "teacher",
      joinDate: "2025-08-15T10:00:00Z",
      lastActive: "2025-09-22T09:30:00Z",
      status: "online"
    },
    {
      id: "2",
      name: "Sarah Chen",
      avatar: "https://placehold.co/200x200?text=SC",
      email: "sarah.chen@example.com",
      role: "student",
      joinDate: "2025-08-20T14:30:00Z",
      lastActive: "2025-09-22T10:15:00Z",
      status: "online"
    },
    {
      id: "3",
      name: "Marcus Johnson",
      avatar: "https://placehold.co/200x200?text=MJ",
      email: "marcus.johnson@example.com",
      role: "student",
      joinDate: "2025-08-18T09:45:00Z",
      lastActive: "2025-09-21T16:20:00Z",
      status: "offline"
    },
    {
      id: "4",
      name: "Elena Rodriguez",
      avatar: "https://placehold.co/200x200?text=ER",
      email: "elena.rodriguez@example.com",
      role: "student",
      joinDate: "2025-08-22T11:30:00Z",
      lastActive: "2025-09-22T08:45:00Z",
      status: "online"
    },
    {
      id: "5",
      name: "David Kim",
      avatar: "https://placehold.co/200x200?text=DK",
      email: "david.kim@example.com",
      role: "student",
      joinDate: "2025-08-19T13:15:00Z",
      lastActive: "2025-09-20T14:30:00Z",
      status: "away"
    },
    {
      id: "6",
      name: "Jamie Lee",
      avatar: "https://placehold.co/200x200?text=JL",
      email: "jamie.lee@example.com",
      role: "admin",
      joinDate: "2025-08-15T10:30:00Z",
      lastActive: "2025-09-22T11:00:00Z",
      status: "online"
    },
    {
      id: "7",
      name: "Taylor Kim",
      avatar: "https://placehold.co/200x200?text=TK",
      email: "taylor.kim@example.com",
      role: "student",
      joinDate: "2025-08-25T09:00:00Z",
      lastActive: "2025-09-21T15:45:00Z",
      status: "offline"
    },
    {
      id: "8",
      name: "Jordan Smith",
      avatar: "https://placehold.co/200x200?text=JS",
      email: "jordan.smith@example.com",
      role: "student",
      joinDate: "2025-08-23T14:00:00Z",
      lastActive: "2025-09-22T09:15:00Z",
      status: "online"
    }
  ];
  
  // Filter members based on search query and role filter
  const filteredMembers = members.filter(member => {
    const matchesSearch = searchQuery 
      ? member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesRole = roleFilter 
      ? member.role === roleFilter
      : true;
      
    return matchesSearch && matchesRole;
  });
  
  // Group members by role
  const teachers = filteredMembers.filter(m => m.role === "teacher");
  const admins = filteredMembers.filter(m => m.role === "admin");
  const students = filteredMembers.filter(m => m.role === "student");
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format last active time
  const formatLastActive = (dateString: string) => {
    const lastActive = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - lastActive.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
    
    return formatDate(dateString);
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-400";
      case "away":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };
  
  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "teacher":
        return (
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldIcon className="h-3 w-3" />
            Teacher
          </span>
        );
      case "admin":
        return (
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <StarIcon className="h-3 w-3" />
            Admin
          </span>
        );
      case "student":
        return (
          <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            Student
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with search and invite button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
          <UserPlusIcon className="h-4 w-4 mr-2" />
          Invite Members
        </Button>
      </div>
      
      {/* Role filters */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={roleFilter === null ? "secondary" : "outline"} 
          size="sm"
          onClick={() => setRoleFilter(null)}
        >
          All Members ({members.length})
        </Button>
        
        <Button 
          variant={roleFilter === "teacher" ? "secondary" : "outline"} 
          size="sm"
          onClick={() => setRoleFilter(roleFilter === "teacher" ? null : "teacher")}
        >
          Teachers ({members.filter(m => m.role === "teacher").length})
        </Button>
        
        <Button 
          variant={roleFilter === "admin" ? "secondary" : "outline"} 
          size="sm"
          onClick={() => setRoleFilter(roleFilter === "admin" ? null : "admin")}
        >
          Admins ({members.filter(m => m.role === "admin").length})
        </Button>
        
        <Button 
          variant={roleFilter === "student" ? "secondary" : "outline"} 
          size="sm"
          onClick={() => setRoleFilter(roleFilter === "student" ? null : "student")}
        >
          Students ({members.filter(m => m.role === "student").length})
        </Button>
      </div>
      
      {/* Members list */}
      <div className="space-y-6">
        {/* Teachers */}
        {teachers.length > 0 && !roleFilter && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <ShieldIcon className="h-5 w-5 text-blue-500" />
              Teachers
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teachers.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}
        
        {/* Admins */}
        {admins.length > 0 && !roleFilter && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <StarIcon className="h-5 w-5 text-purple-500" />
              Admins
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {admins.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}
        
        {/* Students */}
        <div className="space-y-4">
          {!roleFilter && students.length > 0 && (
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-gray-500" />
              Students
            </h3>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMembers.length > 0 ? (
              roleFilter ? filteredMembers.map(member => (
                <MemberCard key={member.id} member={member} />
              )) : students.map(member => (
                <MemberCard key={member.id} member={member} />
              ))
            ) : (
              <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
                <UsersIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  No members match your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MemberCardProps {
  member: {
    id: string;
    name: string;
    avatar: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    joinDate: string;
    lastActive: string;
    status: 'online' | 'offline' | 'away';
  };
}

function MemberCard({ member }: MemberCardProps) {
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format last active time
  const formatLastActive = (dateString: string) => {
    const lastActive = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - lastActive.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
    
    return formatDate(dateString);
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-400";
      case "away":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };
  
  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "teacher":
        return (
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldIcon className="h-3 w-3" />
            Teacher
          </span>
        );
      case "admin":
        return (
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <StarIcon className="h-3 w-3" />
            Admin
          </span>
        );
      case "student":
        return (
          <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            Student
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <img 
              src={member.avatar} 
              alt={member.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(member.status)}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {member.name}
              </h3>
              {getRoleBadge(member.role)}
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {member.email}
            </p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Joined: {formatDate(member.joinDate)}</span>
              <span>Active: {formatLastActive(member.lastActive)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <MessageSquareIcon className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <MailIcon className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}