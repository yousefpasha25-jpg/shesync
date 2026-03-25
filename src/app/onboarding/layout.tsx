import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Get Started | SheSync",
  description: "Set up your personalized AI fitness profile. Takes just 3 minutes.",
};
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
