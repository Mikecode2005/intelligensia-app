import { Metadata } from "next";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lecturer Dashboard - Intelligentsia",
};

export default async function LecturerRolePage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  return (
    <main className="container mx-auto px-4 py-8">
      <DashboardHeader user={user} />
      <h1 className="text-2xl font-bold mt-6">Lecturer Portal</h1>
      <p className="text-sm text-slate-600 mt-2">Tools for course management and students.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Link href="/dashboard" className="p-4 bg-white rounded-lg shadow">Dashboard</Link>
        <Link href="/classrooms" className="p-4 bg-white rounded-lg shadow">My Courses</Link>
        <Link href="/assignments" className="p-4 bg-white rounded-lg shadow">Assignments</Link>
        <Link href="/resources" className="p-4 bg-white rounded-lg shadow">Resources</Link>
      </div>
    </main>
  );
}
