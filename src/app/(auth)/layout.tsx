// src/app/(main)/layout.tsx
import validateRequest from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  // Protect only (main) routes
 

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
