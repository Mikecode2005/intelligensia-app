// lib/stream-utils.ts - UPDATED
import { streamServerClient } from './stream';

export async function safeUpsertUser(userId: string, userData: any) {
  try {
    // Add timeout protection
    const upsertPromise = streamServerClient.upsertUser({
      id: userId,
      name: userData.name || 'User',
      image: userData.image || null,
      role: 'user',
    });

    // Set timeout of 8 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Stream Chat upsert timeout')), 8000);
    });

    await Promise.race([upsertPromise, timeoutPromise]);
    console.log('✅ Stream Chat user upserted:', userId);
    return true;
  } catch (error) {
    console.error('❌ Stream Chat upsert failed:', error);
    return false; // Don't throw - fail gracefully
  }
}

export async function safePartialUpdateUser(userId: string, updates: any) {
  try {
    // Add timeout protection
    const updatePromise = streamServerClient.partialUpdateUser({
      id: userId,
      set: updates,
    });

    // Set timeout of 8 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Stream Chat update timeout')), 8000);
    });

    await Promise.race([updatePromise, timeoutPromise]);
    console.log('✅ Stream Chat user updated:', userId);
    return true;
  } catch (error) {
    console.error('❌ Stream Chat update failed:', error);
    
    // If user doesn't exist, create them first (without timeout for this)
    if (error.toString().includes('does not exist')) {
      console.log('🔄 User does not exist, creating user first...');
      try {
        await streamServerClient.upsertUser({
          id: userId,
          name: updates.name || 'User',
          image: updates.image || null,
          role: 'user',
          ...updates,
        });
        console.log('✅ Created new Stream Chat user:', userId);
        return true;
      } catch (createError) {
        console.error('❌ Failed to create Stream Chat user:', createError);
        return false;
      }
    }
    
    return false; // Don't throw - fail gracefully
  }
}

// Simple non-blocking version for avatar updates
export async function safeUpdateUserAvatar(userId: string, imageUrl: string) {
  // Don't wait for this to complete
  safePartialUpdateUser(userId, { image: imageUrl })
    .then(success => {
      if (success) {
        console.log('✅ Avatar updated in Stream Chat');
      } else {
        console.log('⚠️ Avatar update in Stream Chat failed (non-critical)');
      }
    })
    .catch(error => {
      console.error('❌ Unexpected error in avatar update:', error);
    });
  
  return true; // Always return true since this is non-blocking
}