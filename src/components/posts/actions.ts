// actions/deletePost.ts - FIXED FIELD NAME
"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";

export async function deletePost(id: string) {
  console.log("🗑️ Delete post called with ID:", id);
  
  const { user } = await validateRequest();
  console.log("👤 User from validateRequest:", { 
    userId: user?.id, 
    username: user?.username 
  });

  if (!user) {
    console.error("❌ Unauthorized: No user found");
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  console.log("📝 Post found:", { 
    postId: post?.id, 
    // Check both fields to see what's actually in the database
    postUserId: post?.userId,
    postAuthorId: post?.authorId
  });

  if (!post) {
    console.error("❌ Post not found");
    throw new Error("Post not found");
  }

  // FIX: Check which field actually exists in your database
  const postOwnerId = post.authorId || post.userId;
  
  console.log("🔍 Comparing user IDs:", {
    postOwnerId,
    currentUserId: user.id,
    match: postOwnerId === user.id
  });

  if (postOwnerId !== user.id) {
    console.error("❌ Unauthorized: User doesn't own post");
    throw new Error("Unauthorized");
  }

  console.log("✅ Authorization passed, deleting post...");

  try {
    const deletedPost = await prisma.post.delete({
      where: { id },
      include: getPostDataInclude(user.id),
    });

    console.log("✅ Post deleted successfully:", deletedPost.id);
    return deletedPost;
  } catch (error) {
    console.error("❌ Database error during delete:", error);
    throw new Error("Failed to delete post");
  }
}