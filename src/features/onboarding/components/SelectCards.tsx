"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ToggleOption {
  value: string;
  label: string;
  icon?: string;
}

interface MultiSelectToggleProps {
  options: ToggleOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelections?: number;
  columns?: 2 | 3;
}

export function MultiSelectToggle({
  options,
  selected,
  onChange,
  maxSelections,
  columns = 2,
}: MultiSelectToggleProps) {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else if (!maxSelections || selected.length < maxSelections) {
      onChange([...selected, value]);
    }
  };

  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 ? "grid-cols-2" : "grid-cols-3"
      )}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <motion.button
            key={option.value}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => handleToggle(option.value)}
            className={cn(
              "flex items-center gap-3 rounded-md border text-[11px] font-bold uppercase tracking-widest px-5 py-4 transition-all duration-300 text-left relative overflow-hidden",
              isSelected
                ? "border-secondary bg-secondary/10 text-secondary shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : "border-white/5 bg-card text-muted-foreground hover:border-white/20 hover:bg-white/5"
            )}
          >
            {option.icon && <span className="text-xl filter grayscale group-hover:grayscale-0 transition-all">{option.icon}</span>}
            <span className="flex-1">{option.label}</span>
            {isSelected && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-secondary text-sm"
              >
                ✓
              </motion.span>
            )}
            {/* Subtle luxury glow on selection */}
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 to-transparent pointer-events-none" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

interface SingleSelectCardProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3;
}

export function SingleSelectCard({
  options,
  value,
  onChange,
  columns = 2,
}: SingleSelectCardProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 ? "grid-cols-2" : "grid-cols-3"
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-col items-center justify-center gap-4 rounded-md border p-6 transition-all duration-300 relative overflow-hidden group",
              isSelected
                ? "border-secondary bg-secondary/10 text-secondary shadow-[0_0_25px_rgba(16,185,129,0.15)]"
                : "border-white/5 bg-card text-muted-foreground hover:border-white/20 hover:bg-white/5"
            )}
          >
            {option.icon && (
              <span className={cn(
                "text-3xl transition-transform duration-500 group-hover:scale-110",
                !isSelected && "opacity-40 grayscale"
              )}>
                {option.icon}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{option.label}</span>
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
