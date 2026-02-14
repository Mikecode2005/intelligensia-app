"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, LoginValues } from "@/lib/validation";
import { useState } from "react";
import { PasswordInput } from "@/components/passwordinpt";
import LoadingButton from "@/components/LoadingButton";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { login } from "./actions";

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

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
    setIsLoading(true);
    
    try {
      // Create FormData to pass to server action
      const formData = new FormData();
      formData.append("email", values.username);
      formData.append("password", values.password);
      
      const result = await login(formData);
      
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle(callbackUrl);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </p>
        )}

        <div>
          <label className="block text-white/70 text-sm font-medium mb-2 px-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 z-10" />
            <Controller
              name="username"
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder="name@company.com"
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00] transition-all duration-300"
                  autoComplete="username"
                  {...field}
                />
              )}
            />
          </div>
          <FormMessage className="text-red-400 text-xs mt-1" />
        </div>

        <div>
          <div className="flex justify-between mb-2 px-1">
            <FormLabel className="text-white/70 text-sm font-medium">Password</FormLabel>
            <a className="text-primary text-sm font-medium hover:text-primary/80 transition-colors" href="#">
              Forgot?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 z-10" />
            <Controller
              name="password"
              control={form.control}
              render={({ field }) => (
                <PasswordInput
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-4 pl-12 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00] transition-all duration-300"
                  autoComplete="current-password"
                  {...field}
                />
              )}
            />
          </div>
          <FormMessage className="text-red-400 text-xs mt-1" />
        </div>

        <div className="flex items-center space-x-2 px-1">
          <input 
            className="w-5 h-5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-offset-background-dark" 
            id="remember" 
            type="checkbox"
          />
          <label className="text-white/50 text-sm" htmlFor="remember">Remember me for 30 days</label>
        </div>

        <LoadingButton
          loading={isLoading}
          type="submit"
          disabled={!form.formState.isValid || isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 transform active:scale-[0.98]"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </LoadingButton>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-white/30 text-xs font-semibold uppercase tracking-wider">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="white"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="white"></path>
            </svg>
            <span className="text-white text-sm font-medium">Google</span>
          </button>
          
          <button
            type="button"
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 group"
          >
            <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.96.95-2.18 1.78-3.78 1.78-1.42 0-2.43-.88-3.51-.88s-2.09.88-3.51.88c-1.6 0-2.82-.83-3.78-1.78-2.85-2.81-2.85-8.24 0-11.05 1.02-1.01 2.37-1.65 3.84-1.65 1.42 0 2.21.84 3.45.84 1.23 0 2.02-.84 3.45-.84 1.47 0 2.82.64 3.84 1.65 1.42 1.41 1.99 3.54 1.45 5.53-.29 1.1-.9 2.14-1.74 3.12l.01.01zM12.03 7.25c-.02-2.23 1.64-4.07 3.7-4.25.19 2.44-1.92 4.34-3.7 4.25z"></path>
            </svg>
            <span className="text-white text-sm font-medium">Apple</span>
          </button>
        </div>
      </form>
    </Form>
  );
}
