// app/api/auth/callback/google/route.ts
import { google } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { slugify } from "@/lib/utils";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value;

  if (!code || !state || state !== storedState) {
    return new Response("Invalid OAuth callback parameters", { status: 400 });
  }

  try {
    // 🔑 Exchange code for tokens
    const tokens = await google.validateAuthorizationCode(code);

    // 🔎 Fetch Google user info
    const googleUserRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      }
    );
    const googleUser = await googleUserRes.json() as {
      id: string;
      name: string;
      email?: string;
      picture?: string;
    };

    // 🗂 Check for existing user
    let user = await prisma.user.findUnique({
      where: { googleId: googleUser.id },
    });

    if (!user) {
      // 🆕 Create new user
      const userId = crypto.randomUUID();
      const username = slugify(googleUser.name) + "-" + userId.slice(0, 4);

      user = await prisma.user.create({
        data: {
          id: userId,
          username,
          displayName: googleUser.name,
          email: googleUser.email,
          avatarUrl: googleUser.picture,
          googleId: googleUser.id,
          userType: "STUDENT",
        },
      });

      // Optional: create performance row
      await prisma.performance.create({
        data: {
          userId,
          loginStreak: 1,
          lastActive: new Date(),
        },
      });

      // Optional: Stream chat user
      if (process.env.NEXT_PUBLIC_STREAM_KEY && process.env.STREAM_SECRET) {
        await streamServerClient.upsertUser({
          id: userId,
          username,
          name: googleUser.name,
          image: googleUser.picture,
        });
      }
    }

    // ✅ Store user ID in cookie (replace Lucia)
    cookies().set("auth_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Redirect to dashboard or onboarding
    return Response.redirect(new URL("/dashboard", req.url));
  } catch (err) {
    console.error("Google OAuth error:", err);

    if (err instanceof OAuth2RequestError) {
      return new Response("OAuth authentication failed", { status: 400 });
    }

    return new Response("Internal server error during authentication", {
      status: 500,
    });
  }
}
