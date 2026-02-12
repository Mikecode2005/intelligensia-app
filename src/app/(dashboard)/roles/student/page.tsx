import { Metadata } from "next";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Student Dashboard - Intelligentsia",
};

export default async function StudentRolePage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  return (
    <main className="container mx-auto px-4 py-8">
      <DashboardHeader user={user} />
      <h1 className="text-2xl font-bold mt-6">Student Portal</h1>
      <p className="text-sm text-slate-600 mt-2">Quick links tailored for students.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Link href="/dashboard" className="p-4 bg-white rounded-lg shadow">Dashboard</Link>
        <Link href="/classrooms" className="p-4 bg-white rounded-lg shadow">My Classrooms</Link>
        <Link href="/study-groups" className="p-4 bg-white rounded-lg shadow">Study Groups</Link>
        <Link href="/internships" className="p-4 bg-white rounded-lg shadow">Internships</Link>
      </div>
    </main>
  );
}
