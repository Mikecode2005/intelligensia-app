import { Metadata } from "next";
import LoginForm from "./LoginForm";
import FloatingWords from "@/components/FloatingWords";

export const metadata: Metadata = {
  title: "Login"
}

export default function page() {
  return (
    <main className="relative flex h-screen items-center justify-center p-5 bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <FloatingWords />
      <div className="relative z-10 flex items-center justify-center w-full max-w-md">
        <div className="space-y-6 w-full">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-500">
              Log in to Intelligensia
            </h1>
            <p className="text-muted-foreground">
              A place to connect with students all over the world
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
