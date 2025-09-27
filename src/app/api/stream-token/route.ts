import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createStreamToken, upsertStreamUser } from "@/lib/stream-utils";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Always sync user with Stream before generating token
    try {
      await upsertStreamUser({
        id: user.id,
        name: user.name || user.username || user.email || 'User',
        image: user.image || undefined,
      });
      console.log('User synced with Stream:', user.id);
    } catch (syncError) {
      console.error('Stream sync error (continuing anyway):', syncError);
      // Don't fail the request if sync fails
    }

    const token = await createStreamToken(user.id);
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Stream token error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" }, 
      { status: 500 }
    );
  }
}