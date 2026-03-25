import { z } from "zod";

// ─── Step 1: Welcome / Get Started ───
export const welcomeSchema = z.object({
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms to continue",
  }),
});

// ─── Step 2: Basic Info ───
export const basicInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),
  age: z
    .coerce.number({ message: "Please enter your age" })
    .int()
    .min(13, "You must be at least 13 years old")
    .max(80, "Please enter a valid age"),
  heightCm: z
    .coerce.number({ message: "Please enter your height" })
    .min(100, "Height must be at least 100 cm")
    .max(250, "Height must be under 250 cm"),
  weightKg: z
    .coerce.number({ message: "Please enter your weight" })
    .min(30, "Weight must be at least 30 kg")
    .max(250, "Weight must be under 250 kg"),
});

// ─── Step 3: Medical / Health Background ───
export const medicalSchema = z.object({
  hasHealthConditions: z.boolean(),
  healthConditions: z.array(z.string()).default([]),
  injuries: z.string().max(300).optional(),
  medications: z.string().max(300).optional(),
});

// ─── Step 4: Cycle & Hormonal Sync ───
export const cycleSchema = z.object({
  trackCycle: z.boolean(),
  pregnancyStatus: z.enum(["not_pregnant", "pregnant", "postpartum", "prefer_not_to_say"]),
  averageCycleLength: z.coerce.number().min(20).max(45).optional().nullable(),
  commonSymptoms: z.array(
    z.enum([
      "cramps",
      "bloating",
      "fatigue",
      "mood_swings",
      "headaches",
      "back_pain",
      "breast_tenderness",
      "none",
    ])
  ).default([]),
});

// ─── Step 5: Fitness Goals ───
export const fitnessGoalsSchema = z.object({
  primaryGoal: z.enum([
    "lose_weight",
    "build_muscle",
    "tone_up",
    "improve_endurance",
    "increase_flexibility",
    "stress_relief",
    "overall_health",
    "postpartum_recovery",
  ]),
  secondaryGoals: z.array(z.string()).max(3, "Pick up to 3 secondary goals").default([]),
  targetTimelineWeeks: z.coerce.number().min(4).max(52).optional().nullable(),
});

// ─── Step 6: Current Fitness Level ───
export const fitnessLevelSchema = z.object({
  currentLevel: z.enum(["beginner", "intermediate", "advanced"]),
  exerciseFrequency: z.enum(["never", "1-2_weekly", "3-4_weekly", "5+_weekly"]),
  previousExperience: z.array(
    z.enum([
      "yoga",
      "pilates",
      "strength_training",
      "cardio",
      "hiit",
      "dance",
      "martial_arts",
      "swimming",
      "running",
      "none",
    ])
  ).default([]),
});

// ─── Step 7: Lifestyle Assessment ───
export const lifestyleSchema = z.object({
  workSchedule: z.enum(["9_to_5", "shift_work", "remote", "student", "stay_at_home", "other"]),
  averageSleepHours: z.coerce.number().min(3).max(12),
  stressLevel: z.enum(["low", "moderate", "high", "very_high"]),
  dailySteps: z.enum(["under_3000", "3000_7000", "7000_10000", "over_10000"]),
});

// ─── Step 8: Workout Preferences ───
export const workoutPrefsSchema = z.object({
  preferredDuration: z.enum(["15_min", "30_min", "45_min", "60_min", "90_min"]),
  preferredFrequency: z.enum(["2_days", "3_days", "4_days", "5_days", "6_days"]),
  preferredSplit: z.enum([
    "full_body",
    "upper_lower",
    "push_pull_legs",
    "body_part_split",
    "no_preference",
  ]),
  preferredTime: z.enum(["early_morning", "morning", "afternoon", "evening", "late_night"]),
  workoutTypes: z.array(
    z.enum([
      "strength",
      "cardio",
      "hiit",
      "yoga",
      "pilates",
      "stretching",
      "dance",
      "walking",
    ])
  ).min(1, "Select at least one workout type"),
});

