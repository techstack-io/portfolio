
"use client";

import { motion, useReducedMotion } from "motion/react";

type StaggeredTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  onAnimationComplete?: () => void;
};

export default function StaggeredText({
  text,
  className = "",
  delay = 140,
  duration = 0.7,
  onAnimationComplete,
}: StaggeredTextProps) {
  const reducedMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: 20, filter: "blur(6px)" }
          }
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: reducedMotion ? 0 : duration,
            delay: reducedMotion ? 0 : (index * delay) / 1000,
            ease: "easeOut",
          }}
          onAnimationComplete={
            index === words.length - 1
              ? onAnimationComplete
              : undefined
          }
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}
