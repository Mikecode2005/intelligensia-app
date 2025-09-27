import { Metadata } from "next";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClassroomHeader from "./components/ClassroomHeader";
import ClassroomOverview from "./components/ClassroomOverview";
import ClassroomDiscussions from "./components/ClassroomDiscussions";
import ClassroomAssignments from "./components/ClassroomAssignments";
import ClassroomResources from "./components/ClassroomResources";
import ClassroomStudySection from "./components/ClassroomStudySection";
import ClassroomWorkspace from "./components/ClassroomWorkspace";

export const metadata: Metadata = {
  title: "Classroom - Intelligensia",
  description: "Classroom details and resources"
};

export default async function ClassroomDetailPage({
  params
}: {
  params: { id: string }
}) {
  // Check if user is authenticated
  const { user } = await validateRequest();
  
  if (!user) {
    redirect("/login");
  }
  
  // In a real app, you would fetch classroom data from the database
  // For now, we'll use placeholder data
  const classroom = {
    id: params.id,
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Check if classroom exists
  if (!classroom) {
    notFound();
  }
  
  // Check if user is a member of the classroom
  if (!classroom.isMember) {
    redirect(`/classrooms?join=${params.id}`);
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <ClassroomHeader classroom={classroom} />
      
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <ClassroomOverview classroom={classroom} />
        </TabsContent>
        
        <TabsContent value="discussions">
          <ClassroomDiscussions classroomId={classroom.id} />
        </TabsContent>
        
        <TabsContent value="assignments">
          <ClassroomAssignments classroomId={classroom.id} />
        </TabsContent>
        
        <TabsContent value="resources">
          <ClassroomResources classroomId={classroom.id} />
        </TabsContent>
        
        <TabsContent value="study">
          <ClassroomStudySection classroomId={classroom.id} />
        </TabsContent>
        
        <TabsContent value="workspace">
          <ClassroomWorkspace classroomId={classroom.id} />
        </TabsContent>
        
        <TabsContent value="members">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Class Members</h2>
            <p className="text-gray-500 dark:text-gray-400">
              This section will display all members of the classroom.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}