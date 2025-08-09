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
import { loginSchema, LoginValues } from "@/lib/validation";
import Image from "next/image";
import { useState, useTransition } from "react";
import { login } from "./actions";
import { PasswordInput } from "@/components/passwordinpt";
import LoadingButton from "@/components/LoadingButton";

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: LoginValues) {
    setError(undefined);
    startTransition(async () => {
      try {
        const result = await login(values); // Directly pass values without nesting
        if (result?.error) {
          setError(result.error);
        }
        // Redirect is handled in server action
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Login error:", err);
      }
    });
  }

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
            priority
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center text-orange-600 dark:text-orange-400 mb-2">
        Welcome Back
      </h2>
      <p className="text-center text-neutral-600 dark:text-neutral-400 mb-6">
        Log in to your account
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

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
                    placeholder="Enter your username or email"
                    className="focus:ring-2 focus:ring-orange-500 border-orange-200 dark:border-orange-800 dark:bg-neutral-800"
                    autoComplete="username"
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
                  <PasswordInput
                    placeholder="Enter your password"
                    className="focus:ring-2 focus:ring-orange-500 border-orange-200 dark:border-orange-800 dark:bg-neutral-800"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          <LoadingButton
            loading={isPending}
            type="submit"
            disabled={!form.formState.isValid || isPending}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-orange-500/20 dark:bg-orange-500 dark:hover:bg-orange-600"
          >
            {isPending ? "Logging in..." : "Log In"}
          </LoadingButton>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-orange-200 dark:border-orange-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-orange-600 hover:underline dark:text-orange-400"
                >
                  Sign up
                </a>
              </span>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}