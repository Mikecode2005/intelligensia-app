"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function updateUserProfile(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { error: "You must be logged in to update your profile" };
    }
    
    const fieldsString = formData.get("fields") as string;
    const bio = formData.get("bio") as string;
    const userType = formData.get("userType") as string;
    const fields = JSON.parse(fieldsString || "[]");
    
    if (fields.length === 0) {
      return { error: "Please select at least one field" };
    }
    
    if (bio && bio.length > 500) {
      return { error: "Bio must be less than 500 characters" };
    }

    console.log("Updating user profile for:", session.user.id);
    
    // Simple user update - remove all complex operations
    await prisma.user.upsert({
      where: { id: session.user.id },
      update: {
        bio: bio || null,
        userType: userType || "STUDENT",
        username: session.user.email?.split('@')[0] || `user_${session.user.id.substring(0, 8)}`,
      },
      create: {
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name || "",
        username: session.user.email?.split('@')[0] || `user_${session.user.id.substring(0, 8)}`,
        displayName: session.user.name || "",
        image: session.user.image || "",
        bio: bio || null,
        userType: userType || "STUDENT",
      },
    });

    console.log("User profile updated successfully");
    
    return { success: true };
    
  } catch (error) {
    console.error("Error in onboarding:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}