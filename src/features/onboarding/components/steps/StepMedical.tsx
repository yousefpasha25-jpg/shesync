/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelectToggle } from "../SelectCards";

const healthConditionOptions = [
  { value: "pcos", label: "PCOS" },
  { value: "endometriosis", label: "Endometriosis" },
  { value: "thyroid", label: "Thyroid" },
  { value: "diabetes", label: "Diabetes" },
  { value: "hypertension", label: "Hypertension" },
  { value: "asthma", label: "Asthma" },
  { value: "joint_issues", label: "Joint Issues" },
  { value: "anxiety", label: "Anxiety / Dep." },
];

interface StepMedicalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function StepMedical({ form }: StepMedicalProps) {
  const hasConditions = form.watch("medical.hasHealthConditions");
  const selectedConditions = form.watch("medical.healthConditions") || [];

  return (
    <div className="space-y-10 py-2 max-w-sm mx-auto">
      {/* Editorial Header */}
      <div className="space-y-2 border-l-2 border-secondary pl-6 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Section 02</span>
        <h3 className="text-xl font-bold uppercase tracking-tight text-white font-heading">Medical Audit</h3>
      </div>

      {/* Toggle health conditions */}
      <Controller
        name="medical.hasHealthConditions"
        control={form.control}
        render={({ field }) => (
          <div className="flex items-start gap-4 bg-white/5 p-5 rounded-sm border border-white/5 transition-all hover:bg-white/10">
            <Checkbox
              id="hasConditions"
              checked={field.value || false}
              onCheckedChange={field.onChange}
              className="mt-1 border-white/20 data-[state=checked]:bg-secondary data-[state=checked]:text-black"
            />
            <Label htmlFor="hasConditions" className="cursor-pointer text-[11px] font-medium leading-relaxed text-white/60 tracking-wide uppercase">
              Disclose existing health conditions for bespoke optimization
            </Label>
          </div>
        )}
      />

      {/* Conditions grid */}
      {hasConditions && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4 pt-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/30 px-1">Select Indicators:</p>
          <Controller
            name="medical.healthConditions"
            control={form.control}
            render={({ field }) => (
              <MultiSelectToggle
                options={healthConditionOptions}
                selected={field.value || []}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      )}

      {/* Injuries */}
      <div className="space-y-3 group">
        <Label htmlFor="injuries" className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 group-focus-within:text-secondary transition-colors">
          Current Physical Limitations <span className="text-white/20 font-normal lowercase">(optional)</span>
        </Label>
        <Input
          id="injuries"
          placeholder="e.g. Lumbar strain, ACL recovery"
          className="bg-card border-white/5 rounded-sm focus:border-secondary transition-all h-14 text-sm tracking-wide"
          {...form.register("medical.injuries")}
        />
      </div>

      {/* Medications */}
      <div className="space-y-3 group">
        <Label htmlFor="medications" className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 group-focus-within:text-secondary transition-colors">
          Pharmacological Routine <span className="text-white/20 font-normal lowercase">(optional)</span>
        </Label>
        <Input
          id="medications"
          placeholder="List relevant medications"
          className="bg-card border-white/5 rounded-sm focus:border-secondary transition-all h-14 text-sm tracking-wide"
          {...form.register("medical.medications")}
        />
      </div>
    </div>
  );
}
