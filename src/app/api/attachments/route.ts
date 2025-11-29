// app/api/attachments/route.ts
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, type } = await request.json();
    
    const attachment = await prisma.attachment.create({
      data: {
        url,
        type: type || 'image',
        userId: user.id,
      }
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("Attachment creation error:", error);
    return NextResponse.json({ error: "Failed to create attachment" }, { status: 500 });
  }
}