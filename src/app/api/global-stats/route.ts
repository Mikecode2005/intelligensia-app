import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get counts from database
    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count();

    // Return at least 1 for display purposes if 0
    return NextResponse.json({
      totalUsers: Math.max(userCount, 1),
      totalPosts: Math.max(postCount, 1),
      totalResources: 50,
    });
  } catch (error) {
    console.error('Error fetching global stats:', error);
    // Return defaults
    return NextResponse.json({
      totalUsers: 1,
      totalPosts: 1,
      totalResources: 50,
    });
  }
}
