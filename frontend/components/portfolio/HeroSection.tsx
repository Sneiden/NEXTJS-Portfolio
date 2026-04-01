"use client";

import { motion } from "framer-motion";

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: {
        opacity: 1,
        y: 0,
        transition: { 
            duration: 0.65, 
            // ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
            ease: "easeOut" as const
        },
    },
};

const line = {
    hidden: { scaleX: 0 },
    show: {
        scaleX: 1,
        transition: { 
            duration: 0.8, 
            // ease: [0.22, 1, 0.36, 1] as [number, number, number, number] //cubic bezier tuple
            ease: "easeOut" as const
         },
    },
};

export function HeroSection() {
    return (
        <section
            id="hero"
            className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 overflow-hidden"
        >
            {/* Subtle grid background */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10
                [background-image:linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)]
                [background-size:64px_64px]
                opacity-50"
            />

            {/* Accent blob */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full
                bg-gradient-to-br from-neutral-200 to-transparent blur-3xl opacity-60 -z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
            />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-5xl"
            >
                {/* Eyebrow label */}
                <motion.p
                    variants={fadeUp}
                    className="mb-6 font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase"
                >
                    Portfolio — Full-Stack Developer
                </motion.p>

                {/* Horizontal rule animated */}
                <motion.div
                    variants={line}
                    className="mb-8 h-px w-24 bg-neutral-800 origin-left"
                />

                {/* Name */}
                <motion.h1
                    variants={fadeUp}
                    className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-normal
                    leading-[1.05] tracking-tight text-neutral-900"
                >
                    Your Name
                </motion.h1>

                {/* Title line */}
                <motion.h2
                    variants={fadeUp}
                    className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-light
                    text-neutral-400 italic"
                >
                    Building things for the web.
                </motion.h2>

                {/* Bio */}
                <motion.p
                    variants={fadeUp}
                    className="mt-8 max-w-xl text-base md:text-lg leading-relaxed text-neutral-600"
                >
                    I design and develop full-stack applications — from architecture to
                    pixel-perfect interfaces. Focused on TypeScript, NestJS, and Next.js.
                </motion.p>

                {/* CTA row */}
                <motion.div
                    variants={fadeUp}
                    className="mt-10 flex flex-wrap items-center gap-4"
                >
                    <a
                        href="#projects"
                        className="inline-flex items-center gap-2 rounded-none border border-neutral-900
                        bg-neutral-900 px-7 py-3 font-mono text-sm text-white
                        transition-colors hover:bg-transparent hover:text-neutral-900"
                    >
                        View Projects
                        <span aria-hidden>↓</span>
                    </a>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 rounded-none border border-neutral-300
                        px-7 py-3 font-mono text-sm text-neutral-700
                        transition-colors hover:border-neutral-900 hover:text-neutral-900"
                    >
                        Get in Touch
                    </a>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-6 md:left-16 lg:left-24 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
            >
                <motion.div
                    className="h-10 w-px bg-neutral-400"
                    animate={{ scaleY: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                />
                <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
                    Scroll
                </span>
            </motion.div>
        </section>
    );
}