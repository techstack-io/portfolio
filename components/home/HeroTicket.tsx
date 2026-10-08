
"use client";

import { useRouter } from "next/navigation";
import TearTicket from "@/components/ui/TearTicket";

export default function HeroTicket() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-[380px] w-full items-center justify-center py-12">
      <TearTicket
        width={460}
        height={250}
        stubSize={125}
        background="#F5E6CC"
        stubBackground="#FCCD04"
        color="#201B2A"
        borderColor="#A64AC9"
        radius={16}
        roughness={1.5}
        rotate={-4}
        tilt
        onTear={() => router.push("/learn/first-lesson")}
        ariaLabel="Tear ticket to start your first AI lesson"
        stub={
          <div className="flex h-full flex-col items-center justify-center gap-4 px-3 text-center text-[#201B2A]">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
              Admit One
            </span>
            <span className="text-3xl">↗</span>
            <span className="font-mono text-[10px] font-bold uppercase">
              Tear Here
            </span>
          </div>
        }
      >
        <div className="flex h-full flex-col justify-between p-7 text-[#201B2A]">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#A64AC9]">
            DC Agentic / Your invitation
          </span>

          <div>
            <h2 className="text-3xl font-black leading-tight tracking-tight">
              Your first
              <br />
              AI lesson.
            </h2>
            <p className="mt-2 text-xl font-bold text-[#A64AC9]">
              It's free.
            </p>
          </div>

          <p className="text-xs">
            No experience needed. Just curiosity.
          </p>
        </div>
      </TearTicket>
    </div>
  );
}
