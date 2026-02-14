import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

// GET /api/classrooms - Get all classrooms or search
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const enrolled = searchParams.get("enrolled") === "true";

    // Get user's enrolled classroom IDs if filtering by enrolled
    let enrolledClassroomIds: string[] = [];
    if (enrolled) {
      const memberships = await prisma.classroomMember.findMany({
        where: { userId: session.user.id },
        select: { classroomId: true },
      });
      enrolledClassroomIds = memberships.map((m) => m.classroomId);
    }

    const whereClause = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(enrolled && {
        id: { in: enrolledClassroomIds },
      }),
    };

    const classrooms = await prisma.classroom.findMany({
      where: whereClause,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Add user role in each classroom
    const classroomsWithUserRole = classrooms.map((classroom) => {
      const membership = classroom.members.find(
        (m) => m.user.id === session.user.id
      );
      return {
        ...classroom,
        userRole: membership?.role || null,
        memberCount: classroom._count.members,
        assignmentCount: classroom._count.assignments,
        resourceCount: classroom._count.resources,
      };
    });

    return NextResponse.json(classroomsWithUserRole);
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch classrooms" },
      { status: 500 }
    );
  }
}

// POST /api/classrooms - Create a new classroom (lecturers only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a lecturer
    if (session.user.userType !== "LECTURER" && session.user.userType !== "TUTOR") {
      return NextResponse.json(
        { error: "Only lecturers can create classrooms" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, fieldId } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Classroom name is required" },
        { status: 400 }
      );
    }

    // Generate unique join code
    const joinCode = randomBytes(4).toString("hex").toUpperCase();

    // Create classroom
    const classroom = await prisma.classroom.create({
      data: {
        name,
        description,
        fieldId,
        joinCode,
        members: {
          create: {
            userId: session.user.id,
            role: "ADMIN",
          },
        },
      },
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
      },
    });

    return NextResponse.json(classroom, { status: 201 });
  } catch (error) {
    console.error("Error creating classroom:", error);
    return NextResponse.json(
      { error: "Failed to create classroom" },
      { status: 500 }
    );
  }
}