// ─── Step 9: Nutrition Preferences ───
export const nutritionSchema = z.object({
  dietaryPreference: z.enum([
    "no_restriction",
    "vegetarian",
    "vegan",
    "pescatarian",
    "keto",
    "paleo",
    "halal",
    "gluten_free",
    "other",
  ]).optional().nullable(),
  allergies: z.array(z.string()).default([]),
  dailyWaterGoalLiters: z.coerce.number().min(1).max(6).optional().nullable(),
  mealsPerDay: z.coerce.number().min(2).max(6).optional().nullable(),
  trackCalories: z.boolean().optional().nullable(),
});

// ─── Step 10: Equipment Access ───
export const equipmentSchema = z.object({
  workoutLocation: z.enum(["home", "gym", "outdoor", "mixed"]),
  availableEquipment: z.array(
    z.enum([
      "dumbbells",
      "barbell",
      "resistance_bands",
      "kettlebell",
      "pull_up_bar",
      "yoga_mat",
      "foam_roller",
      "treadmill",
      "stationary_bike",
      "cable_machine",
      "none",
    ])
  ).default([]),
});

// ─── Step 11: Review & Submit ───
export const reviewSchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, {
    message: "Please confirm your profile to continue",
  }),
});

// ─── Composite Schema (full profile) ───
export const onboardingSchema = z.object({
  welcome: welcomeSchema.optional().nullable(),
  basicInfo: basicInfoSchema.optional().nullable(),
  medical: medicalSchema.optional().nullable(),
  cycle: cycleSchema.optional().nullable(),
  fitnessGoals: fitnessGoalsSchema.optional().nullable(),
  fitnessLevel: fitnessLevelSchema.optional().nullable(),
  lifestyle: lifestyleSchema.optional().nullable(),
  workoutPrefs: workoutPrefsSchema.optional().nullable(),
  nutrition: nutritionSchema.optional().nullable(),
  equipment: equipmentSchema.optional().nullable(),
  review: reviewSchema.optional().nullable(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Per-step schemas in order (used by the wizard engine)
export const stepSchemas = [
  welcomeSchema,
  basicInfoSchema,
  medicalSchema,
  cycleSchema,
  fitnessGoalsSchema,
  fitnessLevelSchema,
  lifestyleSchema,
  workoutPrefsSchema,
  nutritionSchema,
  equipmentSchema,
  reviewSchema,
] as const;

// Step keys matching the composite schema
export const stepKeys = [
  "welcome",
  "basicInfo",
  "medical",
  "cycle",
  "fitnessGoals",
  "fitnessLevel",
  "lifestyle",
  "workoutPrefs",
  "nutrition",
  "equipment",
  "review",
] as const;

export type StepKey = (typeof stepKeys)[number];

// Step metadata for UI
export const stepMeta: Record<StepKey, { title: string; subtitle: string; icon: string }> = {
  welcome: {
    title: "Welcome to SheSync",
    subtitle: "Let's build your personalized fitness journey",
    icon: "✨",
  },
  basicInfo: {
    title: "About You",
    subtitle: "Tell us a bit about yourself",
    icon: "👤",
  },
  medical: {
    title: "Health Background",
    subtitle: "Help us keep your workouts safe",
    icon: "🩺",
  },
  cycle: {
    title: "Cycle & Hormonal Sync",
    subtitle: "Optimize workouts around your cycle",
    icon: "🌙",
  },
  fitnessGoals: {
    title: "Your Goals",
    subtitle: "What do you want to achieve?",
    icon: "🎯",
  },
  fitnessLevel: {
    title: "Fitness Level",
    subtitle: "Where are you right now?",
    icon: "💪",
  },
  lifestyle: {
    title: "Your Lifestyle",
    subtitle: "We'll adapt to your schedule",
    icon: "🏠",
  },
  workoutPrefs: {
    title: "Workout Style",
    subtitle: "How do you like to train?",
    icon: "🏋️‍♀️",
  },
  nutrition: {
    title: "Nutrition",
    subtitle: "Fuel your transformation",
    icon: "🥗",
  },
  equipment: {
    title: "Equipment Access",
    subtitle: "What do you have to work with?",
    icon: "🏠",
  },
  review: {
    title: "Review & Launch",
    subtitle: "Confirm your profile and let's go!",
    icon: "🚀",
  },
};
