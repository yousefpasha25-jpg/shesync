"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroSection } from "./HeroSection";
import dynamic from "next/dynamic";
const TrustSections = dynamic(() => import("./TrustSections").then(mod => mod.TrustSections));
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/button";
import { Globe, LogIn } from "lucide-react";
import Link from "next/link";

const Landing = () => {
  const { isRTL, language } = useTranslation();
  const { toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30" dir={isRTL ? "rtl" : "ltr"}>
      {/* Premium Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/5 backdrop-blur-xl border-b border-white/5">
        <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrandLogo size="md" withText={true} className="flex-row items-center gap-3" />
          </Link>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleLanguage}
              className="hidden md:flex gap-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'Arabic' : 'English'}
            </Button>
            
            <Link 
              href="/login" 
              className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors flex items-center gap-2 px-4"
            >
              <LogIn className="size-4" />
              Login
            </Link>

            <Button asChild className="bg-primary hover:bg-primary/90 text-black font-black italic rounded-xl px-6">
              <Link href="/onboarding">START YOUR PLAN</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main>
        <HeroSection />
        
        {/* Core Value Proposition Area */}
        <section className="py-24 border-y border-white/5 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">01</div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter">AI-Driven Insights</h3>
                <p className="text-muted-foreground leading-relaxed">Our engine analyzes your unique biometrics and cycle data to generate the perfect workout protocol every single day.</p>
              </div>
              <div className="space-y-4">
                <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">02</div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Bio-Adaptive Training</h3>
                <p className="text-muted-foreground leading-relaxed">Workouts that evolve with you. As you get stronger, SheSync adapts your load, volume, and recovery cycles automatically.</p>
              </div>
              <div className="space-y-4">
                <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">03</div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Hormonal Syncing</h3>
                <p className="text-muted-foreground leading-relaxed">Optimize your performance by aligning your training with your hormonal cycle for maximum results and better recovery.</p>
              </div>
            </div>
          </div>
        </section>

        <TrustSections />
      </main>

      {/* Modern Footer */}
      <footer className="py-20 bg-black text-white/40 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <BrandLogo size="md" withText={true} />
              <p className="max-w-xs text-center md:text-left text-sm">
                Transforming women's health through elite technology and specialized fitness expertise.
              </p>
            </div>
            
            <div className="flex gap-12 text-sm font-bold uppercase tracking-widest">
              <Link href="/about" className="hover:text-primary transition-colors">About</Link>
              <Link href="/train" className="hover:text-primary transition-colors">Programs</Link>
              <Link href="/onboarding" className="hover:text-primary transition-colors">Start Plan</Link>
            </div>

            <div className="space-y-2 text-center md:text-right">
              <p className="text-white font-bold tracking-tighter italic">SheSync</p>
              <p className="text-[10px] uppercase tracking-widest opacity-50">© 2026 SHESYNC. ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
