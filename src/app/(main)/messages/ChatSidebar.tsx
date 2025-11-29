"use client";

import { useState } from "react";
import {
  Channel,
  ChannelList,
  ChannelListMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Plus, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import NewChatDialog from "./NewChatDialog";

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
}

const CustomChannelPreview = (props: ChannelPreviewUIComponentProps) => {
  const { channel, setActiveChannel } = props;
  const [lastMessage] = channel.state.messages.slice(-1);
  const unreadCount = channel.countUnread();

  return (
    <motion.div
      className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
      onClick={() => setActiveChannel?.(channel)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {channel.data?.name || "Unnamed Chat"}
            </p>
            {unreadCount > 0 && (
              <Badge className="bg-orange-500 text-white text-xs px-2 py-1">
                {unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {lastMessage?.text || "No messages yet"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const CustomChannelList = () => {
  return (
    <ChannelList
      List={ChannelListMessenger}
      Preview={CustomChannelPreview}
      filters={{
        type: "messaging",
        members: { $in: [""] },
      }}
      sort={{ last_message_at: -1 }}
    />
  );
};

export default function ChatSidebar({ open, onClose }: ChatSidebarProps) {
  const [showNewChat, setShowNewChat] = useState(false);
  const { client } = useChatContext();

  return (
    <motion.div
      className={cn(
        "h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50",
        open ? "translate-x-0" : "-translate-x-full"
      )}
      initial={false}
      animate={{ x: open ? 0 : -320 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search conversations..."
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border-0 rounded-lg"
              />
            </div>
            <Button
              size="sm"
              onClick={() => setShowNewChat(true)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto">
          <Channel>
            <CustomChannelList />
          </Channel>
        </div>

        {/* New Chat Dialog */}
        <NewChatDialog
          open={showNewChat}
          onOpenChange={setShowNewChat}
        />
      </div>
    </motion.div>
  );
}