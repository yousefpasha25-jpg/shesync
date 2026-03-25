"use server";
import { createClient } from "@/lib/supabase/server";

export async function saveWeeklyMealPlanAction(formattedPlans: any[]) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  const plansWithUserId = formattedPlans.map(p => ({ ...p, user_id: user.id }));
  
  await supabase.from("weekly_meal_plans").delete().eq("user_id", user.id).eq("week_number", 1);
  
  const { error } = await supabase.from("weekly_meal_plans").insert(plansWithUserId);
  if (error) throw error;
  return true;
}

export async function logMealAction(mealPayload: any) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  const { error } = await supabase.from("meals").insert({
    ...mealPayload,
    user_id: user.id
  });
  if (error) throw error;
  return true;
}
