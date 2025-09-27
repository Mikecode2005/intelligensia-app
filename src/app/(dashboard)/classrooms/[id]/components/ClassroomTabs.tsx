"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import ClassroomOverview from "./ClassroomOverview";
import ClassroomDiscussions from "./ClassroomDiscussions";
import ClassroomAssignments from "./ClassroomAssignments";
import ClassroomResources from "./ClassroomResources";
import ClassroomStudySection from "./ClassroomStudySection";
import ClassroomWorkspace from "./ClassroomWorkspace";
import ClassroomMembers from "./ClassroomMembers";

interface ClassroomTabsProps {
  classroomId: string;
}

export default function ClassroomTabs({ classroomId }: ClassroomTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-6">
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
        <ClassroomOverview classroomId={classroomId} />
      </TabsContent>
      
      <TabsContent value="discussions">
        <ClassroomDiscussions classroomId={classroomId} />
      </TabsContent>
      
      <TabsContent value="assignments">
        <ClassroomAssignments classroomId={classroomId} />
      </TabsContent>
      
      <TabsContent value="resources">
        <ClassroomResources classroomId={classroomId} />
      </TabsContent>
      
      <TabsContent value="study">
        <ClassroomStudySection classroomId={classroomId} />
      </TabsContent>
      
      <TabsContent value="workspace">
        <ClassroomWorkspace classroomId={classroomId} />
      </TabsContent>
      
      <TabsContent value="members">
        <ClassroomMembers classroomId={classroomId} />
      </TabsContent>
    </Tabs>
  );
}