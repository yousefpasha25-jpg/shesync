-- ─── SHE SYNC: ONBOARDING SCHEMA ───
-- Phase 4: Secure Backend Integration

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table
-- Stores core identity and fitness preferences
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER,
  fitness_goals JSONB NOT NULL, -- { primary: string, secondary: string[], timeline: number }
  equipment_access JSONB NOT NULL, -- { location: string, equipment: string[] }
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- 3. Create Health Metrics Table
-- Stores biometric and cycle data
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  height FLOAT NOT NULL,
  weight FLOAT NOT NULL,
  is_pregnant BOOLEAN DEFAULT false,
  cycle_tracking_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Profiles
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own profile."
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. RLS Policies: Health Metrics
CREATE POLICY "Users can insert their own health metrics."
  ON public.health_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own health metrics."
  ON public.health_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics."
  ON public.health_metrics FOR UPDATE
  USING (auth.uid() = user_id);

-- 7. Triggers for updated_at (Best Practice)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_health_metrics_updated_at
BEFORE UPDATE ON public.health_metrics
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
