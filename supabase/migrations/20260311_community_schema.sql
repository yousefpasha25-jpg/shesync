-- ─── SHE SYNC: COMMUNITY & GAMIFICATION SCHEMA ───
-- Phase 14: Community Hub Implementation

-- 1. Create Leaderboard Table
-- Tracks user performance and streaks
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_workouts INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- 2. Create Community Chat Table
-- Stores real-time messages for the Safe Space
CREATE TABLE IF NOT EXISTS public.community_chat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_chat ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies: Leaderboard
CREATE POLICY "Users can select leaderboard data."
  ON public.leaderboard FOR SELECT
  USING (true); -- Publicly readable for the community

CREATE POLICY "Users can update their own leaderboard stats."
  ON public.leaderboard FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert leaderboard rows."
  ON public.leaderboard FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. RLS Policies: Community Chat
CREATE POLICY "Users can read all chat messages."
  ON public.community_chat FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own chat messages."
  ON public.community_chat FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. Trigger for leaderboard updated_at
CREATE TRIGGER set_leaderboard_updated_at
BEFORE UPDATE ON public.leaderboard
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
