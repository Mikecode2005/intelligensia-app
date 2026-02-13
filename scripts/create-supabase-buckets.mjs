import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debugging: print out which env vars are present
console.log("Environment variables:");
console.log("NEXT_PUBLIC_SUPABASE_URL:", SUPABASE_URL ? "[OK]" : "[MISSING]");
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", SUPABASE_ANON_KEY ? "[OK]" : "[MISSING]");
console.log("SUPABASE_SERVICE_ROLE_KEY:", SUPABASE_SERVICE_ROLE_KEY ? "[OK]" : "[MISSING]");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

// ⚠️ Only use the service role key in server-side code
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function ensureBucket(bucket, isPublic) {
  try {
    const { data, error } = await supabase.storage.createBucket(bucket, { public: isPublic });
    if (error) {
      if (error.message && error.message.toLowerCase().includes("already exists")) {
        console.log(`ℹ️ ${bucket} already exists`);
        return;
      }
      throw error;
    }
    console.log(`✅ Created bucket: ${bucket} (public=${isPublic})`);
  } catch (e) {
    console.error(`❌ Failed to create bucket ${bucket}:`, e.message || e);
    process.exitCode = 1;
  }
}

(async function main() {
  console.log("Connecting to Supabase:", SUPABASE_URL);

  await ensureBucket("public-uploads", true);
  await ensureBucket("private-uploads", false);

  console.log("🎉 Done.");
})();
