"use server";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { safeUpsertUser } from "@/lib/stream-utils";
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

    // Upsert user in Stream (non-blocking)
    safeUpsertUser(user.id, {
      name: user.name || user.username || user.email || 'User',
      image: user.image || null,
    });

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

    // Redirect based on user type/role
    const userType = user.userType;
    if (userType === "student") {
      redirect("/roles/student/dashboard");
    } else if (userType === "lecturer") {
      redirect("/roles/lecturer/dashboard");
    } else if (userType === "organization") {
      redirect("/roles/organization/dashboard");
    } else {
      // Default fallback - redirect to onboarding if no userType set
      redirect("/onboarding");
    }
    
  } catch (error) {
    if (error instanceof Error && "digest" in error) {
      throw error;
    }
    
    console.error("Login error:", error);
    return { error: "Something went wrong" };
  }
}
