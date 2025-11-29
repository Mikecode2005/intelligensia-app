import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalUsers,
      totalPosts,
      totalReports,
      totalViews,
      activeUsers,
      newUsersToday,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.report.count(),
      prisma.profileView.count(),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalPosts,
      totalReports,
      totalViews,
      activeUsers,
      newUsersToday,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}