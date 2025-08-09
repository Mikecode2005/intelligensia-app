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
import { useState, useTransition } from "react";
import { signUp } from "./actions";
import { PasswordInput } from "@/components/passwordinpt";
import LoadingButton from "@/components/LoadingButton";

export default function SignUpForm() {
    const [error, setError] = useState<string>();

    const [isPending, startTransition] = useTransition(); 

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
    startTransition(async () => {
        const { error } = await signUp(values);
        if (error) setError(error);
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
          {error && <p className="text-destructive">{error}</p>}
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
            loading={isPending}
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-orange-500/20 dark:bg-orange-500 dark:hover:bg-orange-600"
          >
            Sign Up
          </LoadingButton>

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