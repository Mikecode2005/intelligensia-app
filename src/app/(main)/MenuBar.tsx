import { validateRequest } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Bookmark, Home } from "lucide-react";
import Link from "next/link";
import MessagesButton from "./MessagesButton";
import NotificationsButton from "./NotificationsButton";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  let unreadNotificationsCount = 0;
  let unreadMessagesCount = 0;

  try {
    // Check if notification model exists and table is accessible
    if (prisma.notification) {
      try {
        unreadNotificationsCount = await prisma.notification.count({
          where: {
            recipientId: user.id,
            read: false,
          },
        });
      } catch (error: any) {
        // Handle table doesn't exist or other errors
        console.log('Notifications not available:', error.message);
        unreadNotificationsCount = 0;
      }
    } else {
      console.log('Notification model not available in Prisma client');
      unreadNotificationsCount = 0;
    }

    // For messages, default to 0 since Stream is having issues
    unreadMessagesCount = 0;

  } catch (error) {
    console.error('Error in MenuBar:', error);
    // Default values if anything fails
    unreadNotificationsCount = 0;
    unreadMessagesCount = 0;
  }

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      
      <MessagesButton
        initialState={{ unreadCount: unreadMessagesCount }}
      />
      
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
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
