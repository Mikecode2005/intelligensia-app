import { validateRequest } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { 
  Home, 
  TrendingUp, 
  Users, 
  Award, 
  Briefcase, 
  BookOpen, 
  MessageCircle, 
  Settings,
  Bookmark 
} from "lucide-react";
import Link from "next/link";
import MessagesButton from "./MessagesButton";
import NotificationsButton from "./NotificationsButton";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 hover:bg-orange-50 hover:text-orange-600"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 hover:bg-orange-50 hover:text-orange-600"
        title="Dashboard"
        asChild
      >
        <Link href="/dashboard">
          <TrendingUp />
          <span className="hidden lg:inline">Dashboard</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 hover:bg-orange-50 hover:text-orange-600"
        title="Connect"
        asChild
      >
        <Link href="/connect">
          <Users />
          <span className="hidden lg:inline">Connect</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 hover:bg-orange-50 hover:text-orange-600"
        title="Scholarships"
        asChild
      >
        <Link href="/scholarships">
          <Award />
          <span className="hidden lg:inline">Scholarships</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 hover:bg-orange-50 hover:text-orange-600"
        title="Internships"
        asChild
      >
        <Link href="/internships">
          <Briefcase />
          <span className="hidden lg:inline">Internships</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 hover:bg-orange-50 hover:text-orange-600"
        title="Classroom"
        asChild
      >
        <Link href="/classroom">
          <BookOpen />
          <span className="hidden lg:inline">Classroom</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 hover:bg-orange-50 hover:text-orange-600"
        title="Settings"
        asChild
      >
        <Link href="/settings">
          <Settings />
          <span className="hidden lg:inline">Settings</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 hover:bg-orange-50 hover:text-orange-600"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
