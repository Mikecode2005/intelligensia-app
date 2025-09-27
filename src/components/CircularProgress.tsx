"use client";

import { useEffect, useState } from "react";

interface CircularProgressProps {
  percentage: number;
  value: string;
  label: string;
  color?: string;
  bgColor?: string;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
}

export default function CircularProgress({
  percentage,
  value,
  label,
  color = "#3b82f6",
  bgColor = "#f3f4f6",
  size = 100,
  strokeWidth = 8,
  animate = true,
}: CircularProgressProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    if (animate) {
      // Animate the progress from 0 to the target percentage
      const duration = 1000; // 1 second
      const startTime = Date.now();
      const startValue = 0;
      const endValue = Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100

      const animateProgress = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        setAnimatedPercentage(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animateProgress);
        }
      };

      requestAnimationFrame(animateProgress);
    } else {
      setAnimatedPercentage(percentage);
    }
  }, [percentage, animate]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={bgColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-300 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {value}
          </span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 text-center">
        {label}
      </span>
    </div>
  );
}