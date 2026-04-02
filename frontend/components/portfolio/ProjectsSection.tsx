import { ProjectsGrid } from "./ProjectsGrid";
import type { Project } from "@/types/portfolio";

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/projects`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function ProjectsSection() {
  const projects = await getProjects();

  return (
    <section id="projects" className="px-6 md:px-16 lg:px-24 py-32">
      {/* Section header */}
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase mb-4">
          Selected Work
        </p>
        <div className="h-px w-24 bg-neutral-800 mb-8" />
        <h2 className="font-serif text-4xl md:text-5xl font-normal text-neutral-900 mb-16">
          Projects
        </h2>

        {projects.length === 0 ? (
          <p className="font-mono text-sm text-neutral-400">
            No projects yet — check back soon.
          </p>
        ) : (
          <ProjectsGrid projects={projects} />
        )}
      </div>
    </section>
  );
}