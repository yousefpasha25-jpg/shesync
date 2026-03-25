ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics  ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_prefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_prefs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals      ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated" ON profiles;
DROP POLICY IF EXISTS "Enable all for authenticated" ON health_metrics;

-- profiles
CREATE POLICY "profiles_own" ON profiles FOR ALL
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- health_metrics
CREATE POLICY "health_metrics_own" ON health_metrics FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- workout_logs
CREATE POLICY "workout_logs_own" ON workout_logs FOR ALL
  USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

-- remaining tables
CREATE POLICY "nutrition_prefs_own" ON nutrition_prefs FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fitness_prefs_own" ON fitness_prefs FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_goals_own" ON user_goals FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Add missing index
CREATE INDEX IF NOT EXISTS idx_workout_logs_date ON workout_logs (profile_id, date DESC);

-- Verify — must return 0 rows
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = FALSE;
