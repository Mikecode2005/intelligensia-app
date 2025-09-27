"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

interface StreakDisplayProps {
  streak: number;
  maxStreak?: number;
  animate?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StreakDisplay({
  streak,
  maxStreak = Math.max(streak, 10),
  animate = true,
  size = "md",
}: StreakDisplayProps) {
  const [animatedStreak, setAnimatedStreak] = useState(0);
  
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  useEffect(() => {
    if (animate) {
      // Animate the streak count
      const duration = 800; // 0.8 seconds
      const startTime = Date.now();
      const startValue = 0;
      const endValue = streak;

      const animateStreak = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutBack = 1 + 2.70158 * Math.pow(progress - 1, 3) + 1.70158 * Math.pow(progress - 1, 2);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutBack);
        
        setAnimatedStreak(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animateStreak);
        } else {
          setAnimatedStreak(streak);
        }
      };

      requestAnimationFrame(animateStreak);
    } else {
      setAnimatedStreak(streak);
    }
  }, [streak, animate]);

  // Calculate the fill percentage for the flame icon
  const fillPercentage = Math.min((streak / maxStreak) * 100, 100);
  
  // Determine flame color based on streak length
  const getFlameColor = () => {
    if (streak >= 30) return "text-red-500";
    if (streak >= 15) return "text-orange-500";
    if (streak >= 7) return "text-yellow-500";
    return "text-gray-400";
  };

  // Generate streak message based on length
  const getStreakMessage = () => {
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "Great start! Keep it going!";
    if (streak < 7) return "Building momentum!";
    if (streak < 15) return "Weekly streak! Amazing!";
    if (streak < 30) return "On fire! Don't stop now!";
    return "Legendary streak! You're unstoppable!";
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Flame Icon with Animation */}
      <div className="relative">
        <Flame 
          className={`${sizeClasses[size]} ${getFlameColor()} transition-colors duration-300`}
          fill={fillPercentage > 0 ? "currentColor" : "none"}
          fillOpacity={fillPercentage > 0 ? 0.3 : 0}
        />
        {/* Animated pulse effect for active streaks */}
        {streak > 0 && (
          <div className={`absolute inset-0 rounded-full bg-current animate-ping opacity-20 ${sizeClasses[size]}`} />
        )}
      </div>
      
      {/* Streak Count and Message */}
      <div className="flex-1">
        <div className="flex items-baseline space-x-2">
          <span className={`font-bold text-gray-900 dark:text-gray-100 ${textSizes[size]}`}>
            {animatedStreak}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            day{streak !== 1 ? 's' : ''} streak
          </span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {getStreakMessage()}
        </p>
        
        {/* Progress Bar */}
        <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
        
        {/* Milestone Indicators */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0</span>
          <span>7</span>
          <span>15</span>
          <span>30+</span>
        </div>
      </div>
    </div>
  );
}