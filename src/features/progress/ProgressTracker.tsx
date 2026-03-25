"use client";

import { motion } from "framer-motion";
import { Flame, Target, Trophy, CheckCircle2, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const dailyGoals = [
  { label: "Workout Protocol", current: 1, target: 1, type: "workout" },
  { label: "Protein Target", current: 85, target: 120, unit: "g" },
  { label: "Hydration Sync", current: 2.1, target: 3.0, unit: "L" },
];

const badges = [
  { name: "Consistency Queen", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Metabolic Master", icon: Target, color: "text-primary", bg: "bg-primary/10" },
  { name: "Early Bird", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500/10" },
];

export function ProgressTracker() {
  return (
    <div className="space-y-8">
      {/* Streak and Rank Header */}
      <div className="flex items-center justify-between p-6 rounded-[2rem] bg-black text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
        <div className="space-y-2 relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Current Momentum</p>
          <div className="flex items-center gap-3">
            <Flame className="size-8 text-primary fill-primary/20" />
            <span className="text-4xl font-black italic italic">12 DAY STREAK</span>
          </div>
        </div>
        <div className="text-right relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Elite Rank</p>
          <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto md:ml-auto">
             <Trophy className="size-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Daily Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dailyGoals.map((goal, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-[1.5rem] bg-secondary/30 border border-border group hover:border-primary/50 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{goal.label}</span>
              <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="size-4" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black italic italic tracking-tighter">
                  {goal.current} / {goal.target}
                  <span className="text-sm font-bold text-muted-foreground ml-1 uppercase">{goal.unit || ""}</span>
                </span>
                <span className="text-xs font-bold text-primary">{Math.round((goal.current / goal.target) * 100)}%</span>
              </div>
              <Progress 
                value={(goal.current / goal.target) * 100} 
                className="h-2 bg-white/5" 
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievement Badges */}
      <div className="p-8 rounded-[2rem] bg-card border border-border">
        <h3 className="text-lg font-bold mb-6 tracking-tight">Recent Achievements</h3>
        <div className="flex flex-wrap gap-4">
          {badges.map((badge, idx) => (
            <div 
              key={idx}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${badge.bg} border border-transparent hover:border-white/10 transition-all cursor-default group`}
            >
              <badge.icon className={`size-5 ${badge.color} group-hover:scale-110 transition-transform`} />
              <span className={`text-xs font-bold uppercase tracking-tight ${badge.color}`}>{badge.name}</span>
            </div>
          ))}
          <div className="size-12 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary/30 transition-colors cursor-pointer group">
            <Plus className="size-5 group-hover:rotate-90 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}
