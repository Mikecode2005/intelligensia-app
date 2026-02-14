import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// POST /api/classrooms/join - Join a classroom via join code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { joinCode } = body;

    if (!joinCode) {
      return NextResponse.json(
        { error: "Join code is required" },
        { status: 400 }
      );
    }

    // Find classroom by join code
    const classroom = await prisma.classroom.findUnique({
      where: { joinCode: joinCode.toUpperCase() },
      include: {
        field: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            assignments: true,
            resources: true,
          },
        },
      },
    });

    if (!classroom) {
      return NextResponse.json(
        { error: "Invalid join code" },
        { status: 404 }
      );
    }

    // Check if already a member
    const existingMember = classroom.members.find(
      (m) => m.user.id === session.user.id
    );

    if (existingMember) {
      return NextResponse.json(
        { error: "Already a member of this classroom" },
        { status: 400 }
      );
    }

    // Add user as member
    const membership = await prisma.classroomMember.create({
      data: {
        userId: session.user.id,
        classroomId: classroom.id,
        role: "STUDENT",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Successfully joined classroom",
      classroom: {
        ...classroom,
        userRole: "STUDENT",
        memberCount: classroom._count.members + 1,
        assignmentCount: classroom._count.assignments,
        resourceCount: classroom._count.resources,
      },
      membership,
    });
  } catch (error) {
    console.error("Error joining classroom:", error);
    return NextResponse.json(
      { error: "Failed to join classroom" },
      { status: 500 }
    );
  }
}
