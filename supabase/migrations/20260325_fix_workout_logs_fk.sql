-- Fix workout_logs FK constraint to reference auth.users directly
-- The previous constraint referenced profiles(id) but we store auth.uid() in profile_id

-- Drop the old FK constraint if it exists on user_id
ALTER TABLE IF EXISTS public.workout_logs
  DROP CONSTRAINT IF EXISTS workout_logs_user_id_fkey;

-- Ensure profile_id column exists and references auth.users
ALTER TABLE IF EXISTS public.workout_logs
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure unique constraint on (profile_id, date) for upsert conflict handling
ALTER TABLE IF EXISTS public.workout_logs
  DROP CONSTRAINT IF EXISTS workout_logs_profile_id_date_key;

ALTER TABLE IF EXISTS public.workout_logs
  ADD CONSTRAINT workout_logs_profile_id_date_key UNIQUE (profile_id, date);

-- Update RLS policy to use profile_id = auth.uid()
DROP POLICY IF EXISTS "workout_logs_own" ON public.workout_logs;
CREATE POLICY "workout_logs_own" ON public.workout_logs FOR ALL
  USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
