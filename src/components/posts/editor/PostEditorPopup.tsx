// components/PostEditorPopup.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Minimize2 } from 'lucide-react';
import PostEditor from '@/components/posts/editor/PostEditor';
import { cn } from '@/lib/utils';
import { useSession } from '@/app/(main)/SessionProvider'; // Use your custom provider

export default function PostEditorPopup() {
  const { user, isLoading } = useSession(); // Use your custom session hook
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasScrolled, setHasScrolled] = useState(false);

  // Handle scroll to show/hide popup
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show popup when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 300 && !hasScrolled && user) {
        setHasScrolled(true);
        setIsMinimized(true);
      }
      
      // Hide when near top
      if (currentScrollY < 100) {
        setHasScrolled(false);
        setIsMinimized(false);
      }
      
      lastScrollY = currentScrollY;

      // Auto-minimize after scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (currentScrollY > 300 && !isOpen && user) {
          setIsMinimized(true);
        }
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isOpen, hasScrolled, user]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && isMinimized) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep within viewport bounds
      const boundedX = Math.max(10, Math.min(window.innerWidth - 70, newX));
      const boundedY = Math.max(10, Math.min(window.innerHeight - 70, newY));
      
      setPosition({ x: boundedX, y: boundedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const toggleOpen = () => {
    if (isMinimized) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const toggleMinimize = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(true);
    } else {
      setIsMinimized(!isMinimized);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Don't show if user is not authenticated or still loading
  if (isLoading || !user) {
    return null;
  }

  return (
    <>
      {/* Minimized Floating Button */}
      <AnimatePresence>
        {isMinimized && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 100 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed z-50 cursor-grab active:cursor-grabbing"
            style={{
              left: position.x,
              top: position.y,
            }}
            onMouseDown={handleMouseDown}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-full shadow-2xl shadow-orange-500/50",
                "border-2 border-white/20 backdrop-blur-sm",
                "flex items-center justify-center relative group"
              )}
              onClick={toggleOpen}
            >
              <MessageCircle className="h-6 w-6" />
              
              {/* Pulse animation */}
              <motion.div
                className="absolute inset-0 rounded-full bg-orange-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ zIndex: -1 }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Editor Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleClose}
            />

            {/* Editor Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <motion.div
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-t-2xl border-b border-gray-200 dark:border-gray-700"
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Create Post
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMinimize}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>

                {/* Editor Content */}
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-b-2xl overflow-y-auto max-h-[70vh]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <PostEditor />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fixed Create Post Button (for mobile/always visible) */}
      <motion.button
        className={cn(
          "fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-full shadow-2xl shadow-orange-500/50",
          "border-2 border-white/20 backdrop-blur-sm md:hidden",
          "flex items-center justify-center"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    </>
  );
}