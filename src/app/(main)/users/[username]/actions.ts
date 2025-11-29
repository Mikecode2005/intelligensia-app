// components/users/actions.ts - IMPROVED VERSION
"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { streamServerClient } from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  console.log("🔄 Profile update started", values);

  try {
    const validatedValues = updateUserProfileSchema.parse(values);
    console.log("✅ Validation passed");

    const { user } = await validateRequest();
    console.log("👤 User from session:", user?.id);

    if (!user) throw new Error("Unauthorized");

    const updatedUser = await prisma.$transaction(async (tx) => {
      console.log("💾 Starting database update...");
      
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: validatedValues,
        select: getUserDataSelect(user.id),
      });

      console.log("✅ Database update completed");

      // Stream Chat update (truly non-blocking with timeout)
      updateStreamChatUser(user.id, {
        name: validatedValues.displayName || updatedUser.displayName,
        username: validatedValues.username || updatedUser.username,
        image: validatedValues.avatarUrl || updatedUser.avatarUrl,
      }).catch(error => {
        console.warn("⚠️ Stream update failed (non-critical):", error.message);
        // Don't rethrow - this should not affect the main profile update
      });

      return updatedUser;
    });

    console.log("🎉 Profile update completed successfully");
    return updatedUser;
    
  } catch (error) {
    console.error("❌ Profile update error:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        throw new Error("You must be logged in to update your profile");
      }
      if (error.message.includes("unique constraint")) {
        throw new Error("Username or email already taken");
      }
    }
    
    throw new Error("Failed to update profile. Please try again.");
  }
}

/**
 * Safely update Stream Chat user with timeout protection
 */
async function updateStreamChatUser(userId: string, userData: any): Promise<void> {
  if (!streamServerClient) {
    console.log('ℹ️ Stream Chat: Client not available, skipping update');
    return;
  }

  // Return immediately if no meaningful data to update
  if (!userData.name && !userData.username && !userData.image) {
    console.log('ℹ️ Stream Chat: No user data to update');
    return;
  }

  try {
    console.log("🔄 Updating Stream Chat user...", { userId, userData });
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Stream update timeout')), 5000)
    );
    
    const updatePromise = streamServerClient.upsertUser({
      id: userId,
      name: userData.name,
      username: userData.username,
      image: userData.image,
    });
    
    await Promise.race([updatePromise, timeoutPromise]);
    console.log('✅ Stream Chat: User upserted successfully');
    
  } catch (error: any) {
    // Only log warnings for non-critical errors
    if (error.message.includes('timeout') || error.message.includes('network')) {
      console.warn('⚠️ Stream Chat: Update timed out or network error (non-critical):', error.message);
    } else if (error.message.includes('not found') || error.message.includes('invalid')) {
      console.warn('⚠️ Stream Chat: User not found in Stream (non-critical):', error.message);
    } else {
      console.warn('⚠️ Stream Chat: User upsert failed (non-critical):', error.message);
    }
    // Don't throw - this is a non-critical operation
  }
}

/**
 * Optional: Helper function to check if user exists in Stream
 */
export async function checkStreamUserExists(userId: string): Promise<boolean> {
  if (!streamServerClient) return false;

  try {
    const response = await streamServerClient.queryUsers({ id: userId });
    return response.users.length > 0;
  } catch (error) {
    console.warn('⚠️ Stream Chat: Check user exists failed:', error);
    return false;
  }
}