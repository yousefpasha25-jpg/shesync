/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SingleSelectCard } from "../SelectCards";

const scheduleOptions = [
  { value: "9_to_5", label: "Fixed (9-5)" },
  { value: "shift_work", label: "Shifting" },
  { value: "remote", label: "Distributed" },
  { value: "student", label: "Academic" },
  { value: "stay_at_home", label: "Domestic" },
  { value: "other", label: "Variable" },
];

const sleepOptions = [
  { value: 4, label: "< 5 hrs" },
  { value: 6, label: "5-6 hrs" },
  { value: 7, label: "7-8 hrs" },
  { value: 9, label: "9+ hrs" },
];

const stressOptions = [
  { value: "low", label: "Minimal" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "Elevated" },
  { value: "very_high", label: "Acute" },
];

const stepsOptions = [
  { value: "under_3000", label: "Under 3K" },
  { value: "3000_7000", label: "3K - 7K" },
  { value: "7000_10000", label: "7K - 10K" },
  { value: "over_10000", label: "10K+" },
];

interface StepLifestyleProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function StepLifestyle({ form }: StepLifestyleProps) {
  const schedule = form.watch("lifestyle.workSchedule") || "";
  const stress = form.watch("lifestyle.stressLevel") || "";
  const steps = form.watch("lifestyle.dailySteps") || "";

  return (
    <div className="space-y-12 py-2 max-w-sm mx-auto">
      {/* Editorial Header */}
      <div className="space-y-2 border-l-2 border-secondary pl-6 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Section 06</span>
        <h3 className="text-xl font-bold uppercase tracking-tight text-white font-heading">Lifestyle Audit</h3>
      </div>

      {/* Work schedule */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Professional Schedule</Label>
        <Controller
          name="lifestyle.workSchedule"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={scheduleOptions}
              value={field.value || ""}
              onChange={field.onChange}
              columns={3}
            />
          )}
        />
      </div>

      {/* Sleep */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Recovery Duration</Label>
        <Controller
          name="lifestyle.averageSleepHours"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={sleepOptions.map((s) => ({ ...s, value: String(s.value) }))}
              value={String(field.value || "")}
              onChange={(val) => field.onChange(Number(val))}
            />
          )}
        />
      </div>

      {/* Stress level */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Cortisol Indicators</Label>
        <Controller
          name="lifestyle.stressLevel"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={stressOptions}
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Daily steps */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Basal Activity</Label>
        <Controller
          name="lifestyle.dailySteps"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={stepsOptions}
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
}
