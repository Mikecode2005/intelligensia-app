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

    // Fetch a larger window and then rank/score posts server-side
    const windowSize = pageSize * 3;

    const rawPosts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: windowSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            createdAt: true,
            userType: true,
            followers: {
              where: { followerId: user.id },
              select: { followerId: true }
            },
            _count: {
              select: { posts: true, followers: true }
            }
          }
        },
        field: true,
        attachments: true,
        likes: {
          where: { userId: user.id },
          select: { userId: true }
        },
        bookmarks: {
          where: { userId: user.id },
          select: { userId: true }
        },
        comments: {
          include: {
            author: {
              select: { id: true, username: true, displayName: true, avatarUrl: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: { likes: true, comments: true }
        }
      },
    });

    // Gather user's field interests for relevance scoring
    const userWithFields = await prisma.user.findUnique({
      where: { id: user.id },
      include: { userFields: { select: { fieldId: true } } }
    });

    const userFieldIds = new Set((userWithFields?.userFields || []).map(f => f.fieldId));

    // Score posts: higher score when author role matches, field matches user's interests, or author is followed
    const scored = rawPosts.map(p => {
      let score = 0;

      if (p.author?.userType && user.userType && p.author.userType === user.userType) {
        score += 50;
      }

      if (p.field && userFieldIds.has(p.field.id)) {
        score += 30;
      }

      if (p.author?.followers && p.author.followers.length > 0) {
        score += 20; // user follows the author
      }

      // small boost for engagement
      score += (p._count?.likes || 0) * 2;
      score += (p._count?.comments || 0) * 1;

      return { post: p, score };
    });

    // Sort by score desc, then by createdAt desc
    const sorted = scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return +new Date(b.post.createdAt) - +new Date(a.post.createdAt);
    }).map(s => s.post);

    const nextCursor = sorted.length > pageSize ? sorted[pageSize].id : null;

    const data = {
      posts: sorted.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}