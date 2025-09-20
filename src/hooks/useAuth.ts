"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Custom hook for authentication
 * Provides session data and authentication methods
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;
  
  /**
   * Login with credentials
   * @param username Username or email
   * @param password Password
   * @param redirectTo Path to redirect to after login
   */
  const login = async (username: string, password: string, redirectTo?: string) => {
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        return { success: false, error: result.error };
      }
      
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/dashboard");
      }
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };
  
  /**
   * Login with Google
   * @param redirectTo Path to redirect to after login
   */
  const loginWithGoogle = async (redirectTo?: string) => {
    try {
      await signIn("google", {
        callbackUrl: redirectTo || "/dashboard",
      });
      
      return { success: true };
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };
  
  /**
   * Logout the current user
   * @param redirectTo Path to redirect to after logout
   */
  const logout = async (redirectTo?: string) => {
    try {
      await signOut({
        redirect: false,
      });
      
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/login");
      }
      
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };
  
  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout,
  };
}