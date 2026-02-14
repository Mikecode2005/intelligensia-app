"use client";

import { useEffect, useState } from "react";

export default function MiniGlobe() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-64 h-64">
      {/* Outer glow ring */}
      <div 
        className="absolute inset-0 rounded-full opacity-40"
        style={{
          background: "conic-gradient(from 0deg, transparent, #FF6B00, transparent, #FF6B00, transparent)",
          animation: "spin 8s linear infinite",
          filter: "blur(8px)",
        }}
      />
      
      {/* Main globe */}
      <div 
        className="absolute inset-4 rounded-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0f1a2a 100%)",
          boxShadow: "inset 0 0 40px rgba(255, 107, 0, 0.15), 0 0 30px rgba(255, 107, 0, 0.2)",
        }}
      >
        {/* Grid lines - longitude (curved) */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
          <ellipse cx="50" cy="50" rx="48" ry="48" fill="none" stroke="rgba(255,107,0,0.3)" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="35" ry="48" fill="none" stroke="rgba(255,107,0,0.3)" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="20" ry="48" fill="none" stroke="rgba(255,107,0,0.3)" strokeWidth="0.5" />
          <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(255,107,0,0.3)" strokeWidth="0.5" />
          <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(255,107,0,0.3)" strokeWidth="0.5" />
        </svg>
        
        {/* Rotating gradient overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(${rotation}deg, transparent 30%, rgba(255, 107, 0, 0.1) 50%, transparent 70%)`,
          }}
        />
      </div>

      {/* Inner highlight */}
      <div 
        className="absolute inset-8 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      />
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
