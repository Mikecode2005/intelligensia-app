import { Metadata } from "next";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardHeader from "./components/DashboardHeader";
import PerformanceMetrics from "./components/PerformanceMetrics";
import RecentActivity from "./components/RecentActivity";
import UpcomingEvents from "./components/UpcomingEvents";
import RecommendedContent from "./components/RecommendedContent";

export const metadata: Metadata = {
  title: "Dashboard - Intelligensia"
};

export default async function DashboardPage() {
  // Check if user is authenticated
  const { user } = await validateRequest();
  
  if (!user) {
    redirect("/login");
  }
  
  // Fetch user's performance data
  const performance = await prisma.performance.findUnique({
    where: { userId: user.id },
  });
  
  // Fetch user's fields of interest - CORRECTED
  const userWithFields = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      userFields: { // Changed from "fields" to "userFields"
        include: {
          field: true // Include the actual field data
        }
      },
    },
  });
  
  // If user hasn't completed onboarding (selected fields), redirect to onboarding
  if (!userWithFields?.userFields || userWithFields.userFields.length === 0) {
    redirect("/onboarding");
  }
  
  // Extract the actual field objects from the join table
  const fields = userWithFields.userFields.map(uf => uf.field);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <DashboardHeader user={user} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Main content - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <PerformanceMetrics performance={performance} />
          <RecentActivity userId={user.id} />
        </div>
        
        {/* Sidebar - 1/3 width on large screens */}
        <div className="space-y-6">
          <UpcomingEvents userId={user.id} />
          <RecommendedContent fields={fields} />
        </div>
      </div>
    </main>
  );
}