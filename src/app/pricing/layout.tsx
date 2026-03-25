import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Plans & Pricing | SheSync",
  description: "Choose your SheSync plan. Start your AI-powered fitness journey today.",
};
export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
