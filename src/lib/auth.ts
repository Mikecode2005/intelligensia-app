import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

/**
 * Get the current session on the server
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Validate request (returns { user })
 */
export async function validateRequest() {
  const session = await getServerSession(authOptions);
  return { user: session?.user };
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * Require authentication
 */
export async function requireAuth(redirectTo = "/login") {
  const user = await getCurrentUser();
  if (!user) redirect(redirectTo);
  return user;
}

/**
 * Require role-based authentication
 */
export async function requireRole(roles: string[], redirectTo = "/dashboard") {
  const user = await requireAuth();
  if (!roles.includes(user.userType)) {
    redirect(redirectTo);
  }
  return user;
}
