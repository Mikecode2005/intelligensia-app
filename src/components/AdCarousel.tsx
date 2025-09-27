"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface Ad {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  sponsorName: string;
  sponsorLogo: string;
}

interface AdCarouselProps {
  ads: Ad[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function AdCarousel({
  ads,
  className,
  autoPlay = true,
  autoPlayInterval = 5000,
}: AdCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If there are no ads, don't render anything
  if (!ads || ads.length === 0) {
    return null;
  }

  const nextAd = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  const prevAd = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
  };

  const goToAd = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || ads.length <= 1) return;

    const timer = setInterval(nextAd, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, ads.length]);

  const currentAd = ads[currentIndex];

  return (
    <Card className={cn("w-full overflow-hidden border-border", className)}>
      <CardContent className="p-0">
        <div className="relative">
          {/* Ad Image */}
          <div className="relative h-48 md:h-64 w-full">
            <Image
              src={currentAd.imageUrl}
              alt={currentAd.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Navigation Arrows */}
          {ads.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
                onClick={prevAd}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
                onClick={nextAd}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Ad Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{currentAd.title}</h3>
                <p className="text-sm text-white/90 mb-3 line-clamp-2">
                  {currentAd.description}
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <div className="relative h-8 w-8">
                  <Image
                    src={currentAd.sponsorLogo}
                    alt={currentAd.sponsorName}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-white/80">
                Sponsored by {currentAd.sponsorName}
              </span>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                asChild
              >
                <a href={currentAd.ctaUrl} target="_blank" rel="noopener noreferrer">
                  {currentAd.ctaText}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>

          {/* Dots Indicator */}
          {ads.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {ads.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/70"
                  )}
                  onClick={() => goToAd(index)}
                  aria-label={`Go to ad ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}