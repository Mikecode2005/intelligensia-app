import { Metadata } from "next";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Company Dashboard - Intelligentsia",
};

export default async function CompanyRolePage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  return (
    <main className="container mx-auto px-4 py-8">
      <DashboardHeader user={user} />
      <h1 className="text-2xl font-bold mt-6">Company Portal</h1>
      <p className="text-sm text-slate-600 mt-2">Manage internships, jobs and company profile.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Link href="/internships" className="p-4 bg-white rounded-lg shadow">Post Internships</Link>
        <Link href="/jobs" className="p-4 bg-white rounded-lg shadow">Jobs</Link>
        <Link href="/company/profile" className="p-4 bg-white rounded-lg shadow">Company Profile</Link>
        <Link href="/dashboard" className="p-4 bg-white rounded-lg shadow">Dashboard</Link>
      </div>
    </main>
  );
}
