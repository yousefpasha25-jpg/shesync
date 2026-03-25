import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  setGamificationData: (data: Partial<UserState>) => void;
  addXp: (amount: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      xp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      setGamificationData: (data) => set((state) => ({ ...state, ...data })),
      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
        return { xp: newXp, level: newLevel };
      }),
    }),
    {
      name: 'shesync-user-storage',
    }
  )
);
