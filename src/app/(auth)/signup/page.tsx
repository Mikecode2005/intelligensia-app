"use client";

import { useState } from "react";
import SignUpForm from "./SignUpForm";
import Link from "next/link";
import GlobalStats from "@/components/GlobalStats";
import MiniGlobe from "@/components/MiniGlobe";

type AccountType = "student" | "lecturer" | null;

export default function SignupPage() {
  const [accountType, setAccountType] = useState<AccountType>(null);

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #8B4000 40%, #000000 100%)' }}>
      {/* Left Side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center p-16 w-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-[#FF6B00] text-3xl font-bold">I</span>
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">Intelligensia</span>
          </div>
          
          {/* Main headline */}
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            The future of <span className="text-[#FF6B00]">intelligence</span> starts here.
          </h1>
          
          {/* Additional text under headline */}
          <p className="text-white/80 text-xl max-w-lg leading-relaxed mb-6">
            Unlock your potential with cutting-edge learning tools. Share knowledge and grow with a global community of scholars.
          </p>
          
          <p className="text-white/60 text-base max-w-lg mb-8">
            Whether you are a student seeking knowledge or an educator sharing wisdom, Intelligensia provides the platform to connect, learn, and grow together.
          </p>
          
          {/* Stats directly under headline */}
          <div className="mb-8">
            <GlobalStats />
          </div>
          
          {/* Mini Globe with text */}
          <div className="flex items-center gap-6">
            <MiniGlobe />
            <p className="text-white/70 text-sm">Start your learning journey today</p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden p-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Intelligensia
          </Link>
        </header>
        
        {/* Desktop header */}
        <header className="hidden lg:flex p-8 justify-end">
          <span className="text-white/70">Already have an account?</span>
          <Link href="/login" className="text-white hover:underline font-medium ml-2">
            Sign in
          </Link>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Signup card */}
            <div className="bg-black/50 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Create account</h2>
                <p className="text-white/70">Join thousands of learners today</p>
              </div>

              {/* Account Type Selection */}
              {!accountType ? (
                <div className="space-y-4">
                  <p className="text-white/70 text-sm text-center mb-4">I want to join as a:</p>
                  <button
                    onClick={() => setAccountType("student")}
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-xl hover:border-[#FF6B00]/50 hover:bg-black/60 transition-all duration-300 flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-[#FF6B00]/20 rounded-full flex items-center justify-center group-hover:bg-[#FF6B00]/30 transition-colors">
                      <svg className="w-6 h-6 text-[#FF6B00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold">Student</h3>
                      <p className="text-white/50 text-sm">Learn from experts and track your progress</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setAccountType("lecturer")}
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-xl hover:border-[#FF6B00]/50 hover:bg-black/60 transition-all duration-300 flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-[#FF6B00]/20 rounded-full flex items-center justify-center group-hover:bg-[#FF6B00]/30 transition-colors">
                      <svg className="w-6 h-6 text-[#FF6B00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold">Lecturer</h3>
                      <p className="text-white/50 text-sm">Share knowledge and grow your teaching career</p>
                    </div>
                  </button>

                  {/* Organization option */}
                  <Link
                    href="/signup/organization"
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-xl hover:border-[#FF6B00]/50 hover:bg-black/60 transition-all duration-300 flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-[#FF6B00]/20 rounded-full flex items-center justify-center group-hover:bg-[#FF6B00]/30 transition-colors">
                      <svg className="w-6 h-6 text-[#FF6B00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold">Organization</h3>
                      <p className="text-white/50 text-sm">Register your school or company</p>
                    </div>
                  </Link>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setAccountType(null)}
                    className="text-white/50 text-sm hover:text-white mb-4 flex items-center gap-1"
                  >
                    ← Back to account type selection
                  </button>
                  <SignUpForm accountType={accountType} />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Mobile footer */}
        <footer className="lg:hidden p-6 text-center">
          <p className="text-white/70 text-sm">
            © 2026 Intelligensia. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
