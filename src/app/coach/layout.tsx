import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "AI Coach | SheSync",
  description: "Chat with your personal AI fitness coach. Ask anything about workouts, nutrition, or recovery.",
};
export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
