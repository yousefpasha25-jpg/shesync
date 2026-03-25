/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface StepWelcomeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function StepWelcome({ form }: StepWelcomeProps) {
  const accepted = form.watch("welcome.acceptedTerms");
  const errorsAny = form.formState.errors as any;

  return (
    <div className="space-y-12 text-left max-w-lg mx-auto">
      {/* Editorial Badge */}
      <div className="relative group">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 border border-secondary/20 bg-secondary/5 px-3 py-1 rounded-sm"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Est. 2026</span>
          <div className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
        </motion.div>
      </div>

      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white tight-header leading-[1.1]">
          The Bespoke Architecture of <span className="text-secondary">Your Bio-Sync.</span>
        </h2>
        <p className="text-muted-foreground text-lg body-airy leading-relaxed max-w-sm">
          A luxury fitness engine that adapts to your cellular rhythm. 
          Initiate your assessment below.
        </p>

        <div className="grid gap-6 py-6 border-y border-white/5">
          <div className="flex items-start gap-4 group">
            <span className="text-2xl opacity-50">01</span>
            <div className="space-y-1">
              <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">Biometric Baseline</h4>
              <p className="text-xs text-white/40">Physical data and surgical/health history.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 group">
            <span className="text-2xl opacity-50">02</span>
            <div className="space-y-1">
              <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">Hormonal Velocity</h4>
              <p className="text-xs text-white/40">Menstrual cycle integration and sync.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 group">
            <span className="text-2xl opacity-50">03</span>
            <div className="space-y-1">
              <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">Lifestyle Audit</h4>
              <p className="text-xs text-white/40">Stress, sleep, and environmental variables.</p>
            </div>
        </div>
      </div>
      </div>

      {/* Terms checkbox */}
      <div className="space-y-4 pt-4">
        <Controller
          name="welcome.acceptedTerms"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-start gap-4 bg-white/5 p-5 rounded-sm border border-white/5">
              <Checkbox
                id="accept-terms"
                checked={field.value || false}
                onCheckedChange={field.onChange}
                className="mt-1 border-white/20 data-[state=checked]:bg-secondary data-[state=checked]:text-black"
              />
              <Label htmlFor="accept-terms" className="text-[11px] font-medium text-white/50 leading-relaxed cursor-pointer uppercase tracking-wider">
                I acknowledge the data-privacy protocols and agree to the{" "}
                <span className="text-white underline decoration-secondary/40 underline-offset-4">Terms of Sovereignty</span>
              </Label>
            </div>
          )}
        />
        {errorsAny?.welcome?.acceptedTerms && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest px-1">
            {errorsAny.welcome.acceptedTerms.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
