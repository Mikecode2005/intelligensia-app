import { Metadata } from "next";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Worker Dashboard - Intelligentsia",
};

export default async function WorkerRolePage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  return (
    <main className="container mx-auto px-4 py-8">
      <DashboardHeader user={user} />
      <h1 className="text-2xl font-bold mt-6">Worker Portal</h1>
      <p className="text-sm text-slate-600 mt-2">Jobs, upskilling and networking for workers.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Link href="/jobs" className="p-4 bg-white rounded-lg shadow">Jobs</Link>
        <Link href="/internships" className="p-4 bg-white rounded-lg shadow">Internships</Link>
        <Link href="/resources" className="p-4 bg-white rounded-lg shadow">Training Resources</Link>
        <Link href="/dashboard" className="p-4 bg-white rounded-lg shadow">Dashboard</Link>
      </div>
    </main>
  );
}
