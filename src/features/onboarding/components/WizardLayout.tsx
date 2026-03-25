"use client";

import React, { useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/stores/useUserStore";
import { stepMeta, stepKeys, type StepKey } from "@/features/onboarding/schema";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Luxury Editorial Motion Variants ───
// Instead of fades, we use subtle slide-up (translate-y)
const pageVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 30 : -30,
    opacity: 0,
    scale: 0.99,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -30 : 30,
    opacity: 0,
    scale: 0.99,
  }),
};

const pageTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 25,
  mass: 1,
};

const headerVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

interface WizardLayoutProps {
  children: React.ReactNode;
  onNext: () => Promise<boolean> | boolean;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  canProceed?: boolean;
  direction: number;
  setDirection: (d: number) => void;
}

export function WizardLayout({
  children,
  onNext,
  onSubmit,
  isSubmitting = false,
  canProceed = true,
  direction,
  setDirection,
}: WizardLayoutProps) {
  const { currentStep, prevStep, nextStep } = useUserStore();

  const totalSteps = stepKeys.length;
  const currentKey: StepKey = stepKeys[currentStep];
  const meta = stepMeta[currentKey];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      prevStep();
    }
  }, [currentStep, prevStep, setDirection]);

  const handleNext = useCallback(async () => {
    if (isSubmitting) return;

    const isValid = await onNext();
    if (!isValid) return;

    if (isLastStep && onSubmit) {
      onSubmit();
    } else {
      setDirection(1);
      nextStep();
    }
  }, [isSubmitting, isLastStep, onNext, onSubmit, nextStep, setDirection]);

  // Luxury indicator dots
  const stepDots = useMemo(
    () =>
      stepKeys.map((key, i) => (
        <motion.div
          key={key}
          layout
          className={cn(
            "h-[2px] rounded-full transition-all duration-300",
            i === currentStep
              ? "w-8 bg-secondary"
              : i < currentStep
              ? "w-2 bg-secondary/40"
              : "w-2 bg-white/10"
          )}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )),
    [currentStep]
  );

  return (
    <div className="min-h-screen bg-background text-muted-foreground flex flex-col font-sans selection:bg-secondary/30">
      {/* ─── Floating Top Bar (iOS Native Glass) ─── */}
      <header className="sticky top-0 z-50 glass-container px-6 py-5">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.1em] uppercase text-white/40">
            <span className="text-secondary/80">Step {currentStep + 1} / {totalSteps}</span>
            <span className="tracking-widest">Progress {Math.round(progressPercent)}%</span>
          </div>
          
          <div className="relative h-[2px] w-full bg-white/5 overflow-hidden rounded-full">
            <motion.div 
              className="absolute h-full gradient-primary bg-secondary/80"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>

          <div className="flex items-center justify-center gap-2">
            {stepDots}
          </div>
        </div>
      </header>

      {/* ─── Main Editorial Container ─── */}
      <main className="flex-1 flex flex-col items-center justify-start editorial-spacing overflow-hidden">
        <div className="w-full max-w-xl">
          {/* Animated step header (Tight & Bold) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`header-${currentKey}`}
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="text-left mb-12"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.span
                  className="text-3xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {meta.icon}
                </motion.span>
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold/40">Awdan Vibes</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl tight-header font-heading text-foreground mb-4">
                {meta.title}
              </h1>
              <p className="text-base md:text-lg body-airy text-muted-foreground/80">
                {meta.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Animated step content with slide-up transition */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`content-${currentStep}`}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="relative"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ─── Footer Action Layer ─── */}
      <footer className="sticky bottom-0 z-50 glass-container border-t border-b-0 px-8 py-6">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-6">
          {/* Back button (Subtle) */}
          <div className="w-24">
            {!isFirstStep && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleBack}
                disabled={isSubmitting}
                className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                Back
              </motion.button>
            )}
          </div>

          {/* Progress Indicator Action */}
          <div className="flex-1 flex justify-center">
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-secondary/20 border-t-secondary rounded-full"
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Analyzing Profile</span>
              </div>
            ) : null}
          </div>

          {/* Next / Submit button (Sharp & Primary) */}
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className={cn(
                "h-12 px-8 rounded-sm bg-primary text-white font-bold uppercase tracking-[0.15em] text-[10px] border border-white/10 hover:bg-primary-dark transition-all shadow-premium hover:shadow-premium-lg group",
                isLastStep && "bg-secondary text-background border-none hover:bg-secondary/90"
              )}
            >
              {isLastStep ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-2" />
                  Launch Journey
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
