import { MealDetail } from "@/components/nutrition/MealDetail";

export default function MealPage() {
  // In a real app, fetch based on params.id
  return (
    <MealDetail 
      title={["Grilled Salmon &", "Quinoa"]}
      tags={["Omega-3 Rich", "High Protein"]}
      imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuD-YUDfcRFCjJUMLE59LR6sjATbeDEIVuz17X1P9Qz63bf3QorOHL7uuRKWHAgC2T5zsi80tt50FdC9yCOawC8eBKSpRwpWy_syzUjzHoWSk7rRqZ1EBCdYHcOL5mw23e7ZQsUiP37EikfLk8mKHrsAY8rcQxyNPTR7xh_bgGZVqPpHlLatgEkQ_Os6Zf-qVrvDrJav0u7pUUX3TMK2wWTGznbecsufd0Uhbu2bvgb7ovQDcXcxdPFC5Tzn7XrLGTruX4M9lyIB1f8"
      macros={[
        { label: "Protein", value: "35", unit: "g" },
        { label: "Carbs", value: "42", unit: "g" },
        { label: "Fats", value: "18", unit: "g" }
      ]}
      micronutrients={[
        { name: "Vitamin D", percentage: 85 },
        { name: "Vitamin B12", percentage: 120 },
        { name: "Magnesium", percentage: 45 }
      ]}
      protocol={[
        { title: "Sustainably Sourced", description: "Wild-caught Alaskan salmon selected for optimal purity.", icon: "check_circle" },
        { title: "Slow-Release Carbs", description: "Tri-color quinoa base ensures steady glucose response.", icon: "schedule" },
        { title: "Anti-Inflammatory", description: "Prepared with cold-pressed extra virgin olive oil.", icon: "eco" }
      ]}
    />
  );
}
