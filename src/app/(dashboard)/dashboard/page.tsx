import { Metadata } from "next";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardLayout from "./components/DashboardLayout";

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

  return <DashboardLayout user={user} performance={performance} fields={fields} />;
}
