// components/comments/Comment.tsx - WITH SAFE DATE HANDLING
"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import CommentMoreButton from "./CommentMoreButton";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useSession();

  // Safe access to author data
  const author = comment.author;
  
  if (!author) {
    return (
      <div className="group/comment flex gap-3 py-3">
        <div className="text-sm text-red-500">
          Error: Comment data incomplete
        </div>
      </div>
    );
  }

  const authorName = author.displayName || author.username || "Unknown User";
  const authorUsername = author.username || "unknown";

  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserTooltip user={author}>
          <Link href={`/users/${authorUsername}`}>
            <UserAvatar avatarUrl={author.avatarUrl} size={40} />
          </Link>
        </UserTooltip>
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={author}>
            <Link
              href={`/users/${authorUsername}`}
              className="font-medium hover:underline"
            >
              {authorName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
      {author.id === user?.id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}