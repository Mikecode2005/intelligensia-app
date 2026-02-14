"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import Link from "next/link";

interface DashboardLinkProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardLink({ children, className }: DashboardLinkProps) {
  const { user } = useSession();

  // Map userType to dashboard path
  const getDashboardPath = () => {
    const roleMap: Record<string, string> = {
      STUDENT: "/roles/student/dashboard",
      LECTURER: "/roles/lecturer/dashboard",
      TUTOR: "/roles/tutor/dashboard",
      COMPANY: "/roles/company/dashboard",
      WORKER: "/roles/worker/dashboard",
      ORGANIZATION: "/roles/organization/dashboard",
    };

    return roleMap[user?.userType || "STUDENT"] || "/roles/student/dashboard";
  };

  return (
    <Link href={getDashboardPath()} className={className}>
      {children}
    </Link>
  );
}
