import * as z from "zod";

export const step1Schema = z.object({
  name: z.string().optional(),
  age: z.coerce.number().optional(),
  height_cm: z.coerce.number().optional(),
  weight_kg: z.coerce.number().optional(),
});

export const step2Schema = z.object({
  is_pregnant: z.boolean().optional(),
  pregnancy_weeks: z.string().optional(),
});

export const step3Schema = z.object({
  goals: z.array(z.string()).optional(),
});

export const step4Schema = z.object({
  work_schedule: z.string().optional(),
  sleep_hours: z.string().optional(),
  stress_level: z.string().optional(),
  has_children: z.boolean().optional(),
});

export const step5Schema = z.object({
  cycle_enabled: z.boolean().optional(),
  last_period_date: z.date().optional(),
  avg_cycle_days: z.coerce.number().optional(),
  typical_symptoms: z.array(z.string()).optional(),
});

export const step6Schema = z.object({
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  modalities: z.array(z.string()).optional(),
});

export const step7Schema = z.object({
  preferred_duration_min: z.coerce.number().optional(),
  frequency_days_per_week: z.coerce.number().optional(),
  split: z.array(z.string()).optional(),
});

export const step8Schema = z.object({
  diet_rules: z.array(z.string()).optional(),
  meal_frequency: z.string().optional(),
  cooking_effort: z.string().optional(),
  water_liters: z.coerce.number().optional(),
  nutrition_goals: z.array(z.string()).optional(),
});

export const step9Schema = z.object({
  equipment_context: z.enum(["home_gym", "commercial_gym", "bodyweight"]).optional(),
  equipment_items: z.array(z.string()).optional(),
});

export const step10Schema = z.object({
  wearable_providers: z.array(z.string()).optional(),
});

export type OnboardingData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema> &
  z.infer<typeof step4Schema> &
  z.infer<typeof step5Schema> &
  z.infer<typeof step6Schema> &
  z.infer<typeof step7Schema> &
  z.infer<typeof step8Schema> &
  z.infer<typeof step9Schema> &
  z.infer<typeof step10Schema>;
