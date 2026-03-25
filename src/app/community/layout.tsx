import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Community | SheSync",
  description: "Connect with the SheSync community. Share wins, get support, and stay motivated together.",
};
export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
