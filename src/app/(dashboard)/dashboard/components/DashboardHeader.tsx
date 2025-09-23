import { User } from "@/lib/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BellIcon, MessageSquareIcon, SearchIcon } from "lucide-react";

interface DashboardHeaderProps {
  user: User;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-orange-500">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.displayName || "Profile"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-orange-100 text-orange-600 text-2xl font-bold">
              {user.displayName?.charAt(0) || user.username.charAt(0)}
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome back, {user.displayName || user.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your progress and explore opportunities
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500">
          <SearchIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500">
          <BellIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-500">
          <MessageSquareIcon className="h-5 w-5" />
        </Button>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
          Explore
        </Button>
      </div>
    </header>
  );
}