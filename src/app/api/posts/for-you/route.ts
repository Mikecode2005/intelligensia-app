import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        author: {  // Changed from 'user' to 'author'
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            createdAt: true,
            followers: {
              where: {
                followerId: user.id
              },
              select: {
                followerId: true
              }
            },
            _count: {
              select: {
                posts: true,
                followers: true
              }
            }
          }
        },
        field: true,
        attachments: true,
        likes: {
          where: {
            userId: user.id
          },
          select: {
            userId: true
          }
        },
        bookmarks: {
          where: {
            userId: user.id
          },
          select: {
            userId: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}