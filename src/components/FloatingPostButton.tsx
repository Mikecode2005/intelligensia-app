"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PostEditor from "@/components/posts/editor/PostEditor";

export default function FloatingPostButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Post Button - Bottom Right */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#FF6B00] text-black shadow-lg hover:shadow-xl hover:bg-[#E66000] transition-all flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Create Post"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-0"
            >
              <div className="bg-[#121212] rounded-t-2xl md:rounded-2xl border border-[#262626] w-full md:max-w-2xl md:max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-[#121212] border-b border-[#262626] p-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Create a Post</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  <PostEditor
                    onSuccess={() => setIsOpen(false)}
                    isModal={true}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
