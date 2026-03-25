"use server";
import { createClient } from "@/lib/supabase/server";

export async function postCommunityChatAction(message: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  const { error } = await supabase.from("community_chat").insert({
    user_id: user.id,
    message
  });
  if (error) throw error;
  return true;
}

export async function postCommunityTimelineAction(body: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    body
  });
  if (error) throw error;
  return true;
}
