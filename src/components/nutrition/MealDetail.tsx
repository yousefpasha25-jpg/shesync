"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface MealDetailProps {
  title: string[];
  tags: string[];
  imageUrl: string;
  macros: { label: string; value: string; unit: string }[];
  micronutrients: { name: string; percentage: number }[];
  protocol: { title: string; description: string; icon: string }[];
}

export function MealDetail({
  title,
  tags,
  imageUrl,
  macros,
  micronutrients,
  protocol,
}: MealDetailProps) {
  return (
    <div className="relative mx-auto max-w-md min-h-screen bg-background-dark pb-32">
      {/* Top App Bar / Glass Header */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary/10 max-w-md mx-auto">
        <div className="flex items-center p-4 justify-between">
          <Link 
            href="/"
            className="text-slate-100 flex items-center justify-center h-10 w-10 bg-card-dark border border-primary/20"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="px-3 py-1 bg-accent-gold/10 border border-accent-gold/30">
            <p className="text-accent-gold text-[10px] uppercase font-bold tracking-[0.2em]">Premium Recipe</p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10"></div>
        <div 
          className="w-full h-full bg-center bg-cover" 
          style={{ backgroundImage: `url('${imageUrl}')` }}
        >
        </div>
      </div>

      {/* Title Area */}
      <div className="px-6 -mt-16 relative z-20">
        <h1 className="text-slate-100 text-4xl font-extrabold leading-tight tracking-tight">
          {title.map((line, i) => (
            <span key={i}>
              {line} {i < title.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="text-primary mt-2 text-sm font-semibold uppercase tracking-widest">
          {tags.join(" • ")}
        </p>
      </div>

      {/* Clinical Macro Row */}
      <div className="grid grid-cols-3 gap-3 px-6 mt-8">
        {macros.map((macro, i) => (
          <div key={i} className="bg-card-dark border-l-4 border-primary p-4 flex flex-col gap-1">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">{macro.label}</p>
            <p className="text-slate-100 text-xl font-bold">
              {macro.value}<span className="text-xs ml-0.5 text-slate-500">{macro.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Micronutrients Section */}
      <div className="px-6 mt-10">
        <h3 className="text-slate-100 text-xs uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary"></span> Micronutrients
        </h3>
        <div className="space-y-3">
          {micronutrients.map((micro, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-primary/10">
              <span className="text-slate-300 text-sm">{micro.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1 bg-card-dark relative">
                  <div 
                    className="absolute inset-y-0 left-0 bg-primary" 
                    style={{ width: `${Math.min(micro.percentage, 100)}%` }}
                  ></div>
                </div>
                <span className="text-slate-100 text-xs font-mono">{micro.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dietary Protocol */}
      <div className="px-6 mt-10 pb-24">
        <h3 className="text-slate-100 text-xs uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-accent-gold"></span> Dietary Protocol
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {protocol.map((p, i) => (
            <div key={i} className="bg-card-dark p-4 border border-primary/5">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-lg">{p.icon}</span>
                <div>
                  <p className="text-slate-100 text-sm font-bold">{p.title}</p>
                  <p className="text-slate-500 text-xs mt-1">{p.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent max-w-md mx-auto z-30">
        <button className="w-full bg-primary hover:bg-primary/90 text-slate-100 font-bold py-4 text-xs uppercase tracking-[0.3em] transition-all border border-primary/50 shadow-lg shadow-primary/20">
          Log Meal
        </button>
      </div>
    </div>
  );
}
