// app/actions/submitPost.ts
"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function submitPost(input: {
  content: string;
  mediaUrls?: { url: string; type: string }[];
}) {
  console.log("🔄 Server Action: submitPost called with:", { 
    contentLength: input.content?.length,
    mediaUrls: input.mediaUrls 
  });

  try {
    const { user } = await validateRequest();
    if (!user) {
      console.error("❌ Server Action: Unauthorized user");
      throw new Error("Unauthorized");
    }

    // Validate content
    const content = input.content?.trim();
    if (!content || content.length === 0) {
      throw new Error("Content is required");
    }
    if (content.length > 10000) {
      throw new Error("Content too long");
    }

    console.log("✅ Server Action: Content validated, creating post...");

    // Use transaction for data consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the post
      const post = await tx.post.create({
        data: {
          content: content,
          authorId: user.id,
        }
      });

      console.log("✅ Server Action: Post created:", post.id);

      // 2. Associate media attachments if provided
      if (input.mediaUrls && input.mediaUrls.length > 0) {
        console.log("🔄 Server Action: Associating media:", input.mediaUrls);
        
        for (const media of input.mediaUrls) {
          // Upsert to handle if already exists (e.g., from onUploadComplete) or create new
          const attachment = await tx.attachment.upsert({
            where: { url: media.url },
            update: { 
              postId: post.id 
            },
            create: {
              url: media.url,
              type: media.type,
              userId: user.id,
              postId: post.id
            }
          });

          console.log("✅ Server Action: Upserted attachment:", attachment.id);
        }
      }

      // 3. Return complete post with relations
      const completePost = await tx.post.findUnique({
        where: { id: post.id },
        include: getPostDataInclude(user.id),
      });

      console.log("✅ Server Action: Complete post with relations:", completePost?.id);
      return completePost;
    });

    console.log("🎉 Server Action: Post creation successful");
    
    // Revalidate the feed
    revalidatePath("/");
    revalidatePath("/feed");
    
    return result;

  } catch (error) {
    console.error("❌ Server Action: Error in submitPost:", error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        throw new Error("Please log in to create a post");
      }
      throw new Error(error.message);
    }
    
    throw new Error("Failed to create post. Please try again.");
  }
}