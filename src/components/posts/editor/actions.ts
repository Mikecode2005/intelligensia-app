// src/components/posts/editor/actions.ts
"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { z } from "zod";

console.log("🔧 Post editor actions loaded");

// Main submitPost function with comprehensive debugging
export async function submitPost(input: {
  content: string;
  mediaIds?: string[];
}) {
  const debugId = Math.random().toString(36).substring(7); // Unique ID for this request
  console.log(`🔍 [${debugId}] START submitPost`, {
    input: { ...input, contentLength: input.content?.length },
    timestamp: new Date().toISOString()
  });

  try {
    // Step 1: Validate user authentication
    console.log(`🔍 [${debugId}] Step 1: Validating user authentication`);
    const { user } = await validateRequest();
    
    console.log(`🔍 [${debugId}] User validation result:`, {
      hasUser: !!user,
      userId: user?.id,
      username: user?.username
    });

    if (!user) {
      console.error(`❌ [${debugId}] User authentication failed`);
      throw new Error("Unauthorized");
    }

    // Step 2: Validate input content
    console.log(`🔍 [${debugId}] Step 2: Validating input content`);
    const content = input.content?.trim();
    console.log(`🔍 [${debugId}] Content validation:`, {
      originalLength: input.content?.length,
      trimmedLength: content?.length,
      isEmpty: !content || content.length === 0
    });

    if (!content || content.length === 0) {
      console.error(`❌ [${debugId}] Content validation failed - empty content`);
      throw new Error("Content is required");
    }

    if (content.length > 10000) {
      console.error(`❌ [${debugId}] Content too long: ${content.length} characters`);
      throw new Error("Content too long");
    }

    // Step 3: Prepare post data
    console.log(`🔍 [${debugId}] Step 3: Preparing post data`);
    const postData: any = {
      content: content,
      authorId: user.id,
    };

    console.log(`🔍 [${debugId}] Base post data:`, {
      contentLength: postData.content.length,
      authorId: postData.authorId
    });

    // Step 4: Handle media attachments if provided
    if (input.mediaIds && input.mediaIds.length > 0) {
      console.log(`🔍 [${debugId}] Step 4: Processing media attachments`, {
        mediaIds: input.mediaIds,
        mediaCount: input.mediaIds.length
      });

      // Check if attachments exist in database
      const existingAttachments = await prisma.attachment.findMany({
        where: { id: { in: input.mediaIds } },
        select: { id: true, url: true, type: true }
      });

      console.log(`🔍 [${debugId}] Found existing attachments:`, {
        requested: input.mediaIds.length,
        found: existingAttachments.length,
        existingIds: existingAttachments.map(a => a.id)
      });

      if (existingAttachments.length > 0) {
        postData.attachments = {
          connect: existingAttachments.map(att => ({ id: att.id })),
        };
        console.log(`🔍 [${debugId}] Connected attachments to post`);
      } else {
        console.log(`⚠️ [${debugId}] No existing attachments found, creating post without attachments`);
      }
    } else {
      console.log(`🔍 [${debugId}] No mediaIds provided, creating text-only post`);
    }

    // Step 5: Create the post in database
    console.log(`🔍 [${debugId}] Step 5: Creating post in database`);
    console.log(`🔍 [${debugId}] Final post data:`, {
      contentLength: postData.content.length,
      hasAttachments: !!postData.attachments,
      attachmentCount: postData.attachments?.connect?.length || 0
    });

    const newPost = await prisma.post.create({
      data: postData,
      include: getPostDataInclude(user.id),
    });

    console.log(`✅ [${debugId}] Post created successfully:`, {
      postId: newPost.id,
      authorId: newPost.authorId,
      contentLength: newPost.content.length,
      createdAt: newPost.createdAt,
      hasAttachments: newPost.attachments?.length || 0
    });

    // Step 6: Verify the post was actually saved
    console.log(`🔍 [${debugId}] Step 6: Verifying post persistence`);
    const verifiedPost = await prisma.post.findUnique({
      where: { id: newPost.id },
      select: { 
        id: true, 
        content: true, 
        authorId: true, 
        createdAt: true,
        _count: { select: { attachments: true } }
      },
    });

    if (verifiedPost) {
      console.log(`✅ [${debugId}] Post verification SUCCESS:`, {
        postId: verifiedPost.id,
        contentLength: verifiedPost.content.length,
        attachmentCount: verifiedPost._count.attachments,
        persisted: true
      });
    } else {
      console.error(`❌ [${debugId}] CRITICAL: Post verification FAILED - post not found in database!`);
      throw new Error("Post was created but not persisted to database");
    }

    // Step 7: Return the result
    console.log(`✅ [${debugId}] COMPLETE: Post created and verified successfully`);
    return newPost;

  } catch (error) {
    console.error(`❌ [${debugId}] ERROR in submitPost:`, {
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Provide user-friendly error messages
    if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Validation error: ${errorDetails}`);
    }

    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        throw new Error("Please log in to create a post");
      }
      if (error.message.includes('database') || error.message.includes('prisma')) {
        throw new Error("Database error occurred. Please try again.");
      }
    }

    throw new Error("Failed to create post. Please try again.");
  }
}

// Debug function to check recent posts
export async function debugCheckRecentPosts() {
  console.log("🔍 [DEBUG] Checking recent posts in database...");
  
  try {
    const { user } = await validateRequest();
    
    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, username: true, displayName: true } },
        attachments: true,
        _count: {
          select: { 
            likes: true, 
            comments: true,
            bookmarks: true
          }
        }
      },
    });

    console.log("📊 [DEBUG] Recent posts analysis:", {
      totalPostsFound: recentPosts.length,
      posts: recentPosts.map((post, index) => ({
        index: index + 1,
        id: post.id,
        author: post.author.username,
        contentPreview: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
        createdAt: post.createdAt.toISOString(),
        attachments: post.attachments.length,
        likes: post._count.likes,
        comments: post._count.comments,
        bookmarks: post._count.bookmarks
      }))
    });

    return recentPosts;
  } catch (error) {
    console.error("❌ [DEBUG] Error checking recent posts:", error);
    return [];
  }
}

// Simple version without attachments for testing
export async function submitSimplePost(content: string) {
  console.log("🔧 Testing simple post creation with content:", content?.substring(0, 50) + '...');
  
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized");

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        authorId: user.id,
      },
    });

    console.log("✅ Simple post created:", { id: post.id, contentLength: post.content.length });
    return post;
  } catch (error) {
    console.error("❌ Simple post failed:", error);
    throw error;
  }
}

// Health check function
export async function checkDatabaseHealth() {
  console.log("🏥 Checking database health...");
  
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count();
    
    console.log("🏥 Database health check:", {
      status: "HEALTHY",
      userCount,
      postCount,
      timestamp: new Date().toISOString()
    });
    
    return { healthy: true, userCount, postCount };
  } catch (error) {
    console.error("🏥 Database health check FAILED:", error);
    return { healthy: false, error: String(error) };
  }
}