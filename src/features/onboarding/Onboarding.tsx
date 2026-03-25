"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OnboardingData } from "./types";
import { saveOnboardingDataAction } from "@/features/onboarding/actions";
import { NewStep1, NewStep2, NewStep3, NewStep4, NewStep5 } from "./Steps1-5";

const TOTAL_STEPS = 5;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center">
        <div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const next = (newData: any) => {
    setData((prev) => ({ ...prev, ...newData }));
    setDir(1);
    setStep((s) => s + 1);
  };

  const back = () => {
    setDir(-1);
    setStep((s) => s - 1);
  };

  const complete = async (finalData?: any) => {
    try {
      const merged = { ...data, ...(finalData || {}) };
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Please log in again.",
        });
        router.push("/login");
        return;
      }
      await saveOnboardingDataAction(merged);
      router.push("/dashboard");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error saving profile",
        description: err.message || "Please try again.",
      });
    }
  };

  const isFullScreen = step === 1 || step === 5;
  const props = {
    data,
    onNext: next,
    onBack: back,
    onComplete: complete,
    step,
    totalSteps: TOTAL_STEPS,
  };

  return (
    <div
      className={
        isFullScreen ? "fixed inset-0 overflow-hidden" : "min-h-screen bg-[#050505] overflow-hidden"
      }
    >
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          className="w-full h-full"
        >
          {step === 1 && <NewStep1 {...props} />}
          {step === 2 && <NewStep2 {...props} />}
          {step === 3 && <NewStep3 {...props} />}
          {step === 4 && <NewStep4 {...props} />}
          {step === 5 && <NewStep5 {...props} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
