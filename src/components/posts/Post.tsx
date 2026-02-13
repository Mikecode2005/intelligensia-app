"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media } from "@prisma/client";
import { MessageSquare, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Comments from "../comments/Comments";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import PostMoreButton from "./PostMoreButton";
import RemixButton from "./RemixButton";
import { Repeat2 } from "lucide-react";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();
  const [showComments, setShowComments] = useState(false);

  // CRITICAL: Always check if post exists and has an ID
  if (!post || !post.id) {
    return (
      <div className="rounded-2xl bg-card p-5 shadow-sm text-red-500">
        Error: Post data is invalid
      </div>
    );
  }

  const author = post.author;
  const authorName = author?.displayName || author?.username || "Unknown User";
  const authorUsername = author?.username || "unknown";
  const authorAvatar = author?.avatarUrl;
  const isOwnPost = author?.id === user?.id;

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <UserTooltip user={author}>
            <Link href={`/users/${authorUsername}`}>
              <UserAvatar avatarUrl={authorAvatar} />
            </Link>
          </UserTooltip>
          <div className="flex items-center gap-2">
            <UserTooltip user={author}>
              <Link
                href={`/users/${authorUsername}`}
                className="block font-medium hover:underline"
              >
                {authorName}
              </Link>
            </UserTooltip>
            
            {isOwnPost && (
              <span className="inline-flex items-center gap-1 rounded-full bg-ui2-primary/10 px-2 py-1 text-xs font-medium text-ui2-primary dark:bg-ui2-primary/20 dark:text-ui2-primary">
                <User className="size-3" />
                You
              </span>
            )}
          </div>
        </div>
        
        {isOwnPost && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>

      <Link
        href={`/posts/${post.id}`}
        className="block text-sm text-muted-foreground hover:underline"
        suppressHydrationWarning
      >
        {formatRelativeDate(post.createdAt)}
      </Link>

      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>

      {/* Remix origin indicator */}
      {post.isRemix && post.originalPost && (
        <div className="flex items-center gap-2 rounded-lg bg-ui2-primary/10 dark:bg-ui2-primary/20 p-3 text-sm text-ui2-primary">
          <Repeat2 className="size-4" />
          <span>
            Remixed from{" "}
            <Link
              href={`/posts/${post.originalPost.id}`}
              className="font-medium hover:underline"
            >
              {post.originalPost.author.displayName || post.originalPost.author.username}
              's post
            </Link>
          </span>
        </div>
      )}

      {!!post.attachments?.length && (
        <MediaPreviews attachments={post.attachments} />
      )}

      <hr className="text-muted-foreground" />
      
      {/* ⭐⭐ UPDATED ACTION BUTTONS WITH REMIXBUTTON ⭐⭐ */}
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count?.likes || 0,
              isLikedByUser:
                post.likes?.some((like) => like.userId === user?.id) || false,
            }}
          />
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 transition-colors hover:text-ui2-primary"
          >
            <MessageSquare className="size-5" />
            <span className="text-sm font-medium tabular-nums">
              {post._count?.comments || 0} comments
            </span>
          </button>
          {/* ⭐⭐ ADDED REMIXBUTTON HERE ⭐⭐ */}
          <RemixButton
            postId={post.id}
            postContent={post.content}
            remixesCount={post._count?.remixes || 0}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser:
              post.bookmarks?.some(
                (bookmark) => bookmark.userId === user?.id
              ) || false,
          }}
        />
      </div>

      {/* ALWAYS pass postId - this is the key fix */}
      {showComments && <Comments postId={post.id} />}
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2"
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  // Normalize media type to lowercase
  const type = media.type?.toLowerCase();

  if (type === "image") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (type === "video") {
    return (
      <video
        src={media.url}
        controls
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (type === "pdf" || type === "document") {
    return (
      <a
        href={media.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 underline"
      >
        View Document
      </a>
    );
  }

  return (
    <p className="text-muted-foreground text-sm">
      Unsupported media type: {media.type}
    </p>
  );
}

