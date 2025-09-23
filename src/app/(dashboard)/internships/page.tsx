import { Metadata } from "next";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon, MapPinIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import InternshipCard from "./components/InternshipCard";

export const metadata: Metadata = {
  title: "Internships - Intelligensia"
};

export default async function InternshipsPage({
  searchParams,
}: {
  searchParams: { q?: string; field?: string; location?: string; remote?: string };
}) {
  // Check if user is authenticated
  const { user } = await validateRequest();
  
  if (!user) {
    redirect("/login");
  }
  
  // Get search query and filters
  const searchQuery = searchParams.q || "";
  const fieldFilter = searchParams.field || "";
  const locationFilter = searchParams.location || "";
  const remoteFilter = searchParams.remote === "true";
  
  // In a real app, you would fetch internships from the database
  // For now, we'll use placeholder data
  const internships = [
    {
      id: "1",
      title: "Software Engineering Intern",
      description: "Join our engineering team to develop cutting-edge web applications using modern technologies. You'll work on real projects with experienced mentors.",
      company: "TechCorp",
      location: "San Francisco, CA",
      isRemote: false,
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-04-15"),
      deadline: new Date("2025-11-30"),
      requirements: "Currently pursuing a degree in Computer Science or related field. Knowledge of JavaScript, React, and Node.js.",
      organizationId: "org1",
      fieldId: "computer-science",
      fieldName: "Computer Science",
      logoUrl: "https://placehold.co/200x200?text=TC",
    },
    {
      id: "2",
      title: "Data Science Intern",
      description: "Work with our data team to analyze large datasets and build machine learning models. Help us extract insights that drive business decisions.",
      company: "DataViz Inc.",
      location: "Remote",
      isRemote: true,
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-05-01"),
      deadline: new Date("2025-12-15"),
      requirements: "Statistics or Data Science background. Experience with Python, pandas, and scikit-learn.",
      organizationId: "org2",
      fieldId: "computer-science",
      fieldName: "Computer Science",
      logoUrl: "https://placehold.co/200x200?text=DV",
    },
    {
      id: "3",
      title: "Marketing Intern",
      description: "Join our marketing team to develop and implement digital marketing strategies. Gain hands-on experience in social media, content creation, and analytics.",
      company: "Brand Builders",
      location: "New York, NY",
      isRemote: false,
      startDate: new Date("2026-01-10"),
      endDate: new Date("2026-03-10"),
      deadline: new Date("2025-11-15"),
      requirements: "Marketing, Communications, or Business major. Strong writing skills and social media knowledge.",
      organizationId: "org3",
      fieldId: "business",
      fieldName: "Business & Economics",
      logoUrl: "https://placehold.co/200x200?text=BB",
    },
    {
      id: "4",
      title: "Biomedical Research Assistant",
      description: "Assist our research team in conducting experiments and analyzing results. Contribute to groundbreaking research in medical treatments.",
      company: "HealthTech Research",
      location: "Boston, MA",
      isRemote: false,
      startDate: new Date("2026-02-15"),
      endDate: new Date("2026-08-15"),
      deadline: new Date("2025-12-31"),
      requirements: "Biology, Chemistry, or related field. Laboratory experience preferred.",
      organizationId: "org4",
      fieldId: "medicine",
      fieldName: "Medicine & Health Sciences",
      logoUrl: "https://placehold.co/200x200?text=HTR",
    },
    {
      id: "5",
      title: "UX/UI Design Intern",
      description: "Design user interfaces for web and mobile applications. Work with product managers and developers to create intuitive user experiences.",
      company: "DesignHub",
      location: "Remote",
      isRemote: true,
      startDate: new Date("2026-01-05"),
      endDate: new Date("2026-04-05"),
      deadline: new Date("2025-11-20"),
      requirements: "Design portfolio showcasing UI/UX projects. Familiarity with Figma or Adobe XD.",
      organizationId: "org5",
      fieldId: "arts",
      fieldName: "Arts & Humanities",
      logoUrl: "https://placehold.co/200x200?text=DH",
    },
  ];
  
  // Filter internships based on search query and filters
  const filteredInternships = internships.filter(internship => {
    const matchesSearch = searchQuery
      ? internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesField = fieldFilter
      ? internship.fieldId === fieldFilter
      : true;
      
    const matchesLocation = locationFilter
      ? internship.location.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
      
    const matchesRemote = remoteFilter
      ? internship.isRemote === true
      : true;
      
    return matchesSearch && matchesField && matchesLocation && matchesRemote;
  });
  
  // Get all available fields for filtering
  const fields = [
    { id: "computer-science", name: "Computer Science" },
    { id: "business", name: "Business & Economics" },
    { id: "medicine", name: "Medicine & Health Sciences" },
    { id: "engineering", name: "Engineering" },
    { id: "arts", name: "Arts & Humanities" },
  ];
  
  // Get all available locations for filtering
  const locations = [
    "San Francisco, CA",
    "New York, NY",
    "Boston, MA",
    "Remote",
  ];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Internships
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Find and apply for internships in your field
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
              placeholder="Search internships..."
              className="pl-10 pr-4 py-2 w-full border-gray-200 dark:border-gray-700"
              defaultValue={searchQuery}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
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
            
            <select
              className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              defaultValue={locationFilter}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            
            <label className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                defaultChecked={remoteFilter}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span>Remote Only</span>
            </label>
            
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Internships List */}
      <div className="space-y-4">
        {filteredInternships.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No internships found matching your criteria
            </p>
            <Button variant="link" className="text-orange-600 dark:text-orange-500 mt-2">
              Clear filters
            </Button>
          </div>
        ) : (
          filteredInternships.map(internship => (
            <InternshipCard
              key={internship.id}
              internship={internship}
            />
          ))
        )}
      </div>
    </div>
  );
}