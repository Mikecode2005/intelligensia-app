"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PostEditor from "./PostEditor";

export default function PostEditorModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Blur Overlay - Only visible when modal is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsOpen(false);
              }
            }}
          >
            <div className="bg-[#121212] rounded-2xl border border-[#262626] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute bottom-4 right-4 z-10 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Header */}
              <div className="sticky top-0 bg-[#121212] border-b border-[#262626] p-4 z-10">
                <h2 className="text-lg font-bold text-white">Create a Post</h2>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <PostEditor
                  onSuccess={() => setIsOpen(false)}
                  isModal={true}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button - Card with PostEditor preview */}
      <div className="bg-[#121212] rounded-xl border border-[#262626] p-5">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full text-left"
        >
          <div className="flex gap-4">
            <div className="w-11 h-11 bg-[#262626] rounded-full flex-shrink-0" />
            <div className="flex-1">
              <div className="w-full bg-transparent border-none text-white placeholder-neutral-600 text-base p-3 rounded-lg hover:bg-white/5 transition-colors cursor-text">
                Share an insight, question, or research paper...
              </div>

              {/* Footer with action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#262626] mt-3">
                <div className="flex items-center gap-1">
                  <button className="p-2 text-neutral-500 hover:text-[#FF6B00] hover:bg-white/5 rounded-lg transition-all">
                    <span className="material-symbols-outlined text-[22px]">image</span>
                  </button>
                  <button className="p-2 text-neutral-500 hover:text-[#FF6B00] hover:bg-white/5 rounded-lg transition-all">
                    <span className="material-symbols-outlined text-[22px]">attachment</span>
                  </button>
                  <button className="p-2 text-neutral-500 hover:text-[#FF6B00] hover:bg-white/5 rounded-lg transition-all">
                    <span className="material-symbols-outlined text-[22px]">link</span>
                  </button>
                  <button className="p-2 text-neutral-500 hover:text-[#FF6B00] hover:bg-white/5 rounded-lg transition-all">
                    <span className="material-symbols-outlined text-[22px]">tag</span>
                  </button>
                </div>

                <button className="bg-[#FF6B00] text-black px-8 py-2 rounded-lg text-sm font-bold hover:bg-[#E66000] transition-all">
                  Post
                </button>
              </div>
            </div>
          </div>
        </button>
      </div>
    </>
  );
}
