import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const carousel = await prisma.carousel.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(carousel);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch carousel' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, link, order, isActive } = body;

    const newItem = await prisma.carousel.create({
      data: {
        title,
        description,
        imageUrl,
        link,
        order: order || 0,
        isActive: isActive || true,
        createdBy: 'admin', // This should be updated with actual admin ID
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create carousel item' }, { status: 500 });
  }
}