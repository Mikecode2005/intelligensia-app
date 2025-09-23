"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Server action for user logout with NextAuth.js
 * Invalidates the current session and clears the session cookie
 */
export async function logout() {
  try {
    // Sign out using NextAuth.js
    await signOut({ 
      redirect: false, // We'll handle redirect manually
    });

    // Redirect to login page
    return redirect("/login");
    
  } catch (error) {
    console.error("Logout error:", error);
    
    // Still redirect to login even if there's an error
    return redirect("/login");
  }
}