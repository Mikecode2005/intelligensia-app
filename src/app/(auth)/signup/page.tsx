import { Metadata } from "next";
import SignUpForm from "./SignUpForm";
import FloatingWords from "@/components/FloatingWords";

export const metadata: Metadata =  {
    title: "sign up"
}

export default function page() {

    return (
      <main className="relative flex h-screen items-center justify-center p-5 bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <FloatingWords />
        <div className="relative z-10 flex items-center justify-center w-full max-w-md">
          <div className="space-y-6 w-full">
            <div className="space-y-1 text-center">
                <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-500">Sign Up to Intelligensia</h1>
                <p className="text-muted-foreground">
                    A place to connect with students all over the world
                </p>
            </div>
            <div className="space-y-5">
                <SignUpForm />

            </div>
          </div>
        </div>
    </main>
    );
}
