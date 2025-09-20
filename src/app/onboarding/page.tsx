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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-500">
              Welcome to Intelligensia!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Let's set up your profile to help you connect with like-minded students and find relevant content.
            </p>
          </div>
          
          <OnboardingForm user={session.user} />
        </div>
      </div>
    </main>
  );
}