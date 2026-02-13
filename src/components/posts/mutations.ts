// components/posts/mutations.ts - COMPLETELY FIXED
import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { deletePost } from "./actions";
import { remixPost } from "./actions/remixPost";
import { useSession } from "@/app/(main)/SessionProvider";

// Fixed upload function - handles new response structure
async function uploadFileDirect(file: File, slug: string, timeoutMs = 30000) {
  const formData = new FormData();
  formData.append("files", file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log(`📤 Uploading file to ${slug}:`, {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    const response = await fetch(`/api/uploadthing?slug=${slug}`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Upload successful for ${slug}:`, data);
    
    // ⭐⭐ FIXED: Handle the correct response structure ⭐⭐
    // Upload endpoint returns the data directly, not nested in an array
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error(`Upload timed out after ${timeoutMs}ms`);
    }
    
    console.error(`❌ Upload failed for ${slug}:`, error);
    throw error;
  }
}

export function useDeletePostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: async (postId: string) => {
      console.log("🔄 Delete mutation called for post:", postId);
      const result = await deletePost(postId);
      console.log("✅ deletePost returned:", result);
      return result;
    },
    onSuccess: async (deletedPost, postId) => {
      console.log("✅ Delete mutation successful for post:", deletedPost?.id);

      if (!deletedPost) {
        console.error("❌ No post returned from delete mutation");
        toast({
          variant: "destructive",
          description: "Failed to delete post",
        });
        return;
      }

      try {
        // Method 1: Optimistic update by removing from cache
        queryClient.setQueryData<InfiniteData<PostsPage>>(
          ["post-feed"], 
          (oldData) => {
            if (!oldData) return oldData;

            console.log("🔄 Removing post from cache:", postId);
            
            const updatedPages = oldData.pages.map(page => ({
              ...page,
              posts: page.posts.filter(post => post.id !== postId)
            })).filter(page => page.posts.length > 0); // Remove empty pages

            return {
              ...oldData,
              pages: updatedPages
            };
          }
        );

        console.log("✅ Cache updated, post removed from feed");

        // Also invalidate any post-specific queries
        await queryClient.invalidateQueries({
          predicate: (query) => {
            return (
              query.queryKey[0] === "post-feed" ||
              (Array.isArray(query.queryKey) && 
               query.queryKey.some(key => 
                 typeof key === 'string' && key.includes('post')
               ))
            );
          },
        });

        toast({
          description: "Post deleted successfully!",
        });
      } catch (error) {
        console.error("❌ Error updating cache after delete:", error);
        // Fallback: aggressive invalidation
        await queryClient.invalidateQueries({ 
          queryKey: ["post-feed"] 
        });
        await queryClient.invalidateQueries({
          predicate: (query) => 
            query.queryKey.some(key => 
              typeof key === 'string' && key.includes('post')
            )
        });
      }
    },
    onError: (error, postId) => {
      console.error("❌ Delete mutation error:", error);
      
      // Revert optimistic update by invalidating
      queryClient.invalidateQueries({ 
        queryKey: ["post-feed"] 
      });
      
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to delete post",
      });
    },
  });

  return mutation;
}

export function useRemixPostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      remixPost(postId, content),
    onSuccess: (data, variables) => {
      console.log('✅ Remix mutation successful:', data);
      
      if (data.success && data.post) {
        // Update the original post's remixes count in cache
        queryClient.setQueryData<InfiniteData<PostsPage>>(
          ["post-feed"], 
          (oldData) => {
            if (!oldData) return oldData;

            console.log("🔄 Updating cache for post:", variables.postId);
            
            const updatedPages = oldData.pages.map(page => ({
              ...page,
              posts: page.posts.map(post => {
                if (post.id === variables.postId) {
                  // Update _count.remixes
                  const currentRemixes = post._count?.remixes || 0;
                  const newRemixesCount = currentRemixes + 1;
                  
                  console.log(`📈 Updating _count.remixes: ${currentRemixes} -> ${newRemixesCount}`);
                  
                  return {
                    ...post,
                    _count: {
                      ...post._count,
                      remixes: newRemixesCount
                    }
                  };
                }
                return post;
              })
            }));

            return {
              ...oldData,
              pages: updatedPages
            };
          }
        );

        // Also add the new remix post to the feed
        queryClient.setQueryData<InfiniteData<PostsPage>>(
          ["post-feed"], 
          (oldData) => {
            if (!oldData) {
              return {
                pages: [{
                  posts: [data.post],
                  nextCursor: null
                }],
                pageParams: [null]
              };
            }

            console.log("🔄 Adding remix to feed:", data.post.id);
            
            // Add the new remix to the first page
            const updatedPages = oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  posts: [data.post, ...page.posts]
                };
              }
              return page;
            });

            return {
              ...oldData,
              pages: updatedPages
            };
          }
        );
      }

      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({ 
        queryKey: ["post-feed"] 
      });
      
      // Invalidate the specific post to get updated remixes count
      queryClient.invalidateQueries({
        queryKey: ["post", variables.postId]
      });

      // Invalidate any user stats that might include remixes count
      queryClient.invalidateQueries({
        queryKey: ["user-stats"]
      });

      toast({
        description: "Post remixed successfully!",
      });
    },
    onError: (error) => {
      console.error('❌ Remix mutation error:', error);
      
      // Revert optimistic updates on error
      queryClient.invalidateQueries({ 
        queryKey: ["post-feed"] 
      });
      queryClient.invalidateQueries({
        queryKey: ["post"]
      });
      
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to remix post",
      });
    },
  });
}

// FIXED: Create post mutation with direct upload
export function useCreatePostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      mediaFiles = [],
    }: {
      content: string;
      mediaFiles?: File[];
    }) => {
      console.log("🎯 Creating post with content:", content.substring(0, 50));
      console.log("📁 Media files to upload:", mediaFiles.length);

      let mediaUrls: { url: string; type: string }[] = [];

      // Upload media files in parallel using direct upload
      if (mediaFiles.length > 0) {
        try {
          console.log("📤 Starting media uploads...");
          const uploadPromises = mediaFiles.map(file => 
            uploadFileDirect(file, "attachment")
          );
          
          const uploadResults = await Promise.all(uploadPromises);
          
          // ⭐⭐ FIXED: Handle the correct response structure ⭐⭐
          mediaUrls = uploadResults
            .filter(result => result && result.url)
            .map(result => ({
              url: result.url,
              type: result.type || (result.file?.type?.startsWith('image/') ? 'image' : 'video')
            }));
            
          console.log("✅ Media uploaded successfully, URLs:", mediaUrls);
        } catch (error) {
          console.error("❌ Media upload failed:", error);
          throw new Error("Failed to upload media files");
        }
      }

      // Create the post with media URLs
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create post');
      }

      const newPost = await response.json();
      console.log("✅ Post created successfully:", newPost.id);
      return newPost;
    },
    onSuccess: (newPost) => {
      console.log("🎉 Post creation successful");
      
      // Optimistically add the new post to the feed
      queryClient.setQueryData<InfiniteData<PostsPage>>(
        ["post-feed"],
        (oldData) => {
          if (!oldData) {
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
              return {
                ...page,
                posts: [newPost, ...page.posts]
              };
            }
            return page;
          });

          return {
            ...oldData,
            pages: updatedPages
          };
        }
      );

      toast({
        description: "Post created successfully!",
      });
    },
    onError: (error) => {
      console.error("❌ Post creation error:", error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to create post",
      });
    },
  });
}

// FIXED: Update post mutation with direct upload
export function useUpdatePostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      content,
      mediaFiles = [],
    }: {
      postId: string;
      content: string;
      mediaFiles?: File[];
    }) => {
      console.log("🎯 Updating post:", postId);
      console.log("📁 New media files to upload:", mediaFiles.length);

      let mediaUrls: { url: string; type: string }[] = [];

      // Upload new media files if any
      if (mediaFiles.length > 0) {
        try {
          console.log("📤 Starting media uploads for update...");
          const uploadPromises = mediaFiles.map(file => 
            uploadFileDirect(file, "attachment")
          );
          
          const uploadResults = await Promise.all(uploadPromises);
          
          // ⭐⭐ FIXED: Handle the correct response structure ⭐⭐
          mediaUrls = uploadResults
            .filter(result => result && result.url)
            .map(result => ({
              url: result.url,
              type: result.type || (result.file?.type?.startsWith('image/') ? 'image' : 'video')
            }));
            
          console.log("✅ Media uploaded for update, URLs:", mediaUrls);
        } catch (error) {
          console.error("❌ Media upload failed during update:", error);
          throw new Error("Failed to upload media files");
        }
      }

      // Update the post with new media URLs
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update post');
      }

      const updatedPost = await response.json();
      console.log("✅ Post updated successfully:", updatedPost.id);
      return updatedPost;
    },
    onSuccess: (updatedPost) => {
      console.log("🎉 Post update successful");
      
      // Update the post in cache
      queryClient.setQueryData<InfiniteData<PostsPage>>(
        ["post-feed"],
        (oldData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map(page => ({
            ...page,
            posts: page.posts.map(post => 
              post.id === updatedPost.id ? updatedPost : post
            )
          }));

          return {
            ...oldData,
            pages: updatedPages
          };
        }
      );

      toast({
        description: "Post updated successfully!",
      });
    },
    onError: (error) => {
      console.error("❌ Post update error:", error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to update post",
      });
    },
  });
}