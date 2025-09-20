// src/app/(main)/layout.tsx
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

 

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
