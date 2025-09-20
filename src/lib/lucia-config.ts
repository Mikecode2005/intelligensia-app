// src/lib/lucia-config.ts
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Google } from "arctic";
import prisma from "./prisma";

// OAuth provider: Google
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.NEXT_PUBLIC_APP_URL + "/api/auth/callback/google"
);

// Initialize PrismaAdapter
const adapter = new PrismaAdapter(prisma, {
  user: "user",
  session: "session",
});

// Initialize Lucia
export const auth = new Lucia(adapter, {
  sessionCookie: {
    name: "auth_session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
  },
  getUserAttributes: (databaseUserAttributes) => ({
    id: databaseUserAttributes.id,
    username: databaseUserAttributes.username,
    displayName: databaseUserAttributes.displayName,
    avatarUrl: databaseUserAttributes.avatarUrl,
    googleId: databaseUserAttributes.googleId,
  }),
});

// Lucia type definitions
declare module "lucia" {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: {
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string | null;
      googleId: string | null;
    };
  }
}