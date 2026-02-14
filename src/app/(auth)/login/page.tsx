import LoginForm from "./LoginForm";
import Link from "next/link";
import GlobalStats from "@/components/GlobalStats";
import MiniGlobe from "@/components/MiniGlobe";

export default function LoginPage() {
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
          
          <p className="text-white/60 text-base max-w-lg mb-10">
            Whether you're a student seeking knowledge or an educator sharing wisdom, Intelligensia provides the platform to connect, learn, and grow together.
          </p>
          
          {/* Stats */}
          <div className="mb-10">
            <GlobalStats />
          </div>
          
          {/* Mini Globe with text */}
          <div className="flex items-center gap-6">
            <MiniGlobe />
            <p className="text-white/70 text-sm">Join learners worldwide</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden p-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Intelligensia
          </Link>
        </header>
        
        {/* Desktop header */}
        <header className="hidden lg:flex p-8 justify-end">
          <span className="text-white/70">Do not have an account?</span>
          <Link href="/signup" className="text-white hover:underline font-medium ml-2">
            Sign up
          </Link>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Login card */}
            <div className="bg-black/50 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
                <p className="text-white/70">Sign in to continue your journey</p>
              </div>
              
              <LoginForm />
              
              {/* Organizational Login */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white/50 text-sm text-center mb-4">Are you an organization?</p>
                <Link 
                  href="/login/organization"
                  className="block w-full py-3 px-4 bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-lg text-[#FF6B00] text-center font-medium transition-all duration-300"
                >
                  Login as Organization
                </Link>
              </div>
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
