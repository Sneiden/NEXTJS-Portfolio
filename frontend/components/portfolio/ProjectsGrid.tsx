"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/types/portfolio";

const fadeUp: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const container: import("framer-motion").Variants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.1 },
    },
};

function ProjectCard({ project }: { project: Project }) {
    return (
        <motion.article
            variants={fadeUp}
            className="group flex flex-col border border-neutral-200 bg-white
            hover:border-neutral-400 transition-colors duration-300"
        >
            {/* Image area */}
            <div className="aspect-video w-full bg-neutral-100 overflow-hidden">
                {project.imageUrl ? (
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500
                        group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-xs text-neutral-300 tracking-widest uppercase">
                            No image
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6 gap-4">
                <div>
                    <h3 className="font-serif text-xl text-neutral-900 mb-2">
                        {project.title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
                        {project.description}
                    </p>
                </div>

                {/* Footer row */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-100">
                    <Link
                        href={`/projects/${project.slug}`}
                        className="font-mono text-xs tracking-widest uppercase text-neutral-700
                        hover:text-neutral-900 transition-colors flex items-center gap-2"
                    >
                        View Project <span aria-hidden>→</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[10px] text-neutral-400 hover:text-neutral-700
                                transition-colors tracking-wider uppercase"
                            >
                                Live
                            </a>
                        )}
                        {project.repoUrl && (
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[10px] text-neutral-400 hover:text-neutral-700
                                transition-colors tracking-wider uppercase"
                            >
                                Repo
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </motion.div>
    );
}