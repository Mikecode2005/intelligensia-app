// lib/stream-utils.ts
import streamServerClient from './stream';

export async function safeUpsertUser(userId: string, userData: any) {
  try {
    await streamServerClient.upsertUser({
      id: userId,
      name: userData.name || 'User',
      image: userData.image || null,
      role: 'user',
    });
    return true;
  } catch (error) {
    console.error('Stream Chat upsert failed:', error);
    return false;
  }
}

export async function safePartialUpdateUser(userId: string, updates: any) {
  try {
    await streamServerClient.partialUpdateUser({
      id: userId,
      set: updates,
    });
    return true;
  } catch (error) {
    // If user doesn't exist, create them first
    if (error.toString().includes('does not exist')) {
      return await safeUpsertUser(userId, updates);
    }
    console.error('Stream Chat update failed:', error);
    return false;
  }
}