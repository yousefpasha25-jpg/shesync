import React from "react";
import { ExerciseDetail } from "@/components/exercise/ExerciseDetail";

interface ExercisePageProps {
  params: Promise<{ id: string }>;
}

// Exercise data keyed by slug. Expand as exercises are added.
const EXERCISE_DATA: Record<string, React.ComponentProps<typeof ExerciseDetail>> = {
  "air-squats": {
    title: "Air Squats",
    type: "Strength Training",
    imageUrl: "/images/exercises/air-squats.jpg",
    targetReps: "15",
    restPeriod: "30s",
    intensity: "Mod",
    formSteps: [
      { title: "Feet shoulder-width apart", description: "Ensure a stable base with toes slightly pointed outwards for natural hip rotation." },
      { title: "Keep chest upright", description: "Maintain a neutral spine. Gaze forward to keep your torso engaged and prevent leaning." },
      { title: "Drive through heels", description: "Weight should be centered. Push through your heels to return to a standing position." },
    ],
    muscleGroups: [
      { name: "Quads", isPrimary: true },
      { name: "Glutes", isPrimary: true },
      { name: "Core", isPrimary: true },
      { name: "Hamstrings", isPrimary: false },
    ],
  },
  "glute-bridges": {
    title: "Glute Bridges",
    type: "Strength Training",
    imageUrl: "/images/exercises/glute-bridges.jpg",
    targetReps: "15",
    restPeriod: "30s",
    intensity: "Low",
    formSteps: [
      { title: "Lie flat on your back", description: "Knees bent, feet hip-width apart and flat on the floor." },
      { title: "Drive hips upward", description: "Squeeze glutes and push hips toward the ceiling. Hold 1 second at the top." },
      { title: "Lower with control", description: "Slowly lower hips back to starting position without resting on the floor between reps." },
    ],
    muscleGroups: [
      { name: "Glutes", isPrimary: true },
      { name: "Hamstrings", isPrimary: true },
      { name: "Core", isPrimary: false },
    ],
  },
};

const DEFAULT_EXERCISE: React.ComponentProps<typeof ExerciseDetail> = {
  title: "Exercise",
  type: "Training",
  imageUrl: "/images/exercises/default.jpg",
  targetReps: "12",
  restPeriod: "45s",
  intensity: "Mod",
  formSteps: [
    { title: "Set up correctly", description: "Follow proper form to maximise results and minimise injury risk." },
    { title: "Control the movement", description: "Move with intention — avoid using momentum." },
    { title: "Breathe rhythmically", description: "Exhale on exertion, inhale on the return." },
  ],
  muscleGroups: [{ name: "Full Body", isPrimary: true }],
};

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { id } = await params;
  const exercise = EXERCISE_DATA[id] ?? DEFAULT_EXERCISE;

  return <ExerciseDetail {...exercise} />;
}
