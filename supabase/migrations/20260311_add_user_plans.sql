-- ─── SHE SYNC: USER PLANS SCHEMA ───
-- Phase 12: Global Data Hydration

-- 1. Create User Plans Table
-- Stores AI-generated workout and nutrition plans
CREATE TABLE IF NOT EXISTS public.user_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- 2. Enable Row Level Security
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can insert their own plans."
  ON public.user_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own plans."
  ON public.user_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans."
  ON public.user_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Trigger for updated_at
CREATE TRIGGER set_user_plans_updated_at
BEFORE UPDATE ON public.user_plans
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
