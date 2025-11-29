import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        verified: true,
        isAdmin: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            reportedBy: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedUsers = users.map(user => ({
      ...user,
      postsCount: user._count.posts,
      reportsCount: user._count.reportedBy,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}