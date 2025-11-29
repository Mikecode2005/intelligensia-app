// components/mutations.ts - FIXED VERSION
"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { useToast } from "@/components/ui/use-toast";
import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "./actions"; // FIXED IMPORT PATH

export function useSubmitPostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useSession();

  console.log("🔄 useSubmitPostMutation initialized");

  const mutation = useMutation({
    mutationFn: async (input: { 
      content: string; 
      mediaUrls?: { url: string; type: string }[];
    }) => {
      console.log("🔄 Editor mutation function called with:", {
        contentLength: input.content.length,
        mediaUrls: input.mediaUrls?.length || 0,
        user: user?.name
      });

      if (!user) {
        throw new Error("You must be logged in to create a post");
      }

      try {
        // Submit post with URLs (your action already handles creating post + linking media)
        const result = await submitPost({
          content: input.content,
          mediaUrls: input.mediaUrls && input.mediaUrls.length > 0 ? input.mediaUrls : undefined
        });
        
        console.log("✅ submitPost returned:", result);
        return result;
      } catch (error) {
        console.error("❌ submitPost failed:", error);
        throw error; // Re-throw to let React Query handle it
      }
    },
    onMutate: (variables) => {
      console.log("🔄 Mutation starting:", variables);
      // Return context for potential rollback
      return { timestamp: Date.now() };
    },
    onSuccess: async (newPost, variables, context) => {
      console.log("✅ Editor mutation successful, updating cache for post:", newPost?.id);
      console.log("📊 Mutation context:", context);

      if (!newPost) {
        console.error("❌ No post returned from editor mutation");
        toast({
          variant: "destructive", 
          description: "Post created but failed to load",
        });
        return;
      }

      try {
        // Optimistically add the new post to the feed
        queryClient.setQueryData<InfiniteData<PostsPage>>(
          ["post-feed"],
          (oldData) => {
            console.log("🔄 Updating cache with new post");
            
            if (!oldData) {
              console.log("📝 No existing cache, creating new structure");
              return {
                pages: [{
                  posts: [newPost],
                  nextCursor: null
                }],
                pageParams: [null]
              };
            }

            // Add the new post to the first page
            const updatedPages = oldData.pages.map((page, index) => {
              if (index === 0) {
                console.log(`📝 Adding post to page ${index}`);
                return {
                  ...page,
                  posts: [newPost, ...page.posts]
                };
              }
              return page;
            });

            console.log("✅ Cache updated successfully");
            return {
              ...oldData,
              pages: updatedPages
            };
          }
        );

        console.log("✅ Cache updated with new post");

        toast({
          description: "Post created successfully!",
        });
      } catch (error) {
        console.error("❌ Error updating cache in editor:", error);
        // Fallback: invalidate and refetch
        await queryClient.invalidateQueries({ 
          queryKey: ["post-feed"] 
        });
        console.log("🔄 Cache invalidated as fallback");
      }
    },
    onError: (error, variables, context) => {
      console.error("❌ Editor mutation error:", {
        error: error instanceof Error ? error.message : error,
        variables,
        context
      });
      
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to post. Please try again.",
      });
    },
    onSettled: (data, error, variables, context) => {
      console.log("🏁 Mutation settled:", {
        hasData: !!data,
        hasError: !!error,
        context
      });
    },
  });

  return mutation;
}