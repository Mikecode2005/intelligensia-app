import { Metadata } from "next";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { SearchIcon, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import ClassroomCard from "./components/ClassroomCard";
import JoinClassroomDialog from "./components/JoinClassroomDialog";
import CreateClassroomDialog from "./components/CreateClassroomDialog";

export const metadata: Metadata = {
  title: "Classrooms - Intelligensia"
};

export default async function ClassroomsPage({
  searchParams,
}: {
  searchParams: { q?: string; field?: string };
}) {
  // Check if user is authenticated
  const { user } = await validateRequest();
  
  if (!user) {
    redirect("/login");
  }
  
  // Get search query and field filter
  const searchQuery = searchParams.q || "";
  const fieldFilter = searchParams.field || "";
  
  // In a real app, you would fetch classrooms from the database
  // For now, we'll use placeholder data
  const classrooms = [
    {
      id: "1",
      name: "Introduction to Computer Science",
      description: "Learn the fundamentals of computer science, including algorithms, data structures, and programming concepts.",
      joinCode: "CS101",
      fieldId: "computer-science",
      fieldName: "Computer Science",
      memberCount: 45,
      teacherName: "Dr. Alan Turing",
      teacherAvatar: "https://placehold.co/200x200?text=AT",
      isMember: true,
      role: "STUDENT",
    },
    {
      id: "2",
      name: "Advanced Mathematics",
      description: "Explore advanced mathematical concepts including calculus, linear algebra, and differential equations.",
      joinCode: "MATH301",
      fieldId: "mathematics",
      fieldName: "Mathematics",
      memberCount: 32,
      teacherName: "Prof. Katherine Johnson",
      teacherAvatar: "https://placehold.co/200x200?text=KJ",
      isMember: true,
      role: "STUDENT",
    },
    {
      id: "3",
      name: "Web Development Bootcamp",
      description: "Hands-on course covering HTML, CSS, JavaScript, and modern web frameworks.",
      joinCode: "WEB200",
      fieldId: "computer-science",
      fieldName: "Computer Science",
      memberCount: 68,
      teacherName: "Sarah Williams",
      teacherAvatar: "https://placehold.co/200x200?text=SW",
      isMember: false,
      role: null,
    },
    {
      id: "4",
      name: "Business Ethics",
      description: "Examine ethical principles and moral problems that arise in business environments.",
      joinCode: "BUS220",
      fieldId: "business",
      fieldName: "Business & Economics",
      memberCount: 53,
      teacherName: "Dr. Michael Chen",
      teacherAvatar: "https://placehold.co/200x200?text=MC",
      isMember: false,
      role: null,
    },
    {
      id: "5",
      name: "Introduction to Psychology",
      description: "Explore the fundamentals of human behavior, cognition, and mental processes.",
      joinCode: "PSY101",
      fieldId: "social-sciences",
      fieldName: "Social Sciences",
      memberCount: 87,
      teacherName: "Dr. Emily Rodriguez",
      teacherAvatar: "https://placehold.co/200x200?text=ER",
      isMember: true,
      role: "STUDENT",
    },
  ];
  
  // Filter classrooms based on search query and field
  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = searchQuery
      ? classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classroom.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesField = fieldFilter
      ? classroom.fieldId === fieldFilter
      : true;
      
    return matchesSearch && matchesField;
  });
  
  // Separate classrooms into joined and available
  const joinedClassrooms = filteredClassrooms.filter(classroom => classroom.isMember);
  const availableClassrooms = filteredClassrooms.filter(classroom => !classroom.isMember);
  
  // Get all available fields for filtering
  const fields = [
    { id: "computer-science", name: "Computer Science" },
    { id: "mathematics", name: "Mathematics" },
    { id: "business", name: "Business & Economics" },
    { id: "social-sciences", name: "Social Sciences" },
    { id: "engineering", name: "Engineering" },
  ];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Classrooms
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Join virtual classrooms and collaborate with teachers and students
          </p>
        </div>
        
        <div className="flex gap-2">
          <JoinClassroomDialog>
            <Button variant="outline" className="border-orange-200 dark:border-orange-800">
              Join Class
            </Button>
          </JoinClassroomDialog>
          
          <CreateClassroomDialog>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          </CreateClassroomDialog>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search classrooms..."
              className="pl-10 pr-4 py-2 w-full border-gray-200 dark:border-gray-700"
              defaultValue={searchQuery}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              defaultValue={fieldFilter}
            >
              <option value="">All Fields</option>
              {fields.map(field => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* My Classrooms */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          My Classrooms
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedClassrooms.length === 0 ? (
            <div className="col-span-full text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                You haven't joined any classrooms yet
              </p>
              <JoinClassroomDialog>
                <Button variant="link" className="text-orange-600 dark:text-orange-500 mt-2">
                  Join a classroom
                </Button>
              </JoinClassroomDialog>
            </div>
          ) : (
            joinedClassrooms.map(classroom => (
              <ClassroomCard
                key={classroom.id}
                classroom={classroom}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Available Classrooms */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Available Classrooms
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableClassrooms.length === 0 ? (
            <div className="col-span-full text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                No available classrooms match your search criteria
              </p>
              <Button variant="link" className="text-orange-600 dark:text-orange-500 mt-2">
                Clear filters
              </Button>
            </div>
          ) : (
            availableClassrooms.map(classroom => (
              <ClassroomCard
                key={classroom.id}
                classroom={classroom}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}