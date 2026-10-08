
"use client";

import dynamic from "next/dynamic";

const Lanyard = dynamic(
  () => import("@/components/ui/Lanyard"),
  { ssr: false }
);

export default function HeroLanyard() {
  return (
    <div className="relative h-[440px] w-full sm:h-[520px] md:h-[650px] lg:h-[740px]">
      {/* Turquoise and purple glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A64AC9]/20 blur-[110px]" />

      <div className="relative h-full w-full">
        <Lanyard
          frontImage="/images/learner-badge.png"
          backImage="/images/learner-badge-back.png"
          cardColor="#A64AC9"
          orientation="portrait"
          finish="glossy"
          cornerRadius={0.3}
          size={0.65}
          anchor="center"
          strapLength={0.55}
          strapColor="#17E9E0"
          strapWidth={0.65}
          metal="graphite"
          gravity={1}
          damping={0.6}
          elasticity={0.4}
          breeze={0.15}
          interactive
          intro
        />
      </div>

      <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5E6CC]/40">
        Drag to explore / Click to flip
      </p>
    </div>
  );
}
