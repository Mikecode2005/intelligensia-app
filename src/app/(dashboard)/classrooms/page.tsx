"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Users, 
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  Flame
} from "lucide-react";
import ClassroomCard from "./components/ClassroomCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample classroom data
const classrooms = [
  {
    id: "cs101",
    name: "Introduction to Computer Science",
    description: "Learn the fundamentals of computer science with hands-on projects and real-world applications.",
    subject: "Computer Science",
    instructor: {
      name: "Dr. Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop",
      title: "Senior Lecturer"
    },
    members: 45,
    maxMembers: 50,
    sessions: 24,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    tags: ["Beginner", "Projects", "Career"],
    nextSession: {
      time: "Today, 3:00 PM",
      topic: "Introduction to Python"
    },
    isLive: true,
    progress: 15
  },
  {
    id: "ml202",
    name: "Machine Learning Fundamentals",
    description: "Dive deep into machine learning algorithms, neural networks, and AI applications.",
    subject: "Machine Learning",
    instructor: {
      name: "Prof. Michael Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      title: "AI Research Lead"
    },
    members: 32,
    maxMembers: 40,
    sessions: 36,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
    tags: ["Advanced", "AI", "Research"],
    nextSession: {
      time: "Tomorrow, 2:00 PM",
      topic: "Neural Networks Basics"
    },
    progress: 25
  },
  {
    id: "wd301",
    name: "Modern Web Development",
    description: "Build responsive web applications using React, Next.js, and modern tooling.",
    subject: "Web Development",
    instructor: {
      name: "Emma Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      title: "Senior Developer"
    },
    members: 28,
    maxMembers: 35,
    sessions: 20,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
    tags: ["Intermediate", "React", "Portfolio"],
    nextSession: {
      time: "Friday, 10:00 AM",
      topic: "React Hooks Deep Dive"
    },
    progress: 40
  }
];

export default function ClassroomsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [filteredClassrooms, setFilteredClassrooms] = useState(classrooms);

  const subjects = ["all", "Computer Science", "Machine Learning", "Web Development", "Data Science", "Cybersecurity"];

  useEffect(() => {
    let filtered = classrooms;

    if (searchTerm) {
      filtered = filtered.filter(
        (classroom) =>
          classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          classroom.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          classroom.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSubject !== "all") {
      filtered = filtered.filter(
        (classroom) => classroom.subject === selectedSubject
      );
    }

    setFilteredClassrooms(filtered);
  }, [searchTerm, selectedSubject]);

  const stats = {
    total: classrooms.length,
    live: classrooms.filter(c => c.isLive).length,
    popular: classrooms.filter(c => c.members > 30).length,
    completed: classrooms.filter(c => c.progress === 100).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Classrooms
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Join interactive classes and learn with peers
              </p>
            </div>

            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Classroom
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Total Classes", value: stats.total, icon: BookOpen, color: "from-orange-400 to-amber-500" },
              { label: "Live Now", value: stats.live, icon: Flame, color: "from-red-400 to-orange-500" },
              { label: "Popular", value: stats.popular, icon: TrendingUp, color: "from-green-400 to-emerald-500" },
              { label: "Completed", value: stats.completed, icon: Award, color: "from-purple-400 to-pink-500" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 glass-strong">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          className="flex flex-col md:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search classrooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white/50 dark:bg-gray-800/50 border-0 rounded-lg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white/50 dark:bg-gray-800/50 border-0 rounded-lg px-4 py-2 text-sm"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === "all" ? "All Subjects" : subject}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger value="all">All Classes</TabsTrigger>
            <TabsTrigger value="live">Live Now</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="my">My Classes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredClassrooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClassrooms.map((classroom, index) => (
                  <motion.div
                    key={classroom.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ClassroomCard {...classroom} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No classrooms found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClassrooms.filter(c => c.isLive).map((classroom, index) => (
                <motion.div
                  key={classroom.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ClassroomCard {...classroom} />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}