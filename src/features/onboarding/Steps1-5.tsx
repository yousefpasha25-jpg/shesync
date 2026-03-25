"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2670&auto=format&fit=crop";

// ─── Shared: Progress dots ───────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 rounded-full transition-all duration-500",
            i + 1 < step
              ? "bg-primary w-5"
              : i + 1 === step
              ? "bg-primary w-8"
              : "bg-white/20 w-2"
          )}
        />
      ))}
    </div>
  );
}

// ─── Shared: Chip selector ───────────────────────────────────────────────────
function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200",
        selected
          ? "bg-primary text-white border-primary"
          : "bg-white/5 text-slate-400 border-white/10 hover:border-white/30 hover:text-slate-300"
      )}
    >
      {label}
    </button>
  );
}

// ─── STEP 1: About You (full-screen BG) ──────────────────────────────────────
export function NewStep1({ data, onNext, step, totalSteps }: any) {
  const [name, setName] = useState(data.name || "");
  const [age, setAge] = useState(data.age?.toString() || "");
  const [height, setHeight] = useState(data.height_cm?.toString() || "");
  const [weight, setWeight] = useState(data.weight_kg?.toString() || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onNext({
      name: name.trim(),
      age: Number(age) || undefined,
      height_cm: Number(height) || undefined,
      weight_kg: Number(weight) || undefined,
    });
  };

  return (
    <div className="fixed inset-0">
      <div className="absolute inset-0">
        <Image
          src={BG_IMAGE}
          alt="Fitness"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      <div className="relative h-full overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 px-6 pt-10 pb-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">
                SheSync
              </span>
            </div>
            <ProgressBar step={step} total={totalSteps} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-6 pt-10 pb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Welcome to SheSync
            </h1>
            <p className="text-white/60 text-sm mt-2 uppercase tracking-wider">
              Let's build your elite profile
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                Full Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sara Ahmed"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-slate-600 focus:border-primary/60 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                Age
              </label>
              <input
                type="number"
                min="16"
                max="80"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-slate-600 focus:border-primary/60 focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="140"
                  max="220"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="165"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-slate-600 focus:border-primary/60 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="60"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-slate-600 focus:border-primary/60 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full h-12 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              Begin My Journey <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── STEP 2: Your Health ────────────────────────────────────────────────────
export function NewStep2({ data, onNext, onBack, step, totalSteps }: any) {
  const [isPregnant, setIsPregnant] = useState<boolean>(data.is_pregnant ?? false);
  const [trimester, setTrimester] = useState<string>(data.pregnancy_weeks || "");
  const [cycleEnabled, setCycleEnabled] = useState<boolean>(data.cycle_enabled ?? true);
  const [lastPeriod, setLastPeriod] = useState<Date | undefined>(
    data.last_period_date instanceof Date
      ? data.last_period_date
      : data.last_period_date
      ? new Date(data.last_period_date)
      : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      is_pregnant: isPregnant,
      pregnancy_weeks: isPregnant ? trimester : undefined,
      cycle_enabled: cycleEnabled,
      last_period_date: cycleEnabled ? lastPeriod : undefined,
    });
  };

  const trimesters = [
    { value: "first_trimester", label: "1st Trimester" },
    { value: "second_trimester", label: "2nd Trimester" },
    { value: "third_trimester", label: "3rd Trimester" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Step {step} of {totalSteps}
          </p>
          <ProgressBar step={step} total={totalSteps} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Health</h2>
            <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider">
              Help us personalize your plan safely
            </p>
          </div>

          {/* Pregnancy */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <button
              type="button"
              onClick={() => setIsPregnant(!isPregnant)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                isPregnant
                  ? "border-primary/50 bg-primary/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              )}
            >
              <div className="text-left">
                <p className="text-sm font-bold text-white">Currently Pregnant</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  We'll adapt your workout intensity accordingly
                </p>
              </div>
              <div
                className={cn(
                  "size-5 rounded-full border-2 flex items-center justify-center transition-all",
                  isPregnant ? "border-primary bg-primary" : "border-white/20"
                )}
              >
                {isPregnant && <Check className="h-3 w-3 text-white" />}
              </div>
            </button>

            {isPregnant && (
              <div className="flex gap-2 flex-wrap pt-1">
                {trimesters.map((t) => (
                  <Chip
                    key={t.value}
                    label={t.label}
                    selected={trimester === t.value}
                    onClick={() => setTrimester(t.value)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cycle Tracking */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <button
              type="button"
              onClick={() => setCycleEnabled(!cycleEnabled)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                cycleEnabled
                  ? "border-primary/50 bg-primary/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              )}
            >
              <div className="text-left">
                <p className="text-sm font-bold text-white">Cycle Tracking</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Hormonal syncing for elite performance
                </p>
              </div>
              <div
                className={cn(
                  "size-5 rounded-full border-2 flex items-center justify-center transition-all",
                  cycleEnabled ? "border-primary bg-primary" : "border-white/20"
                )}
              >
                {cycleEnabled && <Check className="h-3 w-3 text-white" />}
              </div>
            </button>

            {cycleEnabled && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm transition-all hover:border-white/30",
                      !lastPeriod && "text-slate-500"
                    )}
                  >
                    <span>
                      {lastPeriod
                        ? format(lastPeriod, "PPP")
                        : "Last period date (optional)"}
                    </span>
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={lastPeriod}
                    onSelect={setLastPeriod}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="h-12 px-5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold hover:border-white/30 transition-all flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── STEP 3: Your Goals ──────────────────────────────────────────────────────
const GOALS = [
  { id: "fat_loss", label: "Burn Fat" },
  { id: "muscle_building", label: "Build Muscle" },
  { id: "strength", label: "Get Stronger" },
  { id: "general_fitness", label: "General Fitness" },
  { id: "hormonal_balance", label: "Hormonal Balance" },
  { id: "stress", label: "Reduce Stress" },
  { id: "better_sleep", label: "Better Sleep" },
  { id: "energy", label: "Boost Energy" },
  { id: "postpartum", label: "Postpartum Recovery" },
  { id: "weight_management", label: "Weight Management" },
];

const LEVELS = [
  { id: "beginner", label: "Beginner", desc: "New to training" },
  { id: "intermediate", label: "Intermediate", desc: "1–3 years" },
  { id: "advanced", label: "Advanced", desc: "3+ years" },
];

export function NewStep3({ data, onNext, onBack, step, totalSteps }: any) {
  const [goals, setGoals] = useState<string[]>(data.goals || []);
  const [level, setLevel] = useState<string>(data.level || "");

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goals.length === 0 || !level) return;
    onNext({ goals, level });
  };

  const canContinue = goals.length > 0 && !!level;

  return (
    <div className="min-h-screen bg-[#050505] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Step {step} of {totalSteps}
          </p>
          <ProgressBar step={step} total={totalSteps} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Goals</h2>
            <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider">
              Select all that apply
            </p>
          </div>

          {/* Goals chips */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              What do you want to achieve?
            </p>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <Chip
                  key={g.id}
                  label={g.label}
                  selected={goals.includes(g.id)}
                  onClick={() => toggleGoal(g.id)}
                />
              ))}
            </div>
            {goals.length === 0 && (
              <p className="text-[10px] text-slate-600 mt-2">Select at least one goal</p>
            )}
          </div>

          {/* Fitness Level */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              Your fitness level
            </p>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLevel(l.id)}
                  className={cn(
                    "p-3 rounded-xl border text-center transition-all duration-200",
                    level === l.id
                      ? "border-primary bg-primary/10"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  )}
                >
                  <p
                    className={cn(
                      "text-xs font-bold",
                      level === l.id ? "text-primary" : "text-white"
                    )}
                  >
                    {l.label}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">{l.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="h-12 px-5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold hover:border-white/30 transition-all flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={!canContinue}
              className="flex-1 h-12 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── STEP 4: Your Setup ──────────────────────────────────────────────────────
const DURATIONS = [
  { value: 20, label: "20 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90 min" },
];

const EQUIPMENT_OPTIONS = [
  { id: "bodyweight", label: "Bodyweight", desc: "No equipment", icon: "self_improvement" },
  { id: "home_gym", label: "Home Gym", desc: "Dumbbells & bands", icon: "fitness_center" },
  { id: "commercial_gym", label: "Full Gym", desc: "All equipment", icon: "sports_gymnastics" },
];

const WATER_OPTIONS = [
  { value: 1, label: "1L" },
  { value: 1.5, label: "1.5L" },
  { value: 2, label: "2L" },
  { value: 2.5, label: "2.5L" },
  { value: 3, label: "3L+" },
];

export function NewStep4({ data, onNext, onBack, step, totalSteps }: any) {
  const [duration, setDuration] = useState<number>(data.preferred_duration_min || 45);
  const [equipment, setEquipment] = useState<string>(data.equipment_context || "");
  const [water, setWater] = useState<number>(data.water_liters || 2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipment) return;
    onNext({
      preferred_duration_min: duration,
      equipment_context: equipment,
      water_liters: water,
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Step {step} of {totalSteps}
          </p>
          <ProgressBar step={step} total={totalSteps} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Setup</h2>
            <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider">
              We'll adapt to your lifestyle
            </p>
          </div>

          {/* Workout Duration */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              Workout duration
            </p>
            <div className="flex gap-2 flex-wrap">
              {DURATIONS.map((d) => (
                <Chip
                  key={d.value}
                  label={d.label}
                  selected={duration === d.value}
                  onClick={() => setDuration(d.value)}
                />
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              Equipment access
            </p>
            <div className="grid grid-cols-3 gap-2">
              {EQUIPMENT_OPTIONS.map((eq) => (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => setEquipment(eq.id)}
                  className={cn(
                    "p-3 rounded-xl border text-center transition-all duration-200",
                    equipment === eq.id
                      ? "border-primary bg-primary/10"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined text-[20px] mb-1 block",
                      equipment === eq.id ? "text-primary" : "text-slate-400"
                    )}
                  >
                    {eq.icon}
                  </span>
                  <p
                    className={cn(
                      "text-[10px] font-bold",
                      equipment === eq.id ? "text-primary" : "text-white"
                    )}
                  >
                    {eq.label}
                  </p>
                  <p className="text-[9px] text-slate-600 mt-0.5">{eq.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Water */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              Daily water target
            </p>
            <div className="flex gap-2 flex-wrap">
              {WATER_OPTIONS.map((w) => (
                <Chip
                  key={w.value}
                  label={w.label}
                  selected={water === w.value}
                  onClick={() => setWater(w.value)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="h-12 px-5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold hover:border-white/30 transition-all flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={!equipment}
              className="flex-1 h-12 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── STEP 5: You're All Set (full-screen BG) ─────────────────────────────────
export function NewStep5({ data, onBack, onComplete, step, totalSteps }: any) {
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setIsLoading(true);
    await onComplete({ ...data, consent_given: true });
    setIsLoading(false);
  };

  const firstName = data.name?.split(" ")[0] || "Champion";

  return (
    <div className="fixed inset-0">
      <div className="absolute inset-0">
        <Image
          src={BG_IMAGE}
          alt="You're all set"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />
      </div>

      <div className="relative h-full overflow-y-auto">
        <div className="sticky top-0 z-20 px-6 pt-10 pb-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">
                SheSync
              </span>
            </div>
            <ProgressBar step={step} total={totalSteps} />
          </div>
        </div>

        <form onSubmit={handleComplete} className="max-w-lg mx-auto px-6 pt-10 pb-12">
          <div className="text-center mb-8 space-y-3">
            <div className="size-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              You&apos;re all set,
              <br />
              {firstName}!
            </h1>
            <p className="text-white/60 text-sm">
              Your elite SheSync profile is ready. Let&apos;s begin.
            </p>
          </div>

          {/* Summary */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 mb-5 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 pb-2 border-b border-white/10">
              Profile Summary
            </p>
            <div className="space-y-2">
              {data.name && (
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Name</span>
                  <span className="text-xs font-bold text-white">{data.name}</span>
                </div>
              )}
              {data.level && (
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Level</span>
                  <span className="text-xs font-bold text-white capitalize">{data.level}</span>
                </div>
              )}
              {data.goals && data.goals.length > 0 && (
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0">Goals</span>
                  <span className="text-xs font-bold text-white text-right">
                    {data.goals
                      .slice(0, 3)
                      .map((g: string) => g.replace(/_/g, " "))
                      .join(", ")}
                  </span>
                </div>
              )}
              {data.equipment_context && (
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Equipment</span>
                  <span className="text-xs font-bold text-white capitalize">
                    {data.equipment_context.replace(/_/g, " ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Consent */}
          <button
            type="button"
            onClick={() => setConsent(!consent)}
            className={cn(
              "w-full flex items-start gap-3 p-4 rounded-xl border transition-all mb-5",
              consent ? "border-primary/40 bg-primary/10" : "border-white/10 bg-white/5"
            )}
          >
            <div
              className={cn(
                "size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                consent ? "border-primary bg-primary" : "border-white/20"
              )}
            >
              {consent && <Check className="h-3 w-3 text-white" />}
            </div>
            <p className="text-[11px] text-slate-400 text-left leading-relaxed">
              I agree to the Terms of Service and Privacy Policy, and consent to the processing of
              my health data for personalized coaching.
            </p>
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="h-12 px-5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:border-white/30 transition-all flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={!consent || isLoading}
              className="flex-1 h-12 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Launch My Plan <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
