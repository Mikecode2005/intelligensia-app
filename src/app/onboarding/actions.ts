"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { fieldSelectionSchema } from "@/lib/validation";
import { ZodError } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Server action for updating user profile during onboarding
 * @param formData Form data containing fields of interest and bio
 * @returns Success status or error message
 */
export async function updateUserProfile(formData: FormData) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { error: "You must be logged in to update your profile" };
    }
    
    // Get form data
    const fieldsString = formData.get("fields") as string;
    const bio = formData.get("bio") as string;
    
    // Parse fields from JSON string
    const fields = JSON.parse(fieldsString);
    
    // Validate input data
    const validatedData = fieldSelectionSchema.parse({
      fields,
      bio,
    });
    
    // Start a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Update the user's bio
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          bio: validatedData.bio || null,
        },
      });
      
      // Create Field records if they don't exist
      for (const fieldId of validatedData.fields) {
        await tx.field.upsert({
          where: { id: fieldId },
          update: {}, // No updates needed if it exists
          create: {
            id: fieldId,
            name: fieldId
              .replace(/-/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase()), // Convert id to display name
          },
        });
      }
      
      // Disconnect all existing fields
      await tx.$executeRaw`DELETE FROM "_FieldToUser" WHERE "B" = ${session.user.id}`;
      
      // Connect to selected fields
      for (const fieldId of validatedData.fields) {
        await tx.field.update({
          where: { id: fieldId },
          data: {
            users: {
              connect: { id: session.user.id },
            },
          },
        });
      }
      
      // Create initial performance record if it doesn't exist
      await tx.performance.upsert({
        where: { userId: session.user.id },
        update: {}, // No updates needed if it exists
        create: {
          userId: session.user.id,
          lastActive: new Date(),
          loginStreak: 1,
        },
      });
    });
    
    // Redirect to dashboard after successful update
    return redirect("/dashboard");
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      
      if (fieldErrors.fields) {
        return { error: fieldErrors.fields[0] };
      }
      
      if (fieldErrors.bio) {
        return { error: fieldErrors.bio[0] };
      }
      
      return { error: "Invalid input. Please check your information." };
    }
    
    // Log and return generic error
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}