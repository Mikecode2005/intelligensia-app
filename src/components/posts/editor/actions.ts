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

    // Create the post first without transaction to avoid timeout
    const post = await prisma.post.create({
      data: {
        content: content,
        authorId: user.id,
      }
    });

    console.log("✅ Server Action: Post created:", post.id);

    // Associate media attachments if provided (outside transaction)
    if (input.mediaUrls && input.mediaUrls.length > 0) {
      console.log("🔄 Server Action: Associating media:", input.mediaUrls);
      
      // Use createMany for better performance instead of individual upserts
      const attachmentData = input.mediaUrls.map(media => ({
        url: media.url,
        type: media.type,
        userId: user.id,
        postId: post.id
      }));

      await prisma.attachment.createMany({
        data: attachmentData,
        skipDuplicates: true // Skip if attachment with same URL already exists
      });

      console.log("✅ Server Action: Attachments created");
    }

    // Fetch complete post with relations
    const completePost = await prisma.post.findUnique({
      where: { id: post.id },
      include: getPostDataInclude(user.id),
    });

    console.log("✅ Server Action: Complete post with relations:", completePost?.id);
    console.log("🎉 Server Action: Post creation successful");
    
    // Revalidate the feed
    revalidatePath("/");
    revalidatePath("/feed");
    
    return completePost;

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
