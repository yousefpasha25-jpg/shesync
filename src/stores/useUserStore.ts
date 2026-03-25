import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OnboardingFormData, StepKey } from "@/features/onboarding/schema";

// ─── Types ───
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface UserState {
  // — Auth
  user: UserProfile | null;
  isAuthenticated: boolean;

  // — Onboarding
  isOnboardingComplete: boolean;
  currentStep: number;
  onboardingData: Partial<OnboardingFormData>;

  // — Actions: Auth
  setUser: (user: UserProfile) => void;
  logout: () => void;

  // — Actions: Onboarding Navigation
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // — Actions: Onboarding Data
  updateStepData: <K extends StepKey>(
    stepKey: K,
    data: OnboardingFormData[K]
  ) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const TOTAL_STEPS = 11;

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // ─── Initial State ───
      user: null,
      isAuthenticated: false,
      isOnboardingComplete: false,
      currentStep: 0,
      onboardingData: {},

      // ─── Auth Actions ───
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isOnboardingComplete: false,
          currentStep: 0,
          onboardingData: {},
        }),

      // ─── Onboarding Navigation ───
      goToStep: (step) =>
        set({
          currentStep: Math.max(0, Math.min(step, TOTAL_STEPS - 1)),
        }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < TOTAL_STEPS - 1) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      // ─── Onboarding Data ───
      updateStepData: (stepKey, data) =>
        set((state) => ({
          onboardingData: {
            ...state.onboardingData,
            [stepKey]: data,
          },
        })),

      completeOnboarding: () =>
        set({
          isOnboardingComplete: true,
        }),

      resetOnboarding: () =>
        set({
          isOnboardingComplete: false,
          currentStep: 0,
          onboardingData: {},
        }),
    }),
    {
      name: "shesync-user-store",
      // Only persist these keys
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isOnboardingComplete: state.isOnboardingComplete,
        currentStep: state.currentStep,
        onboardingData: state.onboardingData,
      }),
    }
  )
);
