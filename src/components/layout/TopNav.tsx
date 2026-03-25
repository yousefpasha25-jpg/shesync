"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Moon, Sun, Languages, LogOut, CreditCard } from "lucide-react";

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const { toggleLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Don't show on landing or auth pages
  const hiddenRoutes = ["/", "/login", "/signup"];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrandLogo size="sm" withText={true} className="flex-row items-center gap-3" />
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors hidden md:block"
          >
            About
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={() => router.push("/pricing")}>
            <CreditCard className="h-4 w-4" />
            Plans & Pricing
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Toggle language">
            <Languages className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {!mounted ? (
              <div className="h-4 w-4" />
            ) : theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
