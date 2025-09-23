"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BookOpenIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ClassroomCardProps {
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
    role: "STUDENT" | "TEACHER" | "ADMIN" | null;
  };
}

export default function ClassroomCard({ classroom }: ClassroomCardProps) {
  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-colors">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-white text-orange-600 rounded-full mb-2">
              {classroom.fieldName}
            </span>
            <h3 className="text-lg font-bold text-white line-clamp-2">
              {classroom.name}
            </h3>
          </div>
          {classroom.isMember && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-white">
              {classroom.role === "TEACHER" ? "Teacher" : 
               classroom.role === "ADMIN" ? "Admin" : "Student"}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
          {classroom.description}
        </p>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            <Image
              src={classroom.teacherAvatar}
              alt={classroom.teacherName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {classroom.teacherName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Teacher
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <UsersIcon className="h-4 w-4 text-orange-500" />
            <span>{classroom.memberCount} members</span>
          </div>
          
          {classroom.isMember && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <BookOpenIcon className="h-4 w-4 text-orange-500" />
              <span>Code: {classroom.joinCode}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        {classroom.isMember ? (
          <Button
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            asChild
          >
            <Link href={`/classrooms/${classroom.id}`}>
              Enter Classroom
            </Link>
          </Button>
        ) : (
          <Button
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            Join Classroom
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}