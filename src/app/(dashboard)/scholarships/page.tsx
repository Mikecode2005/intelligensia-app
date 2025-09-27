import { Metadata } from "next";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import ScholarshipCard from "./components/ScholarshipCard";

export const metadata: Metadata = {
  title: "Scholarships - Intelligensia"
};

export default async function ScholarshipsPage({
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
  
  // In a real app, you would fetch scholarships from the database
  // For now, we'll use placeholder data
  const scholarships = [
    {
      id: "1",
      title: "Engineering Excellence Scholarship",
      description: "For outstanding students in engineering disciplines with demonstrated academic excellence and leadership potential.",
      amount: 5000,
      deadline: new Date("2025-12-15"),
      requirements: "Minimum GPA of 3.5, two recommendation letters, essay submission",
      organizationId: "org1",
      organizationName: "Tech Foundation",
      fieldId: "engineering",
      fieldName: "Engineering",
    },
    {
      id: "2",
      title: "Computer Science Innovation Award",
      description: "Supporting innovative students in computer science who demonstrate exceptional problem-solving skills and creativity.",
      amount: 7500,
      deadline: new Date("2025-11-30"),
      requirements: "Portfolio of projects, academic transcript, personal statement",
      organizationId: "org2",
      organizationName: "Digital Futures Inc.",
      fieldId: "computer-science",
      fieldName: "Computer Science",
    },
    {
      id: "3",
      title: "Global Business Leaders Scholarship",
      description: "For business students with international experience and leadership potential in global markets.",
      amount: 6000,
      deadline: new Date("2026-01-15"),
      requirements: "Business plan submission, academic record, interview",
      organizationId: "org3",
      organizationName: "International Business Association",
      fieldId: "business",
      fieldName: "Business & Economics",
    },
    {
      id: "4",
      title: "Healthcare Innovation Scholarship",
      description: "Supporting students pursuing careers in healthcare with innovative approaches to medical challenges.",
      amount: 8000,
      deadline: new Date("2025-10-31"),
      requirements: "Research proposal, academic transcript, two references",
      organizationId: "org4",
      organizationName: "Health Futures Foundation",
      fieldId: "medicine",
      fieldName: "Medicine & Health Sciences",
    },
  ];
  
  // Filter scholarships based on search query and field
  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = searchQuery
      ? scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesField = fieldFilter
      ? scholarship.fieldId === fieldFilter
      : true;
      
    return matchesSearch && matchesField;
  });
  
  // Get all available fields for filtering
  const fields = [
    { id: "engineering", name: "Engineering" },
    { id: "computer-science", name: "Computer Science" },
    { id: "business", name: "Business & Economics" },
    { id: "medicine", name: "Medicine & Health Sciences" },
  ];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Scholarships
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Discover and apply for scholarships that match your profile
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            Browse All
          </Button>
          <Button variant="outline" className="border-orange-200 dark:border-orange-800">
            My Applications
          </Button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search scholarships..."
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
            
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScholarships.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No scholarships found matching your criteria
            </p>
            <Button variant="link" className="text-orange-600 dark:text-orange-500 mt-2">
              Clear filters
            </Button>
          </div>
        ) : (
          filteredScholarships.map(scholarship => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
            />
          ))
        )}
      </div>
    </div>
  );
}
