import { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";
import loginImage from "@/assets/login-image.jpg"; // Adjust path if needed
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login"
}

export default function page() {
  return (
    <main className="flex h-screen items-center justify-center p-5 bg-gray-50 dark:bg-gray-900">
      <div className="shadow-2xl flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
        <div className="md:w-1/2 space-y-6 overflow-y-auto p-10 flex flex-col justify-center">
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
        
        {/* Image Section */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src={loginImage}
            alt="Login illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </main>
  );
}