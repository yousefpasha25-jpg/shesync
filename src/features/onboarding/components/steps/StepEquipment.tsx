/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SingleSelectCard, MultiSelectToggle } from "../SelectCards";

const locationOptions = [
  { value: "home", label: "Private (Home)" },
  { value: "gym", label: "Gym (Com.)" },
  { value: "outdoor", label: "Open Air" },
  { value: "mixed", label: "Hybrid" },
];

const equipmentOptions = [
  { value: "dumbbells", label: "Dumbbells" },
  { value: "barbell", label: "Barbell" },
  { value: "resistance_bands", label: "Bands" },
  { value: "kettlebell", label: "Kettlebell" },
  { value: "pull_up_bar", label: "Bar (Pull)" },
  { value: "yoga_mat", label: "Standard Mat" },
  { value: "foam_roller", label: "Recovery" },
  { value: "treadmill", label: "Treadmill" },
  { value: "stationary_bike", label: "Bike (Stat)" },
  { value: "cable_machine", label: "Cable Unit" },
  { value: "none", label: "Bodyweight" },
];

interface StepEquipmentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function StepEquipment({ form }: StepEquipmentProps) {
  const location = form.watch("equipment.workoutLocation") || "";
  const equipment = form.watch("equipment.availableEquipment") || [];

  return (
    <div className="space-y-12 py-2 max-w-sm mx-auto">
      {/* Editorial Header */}
      <div className="space-y-2 border-l-2 border-secondary pl-6 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Section 09</span>
        <h3 className="text-xl font-bold uppercase tracking-tight text-white font-heading">Hardware Inventory</h3>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 px-1">Training Environment</Label>
        <Controller
          name="equipment.workoutLocation"
          control={form.control}
          render={({ field }) => (
            <SingleSelectCard
              options={locationOptions}
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Equipment */}
      <div className="space-y-4">
        <div className="space-y-1 mb-2 px-1">
          <Label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40">Available Hardware</Label>
          <p className="text-[9px] text-white/20 uppercase tracking-widest leading-relaxed">Optimization requires knowledge of your specific toolset</p>
        </div>
        <Controller
          name="equipment.availableEquipment"
          control={form.control}
          render={({ field }) => (
            <MultiSelectToggle
              options={equipmentOptions}
              selected={field.value || []}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
}
