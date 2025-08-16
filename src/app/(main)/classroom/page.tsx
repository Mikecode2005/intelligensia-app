"use client";

import { useState } from "react";
import { Metadata } from "next";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Users, 
  Calendar,
  Clock,
  Star,
  Play,
  Download,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Filter,
  Search,
  Plus
} from "lucide-react";

export default function ClassroomPage() {
  const [activeTab, setActiveTab] = useState("classes");

  const tabs = [
    { id: "classes", label: "My Classes", icon: Users },
    { id: "live", label: "Live Classes", icon: Video },
    { id: "books", label: "Books", icon: BookOpen },
    { id: "resources", label: "Resources", icon: FileText },
    { id: "publications", label: "Publications", icon: Star },
  ];

  const myClasses = [
    {
      id: 1,
      title: "Advanced Web Development",
      instructor: "Dr. Sarah Johnson",
      students: 245,
      progress: 78,
      nextClass: "Today, 2:00 PM",
      image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      category: "Technology"
    },
    {
      id: 2,
      title: "Digital Marketing Strategies",
      instructor: "Prof. Michael Chen",
      students: 189,
      progress: 65,
      nextClass: "Tomorrow, 10:00 AM",
      image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      category: "Business"
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      instructor: "Dr. Emily Rodriguez",
      students: 312,
      progress: 42,
      nextClass: "Dec 16, 3:00 PM",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      category: "Data Science"
    }
  ];

  const liveClasses = [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      instructor: "Dr. Alex Thompson",
      viewers: 1247,
      duration: "45 min",
      status: "live",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Creative Writing Workshop",
      instructor: "Prof. Lisa Wang",
      viewers: 892,
      duration: "60 min",
      status: "starting-soon",
      image: "https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Financial Planning Basics",
      instructor: "Mark Stevens",
      viewers: 654,
      duration: "30 min",
      status: "scheduled",
      image: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
    }
  ];

  const books = [
    {
      id: 1,
      title: "The Art of Computer Programming",
      author: "Donald Knuth",
      rating: 4.8,
      downloads: 12500,
      pages: 650,
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Clean Code",
      author: "Robert Martin",
      rating: 4.7,
      downloads: 9800,
      pages: 464,
      image: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Design Patterns",
      author: "Gang of Four",
      rating: 4.6,
      downloads: 8200,
      pages: 395,
      image: "https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&fit=crop"
    }
  ];

  const resources = [
    {
      id: 1,
      title: "Complete React.js Cheat Sheet",
      type: "PDF",
      size: "2.4 MB",
      downloads: 5420,
      likes: 892,
      author: "Tech Academy",
      image: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Python Data Structures Guide",
      type: "PDF",
      size: "1.8 MB",
      downloads: 3210,
      likes: 654,
      author: "Code Masters",
      image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "UI/UX Design Templates",
      type: "ZIP",
      size: "15.2 MB",
      downloads: 2890,
      likes: 1205,
      author: "Design Studio",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
    }
  ];

  const publications = [
    {
      id: 1,
      title: "The Future of Artificial Intelligence in Education",
      author: "Dr. Jennifer Liu",
      journal: "Educational Technology Review",
      citations: 245,
      year: 2024,
      abstract: "This paper explores the transformative potential of AI in modern education systems..."
    },
    {
      id: 2,
      title: "Sustainable Development Through Digital Innovation",
      author: "Prof. David Kumar",
      journal: "Innovation & Sustainability",
      citations: 189,
      year: 2024,
      abstract: "An analysis of how digital technologies can drive sustainable development goals..."
    },
    {
      id: 3,
      title: "Social Media Impact on Student Learning",
      author: "Dr. Maria Santos",
      journal: "Digital Learning Today",
      citations: 156,
      year: 2023,
      abstract: "A comprehensive study on the effects of social media platforms on academic performance..."
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "classes":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myClasses.map((classItem) => (
              <div key={classItem.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={classItem.image} 
                    alt={classItem.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {classItem.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{classItem.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{classItem.instructor}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {classItem.students}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {classItem.progress}% complete
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${classItem.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {classItem.nextClass}
                    </div>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "live":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveClasses.map((liveClass) => (
              <div key={liveClass.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={liveClass.image} 
                    alt={liveClass.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      liveClass.status === 'live' ? 'bg-red-500 text-white' :
                      liveClass.status === 'starting-soon' ? 'bg-yellow-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {liveClass.status === 'live' ? '🔴 LIVE' :
                       liveClass.status === 'starting-soon' ? '⏰ Starting Soon' :
                       '📅 Scheduled'}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{liveClass.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{liveClass.instructor}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {liveClass.viewers}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {liveClass.duration}
                      </div>
                    </div>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "books":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">{book.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">{book.author}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-600">{book.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">{book.pages} pages</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Download className="h-3 w-3 mr-1" />
                      {book.downloads}
                    </div>
                    <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-orange-600 transition-colors">
                      Read
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "resources":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={resource.image} 
                    alt={resource.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {resource.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{resource.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{resource.author}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{resource.size}</span>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {resource.downloads}
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {resource.likes}
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "publications":
        return (
          <div className="space-y-6">
            {publications.map((publication) => (
              <div key={publication.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{publication.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {publication.author} • {publication.journal} • {publication.year}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                      {publication.abstract}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {publication.citations} citations
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-orange-600 transition-colors">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">Save</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-orange-600 transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">Share</span>
                    </button>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                      Read Full Paper
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Classroom</h1>
              <p className="text-orange-100">Access courses, live classes, books, resources, and academic publications</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Search
              </button>
              <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50 dark:bg-orange-900/20"
                      : "text-gray-600 dark:text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}