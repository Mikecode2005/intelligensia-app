"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "./ReactQueryProvider";
import AuthProvider from "@/components/providers/AuthProvider";

export function Providers({ 
  children, 
  session 
}: { 
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
      </AuthProvider>
    </SessionProvider>
  );
}