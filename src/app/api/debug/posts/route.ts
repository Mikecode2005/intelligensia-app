// src/app/api/debug/posts/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    return NextResponse.json({ 
      totalPosts: posts.length,
      posts: posts.map(p => ({
        id: p.id,
        content: p.content.substring(0, 50) + '...',
        author: p.author.username,
        createdAt: p.createdAt
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}