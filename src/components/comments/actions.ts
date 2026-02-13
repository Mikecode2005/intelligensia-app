// components/comments/actions.ts - FIXED VERSION
"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function submitComment(input: {
  postId: string;
  content: string;
}) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (!input.content?.trim()) {
      throw new Error("Comment content is required");
    }

    // Verify the post exists
    const post = await prisma.post.findUnique({
      where: { id: input.postId },
      select: { id: true, authorId: true },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: input.content.trim(),
        authorId: user.id,
        postId: input.postId,
      },
      include: getCommentDataInclude(user.id),
    });

    // Create notification if not commenting on own post
    if (user.id !== post.authorId) {
      await prisma.notification.create({
        data: {
          type: "COMMENT",
          content: `commented on your post`,
          recipientId: post.authorId,
          senderId: user.id,
        },
      });
    }

    // Revalidate the post page
    revalidatePath(`/posts/${input.postId}`);

    return comment;
  } catch (error) {
    console.error("Submit comment error:", error);
    throw error;
  }
}

export async function deleteComment(commentId: string) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Find the comment first to check ownership
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        author: true,
      },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if user owns the comment
    if (comment.authorId !== user.id) {
      throw new Error("Unauthorized");
    }

    // Delete the comment
    const deletedComment = await prisma.comment.delete({
      where: { id: commentId },
      include: getCommentDataInclude(user.id),
    });

    // Revalidate the post page
    revalidatePath(`/posts/${deletedComment.postId}`);

    return deletedComment;
  } catch (error) {
    console.error("Delete comment error:", error);
    throw error;
  }
}