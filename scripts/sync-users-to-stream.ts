// scripts/sync-users-to-stream.ts
import { StreamChat } from "stream-chat";
import prisma from "@/lib/prisma";
import { config } from "dotenv";

// Load environment variables
config();

async function syncUsersToStream() {
  try {
    console.log("🚀 Starting user sync with Stream...");

    const appId = process.env.STREAM_APP_ID; // just for reference
    const apiKey = process.env.NEXT_PUBLIC_STREAM_KEY;
    const secret = process.env.STREAM_SECRET;

    // Debug info
    console.log("App ID:", appId || "❌ Not set (not required by SDK)");
    console.log(
      "API Key:",
      apiKey ? apiKey.slice(0, 6) + "..." : "❌ Not found"
    );
    console.log("Secret length:", secret?.length || "❌ Not found");

    if (!apiKey || !secret) {
      throw new Error("❌ Missing Stream API credentials. Check your .env file.");
    }

    // Correct: use API Key + Secret
    const streamClient = StreamChat.getInstance(apiKey, secret);

    // Fetch users from your DB
    const users = await prisma.user.findMany();
    console.log(`📦 Found ${users.length} users to sync`);

    for (const user of users) {
      try {
        await streamClient.upsertUser({
          id: user.id,
          name: user.name || user.username || user.email || "User",
          image: user.image || undefined,
        });
        console.log(`✅ Synced user: ${user.id} (${user.email})`);
      } catch (error: any) {
        console.error(`❌ Failed to sync user ${user.id}:`, error.message);
      }
    }

    console.log("🎉 User sync completed!");
  } catch (error) {
    console.error("❌ Sync failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  syncUsersToStream();
}
