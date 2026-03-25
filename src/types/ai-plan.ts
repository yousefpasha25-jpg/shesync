export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  rpe: number; // Rate of Perceived Exertion (1-10)
  instruction?: string;
}

export interface DailyWorkout {
  day: string; // Monday, Tuesday, etc.
  title: string;
  type: "strength" | "hiit" | "yoga" | "rest" | "cardio" | "mobility";
  durationMinutes: number;
  exercises: Exercise[];
  coachNotes?: string;
}

export interface DayPlan {
  date: string;
  workout: DailyWorkout;
  nutrition: {
    focus: string;
    targetMacros: {
      protein: string;
      carbs: string;
      fats: string;
    };
    suggestedMeal: string;
  };
}

export interface WeeklyPlan {
  weekNumber: number;
  phase: "follicular" | "ovulatory" | "luteal" | "menstrual";
  philosophy: string;
  days: DayPlan[];
}

export interface FourWeekPlan {
  userId: string;
  createdAt: string;
  onboardingSnapshot: Record<string, unknown>;
  weeks: WeeklyPlan[];
}

// ─── Coach Chat Types ───

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CoachApiResponse {
  reply?: string;
  error?: string;
}

// ─── Plan API Types ───

export interface PlanApiResponse {
  weeks?: WeeklyPlan[];
  error?: string;
}

