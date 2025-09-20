import { google } from "@/auth";
import { cookies } from "next/headers";
import { generateState, generateCodeVerifier } from "arctic";
import { env } from "@/lib/env";

/**
 * Google OAuth initialization endpoint
 * Generates state and code verifier, then redirects to Google OAuth
 */
export async function GET() {
  try {
    // Generate state and code verifier for PKCE
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    
    // Store state and code verifier in cookies
    cookies().set("state", state, {
      path: "/",
      secure: env.IS_PRODUCTION,
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
      sameSite: "lax",
    });
    
    cookies().set("code_verifier", codeVerifier, {
      path: "/",
      secure: env.IS_PRODUCTION,
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
      sameSite: "lax",
    });
    
    // Generate authorization URL with scopes
    const url = await google.createAuthorizationURL(state, codeVerifier, {
      scopes: ["profile", "email"],
    });
    
    // Return URL for client-side redirect
    return Response.json({ url: url.toString() });
  } catch (error) {
    console.error("Error creating Google OAuth URL:", error);
    
    return Response.json(
      { error: "Failed to create authorization URL" },
      { status: 500 }
    );
  }
}