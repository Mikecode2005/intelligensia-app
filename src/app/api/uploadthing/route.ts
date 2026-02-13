import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("Supabase URL or service role key not set. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env.");
}

const supabase = createClient(SUPABASE_URL ?? "", SUPABASE_SERVICE_ROLE_KEY ?? "");

const SLUG_TO_BUCKET: Record<string, { bucket: string; public: boolean }> = {
  postAttachment: { bucket: "public-uploads", public: true },
  attachment: { bucket: "public-uploads", public: true },
  privateFile: { bucket: "private-uploads", public: false },
};

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug") || "postAttachment";

    const mapping = SLUG_TO_BUCKET[slug] ?? { bucket: "public-uploads", public: true };

    const session = await getServerSession(authOptions as any);
    const userId = session?.user?.id ?? "anonymous";

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    const results: any[] = [];

    for (const file of files) {
      const filename = `${userId}/${Date.now()}_${file.name}`;
      const arrayBuffer = await file.arrayBuffer();
      const { data, error } = await supabase.storage
        .from(mapping.bucket)
        .upload(filename, Buffer.from(arrayBuffer), { contentType: file.type, upsert: false });

      if (error) {
        console.error("Supabase upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      let urlResult = null;
      if (mapping.public) {
        const { data: publicUrl } = supabase.storage.from(mapping.bucket).getPublicUrl(filename);
        urlResult = publicUrl?.publicUrl ?? null;
      } else {
        const { data: signed } = await supabase.storage
          .from(mapping.bucket)
          .createSignedUrl(filename, 60 * 60); // 1 hour
        urlResult = signed?.signedUrl ?? null;
      }

      results.push({
        name: file.name,
        url: urlResult,
        size: file.size,
        type: file.type,
        key: data?.path,
        uploadedBy: userId,
      });
    }

    return NextResponse.json(results);
  } catch (e: any) {
    console.error("Upload route error:", e);
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  // This endpoint can be used by the client shim to fetch latest info if needed.
  return NextResponse.json({});
}
