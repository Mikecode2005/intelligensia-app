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
    const goal = formData.get("goal") as string;
    const fields = JSON.parse(fieldsString || "[]");
    
    if (fields.length === 0) {
      return { error: "Please select at least one field" };
    }
    
    if (!goal) {
      return { error: "Please select a mission/goal" };
    }
    
    if (bio && bio.length > 500) {
      return { error: "Bio must be less than 500 characters" };
    }

    console.log("Updating user profile for:", session.user.id, { fieldsCount: fields.length, goal });
    
    // Update user profile
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
    
    // Delete existing user fields
    await prisma.userField.deleteMany({
      where: { userId: session.user.id },
    });

    // Create new user field associations
    for (const fieldId of fields) {
      // First check if the field exists, if not create it
      let field = await prisma.field.findUnique({
        where: { id: fieldId },
      });

      if (!field) {
        // Try to find by name if ID doesn't match
        field = await prisma.field.findUnique({
          where: { name: fieldId },
        });
      }

      if (!field) {
        // Create the field if it doesn't exist
        field = await prisma.field.create({
          data: {
            id: fieldId,
            name: fieldId,
          },
        });
      }

      // Create user field association
      await prisma.userField.create({
        data: {
          userId: session.user.id,
          fieldId: field.id,
        },
      });
    }

    console.log("User fields linked successfully");
    
    return { success: true };
    
  } catch (error) {
    console.error("Error in onboarding:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}