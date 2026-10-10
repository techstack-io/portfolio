"use client";

import { useCallback, useState } from "react";
import StaggeredText from "@/components/ui/StaggeredText";
import TearTicket from "../ui/TearTicket";

export default function HeroHeadlineText() {
  const [showSecondLine, setShowSecondLine] = useState(false);

  const handleFirstLineComplete = useCallback(() => {
    setShowSecondLine(true);
  }, []);

  return (
    <h1 className="font-hero max-w-[650px] text-[clamp(2rem,3.1vw,2.8rem)] font-medium leading-[1.15] tracking-[-0.035em]">
      <StaggeredText
        text="Understand AI."
        delay={140}
        duration={0.7}
        className="block text-[#F5E8D2]"
        onAnimationComplete={handleFirstLineComplete}
      />

      <span className="mt-[6px] block text-[#a6c8ff]">
        {showSecondLine ? (
          <StaggeredText
            text="One lesson at a time."
            delay={140}
            duration={0.7}
            className="block"
          />
        ) : (
          <span className="invisible block" aria-hidden="true">
            One lesson at a time.
          </span>
        )}
      </span>
    </h1>
  );
}
