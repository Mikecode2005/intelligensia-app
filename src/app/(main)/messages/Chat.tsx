"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes";
import { useState } from "react";
import { Chat as StreamChat } from "stream-chat-react";
import ChatChannel from "./ChatChannel";
import ChatSidebar from "./ChatSidebar";
import useInitializeChatClient from "./useInitializeChatClient";
import { motion } from "framer-motion";

export default function Chat() {
  const chatClient = useInitializeChatClient();
  const { resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!chatClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">Loading chat...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.main
      className="relative w-full h-[calc(100vh-4rem)] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white/50 to-amber-50/50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <div className="flex h-full">
            <motion.div
              className={cn(
                "transition-all duration-300",
                sidebarOpen ? "w-80" : "w-0"
              )}
            >
              <ChatSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.div>
            
            <motion.div
              className="flex-1"
              animate={{ x: sidebarOpen ? 0 : -320 }}
              transition={{ duration: 0.3 }}
            >
              <ChatChannel
                open={!sidebarOpen}
                openSidebar={() => setSidebarOpen(true)}
              />
            </motion.div>
          </div>
        </StreamChat>
      </div>
    </motion.main>
  );
}