/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SingleSelectCard, MultiSelectToggle } from "../SelectCards";

const goalOptions = [
  { value: "lose_weight", label: "Mass Loss" },
  { value: "build_muscle", label: "Hypertrophy" },
  { value: "tone_up", label: "Definition" },
  { value: "improve_endurance", label: "Stamina" },
  { value: "increase_flexibility", label: "Mobility" },
  { value: "stress_relief", label: "Neurological" },
  { value: "overall_health", label: "Longevity" },
  { value: "postpartum_recovery", label: "Recovery" },
];

interface StepFitnessGoalsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function StepFitnessGoals({ form }: StepFitnessGoalsProps) {
  const primaryGoal = form.watch("fitnessGoals.primaryGoal") || "";
  const secondaryGoals = form.watch("fitnessGoals.secondaryGoals") || [];
  const errorsAny = form.formState.errors as any;

  return (
    <div className="space-y-12 py-2 max-w-sm mx-auto">
      {/* Editorial Header */}
      <div className="space-y-2 border-l-2 border-secondary pl-6 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Section 04</span>
        <h3 className="text-xl font-bold uppercase tracking-tight text-white font-heading">Core Objectives</h3>
      </div>

      {/* Primary goal */}
      <div className="space-y-4">
        <div className="space-y-1 mb-2 px-1">
          <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40">Primary Directive</Label>
          <p className="text-[9px] text-white/20 uppercase tracking-widest leading-relaxed">The cornerstone of your bespoke program architecture</p>
        </div>
        <Controller
          name="fitnessGoals.primaryGoal"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={goalOptions}
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
        {errorsAny?.fitnessGoals?.primaryGoal && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">
            Required Selection
          </p>
        )}
      </div>

      {/* Secondary goals */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Auxiliary Focus <span className="text-white/20 lowercase font-normal">(limit 3)</span></Label>
        <Controller
          name="fitnessGoals.secondaryGoals"
          control={form.control}
          render={({ field }) => (
            <MultiSelectToggle
              options={goalOptions.filter((g) => g.value !== primaryGoal)}
              selected={field.value || []}
              onChange={field.onChange}
              maxSelections={3}
            />
          )}
        />
      </div>

      {/* Timeline */}
      <div className="space-y-3 group pt-4">
        <Label htmlFor="timeline" className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 group-focus-within:text-secondary transition-colors">
          Temporal Target <span className="text-white/20 font-normal lowercase">(weeks)</span>
        </Label>
        <Input
          id="timeline"
          type="number"
          placeholder="e.g. 12"
          className="bg-card border-white/5 rounded-sm focus:border-secondary transition-all h-14 text-sm tracking-wide"
          {...form.register("fitnessGoals.targetTimelineWeeks", { valueAsNumber: true })}
        />
      </div>
    </div>
  );
}
