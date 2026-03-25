/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SingleSelectCard, MultiSelectToggle } from "../SelectCards";

const levelOptions = [
  { value: "beginner", label: "Base" },
  { value: "intermediate", label: "Adept" },
  { value: "advanced", label: "Elite" },
];

const frequencyOptions = [
  { value: "never", label: "Inactive" },
  { value: "1-2_weekly", label: "Weekly I-II" },
  { value: "3-4_weekly", label: "Weekly III-IV" },
  { value: "5+_weekly", label: "Daily V+" },
];

const experienceOptions = [
  { value: "yoga", label: "Zen (Yoga)" },
  { value: "pilates", label: "Core (Pilates)" },
  { value: "strength_training", label: "Load (Strength)" },
  { value: "cardio", label: "Vascular (Cardio)" },
  { value: "hiit", label: "Force (HIIT)" },
  { value: "dance", label: "Motion (Dance)" },
  { value: "martial_arts", label: "Combat (M.A.)" },
  { value: "swimming", label: "Fluid (Swim)" },
  { value: "running", label: "Kinetic (Run)" },
  { value: "none", label: "Entry Level" },
];

interface StepFitnessLevelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function StepFitnessLevel({ form }: StepFitnessLevelProps) {
  const level = form.watch("fitnessLevel.currentLevel") || "";
  const frequency = form.watch("fitnessLevel.exerciseFrequency") || "";
  const experience = form.watch("fitnessLevel.previousExperience") || [];

  return (
    <div className="space-y-12 py-2 max-w-sm mx-auto">
      {/* Editorial Header */}
      <div className="space-y-2 border-l-2 border-secondary pl-6 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Section 05</span>
        <h3 className="text-xl font-bold uppercase tracking-tight text-white font-heading">Performance Baseline</h3>
      </div>

      {/* Current level */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Kinetic Proficiency</Label>
        <Controller
          name="fitnessLevel.currentLevel"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={levelOptions}
              value={field.value || ""}
              onChange={field.onChange}
              columns={3}
            />
          )}
        />
      </div>

      {/* Exercise frequency */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Training Regularity</Label>
        <Controller
          name="fitnessLevel.exerciseFrequency"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={frequencyOptions}
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Previous experience */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Past Modalities</Label>
        <Controller
          name="fitnessLevel.previousExperience"
          control={form.control}
          render={({ field }) => (
            <MultiSelectToggle
              options={experienceOptions}
              selected={field.value || []}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
}
