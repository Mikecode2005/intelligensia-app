"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpenIcon, 
  FileIcon, 
  FileTextIcon, 
  PlusIcon, 
  SearchIcon, 
  VideoIcon,
  DownloadIcon,
  ExternalLinkIcon,
  BookmarkIcon,
  CheckIcon,
  FileSpreadsheetIcon,
  PresentationIcon,
  FileCodeIcon,
  FileImageIcon,
  FileArchiveIcon,
  LinkIcon
} from "lucide-react";

import { useState } from "react";

interface ClassroomResourcesProps {
  classroomId: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'image' | 'code' | 'spreadsheet' | 'presentation' | 'archive';
  fileType?: string;
  url?: string;
  fileUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
  size?: string;
  viewed: boolean;
  bookmarked: boolean;
  category: string;
}

export default function ClassroomResources({ classroomId }: ClassroomResourcesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Sample resources data
  const resources: Resource[] = [
    {
      id: "1",
      title: "Introduction to Algorithms Lecture Notes",
      description: "Comprehensive lecture notes covering algorithm basics, complexity analysis, and common algorithms.",
      type: "document",
      fileType: "PDF",
      fileUrl: "/files/intro-algorithms.pdf",
      uploadedBy: "Dr. Alan Turing",
      uploadedAt: "2025-09-10T10:30:00Z",
      size: "2.4 MB",
      viewed: true,
      bookmarked: true,
      category: "Lecture Notes"
    },
    {
      id: "2",
      title: "Data Structures Tutorial Video",
      description: "Video tutorial explaining linked lists, trees, and graph implementations.",
      type: "video",
      url: "https://example.com/videos/data-structures",
      uploadedBy: "Dr. Alan Turing",
      uploadedAt: "2025-09-12T14:15:00Z",
      viewed: true,
      bookmarked: false,
      category: "Videos"
    },
    {
      id: "3",
      title: "Sorting Algorithms Comparison",
      description: "Spreadsheet comparing the time and space complexity of different sorting algorithms.",
      type: "spreadsheet",
      fileType: "XLSX",
      fileUrl: "/files/sorting-algorithms.xlsx",
      uploadedBy: "Dr. Alan Turing",
      uploadedAt: "2025-09-15T09:45:00Z",
      size: "1.2 MB",
      viewed: false,
      bookmarked: false,
      category: "Reference Materials"
    },
    {
      id: "4",
      title: "Algorithm Visualization Tools",
      description: "Collection of online tools for visualizing algorithm execution.",
      type: "link",
      url: "https://algorithm-visualizer.org/",
      uploadedBy: "Dr. Alan Turing",
      uploadedAt: "2025-09-18T11:20:00Z",
      viewed: false,
      bookmarked: true,
      category: "External Resources"
    },
    {
      id: "5",
      title: "Recursion Practice Problems",
      description: "Set of practice problems focusing on recursive algorithms.",
      type: "document",
      fileType: "PDF",
      fileUrl: "/files/recursion-problems.pdf",
      uploadedBy: "Dr. Alan Turing",
      uploadedAt: "2025-09-20T15:30:00Z",
      size: "1.8 MB",
      viewed: false,
      bookmarked: false,
      category: "Practice Materials"
    },
    {
      id: "6",
      title: "Big O Notation Cheat Sheet",
      description: "Quick reference guide for Big O notation and common algorithm complexities.",
      type: "image",
      fileType: "PNG",
      fileUrl: "/files/big-o-cheatsheet.png",
      uploadedBy: "Dr. Alan Turing",
      uploadedAt: "2025-09-22T08:15:00Z",
      size: "850 KB",
      viewed: true,
      bookmarked: true,
      category: "Reference Materials"
    },
    {
      id: "7",
      title: "Algorithm Implementation Examples",
      description: "Code examples implementing common algorithms in Python.",
      type: "code",
      fileType: "ZIP",
      fileUrl: "/files/algorithm-examples.zip",
      uploadedBy: "Dr. Alan Turing",
      uploadedAt: "2025-09-25T13:45:00Z",
      size: "3.2 MB",
      viewed: false,
      bookmarked: false,
      category: "Code Examples"
    },
    {
      id: "8",
      title: "Midterm Exam Review Slides",
      description: "Presentation slides covering all topics for the midterm exam.",
      type: "presentation",
      fileType: "PPTX",
      fileUrl: "/files/midterm-review.pptx",
      uploadedBy: "Dr. Alan Turing",
      uploadedAt: "2025-09-28T16:20:00Z",
      size: "5.6 MB",
      viewed: true,
      bookmarked: true,
      category: "Exam Materials"
    }
  ];
  
  // Get all unique categories
  const categories = Array.from(new Set(resources.map(r => r.category)));
  
  // Filter resources based on search query and selected category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery 
      ? resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesCategory = selectedCategory
      ? resource.category === selectedCategory
      : true;
      
    return matchesSearch && matchesCategory;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get icon based on resource type
  const getResourceIcon = (type: string, className: string = "h-5 w-5") => {
    switch (type) {
      case "document":
        return <FileTextIcon className={className} />;
      case "video":
        return <VideoIcon className={className} />;
      case "link":
        return <LinkIcon className={className} />;
      case "image":
        return <FileImageIcon className={className} />;
      case "code":
        return <FileCodeIcon className={className} />;
      case "spreadsheet":
        return <FileSpreadsheetIcon className={className} />;
      case "presentation":
        return <PresentationIcon className={className} />;
      case "archive":
        return <FileArchiveIcon className={className} />;
      default:
        return <FileIcon className={className} />;
    }
  };
  
  // Get color based on resource type
  const getResourceColor = (type: string) => {
    switch (type) {
      case "document":
        return "text-blue-500";
      case "video":
        return "text-red-500";
      case "link":
        return "text-purple-500";
      case "image":
        return "text-green-500";
      case "code":
        return "text-orange-500";
      case "spreadsheet":
        return "text-emerald-500";
      case "presentation":
        return "text-amber-500";
      case "archive":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search resources..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>
      
      {/* Resources tabs */}
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.length > 0 ? (
              filteredResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <BookOpenIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  No resources match your search criteria.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="bookmarked">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.filter(r => r.bookmarked).length > 0 ? (
              filteredResources
                .filter(r => r.bookmarked)
                .map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <BookmarkIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  You haven't bookmarked any resources yet.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="unread">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.filter(r => !r.viewed).length > 0 ? (
              filteredResources
                .filter(r => !r.viewed)
                .map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <CheckIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  You've viewed all resources.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ResourceCardProps {
  resource: Resource;
}

function ResourceCard({ resource }: ResourceCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get icon based on resource type
  const getResourceIcon = (type: string, className: string = "h-5 w-5") => {
    switch (type) {
      case "document":
        return <FileTextIcon className={className} />;
      case "video":
        return <VideoIcon className={className} />;
      case "link":
        return <LinkIcon className={className} />;
      case "image":
        return <FileImageIcon className={className} />;
      case "code":
        return <FileCodeIcon className={className} />;
      case "spreadsheet":
        return <FileSpreadsheetIcon className={className} />;
      case "presentation":
        return <PresentationIcon className={className} />;
      case "archive":
        return <FileArchiveIcon className={className} />;
      default:
        return <FileIcon className={className} />;
    }
  };
  
  // Get color based on resource type
  const getResourceColor = (type: string) => {
    switch (type) {
      case "document":
        return "text-blue-500";
      case "video":
        return "text-red-500";
      case "link":
        return "text-purple-500";
      case "image":
        return "text-green-500";
      case "code":
        return "text-orange-500";
      case "spreadsheet":
        return "text-emerald-500";
      case "presentation":
        return "text-amber-500";
      case "archive":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };
  
  // Get background color based on resource type
  const getResourceBgColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-50 dark:bg-blue-900/20";
      case "video":
        return "bg-red-50 dark:bg-red-900/20";
      case "link":
        return "bg-purple-50 dark:bg-purple-900/20";
      case "image":
        return "bg-green-50 dark:bg-green-900/20";
      case "code":
        return "bg-orange-50 dark:bg-orange-900/20";
      case "spreadsheet":
        return "bg-emerald-50 dark:bg-emerald-900/20";
      case "presentation":
        return "bg-amber-50 dark:bg-amber-900/20";
      case "archive":
        return "bg-gray-50 dark:bg-gray-800";
      default:
        return "bg-gray-50 dark:bg-gray-800";
    }
  };
  
  return (
    <Card className="hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${getResourceBgColor(resource.type)} flex items-center justify-center`}>
            <span className={getResourceColor(resource.type)}>
              {getResourceIcon(resource.type)}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                {resource.title}
              </h3>
              {!resource.viewed && (
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2 py-0.5 rounded">
                  New
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
              {resource.description}
            </p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
              {resource.fileType && (
                <div className="flex items-center gap-1">
                  <FileIcon className="h-3 w-3" />
                  <span>{resource.fileType}</span>
                </div>
              )}
              
              {resource.size && (
                <div className="flex items-center gap-1">
                  <span>{resource.size}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <span>Added: {formatDate(resource.uploadedAt)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span>By: {resource.uploadedBy}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                  {resource.category}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {resource.type === "link" ? (
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLinkIcon className="h-4 w-4" />
                <span>Open</span>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="gap-1">
                <DownloadIcon className="h-4 w-4" />
                <span>Download</span>
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`gap-1 ${resource.bookmarked ? 'text-orange-600' : 'text-gray-500'}`}
            >
              <BookmarkIcon className="h-4 w-4" />
              <span>{resource.bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}