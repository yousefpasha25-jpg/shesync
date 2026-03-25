import { ExerciseDetail } from "@/components/exercise/ExerciseDetail";

export default function ExercisePage() {
  // In a real app, fetch based on params.id
  return (
    <ExerciseDetail 
      title="Air Squats"
      type="Strength Training"
      imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDxiCNbLk5j9IJfapwGBei_Y3hexnohBELp9pKhC-naOLOWMkwpF0Whz311c9wCGCqfr2jv9N7jpKfrHedsoLyEZ163Tp8OUGlFa9CtbMWcwzmJY7sFfFTiqVj8g2QAKg5uzWCsYLFR-m-tc76UHiv2LMY7EVNs6Ce2EAii_XHBu0r3rLzPSamyMTOh7VBneFwjTps-snKy10agBT--QO0zR7TTOLxHxudHu0fmOzCJ3VbWJyHHL3W80xnccOE7h5dXFZBvHxysKZU"
      targetReps="15"
      restPeriod="30s"
      intensity="Mod"
      formSteps={[
        { title: "Feet shoulder-width apart", description: "Ensure a stable base with toes slightly pointed outwards for natural hip rotation." },
        { title: "Keep chest upright", description: "Maintain a neutral spine. Gaze forward to keep your torso engaged and prevent leaning." },
        { title: "Drive through heels", description: "Weight should be centered. Push through your heels to return to a standing position." }
      ]}
      muscleGroups={[
        { name: "Quads", isPrimary: true },
        { name: "Glutes", isPrimary: true },
        { name: "Core", isPrimary: true },
        { name: "Hamstrings", isPrimary: false }
      ]}
    />
  );
}
