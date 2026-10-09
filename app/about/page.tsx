"use client";

import Link from "next/link";
import { useState } from "react";
import StaggeredText from "@/components/ui/StaggeredText";

const projects = [
  {
    number: "01",
    name: "Indicatr AI",
    category: "AI / MACHINE LEARNING",
    description:
      "An AI-powered sales intelligence platform exploring behavioral analysis, lead scoring, and machine learning models.",
    skills: ["Python", "FastAPI", "Machine Learning"],
  },
  {
    number: "02",
    name: "ORB8 Systems",
    category: "DATA / RESEARCH",
    description:
      "A research platform that brings together external data sources, analytical models, and evidence-driven insights.",
    skills: ["APIs", "Data Engineering", "Analytics"],
  },
  {
    number: "03",
    name: "Campana LMS",
    category: "SOFTWARE / KNOWLEDGE SYSTEMS",
    description:
      "A technical knowledge platform exploring structured information, multi-tenant architecture, and retrieval-based workflows.",
    skills: ["Next.js", "PostgreSQL", "Architecture"],
  },
];

export default function AboutPage() {
  const [showSecondLine, setShowSecondLine] = useState(false);
    <main className="min-h-screen bg-[#201B2A] text-[#F5E8D2]">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-24 md:px-12">
        <section className="max-w-4xl pb-20">
          <p className="mb-7 font-mono text-[10px] uppercase tracking-[0.22em] text-[#B5E0E4]">
            ● DC AGENTIC / ABOUT
          </p>

          <h1 className="font-hero max-w-[650px] text-[clamp(2rem,3.1vw,3.1rem)] font-medium leading-[1.15] tracking-[-0.035em]">
            <StaggeredText
              text="Built from curiosity."
              delay={140}
              duration={0.7}
              className="block text-[#F5E8D2]"
            />
      
            <span className="mt-[6px] block text-[#E87855]">
              {showSecondLine ? (
                <StaggeredText
                  text="Grounded in engineering."
                  delay={140}
                  duration={0.7}
                  className="block"
                />
              ) : (
                <span className="invisible block" aria-hidden="true">
                  Grounded in engineering.
                </span>
              )}
            </span>
          </h1>

          <p className="mt-9 max-w-2xl text-lg leading-8 text-[#B9B0B4]">
            DC Agentic is an independent AI education platform
            built around a simple idea: understanding how
            technology works matters more than memorizing
            which tools to use.
          </p>
        </section>

        <section className="grid gap-12 border-t border-white/10 py-20 md:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="font-mono text-xs tracking-widest text-[#B5E0E4]">
              01 / THE BACKGROUND
            </p>
            <h2 className="font-hero mt-5 text-3xl">
              Why learn here?
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-[#B9B0B4]">
            <p>
              My background combines software engineering,
              business education, and hands-on development
              of AI-powered applications.
            </p>
            <p>
              I work across software architecture, data
              engineering, machine learning, and modern web
              development, with an emphasis on understanding
              the systems behind the tools.
            </p>
            <p className="font-medium text-[#F5E8D2]">
              I believe the best way to explain technology
              is to build with it, examine where it fails,
              and share what you learn.
            </p>
          </div>
        </section>

        <section className="border-t border-white/10 py-20">
          <p className="font-mono text-xs tracking-widest text-[#B5E0E4]">
            02 / SELECTED WORK
          </p>

          <div className="mb-12 mt-5 flex flex-wrap items-end justify-between gap-5">
            <h2 className="font-hero text-4xl tracking-tight">
              Beyond the tutorials.
            </h2>
            <p className="max-w-md text-sm leading-7 text-[#B9B0B4]">
              Independent projects exploring how AI, data,
              and software engineering come together.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.number}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-7 transition-colors hover:border-[#E87855]/50"
              >
                <div className="mb-14 flex items-start justify-between">
                  <span className="font-mono text-xs text-[#B5E0E4]">
                    {project.number}
                  </span>
                  <span className="text-[#E87855]">↗</span>
                </div>

                <p className="font-mono text-[10px] tracking-widest text-[#E87855]">
                  {project.category}
                </p>

                <h3 className="font-hero mt-3 text-2xl">
                  {project.name}
                </h3>

                <p className="mt-4 min-h-28 text-sm leading-7 text-[#B9B0B4]">
                  {project.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-[#D0C6C7]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-12 border-t border-white/10 py-20 md:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="font-mono text-xs tracking-widest text-[#B5E0E4]">
              03 / EDUCATION
            </p>
            <h2 className="font-hero mt-5 text-3xl">
              The foundation.
            </h2>
          </div>

          <div className="space-y-9">
            <div>
              <h3 className="text-xl font-medium">
                Northwestern University
              </h3>
              <p className="mt-2 text-sm text-[#B9B0B4]">
                School of Professional Studies
              </p>
              <p className="mt-1 text-sm text-[#E87855]">
                Professional Certificate in Full-Stack Web Development
              </p>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h3 className="text-xl font-medium">
                Master of Business Administration
              </h3>
              <p className="mt-2 text-sm text-[#B9B0B4]">
                Business and management education
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-[#F5E8D2] px-8 py-14 text-[#201B2A] md:px-14">
          <p className="font-mono text-xs tracking-widest text-[#C45B3F]">
            THE PHILOSOPHY
          </p>
          <h2 className="font-hero mt-5 max-w-3xl text-3xl font-medium leading-tight tracking-tight md:text-5xl">
            Understand the concepts.
            <span className="block text-[#C45B3F]">
              Build the systems.
            </span>
            Engineer with intention.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#514A52]">
            From your first question about artificial
            intelligence to designing reliable applications,
            learning should be practical, progressive,
            and grounded in fundamentals.
          </p>
          <Link
            href="/"
            className="mt-9 inline-flex rounded-full bg-[#FFD000] px-7 py-3 text-sm font-semibold text-[#201B2A] transition hover:bg-[#F0BD00]"
          >
            Start Learning ↗
          </Link>
        </section>
      </div>
    </main>
  );
}
