"use server";

import { loginSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function login(credentials: LoginValues) {
  try {
    // Validate input
    const { username, password } = loginSchema.parse(credentials);

    // Find user
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive"
        }
      }
    });

    // Verify user exists
    if (!existingUser || !existingUser.passwordHash) {
      return { error: "Incorrect username or password" };
    }

    // Verify password
    const validPassword = await verify(
      existingUser.passwordHash, 
      password,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      }
    );

    if (!validPassword) {
      return { error: "Incorrect username or password" };
    }

    // Create session
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // Redirect on success
    return redirect("/");
    
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Login error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}   