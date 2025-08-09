import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "../lib/prisma";
import { Lucia } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    }
  },
  getUserAttributes: (databaseUserAttributes) => {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string | null;
      googleId: string | null;
    };
  }
}

// Server-side validation function
export async function validateRequest() {
  const cookieStore = cookies();
  const sessionId = (await cookieStore).get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return {
      user: null,
      session: null
    };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      (await cookieStore).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      (await cookieStore).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch (error) {
    console.error("Session validation error:", error);
  }
  
  return result;
}

// Type exports
export type User = Awaited<ReturnType<typeof validateRequest>>["user"];
export type Session = Awaited<ReturnType<typeof validateRequest>>["session"];