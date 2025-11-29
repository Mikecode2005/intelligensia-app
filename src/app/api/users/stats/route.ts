// src/app/api/users/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's posts with counts
    const userPosts = await prisma.post.findMany({
      where: { authorId: user.id },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        },
        remixes: {
          select: {
            id: true
          }
        }
      }
    });

    // Calculate totals
    const totalLikes = userPosts.reduce((sum, post) => sum + post._count.likes, 0);
    const totalComments = userPosts.reduce((sum, post) => sum + post._count.comments, 0);
    const totalRemixes = userPosts.reduce((sum, post) => sum + post.remixes.length, 0);
    const totalPosts = userPosts.length;

    // Get follower counts
    const followerCount = await prisma.follow.count({
      where: { followingId: user.id }
    });

    const followingCount = await prisma.follow.count({
      where: { followerId: user.id }
    });

    // Get classes count
    const classesCount = await prisma.classroomMember.count({
      where: { userId: user.id }
    });

    // Calculate engagement rate (likes + comments per post)
    const engagementRate = totalPosts > 0 
      ? Math.round((totalLikes + totalComments) / totalPosts * 10) / 10 
      : 0;

    // Calculate weekly activity (posts from last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyActivity = await prisma.post.count({
      where: {
        authorId: user.id,
        createdAt: { gte: oneWeekAgo }
      }
    });

    // Get achievements count - placeholder for now
    const achievementsCount = 0;

    // Calculate streak (consecutive days with activity)
    const recentActivities = await prisma.post.findMany({
      where: {
        authorId: user.id,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' }
    });

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const activityOnDate = recentActivities.some(activity => {
        const activityDate = new Date(activity.createdAt);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === currentDate.getTime();
      });

      if (activityOnDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    const stats = {
      followers: followerCount,
      following: followingCount,
      posts: totalPosts,
      classes: classesCount,
      achievements: achievementsCount,
      streak,
      totalLikes,
      totalComments,
      totalRemixes,
      engagementRate,
      weeklyActivity
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}