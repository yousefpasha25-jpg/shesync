import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Profile | SheSync",
  description: "Manage your SheSync profile, fitness preferences, and account settings.",
};
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
