
import Link from "next/link";

const learningLinks = [
  { label: "Understand AI", href: "/learn/understand" },
  { label: "Build with AI", href: "/learn/build" },
  { label: "Engineer AI", href: "/learn/engineer" },
  { label: "All Lessons", href: "/learn" },
];

const exploreLinks = [
  { label: "Articles", href: "/articles" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-white/15 bg-[#0a0a0a] text-white"
    >
      <div className="mx-auto max-w-[1600px] px-5 pt-20 md:px-8 md:pt-28">

        {/* Top section */}
        <div className="grid gap-14 border-b border-white/15 pb-20 md:grid-cols-12">

          {/* Brand */}
          <div className="md:col-span-5">
            <Link
              href="/"
              className="inline-block text-3xl font-black tracking-[-0.06em] text-acid md:text-4xl"
            >
              DC AGENTIC<span className="text-white">.</span>
            </Link>

            <h2 className="mt-8 max-w-md text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Understand AI.
              <span className="block text-acid">
                Build what matters.
              </span>
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
              AI education for every level of experience.
              Clear explanations, practical tutorials, and
              engineering principles that help turn curiosity
              into capability.
            </p>
          </div>

          {/* Learning navigation */}
          <div className="md:col-span-2 md:col-start-7">
            <p className="mb-7 font-mono text-[11px] uppercase tracking-[0.2em] text-acid">
              Learn
            </p>

            <nav aria-label="Learning navigation" className="flex flex-col gap-4">
              {learningLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 transition-colors hover:text-acid"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Explore navigation */}
          <div className="md:col-span-2">
            <p className="mb-7 font-mono text-[11px] uppercase tracking-[0.2em] text-acid">
              Explore
            </p>

            <nav aria-label="Explore navigation" className="flex flex-col gap-4">
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 transition-colors hover:text-acid"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <p className="mb-7 font-mono text-[11px] uppercase tracking-[0.2em] text-acid">
              Support
            </p>

            <p className="mb-5 text-sm leading-6 text-white/55">
              Free to learn. Supported by people who believe
              AI education should be accessible.
            </p>

            <a
              href="https://www.patreon.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-b border-acid pb-1 text-sm font-semibold text-acid transition-colors hover:text-white"
            >
              Support on Patreon ↗
            </a>
          </div>
        </div>

        {/* Large brand treatment */}
        <div className="overflow-hidden border-b border-white/15 py-8">
          <p
            aria-hidden="true"
            className="whitespace-nowrap text-center text-[clamp(3.5rem,12.5vw,12rem)] font-black leading-none tracking-[-0.085em] text-white/[0.07]"
          >
            DC AGENTIC
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 py-7 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} DC Agentic</p>

          <p>Learn / Build / Engineer</p>

          <div className="flex gap-6">
            <a
              href="mailto:hello@example.com"
              className="transition-colors hover:text-acid"
            >
              Email ↗
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-acid"
            >
              LinkedIn ↗
            </a>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-acid"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
