/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface StepBasicInfoProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function StepBasicInfo({ form }: StepBasicInfoProps) {
  const { register, formState: { errors } } = form;
  const errorsAny = errors as any;

  return (
    <div className="space-y-10 py-4 max-w-sm mx-auto">
      {/* Editorial Header */}
      <div className="space-y-2 border-l-2 border-secondary pl-6 mb-12">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Section 01</span>
        <h3 className="text-xl font-bold uppercase tracking-tight text-white font-heading">Base Biometrics</h3>
      </div>

      {/* Full Name */}
      <div className="space-y-3 group">
        <Label htmlFor="fullName" className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 group-focus-within:text-secondary transition-colors">
          Full Identifier
        </Label>
        <Input
          id="fullName"
          placeholder="Enter legal name"
          className="bg-card border-white/5 rounded-sm focus:border-secondary transition-all h-14 text-sm tracking-wide"
          {...register("basicInfo.fullName")}
        />
        {errorsAny?.basicInfo?.fullName && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">
            {errorsAny.basicInfo.fullName.message as string}
          </p>
        )}
      </div>

      {/* Age */}
      <div className="space-y-3 group">
        <Label htmlFor="age" className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 group-focus-within:text-secondary transition-colors">
          Chronological Age
        </Label>
        <Input
          id="age"
          type="number"
          placeholder="Years"
          className="bg-card border-white/5 rounded-sm focus:border-secondary transition-all h-14 text-sm tracking-wide"
          {...register("basicInfo.age", { valueAsNumber: true })}
        />
        {errorsAny?.basicInfo?.age && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">
            {errorsAny.basicInfo.age.message as string}
          </p>
        )}
      </div>

      {/* Height & Weight row */}
      <div className="grid grid-cols-2 gap-6 pt-4">
        <div className="space-y-3 group">
          <Label htmlFor="heightCm" className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 group-focus-within:text-secondary transition-colors">
            Stature (cm)
          </Label>
          <Input
            id="heightCm"
            type="number"
            placeholder="Metric"
            className="bg-card border-white/5 rounded-sm focus:border-secondary transition-all h-14 text-sm tracking-wide"
            {...register("basicInfo.heightCm", { valueAsNumber: true })}
          />
          {errorsAny?.basicInfo?.heightCm && (
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">
              Field Required
            </p>
          )}
        </div>
        <div className="space-y-3 group">
          <Label htmlFor="weightKg" className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 group-focus-within:text-secondary transition-colors">
            Mass (kg)
          </Label>
          <Input
            id="weightKg"
            type="number"
            placeholder="Metric"
            className="bg-card border-white/5 rounded-sm focus:border-secondary transition-all h-14 text-sm tracking-wide"
            {...register("basicInfo.weightKg", { valueAsNumber: true })}
          />
          {errorsAny?.basicInfo?.weightKg && (
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">
              Field Required
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
