import { Metadata } from "next";
import OnboardingForm from "./OnboardingForm";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Complete Your Profile - Intelligensia"
};

export default async function OnboardingPage() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
      <OnboardingForm user={session.user} />
    </main>
  );
}