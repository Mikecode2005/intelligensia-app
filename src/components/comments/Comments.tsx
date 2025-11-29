// components/comments/Comments.tsx - WITH COMMENT LOADING
"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { CommentData } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import Comment from "./Comment";

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const { user } = useSession();
  const { toast } = useToast();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  // Load existing comments when component mounts
  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments || []);
          console.log("✅ Loaded comments:", data.comments?.length || 0);
        } else {
          console.error("Failed to fetch comments");
          toast({
            variant: "destructive",
            description: "Failed to load comments",
          });
        }
      } catch (error) {
        console.error("Error loading comments:", error);
        toast({
          variant: "destructive",
          description: "Error loading comments",
        });
      } finally {
        setIsLoadingComments(false);
      }
    };

    loadComments();
  }, [postId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        description: "Please sign in to comment",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        variant: "destructive",
        description: "Comment cannot be empty",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post comment");
      }

      const { comment } = await response.json();
      
      // Add new comment to the list
      setComments(prev => [comment, ...prev]);
      setContent("");
      
      toast({
        description: "Comment posted successfully!",
      });
    } catch (error) {
      console.error("Comment error:", error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <Send className="size-4" />
        </button>
      </form>

      {/* Comments list */}
      <div className="space-y-3">
        {isLoadingComments ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading comments...</p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
            
            {comments.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}