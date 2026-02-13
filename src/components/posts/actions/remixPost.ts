// src/components/posts/actions/remixPost.ts - FIXED VERSION
"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function remixPost(originalPostId: string, newContent: string, mediaIds?: string[]) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (!newContent.trim()) {
      throw new Error("Content is required for remix");
    }

    console.log('🔄 Creating remix for post:', originalPostId);

    // Check if original post exists - FIXED: use 'author' instead of 'user'
    const originalPost = await prisma.post.findUnique({
      where: { id: originalPostId },
      include: {
        author: true, // Changed from 'user' to 'author'
      },
    });

    if (!originalPost) {
      throw new Error("Original post not found");
    }

    // Create the remix post
    const remixPost = await prisma.post.create({
      data: {
        content: newContent,
        authorId: user.id,
        isRemix: true,
        originalPostId: originalPostId,
        attachments: mediaIds?.length ? {
          connect: mediaIds.map(id => ({ id }))
        } : undefined,
      },
      include: getPostDataInclude(user.id),
    });

    console.log('✅ Remix created:', remixPost.id);

    // Create notification for original post author (if it's not the same user)
    if (user.id !== originalPost.authorId) {
      await prisma.notification.create({
        data: {
          type: "REMIX",
          content: `remixed your post: "${originalPost.content.substring(0, 50)}${originalPost.content.length > 50 ? '...' : ''}"`,
          recipientId: originalPost.authorId,
          senderId: user.id,
        },
      });
      console.log('📧 Notification created for original author');
    }

    // Revalidate relevant paths
    revalidatePath('/');
    revalidatePath('/posts');
    revalidatePath(`/posts/${originalPostId}`);
    revalidatePath(`/users/${user.username}`);

    return {
      success: true,
      post: remixPost,
    };
  } catch (error) {
    console.error("❌ Remix post error:", error);
    throw error;
  }
}

// Get remixes for a specific post
export async function getPostRemixes(postId: string) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      throw new Error("Unauthorized");
    }

    const remixes = await prisma.post.findMany({
      where: {
        originalPostId: postId,
        isRemix: true,
      },
      include: getPostDataInclude(user.id),
      orderBy: {
        createdAt: 'desc',
      },
    });

    return remixes;
  } catch (error) {
    console.error("Error fetching remixes:", error);
    throw error;
  }
}

// Check if user has remixed a post
export async function hasUserRemixedPost(postId: string) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return false;
    }

    const existingRemix = await prisma.post.findFirst({
      where: {
        originalPostId: postId,
        authorId: user.id,
        isRemix: true,
      },
    });

    return !!existingRemix;
  } catch (error) {
    console.error("Error checking remix status:", error);
    return false;
  }
}