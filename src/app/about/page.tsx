import { Metadata } from "next";
import { AboutHero } from "@/features/about/AboutHero";
import { VisionMission } from "@/features/about/VisionMission";
import { ServicesGrid } from "@/features/about/ServicesGrid";
import { TeamSection } from "@/features/about/TeamSection";
import { WhyAwdan } from "@/features/about/WhyAwdan";
import { CTASection } from "@/features/about/CTASection";

export const metadata: Metadata = {
  title: "About | Awdan Vibes",
  description: "Transforming lives through wellness, fitness, and AI-powered coaching.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />
      <WhyAwdan />
      <VisionMission />
      <ServicesGrid />
      <TeamSection />
      <CTASection />
    </main>
  );
}
