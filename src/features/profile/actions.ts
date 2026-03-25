"use server";
import { createClient } from "@/lib/supabase/server";

export async function deleteAccountAction() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  // Delete the profile, which cascades to user_plans, meals, etc.
  const { error } = await supabase.from('profiles').delete().eq('id', user.id);
  if (error) throw error;
  
  // Sign out will happen on the client
  return true;
}
