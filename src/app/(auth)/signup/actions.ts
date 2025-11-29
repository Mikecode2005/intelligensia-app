"use server";

import prisma from "@/lib/prisma";
import { streamServerClient } from "@/lib/stream"; // Add Stream import
import { signUpSchema } from "@/lib/validation";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

/**
 * Server action for user signup
 * @param formData Form data from the signup form
 * @returns Error message if signup fails, redirects to login on success
 */
export async function signUp(formData: FormData) {
  try {
    // Get form data
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    
    // Validate input
    const validatedData = signUpSchema.parse({
      email,
      username,
      password,
    });

    // Check if username already exists
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: validatedData.username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return { error: "Username already taken" };
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: validatedData.email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return { error: "Email already taken" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user with transaction to ensure atomicity
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name: validatedData.username,
          username: validatedData.username,
          displayName: validatedData.username,
          email: validatedData.email,
          password: hashedPassword,
          userType: "STUDENT",
        },
      });
      
      // Create initial performance record
      await tx.performance.create({
        data: {
          userId: user.id,
          loginStreak: 1,
          lastActive: new Date(),
        }
      });

      return user; // Return user so we can use it outside the transaction
    });

    // ✅ ADDED: Create user in Stream Chat
    await createStreamChatUser(user.id, {
      name: user.displayName || user.username,
      username: user.username,
      email: user.email,
    });

    // Redirect to login page
    redirect("/login?registered=true");
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      
      if (fieldErrors.username) {
        return { error: fieldErrors.username[0] };
      }
      
      if (fieldErrors.email) {
        return { error: fieldErrors.email[0] };
      }
      
      if (fieldErrors.password) {
        return { error: fieldErrors.password[0] };
      }
      
      return { error: "Invalid input. Please check your information." };
    }
    
    // Log and return generic error
    console.error("Signup error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

/**
 * Create user in Stream Chat
 * Uses upsertUser to create the user if they don't exist
 */
async function createStreamChatUser(userId: string, userData: {
  name: string;
  username: string;
  email?: string;
}) {
  if (!streamServerClient) {
    console.log('ℹ️ Stream Chat: Client not available during signup');
    return;
  }

  try {
    await streamServerClient.upsertUser({
      id: userId,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      // Add any other relevant user data
    });
    console.log(`✅ Stream Chat: User created successfully for ${userData.username}`);
  } catch (error: any) {
    console.warn('⚠️ Stream Chat: User creation failed during signup:', error.message);
    // Don't throw - we don't want signup to fail if Stream is down
  }
}