import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reporter = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!reporter) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { reason, description } = body;

    const report = await prisma.report.create({
      data: {
        reporterId: reporter.id,
        reportedId: params.userId,
        reason,
        description,
        status: 'PENDING',
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}