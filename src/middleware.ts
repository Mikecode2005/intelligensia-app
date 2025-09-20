import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Authentication middleware
 * Protects routes and redirects unauthenticated users
 */
export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Check if the pathname is for auth pages
  const isAuthPage = pathname.startsWith("/login") || 
                     pathname.startsWith("/signup") || 
                     pathname.startsWith("/forgot-password");

  // Get the token from the request
  const token = await getToken({ 
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  });
  
  const isAuthenticated = !!token;

  // If the user is on an auth page and is authenticated, redirect to dashboard
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is not authenticated and not on a public path, redirect to login
  if (!isAuthenticated && !isPublicPath(pathname)) {
    // Store the original URL to redirect back after login
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    
    return NextResponse.redirect(redirectUrl);
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}

/**
 * Check if a path is public (doesn't require authentication)
 */
function isPublicPath(pathname: string) {
  const publicPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/api/auth",
    "/api/health",
    "/_next",
    "/favicon.ico",
    "/assets",
  ];
  
  return publicPaths.some(path => pathname.startsWith(path));
}

/**
 * Matcher configuration for the middleware
 * Specifies which paths the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (e.g. robots.txt)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};