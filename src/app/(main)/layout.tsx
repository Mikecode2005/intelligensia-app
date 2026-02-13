import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "./Navbar";
import SessionProvider from "./SessionProvider";
import "../globals.css";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the session using NextAuth
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // send unauthenticated users to login
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[#101622] text-white font-sans">
        <Navbar />
        {children}
      </div>
    </SessionProvider>
  );
}
