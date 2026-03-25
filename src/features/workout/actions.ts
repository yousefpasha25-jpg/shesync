"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateFitnessGoalsAction(plan: any) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  const { error } = await supabase.from('profiles').update({ fitness_goals: plan }).eq('user_id', user.id);
  if (error) throw error;
  return true;
}
