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
    // First try to create the bucket
    const { data: createData, error: createError } = await supabase.storage.createBucket(bucket, { 
      public: isPublic,
      allowedMimeTypes: ['*'], // Allow all MIME types
      fileSizeLimit: '10MB' // 10MB limit
    });
    
    if (createError) {
      if (createError.message && createError.message.toLowerCase().includes("already exists")) {
        console.log(`ℹ️ ${bucket} already exists, checking/updating configuration...`);
        
        // Bucket exists, try to update its settings to allow all file types
        const { data: updateData, error: updateError } = await supabase.storage
          .updateBucket(bucket, {
            public: isPublic,
            allowedMimeTypes: ['*'],
            fileSizeLimit: '10MB'
          });
        
        if (updateError) {
          // Update might fail if the API doesn't support it, but that's OK
          console.log(`⚠️ Could not update bucket ${bucket} settings:`, updateError.message);
        } else {
          console.log(`✅ Updated bucket: ${bucket} settings`);
        }
        return;
      }
      throw createError;
    }
    console.log(`✅ Created bucket: ${bucket} (public=${isPublic})`);
  } catch (e) {
    console.error(`❌ Failed to create bucket ${bucket}:`, e.message || e);
    process.exitCode = 1;
  }
}

async function deleteBucket(bucket) {
  try {
    const { error } = await supabase.storage.deleteBucket(bucket);
    if (error) {
      console.log(`⚠️ Could not delete bucket ${bucket}:`, error.message);
    } else {
      console.log(`✅ Deleted bucket: ${bucket}`);
    }
  } catch (e) {
    console.error(`❌ Failed to delete bucket ${bucket}:`, e.message || e);
  }
}

(async function main() {
  console.log("Connecting to Supabase:", SUPABASE_URL);

  // Delete and recreate buckets with proper settings
  await deleteBucket("public-uploads");
  await deleteBucket("private-uploads");
  
  // Recreate with correct settings
  await ensureBucket("public-uploads", true);
  await ensureBucket("private-uploads", false);

  console.log("🎉 Done.");
})();
