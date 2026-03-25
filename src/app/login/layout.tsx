import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign In | SheSync",
  description: "Sign in to your SheSync account and continue your AI fitness journey.",
};
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
