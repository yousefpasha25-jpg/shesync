"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import type { DailyWorkout, Exercise } from "@/types/ai-plan";

// ─── Types ───
interface PlanWeek {
  weekNumber: number;
  phase?: string;
  philosophy?: string;
  days: PlanDay[];
}

interface PlanDay {
  date: string;
  workout: DailyWorkout;
}

interface PlanData {
  weeks: PlanWeek[];
}

interface TrainingViewProps {
  initialPlan: { plan_data: PlanData | null } | null;
}

export function TrainingView({ initialPlan }: TrainingViewProps) {
  const [plan, setPlan] = useState<PlanData | null>(initialPlan?.plan_data || null);
  const [isGenerating, setIsGenerating] = useState(!initialPlan?.plan_data);
  const [hasError, setHasError] = useState(false);
  const hasFetched = React.useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!plan && !hasFetched.current) {
      hasFetched.current = true;
      generatePlan();
    }
  }, [plan]);

  const generatePlan = async () => {
    setIsGenerating(true);
    setHasError(false);
    try {
      const res = await fetch("/api/engine/generate-plan", { method: "POST" });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      if (data.weeks && Array.isArray(data.weeks) && data.weeks.length > 0) {
        setPlan(data);
        toast({ title: "PROTOCOL ESTABLISHED", description: "Your bespoke AI plan has been synced." });
      } else {
        throw new Error("Invalid plan structure received");
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Plan generation failed:", errorMsg);
      setHasError(true);
      toast({ title: "SYNC FAILED", description: errorMsg, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    hasFetched.current = false;
    setPlan(null);
    setHasError(false);
    generatePlan();
  };

  // ─── Loading State ───
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-8 px-6 text-center">
        <div className="relative">
          <motion.div 
            className="size-32 rounded-full border border-emerald-500/20 flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center animate-pulse">
              <span className="text-secondary text-3xl">✨</span>
            </div>
          </motion.div>
          {[0, 120, 240].map((deg) => (
            <motion.div
              key={deg}
              className="absolute top-1/2 left-1/2 size-1 bg-emerald-400 rounded-full"
              animate={{
                rotate: [deg, deg + 360],
                x: [-60, 60, -60],
                y: [-60, 60, -60],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white">Architecting Protocol</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed max-w-[240px]">
            Awdan AI is analyzing your bio-metrics to curate a bespoke 4-week clinical regime.
          </p>
        </div>
      </div>
    );
  }

  // ─── Error State with Retry ───
  if (hasError && !plan) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-8 px-6 text-center">
        <div className="size-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="text-red-400 text-3xl">⚠️</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white">Sync Failed</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed max-w-[280px]">
            The AI engine could not generate your protocol. This may be a temporary issue.
          </p>
        </div>
        <button
          onClick={handleRetry}
          className="bg-secondary text-black font-bold uppercase tracking-widest py-4 px-8 rounded-sm text-xs active:scale-95 transition-all hover:bg-secondary/80"
        >
          Retry Generation
        </button>
      </div>
    );
  }

  // ─── Plan Display ───
  const todayWorkout = plan?.weeks?.[0]?.days?.[0]?.workout;

  return (
    <div className="px-6 pt-8 space-y-8 pb-32">
      <header className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-semibold">Awdan Training</p>
        <h1 className="text-3xl font-bold tracking-tight text-white">Your Studio</h1>
      </header>

      <div className="space-y-6">
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Active Protocol</h2>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest border border-secondary/20 px-2 py-0.5 rounded">
              {plan?.weeks?.[0]?.phase || "Dynamic"} Phase
            </span>
          </div>

          <AnimatePresence mode="wait">
            {todayWorkout ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-card-dark rounded-xl p-5 border border-white/5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Today&apos;s Session</p>
                      <h3 className="text-xl font-bold text-white mt-1">{todayWorkout.title}</h3>
                    </div>
                    <span className="bg-white/5 px-3 py-1 rounded-sm text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {todayWorkout.durationMinutes}M
                    </span>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    {todayWorkout.exercises.slice(0, 3).map((ex: Exercise, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-slate-200">{ex.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase">{ex.reps} • {ex.sets} Sets</p>
                        </div>
                        <div className="size-6 rounded-full bg-white/5 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-secondary text-black font-bold uppercase tracking-widest py-4 rounded-sm text-xs mt-4 active:scale-95 transition-all">
                    Initiate Session
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-card-dark rounded-xl p-10 border border-dashed border-white/10 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-widest">No workout scheduled for today.</p>
              </div>
            )}
          </AnimatePresence>
        </section>

        <section className="space-y-4 pt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Upcoming in {plan?.weeks?.[0]?.phase || "this"} week</h2>
          <div className="grid gap-3">
            {plan?.weeks?.[0]?.days?.slice(1, 4).map((day: PlanDay, i: number) => (
              <div key={i} className="bg-card-dark/50 rounded-lg p-4 border border-white/5 flex justify-between items-center opacity-60">
                <div className="flex items-center gap-4">
                  <span className="text-lg opacity-30 italic font-light">{i + 2}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{day.workout?.title || "Rest Day"}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{day.workout?.type || "rest"} • {day.workout?.durationMinutes || 0}m</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{day.date}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
