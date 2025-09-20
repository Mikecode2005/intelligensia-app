// app/api/auth/[...nextauth]/getAuthOptions.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { env } from "@/lib/env";

const prisma = new PrismaClient();

export function getAuthOptions() {
  return {
    adapter: PrismaAdapter(prisma),

    providers: [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID || "",
        clientSecret: env.GOOGLE_CLIENT_SECRET || "",
        profile(profile) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            username: profile.email ? profile.email.split("@")[0] : profile.sub,
            displayName: profile.name,
            userType: "STUDENT",
          };
        },
      }),

      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.username || !credentials?.password) return null;

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { username: credentials.username },
                { email: credentials.username },
              ],
            },
          });

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!passwordMatch) return null;

          // Track login activity
          await prisma.performance.upsert({
            where: { userId: user.id },
            update: {
              lastActive: new Date(),
              loginStreak: { increment: 1 },
            },
            create: {
              userId: user.id,
              lastActive: new Date(),
              loginStreak: 1,
            },
          });

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            username: user.username,
            displayName: user.displayName,
            userType: user.userType,
          };
        },
      }),
    ],

    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.username = user.username;
          token.displayName = user.displayName;
          token.userType = user.userType;
        }
        return token;
      },

      async session({ session, token }) {
        if (session.user && token) {
          session.user = {
            ...session.user,
            id: token.id as string,
            username: token.username as string,
            displayName: token.displayName as string,
            userType: token.userType as string,
          };
        }
        return session;
      },
    },

    pages: {
      signIn: "/login", // only override signIn page
    },

    session: {
      strategy: "database", // ✅ match PrismaAdapter
    },

    secret: env.AUTH_SECRET,
  };
}
