// lib/auth.ts
import { Google } from "arctic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

/**
 * Get the current session on the server
 * @returns The current session or null if not authenticated
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Validate the request and get the current user
 * @returns Object containing the current user or null if not authenticated
 */
export async function validateRequest() {
  const session = await getServerSession(authOptions);
  return { user: session?.user };
}

/**
 * Get the current user on the server
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * Check if the user is authenticated and redirect if not
 * @param redirectTo The path to redirect to if not authenticated
 * @returns The current user
 */
export async function requireAuth(redirectTo = "/login") {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect(redirectTo);
  }
  
  return user;
}

/**
 * Check if the user is authenticated with a specific role
 * @param roles Array of allowed roles
 * @param redirectTo The path to redirect to if not authorized
 * @returns The current user
 */
export async function requireRole(roles: string[], redirectTo = "/unauthorized") {
  const user = await requireAuth();
  
  // Ensure user has a userType and it's included in the allowed roles
  if (!user.userType || !roles.includes(user.userType)) {
    redirect(redirectTo);
  }
  
  return user;
}

/**
 * Check if the user is authenticated and redirect to dashboard if they are
 * Useful for auth pages like login/signup where authenticated users shouldn't access
 * @param redirectTo The path to redirect to if authenticated (default: "/dashboard")
 * @returns The current user or null if not authenticated
 */
export async function requireNoAuth(redirectTo = "/dashboard") {
  const user = await getCurrentUser();
  
  if (user) {
    redirect(redirectTo);
  }
  
  return user;
}

/**
 * Get the current user without throwing errors
 * Useful for components that should work for both authenticated and non-authenticated users
 * @returns The current user or null if not authenticated
 */
export async function safeGetUser() {
  try {
    const session = await getSession();
    return session?.user || null;
  } catch (error) {
    return null;
  }
}

/**
 * Check if the current user has a specific role
 * @param role The role to check for
 * @returns Boolean indicating if user has the role
 */
export async function hasRole(role: string) {
  const user = await getCurrentUser();
  return user?.userType === role;
}

/**
 * Check if the current user has any of the specified roles
 * @param roles Array of roles to check for
 * @returns Boolean indicating if user has any of the roles
 */
export async function hasAnyRole(roles: string[]) {
  const user = await getCurrentUser();
  return user?.userType ? roles.includes(user.userType) : false;
}
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.NODE_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`
    : "http://localhost:3000/api/auth/callback/google"
);
