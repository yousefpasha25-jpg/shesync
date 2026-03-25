"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2670&auto=format&fit=crop"
          alt="Fitness Background"
          fill
          className="object-cover grayscale opacity-20 scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest"
          >
            <Sparkles className="size-4" />
            Empowering Women Through AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] italic italic"
          >
            AI FITNESS COACH <br /> 
            <span className="text-primary italic underline underline-offset-8 decoration-4">FOR WOMEN</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Personalized training and nutrition powered by AI. Transform your body, mindset, and lifestyle with Awdan Vibes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild size="lg" className="group rounded-2xl px-12 py-8 text-xl font-bold italic h-auto">
              <Link href="/onboarding">
                START YOUR PLAN
                <ArrowRight className="ml-2 size-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl px-12 py-8 text-xl font-bold h-auto border-2">
              <Link href="/about">LEARN MORE</Link>
            </Button>
          </motion.div>

          {/* Social Proof Mini */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 pt-8 opacity-50 grayscale hover:grayscale-0 transition-all"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Expert Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-5" />
              <span className="text-xs font-bold uppercase tracking-widest">AI Personalized</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="size-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Clinically Sound</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
