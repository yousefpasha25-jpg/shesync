"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ExerciseDetailProps {
  title: string;
  type: string;
  imageUrl: string;
  targetReps: string;
  restPeriod: string;
  intensity: string;
  formSteps: { title: string; description: string }[];
  muscleGroups: { name: string; isPrimary: boolean }[];
}

export function ExerciseDetail({
  title,
  type,
  imageUrl,
  targetReps,
  restPeriod,
  intensity,
  formSteps,
  muscleGroups,
}: ExerciseDetailProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col pb-32">
      {/* Top Navigation */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 bg-gradient-to-b from-black/60 to-transparent">
        <Link 
          href="/"
          className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined !text-[20px]">arrow_back_ios_new</span>
        </Link>
        <h1 className="text-white text-sm font-medium tracking-[0.2em] uppercase">Exercise Detail</h1>
        <button className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
          <span className="material-symbols-outlined !text-[20px]">more_horiz</span>
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative w-full aspect-[4/5] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10"></div>
        <Image 
          alt={title} 
          className="object-cover" 
          fill
          priority
          sizes="100vw"
          src={imageUrl} 
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button className="flex items-center justify-center size-20 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/40 text-white group hover:scale-105 transition-transform">
            <div className="bg-primary size-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/40">
              <span className="material-symbols-outlined !text-[32px] fill-1">play_arrow</span>
            </div>
          </button>
        </div>
        <div className="absolute bottom-12 left-6 z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/30 backdrop-blur-md border border-primary/40 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-3">
            {type}
          </span>
          <h2 className="text-white text-4xl font-bold tracking-tight">{title}</h2>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="grid grid-cols-3 gap-3 px-6 -mt-4 relative z-20">
        <div className="flex flex-col gap-2 rounded-md border border-white/5 bg-card-dark p-4 shadow-xl">
          <span className="material-symbols-outlined text-primary !text-[20px]">target</span>
          <div>
            <p className="text-white text-lg font-bold">{targetReps}</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Target Reps</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-md border border-white/5 bg-card-dark p-4 shadow-xl">
          <span className="material-symbols-outlined text-primary !text-[20px]">timer</span>
          <div>
            <p className="text-white text-lg font-bold">{restPeriod}</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Rest Period</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-md border border-white/5 bg-card-dark p-4 shadow-xl">
          <span className="material-symbols-outlined text-primary !text-[20px]">speed</span>
          <div>
            <p className="text-white text-lg font-bold">{intensity}</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Intensity</p>
          </div>
        </div>
      </section>

      {/* Form Mastery */}
      <section className="px-6 pt-10 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-semibold tracking-tight">Form Mastery</h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/40 to-transparent ml-4"></div>
        </div>
        <ul className="space-y-5">
          {formSteps.map((step, index) => (
            <li key={index} className="flex items-start gap-4">
              <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                <span className="text-[10px] text-emerald-400 font-bold">{(index + 1).toString().padStart(2, "0")}</span>
              </span>
              <div>
                <p className="text-slate-200 font-medium">{step.title}</p>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Muscle Groups */}
      <section className="px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-semibold tracking-tight">Target Muscle Groups</h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-accent-gold/40 to-transparent ml-4"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {muscleGroups.map((muscle, index) => (
            <div key={index} className="px-4 py-2 rounded-md bg-white/5 border border-white/10 flex items-center gap-2">
              <div className={cn("size-2 rounded-full", muscle.isPrimary ? "bg-accent-gold" : "bg-white/20")}></div>
              <span className={cn("text-sm font-medium", muscle.isPrimary ? "text-slate-300" : "text-slate-500")}>
                {muscle.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-30">
        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-md shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
          <span className="material-symbols-outlined !text-[20px]">edit_note</span>
          <span className="tracking-wide uppercase text-sm">Log Set & Performance</span>
        </button>
      </div>
    </div>
  );
}
