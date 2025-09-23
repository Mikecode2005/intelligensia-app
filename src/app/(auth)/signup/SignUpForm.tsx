"use client";

import { useForm, Controller } from "react-hook-form";
import Logo from "@/assets/Intelligwntia.png"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import Image from "next/image";
import { useState } from "react";
import { signUp } from "./actions";
import { PasswordInput } from "@/components/passwordinpt";
import LoadingButton from "@/components/LoadingButton";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const { loginWithGoogle } = useAuth();
    const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    setError(undefined);
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("username", values.username);
      formData.append("password", values.password);
      
      const result = await signUp(formData);
      
      if (result?.error) {
        setError(result.error);
      }
      // Redirect is handled in the server action
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle("/onboarding");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-xl p-8 shadow-lg bg-white dark:bg-neutral-900 border border-orange-100 dark:border-orange-900/50">
      {/* Logo Section */}
      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-16">
          <Image 
            src={Logo}
            alt="Intelligensia Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center text-orange-600 dark:text-orange-400 mb-2">
        Create Your Account
      </h2>
      <p className="text-center text-neutral-600 dark:text-neutral-400 mb-6">
        Join our community of innovators
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-700 dark:text-neutral-300">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="enter your email"
                    className="focus:ring-2 focus:ring-orange-500 border-orange-200 dark:border-orange-800 dark:bg-neutral-800"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          <Controller
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-700 dark:text-neutral-300">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username"
                    className="focus:ring-2 focus:ring-orange-500 border-orange-200 dark:border-orange-800 dark:bg-neutral-800"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-700 dark:text-neutral-300">
                  Password
                </FormLabel>
                <FormControl>
                 <PasswordInput placeholder="password" {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          <LoadingButton
            loading={isLoading}
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-orange-500/20 dark:bg-orange-500 dark:hover:bg-orange-600"
          >
            Sign Up
          </LoadingButton>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-orange-200 dark:border-orange-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950 py-2.5 px-4 rounded-lg transition duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-orange-200 dark:border-orange-800"></div>
            </div>
          </div>

           <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">
                Already Have an Account?{" "}
                <a 
                  href="/login" 
                  className="text-orange-600 hover:underline dark:text-orange-400"
                >
                  Log in
                </a>
              </span>
            </div>

        </form>
      </Form>
    </div>
  );
}