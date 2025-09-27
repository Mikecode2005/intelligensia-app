"use client";

import { Button } from "@/components/ui/button";
import { 
  BookOpenIcon, 
  UsersIcon, 
  CalendarIcon, 
  BellIcon, 
  SettingsIcon,
  BellOffIcon
} from "lucide-react";
import { useState } from "react";

interface ClassroomHeaderProps {
  classroom: {
    id: string;
    name: string;
    description: string;
    joinCode: string;
    fieldId: string;
    fieldName: string;
    memberCount: number;
    teacherName: string;
    teacherAvatar: string;
    isMember: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function ClassroomHeader({ classroom }: ClassroomHeaderProps) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  
  const toggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };
  
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-6 w-6" />
              <span className="text-sm font-medium text-orange-100">{classroom.fieldName}</span>
            </div>
            <h1 className="text-3xl font-bold">{classroom.name}</h1>
            <p className="text-orange-100 max-w-2xl">{classroom.description}</p>
            
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                <span className="text-sm">{classroom.memberCount} members</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm">Created {new Date(classroom.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
              onClick={toggleNotifications}
            >
              {isNotificationsEnabled ? (
                <>
                  <BellOffIcon className="h-4 w-4 mr-2" />
                  Mute
                </>
              ) : (
                <>
                  <BellIcon className="h-4 w-4 mr-2" />
                  Unmute
                </>
              )}
            </Button>
            
            {classroom.role === "TEACHER" || classroom.role === "ADMIN" ? (
              <Button 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Manage
              </Button>
            ) : null}
            
            <Button className="bg-white text-orange-600 hover:bg-orange-50">
              Enter Classroom
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-sm border border-gray-200 dark:border-gray-700 border-t-0 p-4">
        <div className="flex items-center gap-3">
          <img 
            src={classroom.teacherAvatar} 
            alt={classroom.teacherName}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {classroom.teacherName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Teacher
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Join Code:
            </span>
            <span className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded text-sm font-mono">
              {classroom.joinCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}