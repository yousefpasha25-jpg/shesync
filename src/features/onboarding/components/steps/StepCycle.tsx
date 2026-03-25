/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SingleSelectCard, MultiSelectToggle } from "../SelectCards";

const pregnancyOptions = [
  { value: "not_pregnant", label: "Baseline" },
  { value: "pregnant", label: "Pregnant" },
  { value: "postpartum", label: "Postpartum" },
  { value: "prefer_not_to_say", label: "Private" },
];

const symptomOptions = [
  { value: "cramps", label: "Cramps" },
  { value: "bloating", label: "Bloating" },
  { value: "fatigue", label: "Fatigue" },
  { value: "mood_swings", label: "Mood Swings" },
  { value: "headaches", label: "Headaches" },
  { value: "back_pain", label: "Back Pain" },
  { value: "breast_tenderness", label: "Tenderness" },
  { value: "none", label: "None" },
];

interface StepCycleProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function StepCycle({ form }: StepCycleProps) {
  const trackCycle = form.watch("cycle.trackCycle");
  const pregnancyStatus = form.watch("cycle.pregnancyStatus") || "";
  const symptoms = form.watch("cycle.commonSymptoms") || [];

  return (
    <div className="space-y-12 py-2 max-w-sm mx-auto">
      {/* Editorial Header */}
      <div className="space-y-2 border-l-2 border-secondary pl-6 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Section 03</span>
        <h3 className="text-xl font-bold uppercase tracking-tight text-white font-heading">Hormonal Sync</h3>
      </div>

      {/* Track cycle toggle */}
      <Controller
        name="cycle.trackCycle"
        control={form.control}
        render={({ field }) => (
          <div className="flex items-start gap-4 bg-white/5 p-5 rounded-sm border border-white/5 transition-all hover:bg-white/10">
            <Checkbox
              id="trackCycle"
              checked={field.value || false}
              onCheckedChange={field.onChange}
              className="mt-1 border-white/20 data-[state=checked]:bg-secondary data-[state=checked]:text-black"
            />
            <div className="space-y-1">
              <Label htmlFor="trackCycle" className="cursor-pointer text-[11px] font-medium leading-relaxed text-white/60 tracking-wide uppercase">
                Sync Architecture with Menstrual Cycle
              </Label>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.05em]">
                Optimizer: Adaptive intensity based on phase
              </p>
            </div>
          </div>
        )}
      />

      {/* Pregnancy status */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Current State</Label>
        <Controller
          name="cycle.pregnancyStatus"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={pregnancyOptions}
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Cycle length */}
      {trackCycle && (
        <div className="space-y-3 group animate-in fade-in slide-in-from-top-4 duration-500">
          <Label htmlFor="cycleLength" className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 group-focus-within:text-secondary transition-colors">
            Mean Velocity (days)
          </Label>
          <Input
            id="cycleLength"
            type="number"
            placeholder="e.g. 28"
            className="bg-card border-white/5 rounded-sm focus:border-secondary transition-all h-14 text-sm tracking-wide"
            {...form.register("cycle.averageCycleLength", { valueAsNumber: true })}
          />
        </div>
      )}

      {/* Common symptoms */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Luteal Indicators</Label>
        <Controller
          name="cycle.commonSymptoms"
          control={form.control}
          render={({ field }) => (
            <MultiSelectToggle
              options={symptomOptions}
              selected={field.value || []}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
}
