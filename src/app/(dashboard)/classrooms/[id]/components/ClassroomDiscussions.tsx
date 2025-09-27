"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquareIcon, 
  PlusIcon, 
  SearchIcon, 
  ThumbsUpIcon, 
  MessageCircleIcon,
  UserIcon,
  TagIcon,
  FilterIcon
} from "lucide-react";
import { useState } from "react";

interface ClassroomDiscussionsProps {
  classroomId: string;
}

export default function ClassroomDiscussions({ classroomId }: ClassroomDiscussionsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample discussion data
  const discussions = [
    {
      id: "1",
      title: "Understanding Recursion in Programming",
      author: "Sarah Chen",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150",
      date: "2025-09-20T14:30:00Z",
      replies: 12,
      likes: 8,
      tags: ["recursion", "programming", "algorithms"],
      pinned: true,
      unread: false
    },
    {
      id: "2",
      title: "Big O Notation and Algorithm Efficiency",
      author: "Michael Johnson",
      authorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150",
      date: "2025-09-18T09:15:00Z",
      replies: 8,
      likes: 15,
      tags: ["algorithms", "big-o", "efficiency"],
      pinned: false,
      unread: true
    },
    {
      id: "3",
      title: "Comparing Different Sorting Algorithms",
      author: "Alex Rodriguez",
      authorAvatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150",
      date: "2025-09-15T16:45:00Z",
      replies: 20,
      likes: 12,
      tags: ["sorting", "algorithms", "performance"],
      pinned: false,
      unread: false
    },
    {
      id: "4",
      title: "Help with Assignment 3: Binary Trees",
      author: "Jamie Lee",
      authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150",
      date: "2025-09-14T11:20:00Z",
      replies: 15,
      likes: 5,
      tags: ["assignment", "binary-trees", "help"],
      pinned: false,
      unread: true
    },
    {
      id: "5",
      title: "Resources for Learning Data Structures",
      author: "Taylor Kim",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150",
      date: "2025-09-10T08:30:00Z",
      replies: 18,
      likes: 24,
      tags: ["resources", "data-structures", "learning"],
      pinned: false,
      unread: false
    }
  ];
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
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
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Filter discussions based on search query
  const filteredDiscussions = discussions.filter(discussion => 
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="space-y-6">
      {/* Header with search and new discussion button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search discussions..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Discussion
          </Button>
        </div>
      </div>
      
      {/* Discussion tabs */}
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Discussions</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="pinned">Pinned</TabsTrigger>
          <TabsTrigger value="my-posts">My Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <MessageSquareIcon className="h-5 w-5 text-orange-500" />
                All Discussions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {filteredDiscussions.map((discussion) => (
                  <div 
                    key={discussion.id}
                    className={`flex items-start p-4 rounded-lg transition-colors ${
                      discussion.unread 
                        ? 'bg-orange-50 dark:bg-orange-900/10 border-l-2 border-orange-500' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <img 
                      src={discussion.authorAvatar} 
                      alt={discussion.author}
                      className="h-10 w-10 rounded-full object-cover mr-4"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {discussion.pinned && (
                          <span className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-xs px-2 py-0.5 rounded">
                            Pinned
                          </span>
                        )}
                        {discussion.unread && (
                          <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2 py-0.5 rounded">
                            New
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mt-1">
                        {discussion.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          <span>{discussion.author}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <MessageCircleIcon className="h-3 w-3" />
                          <span>{discussion.replies} replies</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <ThumbsUpIcon className="h-3 w-3" />
                          <span>{discussion.likes} likes</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <TagIcon className="h-3 w-3" />
                          <div className="flex gap-1">
                            {discussion.tags.map((tag, index) => (
                              <span key={index} className="text-orange-600 dark:text-orange-400">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <span>{formatDate(discussion.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredDiscussions.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquareIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">No discussions found</p>
                    <Button variant="link" className="mt-2 text-orange-600 dark:text-orange-400">
                      Start a new discussion
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unread">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                {filteredDiscussions.filter(d => d.unread).map((discussion) => (
                  <div 
                    key={discussion.id}
                    className="flex items-start p-4 rounded-lg bg-orange-50 dark:bg-orange-900/10 border-l-2 border-orange-500"
                  >
                    <img 
                      src={discussion.authorAvatar} 
                      alt={discussion.author}
                      className="h-10 w-10 rounded-full object-cover mr-4"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2 py-0.5 rounded">
                          New
                        </span>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mt-1">
                        {discussion.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          <span>{discussion.author}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <MessageCircleIcon className="h-3 w-3" />
                          <span>{discussion.replies} replies</span>
                        </div>
                        
                        <span>{formatDate(discussion.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredDiscussions.filter(d => d.unread).length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquareIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">No unread discussions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pinned">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                {filteredDiscussions.filter(d => d.pinned).map((discussion) => (
                  <div 
                    key={discussion.id}
                    className="flex items-start p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <img 
                      src={discussion.authorAvatar} 
                      alt={discussion.author}
                      className="h-10 w-10 rounded-full object-cover mr-4"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-xs px-2 py-0.5 rounded">
                          Pinned
                        </span>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mt-1">
                        {discussion.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          <span>{discussion.author}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <MessageCircleIcon className="h-3 w-3" />
                          <span>{discussion.replies} replies</span>
                        </div>
                        
                        <span>{formatDate(discussion.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredDiscussions.filter(d => d.pinned).length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquareIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">No pinned discussions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="my-posts">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquareIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">You haven't created any discussions yet</p>
                <Button variant="link" className="mt-2 text-orange-600 dark:text-orange-400">
                  Start a new discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}