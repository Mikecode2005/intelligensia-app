import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardSidebar from "./DashboardSidebar";
import Navbar from "@/app/(main)/Navbar";
import SessionProvider from "@/app/(main)/SessionProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }
  
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-black flex flex-col">
        {/* Navbar - full width at top */}
        <Navbar />
        
        {/* Main Content with Sidebar */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar - fixed below navbar, only visible on desktop or when toggled on mobile */}
          <DashboardSidebar user={session.user} />
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto w-full md:ml-64">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
