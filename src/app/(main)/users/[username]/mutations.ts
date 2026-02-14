import { useToast } from "@/components/ui/use-toast";
import { PostsPage } from "@/lib/types";
import { UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateUserProfile } from "./actions";

export function useUpdateProfileMutation() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { update: updateSession } = useSession();

  console.log("🔄 useUpdateProfileMutation hook called");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      console.log("🎯 Mutation function started:", { values, hasAvatar: !!avatar });

      let avatarUrl: string | undefined;

      // 1. Upload avatar using Supabase
      if (avatar) {
        try {
          console.log("📤 Starting Supabase avatar upload...");
          
          const formData = new FormData();
          formData.append("files", avatar);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);

          // Use the Supabase upload API endpoint with 'avatar' slug
          const response = await fetch(`/api/uploadthing?slug=avatar`, {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${response.status} - ${errorText}`);
          }

          const uploadResults = await response.json();
          console.log("📤 Supabase avatar upload result:", uploadResults);
          
          // The uploadthing route returns an array of results
          if (uploadResults && Array.isArray(uploadResults) && uploadResults.length > 0) {
            // Get the first result's URL
            avatarUrl = uploadResults[0].url;
            console.log("✅ Avatar uploaded successfully, URL:", avatarUrl);
          } else if (uploadResults && uploadResults.url) {
            // Handle case where it returns a single object
            avatarUrl = uploadResults.url;
            console.log("✅ Avatar uploaded successfully, URL:", avatarUrl);
          } else {
            console.error("❌ No URL found in upload result:", uploadResults);
            throw new Error("Avatar upload completed but no URL returned");
          }
        } catch (error) {
          console.error("❌ Avatar upload failed:", error);
          
          if (error instanceof Error && error.name === 'AbortError') {
            throw new Error("Avatar upload timed out after 30 seconds");
          }
          
          throw new Error(`Failed to upload avatar: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }

      // 2. Prepare the data for profile update
      const updateData = avatarUrl 
        ? { ...values, avatarUrl }
        : values;

      console.log("📝 Calling updateUserProfile with:", updateData);

      // 3. Update user profile
      const updatedUser = await updateUserProfile(updateData);
      console.log("✅ updateUserProfile returned:", updatedUser);

      return updatedUser;
    },
    onMutate: (variables) => {
      console.log("🚀 onMutate called:", variables);
    },
    onSuccess: async (updatedUser) => {
      console.log("🎉 onSuccess called:", updatedUser);
      
      // Update the NextAuth session to reflect new avatar immediately
      // Use image field which contains the avatar URL
      const avatarImage = updatedUser.image || updatedUser.avatarUrl;
      if (avatarImage) {
        await updateSession({
          user: {
            image: avatarImage
          }
        });
      }
      
      // Update the cache for post feed
      queryClient.setQueryData<InfiniteData<PostsPage>>(
        ["post-feed"],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.author.id === updatedUser.id) {
                  return {
                    ...post,
                    author: updatedUser,
                  };
                }
                return post;
              }),
            })),
          };
        }
      );

      // Invalidate user-specific queries
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser.username] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });

      toast({
        description: "Profile updated successfully!",
      });

      // Refresh after a short delay to ensure toast is visible
      setTimeout(() => {
        router.refresh();
      }, 1000);
    },
    onError: (error, variables, context) => {
      console.error("❌ onError called:", error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to update profile",
      });
    },
    onSettled: (data, error, variables, context) => {
      console.log("🔚 onSettled called:", { data, error });
    },
  });

  console.log("✅ Mutation object created:", {
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess
  });

  return mutation;
}