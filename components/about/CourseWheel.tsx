
"use client";

import { useState } from "react";
import Link from "next/link";
import OptionWheel from "@/components/ui/OptionWheel";

const courses = [
  {
    title: "AI Fundamentals",
    href: "/learn/ai-fundamentals",
    category: "UNDERSTAND",
  },
  {
    title: "Prompt Engineering",
    href: "/learn/prompt-engineering",
    category: "UNDERSTAND",
  },
  {
    title: "Python for AI",
    href: "/learn/python-for-ai",
    category: "BUILD",
  },
  {
    title: "Building AI Applications",
    href: "/learn/building-ai-applications",
    category: "BUILD",
  },
  {
    title: "RAG Systems",
    href: "/learn/rag-systems",
    category: "ENGINEER",
  },
  {
    title: "AI Agents",
    href: "/learn/ai-agents",
    category: "ENGINEER",
  },
  {
    title: "Production AI",
    href: "/learn/production-ai",
    category: "ENGINEER",
  },
];

export default function CourseWheel() {
  const [selected, setSelected] = useState(3);
  const course = courses[selected];

  return (
    <div className="relative h-full w-full">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#B5E0E4]">
          EXPLORE THE CURRICULUM
        </span>

        <span className="font-mono text-[10px] text-[#B9B0B4]">
          01 — 07
        </span>
      </div>

      <div className="relative h-[520px] w-full overflow-hidden md:h-[620px] lg:h-[680px]">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 border-y border-[#E87855]/30 bg-[#E87855]/[0.06] py-9" />

        <OptionWheel
          items={courses.map((course) => course.title)}
          defaultSelected={3}
          onChange={(index) => setSelected(index)}
          fontSize={1.35}
          spacing={1.9}
          curve={0.7}
          tilt={8}
          blur={1.1}
          fade={0.22}
          minOpacity={0.12}
          inset={32}
          textColor="#918A98"
          activeColor="#F5E8D2"
          loop={false}
          draggable
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-widest text-[#E87855]">
            {course.category}
          </p>
          <p className="mt-1 text-sm text-[#F5E8D2]">
            {course.title}
          </p>
        </div>

        <Link
          href={course.href}
          className="shrink-0 rounded-full bg-[#FCCD04] px-5 py-3 text-xs font-bold text-[#201B2A] transition-colors hover:bg-[#F5E6CC]"
        >
          Explore Course ↗
        </Link>
      </div>

      <p className="mt-5 text-xs text-[#918A98]">
        Scroll or drag to explore courses.
      </p>
    </div>
  );
}
