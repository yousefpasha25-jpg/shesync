import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  withText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function BrandLogo({ className, withText = true, size = "md" }: BrandLogoProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-xl",
    xl: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative overflow-hidden rounded-full border-2 border-white/20 shadow-sm transition-transform hover:scale-110", sizes[size])}>
        <Image
          src="/awdan-logo.jpg.jpeg"
          alt="Awdan Vibes Logo"
          fill
          className="object-cover"
          priority
        />
      </div>
      {withText && (
        <span className={cn("font-bold tracking-tight text-white italic", textSizes[size])}>
          Awdan Vibes
        </span>
      )}
    </div>
  );
}
