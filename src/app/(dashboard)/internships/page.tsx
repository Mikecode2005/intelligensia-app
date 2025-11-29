"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Users,
  Star,
  Heart,
  ExternalLink,
  Calendar,
  TrendingUp,
  Award,
  Briefcase,
  Zap,
  CheckCircle,
  XCircle,
  BriefcaseBusiness,
  MapPinIcon,
  ClockIcon,
  DollarSignIcon
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Internship {
  id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
    industry: string;
    size: string;
    location: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  type: "full-time" | "part-time" | "remote" | "hybrid";
  duration: string;
  stipend: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: string;
  tags: string[];
  rating: number;
  applications: number;
  positions: number;
  postedAt: string;
  isFeatured?: boolean;
  isRemote?: boolean;
  isPaid?: boolean;
}

// Enhanced internship data
const internships: Internship[] = [
  {
    id: "int001",
    title: "Software Engineering Intern",
    company: {
      name: "TechCorp Inc.",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
      industry: "Technology",
      size: "1000-5000",
      location: "San Francisco, CA"
    },
    description: "Join our engineering team to build scalable web applications using modern technologies. Work on real projects with experienced mentors and contribute to production systems.",
    requirements: ["React", "Node.js", "Git", "Problem Solving", "Team Collaboration"],
    benefits: ["Competitive stipend $4-6k/month", "Full-time offer potential", "Remote work option", "Mentorship program", "Tech conference tickets"],
    type: "full-time",
    duration: "3 months",
    stipend: { min: 4000, max: 6000, currency: "USD" },
    deadline: "2024-03-15",
    tags: ["React", "Node.js", "Full-stack", "AI", "Cloud"],
    rating: 4.8,
    applications: 234,
    positions: 5,
    postedAt: "2024-01-10",
    isFeatured: true,
    isRemote: true,
    isPaid: true
  },
  {
    id: "int002",
    title: "AI/ML Research Intern",
    company: {
      name: "DataFlow Solutions",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
      industry: "AI/ML",
      size: "100-500",
      location: "New York, NY"
    },
    description: "Work with cutting-edge AI research on large datasets. Build predictive models and contribute to groundbreaking machine learning applications.",
    requirements: ["Python", "PyTorch", "TensorFlow", "Statistics", "Research Papers"],
    benefits: ["$3.5-5k monthly stipend", "Research publication opportunities", "PhD mentorship", "GPU access", "Conference attendance"],
    type: "hybrid",
    duration: "4 months",
    stipend: { min: 3500, max: 5000, currency: "USD" },
    deadline: "2024-03-20",
    tags: ["Python", "Machine Learning", "AI", "Research", "Data Science"],
    rating: 4.9,
    applications: 189,
    positions: 3,
    postedAt: "2024-01-08",
    isFeatured: true,
    isPaid: true
  }
];

