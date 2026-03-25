ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_workout_date DATE;

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, achievement_type)
);
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements_own" ON achievements FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS daily_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  point_type VARCHAR(50) NOT NULL, -- 'water', 'workout', 'meal'
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  points_awarded INTEGER NOT NULL,
  UNIQUE(user_id, point_type, date)
);
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_goals_own" ON daily_goals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
