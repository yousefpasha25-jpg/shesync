-- ─── SHE SYNC: DELETE POLICIES & COMMUNITY UPDATES ───
-- Phase 1 Security Audit Fix: Add DELETE policies for data ownership

-- 1. DELETE Policies: Profiles
CREATE POLICY "Users can delete their own profile."
  ON public.profiles FOR DELETE
  USING (auth.uid() = user_id);

-- 2. DELETE Policies: Health Metrics
CREATE POLICY "Users can delete their own health metrics."
  ON public.health_metrics FOR DELETE
  USING (auth.uid() = user_id);

-- 3. DELETE Policies: User Plans
CREATE POLICY "Users can delete their own plans."
  ON public.user_plans FOR DELETE
  USING (auth.uid() = user_id);

-- 4. DELETE Policies: Community Chat (own messages only)
CREATE POLICY "Users can delete their own chat messages."
  ON public.community_chat FOR DELETE
  USING (auth.uid() = user_id);

-- 5. UPDATE Policy: Community Chat (allow editing own messages)
CREATE POLICY "Users can update their own chat messages."
  ON public.community_chat FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. DELETE Policy: Leaderboard (own entry only, for account cleanup)
CREATE POLICY "Users can delete their own leaderboard entry."
  ON public.leaderboard FOR DELETE
  USING (auth.uid() = user_id);
