import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentsPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 5;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the post exists first
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: getCommentDataInclude(user.id),
      orderBy: { createdAt: "asc" },
      take: pageSize + 1, // Get one extra to check if there are more
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0, // Skip the cursor itself
    });

    const hasMore = comments.length > pageSize;
    const items = hasMore ? comments.slice(0, -1) : comments;
    const nextCursor = hasMore ? comments[comments.length - 1]?.id : null;

    const data: CommentsPage = {
      comments: items,
      previousCursor: nextCursor, // Using nextCursor for pagination
    };

    return Response.json(data);
  } catch (error) {
    console.error("Comments fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content?.trim()) {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    // Verify the post exists and get author info for notification
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        authorId: true,
        content: true,
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    // Create comment in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the comment
      const comment = await tx.comment.create({
        data: {
          content: content.trim(),
          authorId: user.id,
          postId,
        },
        include: getCommentDataInclude(user.id),
      });

      // Create notification if the commenter is not the post author
      if (user.id !== post.authorId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            content: `commented on your post`,
            recipientId: post.authorId,
            senderId: user.id,
            postId,
          },
        });
      }

      return comment;
    });

    return Response.json({ comment: result });
  } catch (error) {
    console.error("Comment creation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}