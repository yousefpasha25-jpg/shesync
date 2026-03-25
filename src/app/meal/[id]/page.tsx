import React from "react";
import { MealDetail } from "@/components/nutrition/MealDetail";

interface MealPageProps {
  params: Promise<{ id: string }>;
}

// Meal data keyed by slug. Expand as meals are added.
const MEAL_DATA: Record<string, React.ComponentProps<typeof MealDetail>> = {
  "grilled-salmon-quinoa": {
    title: ["Grilled Salmon &", "Quinoa"],
    tags: ["Omega-3 Rich", "High Protein"],
    imageUrl: "/images/meals/salmon-quinoa.jpg",
    macros: [
      { label: "Protein", value: "35", unit: "g" },
      { label: "Carbs", value: "42", unit: "g" },
      { label: "Fats", value: "18", unit: "g" },
    ],
    micronutrients: [
      { name: "Vitamin D", percentage: 85 },
      { name: "Vitamin B12", percentage: 120 },
      { name: "Magnesium", percentage: 45 },
    ],
    protocol: [
      { title: "Sustainably Sourced", description: "Wild-caught Alaskan salmon selected for optimal purity.", icon: "check_circle" },
      { title: "Slow-Release Carbs", description: "Tri-color quinoa base ensures steady glucose response.", icon: "schedule" },
      { title: "Anti-Inflammatory", description: "Prepared with cold-pressed extra virgin olive oil.", icon: "eco" },
    ],
  },
  "lentil-soup": {
    title: ["Red Lentil", "Soup"],
    tags: ["High Fibre", "Plant-Based"],
    imageUrl: "/images/meals/lentil-soup.jpg",
    macros: [
      { label: "Protein", value: "18", unit: "g" },
      { label: "Carbs", value: "55", unit: "g" },
      { label: "Fats", value: "8", unit: "g" },
    ],
    micronutrients: [
      { name: "Iron", percentage: 40 },
      { name: "Folate", percentage: 90 },
      { name: "Zinc", percentage: 30 },
    ],
    protocol: [
      { title: "Iron-Rich", description: "Red lentils provide non-heme iron; pair with vitamin C foods for absorption.", icon: "fitness_center" },
      { title: "Gut-Friendly", description: "High soluble fibre supports a balanced microbiome.", icon: "eco" },
      { title: "MENA Heritage", description: "A staple of Levantine cuisine, slow-simmered with cumin and lemon.", icon: "restaurant" },
    ],
  },
};

const DEFAULT_MEAL: React.ComponentProps<typeof MealDetail> = {
  title: ["Balanced", "Meal"],
  tags: ["Nutritious", "Balanced"],
  imageUrl: "/images/meals/default.jpg",
  macros: [
    { label: "Protein", value: "25", unit: "g" },
    { label: "Carbs", value: "40", unit: "g" },
    { label: "Fats", value: "12", unit: "g" },
  ],
  micronutrients: [
    { name: "Vitamin C", percentage: 60 },
    { name: "Calcium", percentage: 30 },
    { name: "Iron", percentage: 25 },
  ],
  protocol: [
    { title: "Whole Foods", description: "Ingredients selected for micronutrient density and bioavailability.", icon: "check_circle" },
    { title: "Balanced Macros", description: "Optimised macronutrient ratio for sustained energy.", icon: "scale" },
    { title: "Anti-Inflammatory", description: "Prepared using anti-inflammatory cooking methods.", icon: "eco" },
  ],
};

export default async function MealPage({ params }: MealPageProps) {
  const { id } = await params;
  const meal = MEAL_DATA[id] ?? DEFAULT_MEAL;

  return <MealDetail {...meal} />;
}
