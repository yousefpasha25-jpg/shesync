"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Dumbbell, Apple, Sparkles, Users, User } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Train", icon: Dumbbell, href: "/train" },
  { label: "Eat", icon: Apple, href: "/eat" },
  { label: "AI Coach", icon: Sparkles, href: "/coach" },
  { label: "Community", icon: Users, href: "/community" },
  { label: "About", icon: Sparkles, href: "/about" },
  { label: "Profile", icon: User, href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  // Don't show on landing or onboarding
  if (pathname === "/" || pathname === "/onboarding") return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-card/80 backdrop-blur-md border-t border-border px-6 pb-8 pt-4">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
