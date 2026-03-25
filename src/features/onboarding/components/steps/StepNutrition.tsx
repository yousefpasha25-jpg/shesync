/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SingleSelectCard } from "../SelectCards";

const dietOptions = [
  { value: "no_restriction", label: "Standard" },
  { value: "vegetarian", label: "Veg." },
  { value: "vegan", label: "Vegan" },
  { value: "pescatarian", label: "Pesc." },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "halal", label: "Halal" },
  { value: "gluten_free", label: "No Gluten" },
  { value: "other", label: "Custom" },
];

const waterOptions = [
  { value: "1", label: "1.0L" },
  { value: "2", label: "2.0L" },
  { value: "3", label: "3.0L" },
  { value: "4", label: "4.0L+" },
];

const mealOptions = [
  { value: "2", label: "2 Meals" },
  { value: "3", label: "3 Meals" },
  { value: "4", label: "4 Meals" },
  { value: "5", label: "5 Meals" },
];

interface StepNutritionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function StepNutrition({ form }: StepNutritionProps) {
  const diet = form.watch("nutrition.dietaryPreference") || "";
  const trackCalories = form.watch("nutrition.trackCalories");

  return (
    <div className="space-y-12 py-2 max-w-sm mx-auto">
      {/* Editorial Header */}
      <div className="space-y-2 border-l-2 border-secondary pl-6 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Section 08</span>
        <h3 className="text-xl font-bold uppercase tracking-tight text-white font-heading">Nutrient Profile</h3>
      </div>

      {/* Dietary preference */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Dietary Framework</Label>
        <Controller
          name="nutrition.dietaryPreference"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={dietOptions}
              value={field.value || ""}
              onChange={field.onChange}
              columns={3}
            />
          )}
        />
      </div>

      {/* Allergies */}
      <div className="space-y-3 group">
        <Label htmlFor="allergies" className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 group-focus-within:text-secondary transition-colors pl-1">
          Immunological Avoidance <span className="text-white/20 font-normal lowercase">(csv)</span>
        </Label>
        <Controller
          name="nutrition.allergies"
          control={form.control}
          render={({ field }) => (
            <Input
              id="allergies"
              placeholder="List sensitivities"
              className="bg-card border-white/5 rounded-sm focus:border-secondary transition-all h-14 text-sm tracking-wide"
              value={Array.isArray(field.value) ? field.value.join(", ") : ""}
              onChange={(e) => {
                const allergies = e.target.value
                  .split(",")
                  .map((a) => a.trim())
                  .filter(Boolean);
                field.onChange(allergies);
              }}
            />
          )}
        />
      </div>

      {/* Daily water goal */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Hydration Baseline</Label>
        <Controller
          name="nutrition.dailyWaterGoalLiters"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={waterOptions}
              value={String(field.value || "")}
              onChange={(val) => field.onChange(Number(val))}
            />
          )}
        />
      </div>

      {/* Meals per day */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Feeding Regimen</Label>
        <Controller
          name="nutrition.mealsPerDay"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={mealOptions}
              value={String(field.value || "")}
              onChange={(val) => field.onChange(Number(val))}
              columns={2}
            />
          )}
        />
      </div>

      {/* Track calories */}
      <Controller
        name="nutrition.trackCalories"
        control={form.control}
        render={({ field }) => (
          <div className="flex items-start gap-4 bg-white/5 p-5 rounded-sm border border-white/5">
            <Checkbox
              id="trackCalories"
              checked={field.value || false}
              onCheckedChange={field.onChange}
              className="mt-1 border-white/20 data-[state=checked]:bg-secondary data-[state=checked]:text-black"
            />
            <div className="space-y-1">
              <Label htmlFor="trackCalories" className="cursor-pointer text-[11px] font-medium leading-relaxed text-white/60 tracking-wide uppercase">
                Enable Caloric Analytics
              </Label>
              <p className="text-[10px] text-white/30 tracking-widest uppercase">
                Quantify deficit/surplus per session
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
