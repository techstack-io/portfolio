
"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Learn", href: "/learn" },
  { label: "Articles", href: "/articles" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#201B2A]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A64AC9] text-sm font-black text-white">
            DC
          </span>
          <span className="text-lg font-extrabold tracking-[-0.05em] text-[#F5E6CC]">
            AGENTIC<span className="text-[#17E9E0]">.</span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-9 md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#F5E6CC]/70 transition-colors hover:text-[#17E9E0]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/learn"
          className="hidden rounded-full bg-[#FCCD04] px-6 py-3 text-sm font-bold text-[#201B2A] transition-colors hover:bg-[#F5E6CC] md:inline-flex"
        >
          Start Learning ↗
        </Link>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-[#F5E6CC] md:hidden"
        >
          <span className="text-xl">{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="flex flex-col gap-1 border-t border-white/10 bg-[#201B2A] px-5 py-5 md:hidden"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm text-[#F5E6CC] hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/learn"
            onClick={() => setMenuOpen(false)}
            className="mt-3 rounded-full bg-[#FCCD04] px-5 py-3 text-center text-sm font-bold text-[#201B2A]"
          >
            Start Learning ↗
          </Link>
        </nav>
      )}
    </header>
  );
}

