/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { stepMeta } from "../../schema";

interface StepReviewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  isSubmitting: boolean;
  onboardingData: any;
}

function SummaryItem({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-baseline py-3 border-b border-white/5 last:border-0">
      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/30">{label}</span>
      <span className="text-sm font-medium text-right text-white/90">{value}</span>
    </div>
  );
}

function formatArray(arr: string[] | undefined): string {
  if (!arr || arr.length === 0) return "None";
  return arr.map((s) => s.replace(/_/g, " ")).join(", ");
}

function formatEnum(val: string | undefined): string {
  if (!val) return "Not set";
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StepReview({ form, isSubmitting, onboardingData }: StepReviewProps) {
  const data = onboardingData;
  const confirmed = form.watch("review.confirmed");
  const errorsAny = form.formState.errors as any;

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-10">
        <div className="relative">
          <motion.div 
            className="w-32 h-32 rounded-full border border-white/5 flex items-center justify-center relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {/* Spinning gradient ring */}
            <motion.div 
              className="absolute inset-0 border-t-2 border-secondary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-4xl text-secondary drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">✨</span>
          </motion.div>
        </div>
        
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold font-heading text-white tracking-tight uppercase">
            Architecting Your Plan
          </h3>
          <p className="text-sm text-white/40 max-w-xs mx-auto leading-relaxed">
            Our luxury AI is analyzing your biometric data to curate a truly bespoke fitness experience.
          </p>
        </div>

        {/* Premium skeleton loader */}
        <div className="w-full max-w-sm space-y-4 pt-4">
          {[0.9, 0.7, 0.4].map((width, i) => (
            <div key={i} className="h-1 bg-white/5 overflow-hidden rounded-full relative">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                style={{ width: "50%" }}
              />
              <div className="h-full bg-white/5" style={{ width: `${width * 100}%` }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Summary Card */}
      <section className="bg-card rounded-md border border-white/5 p-6 space-y-2 shadow-premium">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">👤</span>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Your Profile</h3>
        </div>
        <SummaryItem label="Full Name" value={data.basicInfo?.fullName} />
        <SummaryItem label="Biometric Age" value={data.basicInfo?.age ? `${data.basicInfo.age} years` : undefined} />
        <SummaryItem label="Height / Weight" value={data.basicInfo?.heightCm ? `${data.basicInfo.heightCm}cm / ${data.basicInfo.weightKg}kg` : undefined} />
      </section>

      {/* Goals Summary */}
      <section className="bg-card rounded-md border border-white/5 p-6 space-y-2 shadow-premium">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🎯</span>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Architecture</h3>
        </div>
        <SummaryItem label="Core Directive" value={formatEnum(data.fitnessGoals?.primaryGoal)} />
        <SummaryItem label="Baseline Level" value={formatEnum(data.fitnessLevel?.currentLevel)} />
        <SummaryItem label="Frequency" value={formatEnum(data.workoutPrefs?.preferredFrequency)} />
        <SummaryItem label="Split Preference" value={formatEnum(data.workoutPrefs?.preferredSplit)} />
      </section>

      {/* Confirmation checkbox */}
      <div className="space-y-4">
        <Controller
          name="review.confirmed"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-start gap-4 bg-secondary/5 rounded-md border border-secondary/20 p-5 transition-all hover:bg-secondary/10">
              <Checkbox
                id="confirm-review"
                checked={field.value || false}
                onCheckedChange={field.onChange}
                className="mt-1 border-white/20 data-[state=checked]:bg-secondary data-[state=checked]:text-black"
              />
              <Label htmlFor="confirm-review" className="cursor-pointer text-[11px] font-medium leading-relaxed text-white/60 tracking-wide uppercase">
                I confirm these biometric details are accurate and I am ready to initiate my SheSync journey.
              </Label>
            </div>
          )}
        />
        {errorsAny?.review?.confirmed && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">
            {errorsAny.review.confirmed.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
