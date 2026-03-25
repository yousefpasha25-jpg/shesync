/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OnboardingFormData } from "@/features/onboarding/schema";

/**
 * Mock API call that simulates submitting the onboarding profile.
 * Replace this with a real Supabase call when the backend is ready.
 */
export async function submitOnboardingProfile(
  data: Partial<OnboardingFormData>
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to submit onboarding profile");
    }

    return {
      success: true,
      message: result.message || "Profile created successfully! Welcome to SheSync 💚",
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "A critical error occurred. Please try again.";
    console.error("Submission error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}