// Change this to a named export
const InternshipCard = ({ internship }: { internship: Internship }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time": return "from-blue-500 to-cyan-500";
      case "part-time": return "from-green-500 to-emerald-500";
      case "remote": return "from-purple-500 to-violet-500";
      case "hybrid": return "from-orange-500 to-amber-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const formatStipend = (stipend: { min: number; max: number; currency: string }) => {
    return `${stipend.currency}${stipend.min.toLocaleString()} - ${stipend.currency}${stipend.max.toLocaleString()}/month`;
  };

  const getDeadlineStatus = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: "expired", color: "text-red-500", icon: <XCircle className="h-4 w-4" /> };
    if (diffDays <= 7) return { status: "urgent", color: "text-orange-500", icon: <Clock className="h-4 w-4" /> };
    return { status: "active", color: "text-green-500", icon: <CheckCircle className="h-4 w-4" /> };
  };

  const deadlineStatus = getDeadlineStatus(internship.deadline);

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
        {/* Header with Gradient */}
        <div className={`relative h-32 bg-gradient-to-br ${getTypeColor(internship.type)}`}>
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex space-x-2">
            {internship.isFeatured && (
              <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                <Award className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {internship.isRemote && (
              <Badge variant="outline" className="text-purple-500 border-purple-500 bg-white/20">
                <Users className="h-3 w-3 mr-1" />
                Remote
              </Badge>
            )}
          </div>

          {/* Company Info */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center space-x-3">
              {internship.company.logo && (
                <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <img
                    src={internship.company.logo}
                    alt={internship.company.name}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-white font-bold text-lg">{internship.title}</h3>
                <p className="text-white/80 text-sm">{internship.company.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {internship.description}
          </p>

          {/* Requirements */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Requirements:</h4>
            <div className="flex flex-wrap gap-1">
              {internship.requirements.slice(0, 3).map((req) => (
                <Badge
                  key={req}
                  variant="secondary"
                  className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                >
                  {req}
                </Badge>
              ))}
              {internship.requirements.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{internship.requirements.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Benefits:</h4>
            <div className="flex flex-wrap gap-1">
              {internship.benefits.slice(0, 2).map((benefit) => (
                <Badge
                  key={benefit}
                  variant="outline"
                  className="text-xs text-green-600 border-green-600"
                >
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <MapPinIcon className="h-4 w-4" />
                <span>{internship.company.location}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 mt-1">
                <ClockIcon className="h-4 w-4" />
                <span>{internship.duration}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1 text-green-600 font-medium">
                <DollarSignIcon className="h-4 w-4" />
                <span>{formatStipend(internship.stipend)}</span>
              </div>
              <div className={`flex items-center space-x-1 ${deadlineStatus.color} mt-1`}>
                {deadlineStatus.icon}
                <span>Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Applications</span>
              <span className="font-medium">
                {internship.applications}/{internship.positions * 10}
              </span>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(internship.applications / (internship.positions * 10)) * 100}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {internship.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {internship.applications} applicants
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 dark:text-gray-400">
                {internship.positions} spots
              </span>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsSaved(!isSaved)}
                className={cn(
                  "transition-colors",
                  isSaved && "text-orange-500"
                )}
              >
                <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
              >
                Apply Now
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Only ONE default export per file
export default function InternshipsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [filteredInternships, setFilteredInternships] = useState(internships);

  useEffect(() => {
    let filtered = internships;

    if (searchTerm) {
      filtered = filtered.filter(
        (internship) =>
          internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((internship) => internship.type === selectedType);
    }

    setFilteredInternships(filtered);
  }, [searchTerm, selectedType, selectedLocation]);

  const types = ["all", "full-time", "part-time", "remote", "hybrid"];
  const locations = ["all", "Remote", "San Francisco", "New York", "Seattle", "Austin"];

  const stats = {
    total: internships.length,
    remote: internships.filter(i => i.isRemote).length,
    paid: internships.filter(i => i.isPaid).length,
    applications: internships.reduce((sum, i) => sum + i.applications, 0)
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
                Internships
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Find your dream internship opportunity
              </p>
            </div>

            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <Briefcase className="h-4 w-4 mr-2" />
              Post Internship
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Total Opportunities", value: stats.total, icon: Briefcase, color: "from-orange-400 to-amber-500" },
              { label: "Remote Positions", value: stats.remote, icon: Users, color: "from-purple-400 to-violet-500" },
              { label: "Paid Internships", value: stats.paid, icon: Award, color: "from-green-400 to-emerald-500" },
              { label: "Applications", value: stats.applications.toLocaleString(), icon: TrendingUp, color: "from-blue-400 to-cyan-500" }
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
              placeholder="Search internships..."
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
              {types.map(type => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-white/50 dark:bg-gray-800/50 border-0 rounded-lg px-4 py-2 text-sm"
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location === "all" ? "All Locations" : location}
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
            <TabsTrigger value="all">All Internships</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="remote">Remote</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredInternships.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredInternships.map((internship, index) => (
                  <motion.div
                    key={internship.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <InternshipCard internship={internship} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No internships found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredInternships.filter(i => i.isFeatured).map((internship, index) => (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <InternshipCard internship={internship} />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}