import type { Metadata } from "next";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";

export const metadata: Metadata  = {
  title: "Sneiden — Full-Stack Developer",
  description:
    "Sneiden's Portfolio — full-stack1 TypeScript, NestJS, and Next.js.",
};

export default function HomePage() {
  return (
    <main className="bg-[#FAFAF8] text-neutral-900 antialiased">
      <HeroSection />
      <ProjectsSection />
      {/* More sections come here: Projects, About, References, Contact */}
    </main>
  );
}