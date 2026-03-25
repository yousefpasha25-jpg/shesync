/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SingleSelectCard, MultiSelectToggle } from "../SelectCards";

const durationOptions = [
  { value: "15_min", label: "15m" },
  { value: "30_min", label: "30m" },
  { value: "45_min", label: "45m" },
  { value: "60_min", label: "60m" },
  { value: "90_min", label: "90m" },
];

const frequencyOptions = [
  { value: "2_days", label: "2 Days" },
  { value: "3_days", label: "3 Days" },
  { value: "4_days", label: "4 Days" },
  { value: "5_days", label: "5 Days" },
  { value: "6_days", label: "6 Days" },
];

const splitOptions = [
  { value: "full_body", label: "Full Body" },
  { value: "upper_lower", label: "Up / Low" },
  { value: "push_pull_legs", label: "PPL" },
  { value: "body_part_split", label: "Isolation" },
  { value: "no_preference", label: "Bespoke" },
];

const timeOptions = [
  { value: "early_morning", label: "05-07" },
  { value: "morning", label: "07-10" },
  { value: "afternoon", label: "12-16" },
  { value: "evening", label: "17-20" },
  { value: "late_night", label: "20+" },
];

const workoutTypeOptions = [
  { value: "strength", label: "Strength" },
  { value: "cardio", label: "Cardio" },
  { value: "hiit", label: "HIIT" },
  { value: "yoga", label: "Yoga" },
  { value: "pilates", label: "Pilates" },
  { value: "stretching", label: "Mobility" },
  { value: "dance", label: "Dance" },
  { value: "walking", label: "Walking" },
];

interface StepWorkoutPrefsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function StepWorkoutPrefs({ form }: StepWorkoutPrefsProps) {
  const duration = form.watch("workoutPrefs.preferredDuration") || "";
  const frequency = form.watch("workoutPrefs.preferredFrequency") || "";
  const split = form.watch("workoutPrefs.preferredSplit") || "";
  const time = form.watch("workoutPrefs.preferredTime") || "";
  const types = form.watch("workoutPrefs.workoutTypes") || [];
  const errorsAny = form.formState.errors as any;

  return (
    <div className="space-y-12 py-2 max-w-sm mx-auto">
      {/* Editorial Header */}
      <div className="space-y-2 border-l-2 border-secondary pl-6 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Section 07</span>
        <h3 className="text-xl font-bold uppercase tracking-tight text-white font-heading">Protocol Prefs</h3>
      </div>

      {/* Duration */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Session Duration</Label>
        <Controller
          name="workoutPrefs.preferredDuration"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={durationOptions}
              value={field.value || ""}
              onChange={field.onChange}
              columns={3}
            />
          )}
        />
      </div>

      {/* Frequency */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Weekly Commitment</Label>
        <Controller
          name="workoutPrefs.preferredFrequency"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={frequencyOptions}
              value={field.value || ""}
              onChange={field.onChange}
              columns={3}
            />
          )}
        />
      </div>

      {/* Split */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Training Split</Label>
        <Controller
          name="workoutPrefs.preferredSplit"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={splitOptions}
              value={field.value || ""}
              onChange={field.onChange}
              columns={3}
            />
          )}
        />
      </div>

      {/* Preferred time */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Prime Time (24h)</Label>
        <Controller
          name="workoutPrefs.preferredTime"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={timeOptions}
              value={field.value || ""}
              onChange={field.onChange}
              columns={3}
            />
          )}
        />
      </div>

      {/* Workout types */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Preferred Modalities</Label>
        {errorsAny?.workoutPrefs?.workoutTypes && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">
            {errorsAny.workoutPrefs.workoutTypes.message as string}
          </p>
        )}
        <Controller
          name="workoutPrefs.workoutTypes"
          control={form.control}
          render={({ field }) => (
            <MultiSelectToggle
              options={workoutTypeOptions}
              selected={field.value || []}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
}
