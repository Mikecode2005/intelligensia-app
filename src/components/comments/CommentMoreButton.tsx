// components/comments/CommentMoreButton.tsx
"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { CommentData } from "@/lib/types";
import { useDeleteCommentMutation } from "./mutations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CommentMoreButtonProps {
  comment: CommentData;
  className?: string;
}

export default function CommentMoreButton({ comment, className }: CommentMoreButtonProps) {
  const { user } = useSession();
  const deleteCommentMutation = useDeleteCommentMutation(comment.postId);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteCommentMutation.mutateAsync(comment.id);
      setIsOpen(false);
    } catch (error) {
      // Error is handled in the mutation
      console.error("Failed to delete comment:", error);
    }
  };

  // Only show for comment owner
  if (!user || comment.author.id !== user.id) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "rounded-full p-1 transition-colors hover:bg-accent",
            className
          )}
          disabled={deleteCommentMutation.isLoading}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={deleteCommentMutation.isLoading}
          className="text-destructive focus:text-destructive"
        >
          {deleteCommentMutation.isLoading ? "Deleting..." : "Delete Comment"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}