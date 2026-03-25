"use server";
import { createClient } from "@/lib/supabase/server";

export async function saveOnboardingDataAction(onboardingData: any) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Unauthorized");

  // 1. Bulletproof Profile Handling
  const profilePayload = {
    full_name: onboardingData.name || null,
    age: onboardingData.age ? Number(onboardingData.age) : null,
    fitness_level: onboardingData.level || "beginner",
    fitness_goals: onboardingData.goals || [], 
    equipment_access: onboardingData.equipment_context || "none",
    user_id: user.id, // Guarantee this not-null relation
    consent_given_at: onboardingData.consent_given ? new Date().toISOString() : null,
  };

  const { data: existingProfile } = await supabase.from("profiles").select("id, user_id").eq("user_id", user.id).maybeSingle();
  if (existingProfile) {
    const { error: profileError } = await supabase.from("profiles").update(profilePayload).eq("user_id", user.id);
    if (profileError) throw profileError;
  } else {
    // Fallback: Check if profile exists by 'id' just in case
    const { data: profileById } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
    if (profileById) {
      const { error: profileError } = await supabase.from("profiles").update(profilePayload).eq("id", user.id);
      if (profileError) throw profileError;
    } else {
      // It's completely new
      const { error: profileError } = await supabase.from("profiles").insert({ ...profilePayload, id: user.id });
      if (profileError) throw profileError;
    }
  }

  // 2. Bulletproof Health Metrics
  const healthPayload = {
     weight: onboardingData.weight_kg ? Number(onboardingData.weight_kg) : null,
     height: onboardingData.height_cm ? Number(onboardingData.height_cm) : null,
     user_id: user.id,
  };
  
  const { data: existingHealth } = await supabase.from("health_metrics").select("user_id").eq("user_id", user.id).maybeSingle();
  if (existingHealth) {
     const { error: healthError } = await supabase.from("health_metrics").update(healthPayload).eq("user_id", user.id);
     if (healthError) throw healthError;
  } else {
     const { error: healthError } = await supabase.from("health_metrics").insert(healthPayload);
     if (healthError) throw healthError;
  }

  // 3. User Goals (Delete existing, then insert)
  await supabase.from("user_goals").delete().eq("user_id", user.id);
  if (onboardingData.goals && onboardingData.goals.length > 0) {
    const goalsPayload = onboardingData.goals.map((g: string) => ({ user_id: user.id, goal: g }));
    const { error } = await supabase.from("user_goals").insert(goalsPayload);
    if (error) throw error;
  }

  // 4. Fitness Prefs
  const { error: fpError } = await supabase.from("fitness_prefs").upsert({
    user_id: user.id,
    level: onboardingData.level || "beginner",
    modalities: onboardingData.modalities || [],
    preferred_duration_min: onboardingData.preferred_duration_min ? Number(onboardingData.preferred_duration_min) : 30,
    frequency_days_per_week: onboardingData.frequency_days_per_week ? Number(onboardingData.frequency_days_per_week) : 3,
    equipment_context: onboardingData.equipment_context || "bodyweight"
  }, { onConflict: 'user_id' });
  if (fpError) throw fpError;

  // 5. Nutrition Prefs
  const { error: npError } = await supabase.from("nutrition_prefs").upsert({
    user_id: user.id,
    diet_rules: onboardingData.diet_rules || [],
    meal_frequency: onboardingData.meal_frequency || "3_meals",
    water_liters: onboardingData.water_liters ? Number(onboardingData.water_liters) : 2.5
  }, { onConflict: 'user_id' });
  if (npError) throw npError;

  return true;
}
