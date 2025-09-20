import { Lucia } from "lucia";
import { PrismaClient } from '@prisma/client';

// Create a simple adapter for edge compatibility
const createEdgeAdapter = () => {
  return {
    getSessionAndUser: async (sessionId: string) => {
      // This will be handled by your main auth in API routes
      return null;
    }
  };
};

export const lucia = new Lucia(createEdgeAdapter(), {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    }
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      username: attributes.username,
      displayName: attributes.displayName,
      avatarUrl: attributes.avatarUrl,
      googleId: attributes.googleId,
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