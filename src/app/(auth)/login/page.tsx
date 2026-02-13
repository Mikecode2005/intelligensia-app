import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login"
}

export default function page() {
  return (
    <main className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center relative font-display">
      {/* Decorative Animated-style Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-primary rounded-full"></div>
        <div className="glow-orb absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-primary/30 rounded-full"></div>
        <div className="glow-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-white/5 rounded-full"></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full max-w-[1200px] px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
        {/* Left Side: Brand & Visuals */}
        <div className="hidden lg:flex flex-col space-y-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-icons text-white text-3xl">psychology</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">Intelligensia</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl font-extrabold text-white leading-[1.1]">
              The future of <span className="text-primary">intelligence</span> starts here.
            </h1>
            <p className="text-white/60 text-xl max-w-md leading-relaxed">
              Access our world-class neural networks and high-performance computing clusters with a single secure login.
            </p>
          </div>
          <div className="flex items-center space-x-6 pt-8">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" alt="User avatar 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTXK5uGc2XULC0YMycb4PAym39DqUqWmDxx7gjR4IS7qqxWY0eUWwGmwv6z_zg68skm0J8rBnOM-j5bx8-eYDOyxo8Ezf8RdSiieV88P7SDOzaLgL7s3NyOFOwZGFlmj-KotxFkEOsJAPXt7siYV1tDAsopTdp1C0G41iUA-LWT2IGXRXPL6G0pF7M_EPets1zLsY3InXAptB19-ePCVpj5IE3oq5ANttVEptAmRBaCSoLmNdhqZkkM4_uRIoQ4gWgf-jWZaE4vjM"/>
              <img className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" alt="User avatar 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_-kA9ESzxO9DBd4CTgxAdPpglBxR6bEsxAZNdRKcxXa3rpTyS5efcZAoMdlECOj3D8awnJt0DjjyPupOl1xdRLMu2sNtWreYPgH53IhailPqKzCaQHwhVSNgErxCmYn1nRDc_bKYAMtBNHN4lcbPwmrDwHZ0hvNijN1LVsXqeTYJs5uOcnhakVOVLGoC9SqCgmy1kCtLB03Uvm3x7-LsmCqf1LQ23xwOf9IFIvJa1qfGVCRk37OS_G8YlzQNqdAl8y1yIGwNcVHI"/>
              <img className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" alt="User avatar 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAavgqrGvunSLlO7iVYSLTjGQgzqT6JTRTVyjGYGrLj2pnbfkZzPDoAI-L72m315KEX5B50YxjIeWlJYPdJxnuCPGrzSqsQd_JOXkj6ZY11eF5D3QdAlNzNbscs7EXWOxbrhIQ9765-Orh8XoaV8gmk4ym-YtQPYcP0JIlEK3MymUNEJ7U1avDoraXpGikWzHHqQYZiw2yd33SxO37GN2qr_uNiGB-PskSlYVmRz-HGvU3xxW_kPap1XY-WEix9HKFW0IfPmYtEoiU"/>
              <div className="w-10 h-10 rounded-full border-2 border-background-dark bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">+2k</div>
            </div>
            <p className="text-white/40 text-sm">Joined by over 2,000+ researchers today.</p>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="glass-card p-10 rounded-xl shadow-2xl">
            {/* Mobile Logo (visible only on small screens) */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <span className="material-icons text-white text-3xl">psychology</span>
              </div>
            </div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-white/50">Enter your credentials to access your workspace.</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center space-x-4">
        <a className="text-white/30 text-xs hover:text-white transition-colors" href="#">Privacy Policy</a>
        <span className="text-white/10">•</span>
        <a className="text-white/30 text-xs hover:text-white transition-colors" href="#">Terms of Service</a>
        <span className="text-white/10">•</span>
        <a className="text-white/30 text-xs hover:text-white transition-colors" href="#">Contact Support</a>
      </div>

      {/* Background Decoration: Subtle Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
      
      {/* Add CSS-in-JS styles for glassmorphism and animations */}
      <style jsx global>{`
        .glass-card {
          background: rgba(34, 25, 16, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(244, 140, 37, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        
        .glass-card:hover {
          border-color: rgba(244, 140, 37, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
        }
        
        .glow-orb {
          filter: blur(80px);
          opacity: 0.4;
          animation: float 6s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        
        .glow-orb:nth-child(1) { animation-delay: 0s; }
        .glow-orb:nth-child(2) { animation-delay: 2s; }
        .glow-orb:nth-child(3) { animation-delay: 4s; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .material-icons {
          font-family: 'Material Icons';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(244, 140, 37, 0.5), 0 0 10px rgba(244, 140, 37, 0.3); 
          }
          50% { 
            box-shadow: 0 0 20px rgba(244, 140, 37, 0.8), 0 0 30px rgba(244, 140, 37, 0.5); 
          }
        }
        
        .group:focus-within .material-icons {
          color: #f48c25 !important;
          transform: scale(1.1);
        }
        
        .transition-all {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .transform {
          transform: translateZ(0);
        }
      `}</style>
    </main>
  );
}
