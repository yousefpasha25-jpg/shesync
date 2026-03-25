"use server";
import { createClient } from "@/lib/supabase/server";

export async function logWaterAction(ml: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const today = new Date().toISOString().split('T')[0];

  const { data: existingLog, error: fetchError } = await supabase
    .from("water_logs")
    .select("id, ml")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const newTotal = (existingLog?.ml || 0) + ml;

  if (existingLog) {
    const { error: updateError } = await supabase
      .from("water_logs")
      .update({ ml: newTotal })
      .eq("id", existingLog.id);
    if (updateError) throw updateError;
  } else {
    const { error: insertError } = await supabase
      .from("water_logs")
      .insert({
        user_id: user.id,
        ml: ml,
        date: today
      });
    if (insertError) throw insertError;
  }

  return newTotal;
}
