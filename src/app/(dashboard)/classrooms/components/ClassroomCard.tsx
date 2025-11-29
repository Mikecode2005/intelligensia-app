"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  BookOpen, 
  Clock, 
  Star, 
  Play, 
  TrendingUp,
  Flame,
  Award,
  MessageSquare,
  Calendar,
  Video,
  FileText,
  CheckCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ClassroomCardProps {
  id: string;
  name: string;
  description: string;
  subject: string;
  instructor: {
    name: string;
    avatar?: string;
    title: string;
  };
  members: number;
  maxMembers: number;
  sessions: number;
  rating: number;
  image?: string;
  tags: string[];
  nextSession?: {
    time: string;
    topic: string;
  };
  isLive?: boolean;
  progress?: number;
}

export default function ClassroomCard({
  id,
  name,
  description,
  subject,
  instructor,
  members,
  maxMembers,
  sessions,
  rating,
  image,
  tags,
  nextSession,
  isLive,
  progress = 0
}: ClassroomCardProps) {
  const isFull = members >= maxMembers;
  const fillPercentage = (members / maxMembers) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg",
        "border border-gray-200/50 dark:border-gray-700/50",
        "hover:border-orange-400/50 hover:shadow-xl",
        isLive && "ring-2 ring-orange-500/50"
      )}>
        {/* Live Indicator */}
        {isLive && (
          <motion.div
            className="absolute top-3 left-3 z-10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Badge className="bg-red-500 text-white animate-pulse">
              <Flame className="h-3 w-3 mr-1" />
              LIVE
            </Badge>
          </motion.div>
        )}

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        )}

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-500/20" />
        </div>

        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-white/80" />
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Subject Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
              {subject}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Users className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {members}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Students</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {sessions}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sessions</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {rating}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
            </div>
          </div>

          {/* Capacity Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Capacity</span>
              <span className={cn(
                "font-medium",
                isFull ? "text-red-500" : "text-green-500"
              )}>
                {members}/{maxMembers}
              </span>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${fillPercentage}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={instructor.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white">
                {instructor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {instructor.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {instructor.title}
              </p>
            </div>
          </div>

          {/* Next Session */}
          {nextSession && (
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Next: {nextSession.topic}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {nextSession.time}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isLive && (
                <Badge variant="outline" className="text-red-500 border-red-500">
                  <Video className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
              {isFull && (
                <Badge variant="outline" className="text-orange-500 border-orange-500">
                  Full
                </Badge>
              )}
            </div>

            <Link href={`/classrooms/${id}`}>
              <Button
                size="sm"
                className={cn(
                  "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
                  "hover:from-orange-600 hover:to-amber-600",
                  "transition-all duration-300",
                  isFull && "opacity-50 cursor-not-allowed"
                )}
                disabled={isFull}
              >
                {isFull ? "Full" : "Join Class"}
                <Play className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}