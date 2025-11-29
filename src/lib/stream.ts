// lib/stream.ts - UPDATED
import { StreamChat } from 'stream-chat';

// Create server client with proper configuration
export const streamServerClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY!,
  process.env.STREAM_SECRET!,
  {
    timeout: 10000, // Increase timeout to 10 seconds
    allowServerSideConnect: true,
  }
);

// Test connection on startup
export async function initializeStreamChat() {
  try {
    // Simple connection test
    await streamServerClient.queryUsers({ id: 'test' }, { id: 1 }, { limit: 1 });
    console.log('✅ Stream Chat initialized successfully');
  } catch (error) {
    console.error('❌ Stream Chat initialization failed:', error);
  }
}

// Call this during app startup
initializeStreamChat();