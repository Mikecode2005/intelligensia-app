"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { upsertStreamUser } from "@/lib/stream-utils";
import prisma from "@/lib/prisma";

export async function login(credentials: unknown) {
  try {
    const formData = credentials as FormData;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Invalid credentials" };
    }

    // Get the authenticated user from your database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Upsert user in Stream
    try {
      await upsertStreamUser({
        id: user.id,
        name: user.name || user.username || user.email || 'User',
        image: user.image || undefined,
      });
    } catch (streamError) {
      console.error("Stream user creation error:", streamError);
      // Don't fail login if Stream fails, just log it
    }

    // Update last login
    await prisma.performance.upsert({
      where: { userId: user.id },
      update: { 
        lastActive: new Date(),
        loginStreak: { increment: 1 }
      },
      create: {
        userId: user.id,
        lastActive: new Date(),
        loginStreak: 1
      }
    });

    redirect("/dashboard");
    
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials" };
    }
    
    if (error instanceof Error && "digest" in error) {
      throw error;
    }
    
    console.error("Login error:", error);
    return { error: "Something went wrong" };
  }
}