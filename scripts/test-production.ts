import { StreamChat } from 'stream-chat';
import { config } from 'dotenv';

config();

async function testProduction() {
  console.log('=== Testing Production App - Fixed ===');
  
  // ✅ CORRECT: Use the actual variable name from your .env
  const apiKey = process.env.NEXT_PUBLIC_STREAM_KEY;  // ← FIX THIS LINE
  const secret = process.env.STREAM_SECRET;
  const appId = process.env.STREAM_APP_ID;
  
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey?.length);
  console.log('Secret exists:', !!secret);
  console.log('Secret length:', secret?.length);
  console.log('App ID exists:', !!appId);
  console.log('App ID:', appId);

  if (!apiKey || !secret) {
    console.log('❌ Missing credentials');
    console.log('Looking for: NEXT_PUBLIC_STREAM_KEY and STREAM_SECRET');
    return;
  }

  try {
    const client = StreamChat.getInstance(apiKey, secret);
    
    console.log('\nTesting API methods...');
    
    try {
      await client.upsertUser({
        id: 'test-user-' + Date.now(),
        name: 'Test User',
      });
      console.log('✅ upsertUser SUCCESS!');
    } catch (e: any) {
      console.log('❌ upsertUser failed:', e.message);
      console.log('Error code:', e.code);
    }
    
  } catch (error: any) {
    console.log('❌ Overall error:', error.message);
  }
}

testProduction();