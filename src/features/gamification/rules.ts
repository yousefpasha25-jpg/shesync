export const XP_VALUES = {
  WORKOUT_COMPLETED: 50,
  MEAL_LOGGED: 10,
  WATER_GOAL_MET: 15,
  STREAK_BONUS_7_DAYS: 100,
  STREAK_BONUS_30_DAYS: 500,
};

export const ACHIEVEMENTS = [
  { id: "first_workout", name: "First Sweat", points: 50, description: "Completed your first workout." },
  { id: "first_meal", name: "Nutrition Start", points: 20, description: "Logged your first meal." },
  { id: "streak_7", name: "Unstoppable", points: 100, description: "Hit a 7-day workout streak." },
  { id: "streak_30", name: "Iron Will", points: 500, description: "Hit a 30-day workout streak." },
  { id: "water_master", name: "Hydration Master", points: 50, description: "Hit your daily water goal 7 times." },
];

export const calculateLevel = (xp: number) => {
  // Base formula: Level = floor(sqrt(XP / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const xpForNextLevel = (currentLevel: number) => {
  return Math.pow(currentLevel, 2) * 100;
};
