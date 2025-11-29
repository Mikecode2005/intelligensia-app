// components/posts/RemixButton.tsx - UPDATED WITH MUTATION
"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { useToast } from "@/components/ui/use-toast";
import { Repeat2 } from "lucide-react";
import { useState } from "react";
import { useRemixPostMutation } from "./mutations";

interface RemixButtonProps {
  postId: string;
  postContent: string;
  remixesCount?: number;
}

export default function RemixButton({ postId, postContent, remixesCount = 0 }: RemixButtonProps) {
  const { user } = useSession();
  const { toast } = useToast();
  const remixMutation = useRemixPostMutation();
  const [showRemixModal, setShowRemixModal] = useState(false);
  const [remixContent, setRemixContent] = useState("");

  const handleRemix = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "Please sign in to remix posts",
      });
      return;
    }

    setShowRemixModal(true);
  };

  const submitRemix = async () => {
    if (!remixContent.trim()) {
      toast({
        variant: "destructive",
        description: "Please add your thoughts to remix this post",
      });
      return;
    }

    try {
      await remixMutation.mutateAsync({
        postId,
        content: remixContent,
      });
      
      setShowRemixModal(false);
      setRemixContent("");
      
      // No need to refresh the page - cache will update automatically
    } catch (error) {
      // Error is handled in the mutation
      console.error("Remix error:", error);
    }
  };

  return (
    <>
      <button
        onClick={handleRemix}
        disabled={remixMutation.isPending}
        className="flex items-center gap-2 transition-colors hover:text-green-500 disabled:opacity-50"
      >
        <Repeat2 className="size-5" />
        <span className="text-sm font-medium tabular-nums">
          {remixesCount} <span className="hidden sm:inline">remixes</span>
        </span>
      </button>

      {/* Remix Modal */}
      {showRemixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Remix Post</h3>
            
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Original post:</p>
              <p className="text-sm">{postContent}</p>
            </div>

            <textarea
              value={remixContent}
              onChange={(e) => setRemixContent(e.target.value)}
              placeholder="Add your thoughts..."
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800"
              disabled={remixMutation.isPending}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRemixModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                disabled={remixMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={submitRemix}
                disabled={remixMutation.isPending || !remixContent.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {remixMutation.isPending ? "Remixing..." : "Post Remix"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}