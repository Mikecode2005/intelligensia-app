import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { message: "Invalid authorization header" },
        { status: 401 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { message: "Supabase not configured" },
        { status: 500 }
      );
    }

    // Find unused media (media not attached to any post)
    const unusedMedia = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    // Extract file paths from URLs and delete from Supabase
    for (const media of unusedMedia) {
      try {
        // Extract the path from the URL (e.g., "userId/filename.jpg")
        const urlParts = media.url.split('/public-uploads/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          
          // Delete from Supabase storage
          const { error } = await supabase.storage
            .from('public-uploads')
            .remove([filePath]);
          
          if (error) {
            console.error(`Failed to delete ${filePath}:`, error);
          }
        }
      } catch (err) {
        console.error(`Error processing media ${media.id}:`, err);
      }
    }

    // Delete records from database
    await prisma.media.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((m) => m.id),
        },
      },
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
