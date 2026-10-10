import Link from "next/link";
import TypographicWall from "@/components/ui/TypographicWall";
// import HeroHeadlineText from "./HeroHeadlineText";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-screen overflow-visible bg-[#201C2A] text-[#F5E6CC]"
    >
      {/* Main hero layout */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1600px] items-center gap-10 px-5 pb-16 pt-28 md:grid-cols-12 md:gap-8 md:px-8 md:pb-12 md:pt-24 lg:min-h-[calc(100svh-5rem)]">

        {/* Left column */}
        <div className="relative z-20 md:col-span-7">

          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#B4DFE5]" />

            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#B4DFE5] sm:text-[11px]">
              AI Education / Exploration / Engineering
            </p>
          </div>

          {/* Animated headline */}
          {/* <HeroHeadlineText /> */}

          {/* Introduction */}
          <p className="mt-7 max-w-[540px] text-[17px] leading-7 text-[#F5E6CC]/70">
            Artificial intelligence explained for everyone.
            From your first question to building reliable AI
            applications, learn the concepts, tools, and
            engineering principles that matter.
          </p>

          {/* Calls to action */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/learn"
              className="inline-flex min-h-12 items-center justify-center gap-4 rounded-full bg-[#FCCD04] px-7 py-3 text-sm font-bold text-[#201B2A] transition-colors hover:bg-[#F5E6CC]"
            >
              Start Learning
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              href="#learning-paths"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#B4DFE5]/40 px-7 py-3 text-sm font-medium text-[#D2FDFF] transition-colors hover:border-[#FBE8A6] hover:text-[#FBE8A6]"
            >
              Explore the Paths
              <span aria-hidden="true">↓</span>
            </Link>
          </div>

          {/* Learning path indicators */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#F5E6CC]/20 pt-6">
            {[
              ["01", "Understand"],
              ["02", "Build"],
              ["03", "Engineer"],
            ].map(([number, label]) => (
              <div
                key={number}
                className="flex items-center gap-2"
              >
                <span className="font-mono text-[10px] text-[#17E9E0]">
                  {number}
                </span>

                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#F5E6CC]/60">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Only rendering your component here */}
        <div className="relative z-10 flex min-w-0 items-center justify-center overflow-visible md:col-span-5 lg:-translate-y-8 w-full h-[500px] bg-black/40">
          <TypographicWall />
        </div>

      </div>
    </section>
  );
}
