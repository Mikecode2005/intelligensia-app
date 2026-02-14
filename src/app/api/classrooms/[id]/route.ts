import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET /api/classrooms/[id] - Get classroom details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const classroom = await prisma.classroom.findUnique({
      where: { id: params.id },
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
        assignments: {
          orderBy: { dueDate: "asc" },
          take: 10,
        },
        resources: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            members: true,
            assignments: true,
            resources: true,
            messages: true,
          },
        },
      },
    });

    if (!classroom) {
      return NextResponse.json(
        { error: "Classroom not found" },
        { status: 404 }
      );
    }

    // Check if user is a member
    const membership = classroom.members.find(
      (m) => m.user.id === session.user.id
    );

    // Only return full details if user is a member
    if (!membership) {
      return NextResponse.json({
        id: classroom.id,
        name: classroom.name,
        description: classroom.description,
        joinCode: classroom.joinCode,
        field: classroom.field,
        createdAt: classroom.createdAt,
        isMember: false,
        memberCount: classroom._count.members,
        assignmentCount: classroom._count.assignments,
        resourceCount: classroom._count.resources,
      });
    }

    return NextResponse.json({
      ...classroom,
      userRole: membership.role,
      isMember: true,
      memberCount: classroom._count.members,
      assignmentCount: classroom._count.assignments,
      resourceCount: classroom._count.resources,
      messageCount: classroom._count.messages,
    });
  } catch (error) {
    console.error("Error fetching classroom:", error);
    return NextResponse.json(
      { error: "Failed to fetch classroom" },
      { status: 500 }
    );
  }
}

// DELETE /api/classrooms/[id] - Delete classroom (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin of the classroom
    const membership = await prisma.classroomMember.findFirst({
      where: {
        classroomId: params.id,
        userId: session.user.id,
        role: "ADMIN",
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Only classroom admin can delete" },
        { status: 403 }
      );
    }

    await prisma.classroom.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Classroom deleted" });
  } catch (error) {
    console.error("Error deleting classroom:", error);
    return NextResponse.json(
      { error: "Failed to delete classroom" },
      { status: 500 }
    );
  }
}
