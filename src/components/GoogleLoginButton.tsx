"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Fetch the Google OAuth URL from our API
      const response = await fetch("/api/auth/google");
      const { url } = await response.json();
      
      // Redirect to Google OAuth
      window.location.href = url;
    } catch (error) {
      console.error("Google login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950"
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      ) : (
        <FcGoogle className="h-5 w-5" />
      )}
      <span>{isLoading ? "Connecting..." : "Continue with Google"}</span>
    </Button>
  );
}