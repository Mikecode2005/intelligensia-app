"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Upload,
  FileText,
  Video,
  Image,
  BookOpen,
  Clock,
  Star,
  Eye,
  Share2,
  Bookmark,
  Play,
  ExternalLink,
  Calendar,
  Users,
  Award,
  TrendingUp,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "video" | "document" | "image" | "interactive";
  subject: string;
  author: {
    name: string;
    avatar?: string;
    title: string;
  };
  views: number;
  downloads: number;
  rating: number;
  duration?: string;
  size?: string;
  tags: string[];
  thumbnail?: string;
  createdAt: string;
  isFeatured?: boolean;
  isNew?: boolean;
}

const resources: Resource[] = [
  {
    id: "res001",
    title: "React Hooks Masterclass",
    description: "Complete guide to React Hooks with practical examples and best practices.",
    type: "video",
    subject: "Web Development",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop",
      title: "Senior Developer"
    },
    views: 15420,
    downloads: 2840,
    rating: 4.9,
    duration: "2h 45m",
    size: "1.2 GB",
    tags: ["React", "JavaScript", "Frontend"],
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
    createdAt: "2024-01-15",
    isFeatured: true,
    isNew: true
  },
  {
    id: "res002",
    title: "Machine Learning Cheat Sheet",
    description: "Comprehensive reference guide for ML algorithms and their applications.",
    type: "document",
    subject: "Machine Learning",
    author: {
      name: "Dr. Michael Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      title: "AI Research Lead"
    },
    views: 8930,
    downloads: 4560,
    rating: 4.8,
    duration: "45 pages",
    size: "2.5 MB",
    tags: ["ML", "Algorithms", "Reference"],
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop",
    createdAt: "2024-01-10",
    isFeatured: true
  },
  {
    id: "res003",
    title: "UI/UX Design Principles",
    description: "Interactive guide to modern UI/UX design patterns and best practices.",
    type: "interactive",
    subject: "Design",
    author: {
      name: "Emma Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      title: "UX Designer"
    },
    views: 6780,
    downloads: 1230,
    rating: 4.7,
    duration: "1h 30m",
    size: "800 MB",
    tags: ["Design", "UI", "UX"],
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=225&fit=crop",
    createdAt: "2024-01-08",
    isNew: true
  }
];

const subjects = ["All", "Web Development", "Machine Learning", "Data Science", "Cybersecurity", "Mobile Development", "Design", "Career"];

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "document": return <FileText className="h-4 w-4" />;
      case "image": return <Image className="h-4 w-4" />;
      case "interactive": return <Play className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video": return "from-red-500 to-pink-500";
      case "document": return "from-blue-500 to-cyan-500";
      case "image": return "from-green-500 to-emerald-500";
      case "interactive": return "from-purple-500 to-violet-500";
      default: return "from-orange-500 to-amber-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group relative overflow-hidden transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-400/50 hover:shadow-xl">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex space-x-2">
          {resource.isFeatured && (
            <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {resource.isNew && (
            <Badge className="bg-green-500 text-white">
              <Zap className="h-3 w-3 mr-1" />
              New
            </Badge>
          )}
        </div>

        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          {resource.thumbnail ? (
            <div className="relative h-full w-full">
              <img
                src={resource.thumbnail}
                alt={resource.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Play overlay for videos */}
              {resource.type === "video" && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className={`h-full bg-gradient-to-br ${getTypeColor(resource.type)} flex items-center justify-center`}>
              {getTypeIcon(resource.type)}
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-black/50 text-white backdrop-blur-sm">
              {getTypeIcon(resource.type)}
              <span className="ml-1">{resource.type}</span>
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {resource.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {resource.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {resource.views.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {resource.downloads.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-400">{resource.rating}</span>
              </div>
            </div>
            <span className="text-gray-500 text-xs">{resource.size}</span>
          </div>

          {/* Author */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {resource.author.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {resource.author.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {resource.author.title}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{resource.duration}</span>
              <span>•</span>
              <span>{resource.subject}</span>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-600 hover:text-orange-600"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [filteredResources, setFilteredResources] = useState(resources);

  useEffect(() => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((resource) => resource.type === selectedType);
    }

    if (selectedSubject !== "all") {
      filtered = filtered.filter((resource) => resource.subject === selectedSubject);
    }

    setFilteredResources(filtered);
  }, [searchTerm, selectedType, selectedSubject]);

  const resourceTypes = [
    { value: "all", label: "All Types", icon: BookOpen },
    { value: "video", label: "Videos", icon: Video },
    { value: "document", label: "Documents", icon: FileText },
    { value: "interactive", label: "Interactive", icon: Play },
    { value: "image", label: "Images", icon: Image }
  ];

  const stats = {
    total: resources.length,
    downloads: resources.reduce((sum, r) => sum + r.downloads, 0),
    views: resources.reduce((sum, r) => sum + r.views, 0),
    rating: (resources.reduce((sum, r) => sum + r.rating, 0) / resources.length).toFixed(1)
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
                Resources
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Discover curated learning materials and resources
              </p>
            </div>

            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload Resource
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Total Resources", value: stats.total, icon: BookOpen, color: "from-orange-400 to-amber-500" },
              { label: "Downloads", value: stats.downloads.toLocaleString(), icon: Download, color: "from-green-400 to-emerald-500" },
              { label: "Views", value: stats.views.toLocaleString(), icon: Eye, color: "from-blue-400 to-cyan-500" },
              { label: "Avg Rating", value: stats.rating, icon: Star, color: "from-yellow-400 to-amber-500" }
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

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          className="flex flex-col lg:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white/50 dark:bg-gray-800/50 border-0 rounded-lg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white/50 dark:bg-gray-800/50 border-0 rounded-lg px-4 py-2 text-sm"
            >
              {resourceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white/50 dark:bg-gray-800/50 border-0 rounded-lg px-4 py-2 text-sm"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
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
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ResourceCard resource={resource} />
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
                  No resources found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResources.filter(r => r.isFeatured).map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ResourceCard resource={resource} />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}