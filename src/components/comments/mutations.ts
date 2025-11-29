// components/comments/mutations.ts - IMPROVED VERSION
import { CommentsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { deleteComment, submitComment } from "./actions";

export function useSubmitCommentMutation(postId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: { content: string }) => 
      submitComment({ postId, content: input.content }),
    onSuccess: async (newComment) => {
      console.log("✅ Comment created successfully:", newComment.id);
      
      const queryKey: QueryKey = ["comments", postId];

      try {
        // Update the cache optimistically
        queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
          queryKey,
          (oldData) => {
            if (!oldData) {
              return {
                pageParams: [null],
                pages: [{
                  previousCursor: null,
                  comments: [newComment],
                }],
              };
            }

            const firstPage = oldData.pages[0];
            
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  previousCursor: firstPage.previousCursor,
                  comments: [newComment, ...firstPage.comments],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        );

        toast({
          description: "Comment created successfully!",
        });
      } catch (error) {
        console.error("Error updating cache:", error);
        // If cache update fails, invalidate the query to refetch
        await queryClient.invalidateQueries({ queryKey });
      }
    },
    onError: (error) => {
      console.error("❌ Comment submission error:", error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to submit comment. Please try again.",
      });
    },
  });

  return mutation;
}

export function useDeleteCommentMutation(postId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      console.log("✅ Comment deleted successfully:", deletedComment.id);
      
      const actualPostId = postId || deletedComment.postId;
      const queryKey: QueryKey = ["comments", actualPostId];

      try {
        // Update the cache optimistically
        queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
          queryKey,
          (oldData) => {
            if (!oldData) return oldData;

            return {
              pageParams: oldData.pageParams,
              pages: oldData.pages.map((page) => ({
                previousCursor: page.previousCursor,
                comments: page.comments.filter((c) => c.id !== deletedComment.id),
              })),
            };
          }
        );

        toast({
          description: "Comment deleted successfully!",
        });
      } catch (error) {
        console.error("Error updating cache:", error);
        // If cache update fails, invalidate the query to refetch
        await queryClient.invalidateQueries({ queryKey });
      }
    },
    onError: (error, commentId) => {
      console.error("❌ Comment deletion error:", error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to delete comment. Please try again.",
      });
    },
  });

  return mutation;
}