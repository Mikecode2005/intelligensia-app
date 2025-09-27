import { useSession } from "@/app/(main)/SessionProvider";
import { useToast } from "@/components/ui/use-toast";
import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "./actions";

export function useSubmitPostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      console.log("✅ Mutation successful, updating cache for post:", newPost.id);

      try {
        // Method 1: Simple invalidation (most reliable)
        await queryClient.invalidateQueries({ 
          queryKey: ["post-feed"] 
        });

        // Method 2: More targeted optimistic update (if you want to keep it)
        updateCacheOptimistically(queryClient, user.id, newPost);

        toast({
          description: "Post created successfully",
        });
      } catch (error) {
        console.error("Error updating cache:", error);
        // Fallback: invalidate everything related to posts
        await queryClient.invalidateQueries({ 
          predicate: (query) => 
            query.queryKey.some(key => 
              typeof key === 'string' && key.includes('post')
            )
        });
      }
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to post. Please try again.",
      });
    },
    // Add optimistic updates for better UX
    onMutate: async (variables) => {
      console.log("🔄 Starting optimistic update for:", variables.content);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['post-feed'] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(['post-feed']);

      // Optimistically add to cache
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        { queryKey: ['post-feed'] },
        (oldData) => {
          if (!oldData?.pages[0]) {
            // Create initial structure if it doesn't exist
            return {
              pageParams: [null],
              pages: [{
                posts: [{
                  ...variables,
                  id: 'optimistic-' + Date.now(),
                  author: user,
                  authorId: user.id,
                  createdAt: new Date(),
                  likes: [],
                  likesCount: 0,
                  comments: [],
                  attachments: [],
                  bookmarks: [],
                  _count: { likes: 0, comments: 0 }
                }],
                nextCursor: null,
              }]
            };
          }

          const firstPage = oldData.pages[0];
          return {
            ...oldData,
            pages: [
              {
                ...firstPage,
                posts: [
                  {
                    ...variables,
                    id: 'optimistic-' + Date.now(),
                    author: user,
                    authorId: user.id,
                    createdAt: new Date(),
                    likes: [],
                    likesCount: 0,
                    comments: [],
                    attachments: [],
                    bookmarks: [],
                    _count: { likes: 0, comments: 0 }
                  },
                  ...firstPage.posts,
                ],
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      );

      return { previousPosts };
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['post-feed'] });
    },
  });

  return mutation;
}

// Helper function for optimistic cache updates
function updateCacheOptimistically(
  queryClient: any, 
  userId: string, 
  newPost: any
) {
  try {
    const queryFilter = {
      queryKey: ["post-feed"],
    };

    queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
      queryFilter,
      (oldData) => {
        if (!oldData?.pages?.length) {
          console.log("No existing data, creating new cache structure");
          return {
            pageParams: [null],
            pages: [{
              posts: [newPost],
              nextCursor: null,
            }]
          };
        }

        console.log("Updating existing cache with new post");
        const firstPage = oldData.pages[0];
        
        // Check if post already exists to avoid duplicates
        const postExists = firstPage.posts.some(post => post.id === newPost.id);
        if (postExists) {
          console.log("Post already exists in cache, skipping");
          return oldData;
        }

        return {
          ...oldData,
          pages: [
            {
              ...firstPage,
              posts: [newPost, ...firstPage.posts],
            },
            ...oldData.pages.slice(1),
          ],
        };
      }
    );
  } catch (error) {
    console.error("Error in optimistic cache update:", error);
  }
}