import Header from "@/components/Header";
import PatternWaves from "@/components/PatternWaves";
import ProjectCard from "@/components/ProjectCard";
import TechText from "@/components/TechText";

const projects = [
  {
    index: "01",
    title: "ORB8",
    eyebrow: "Market Intelligence / AI",
    description:
      "An evidence-driven validation platform that turns fragmented market signals into structured findings, confidence, and an actionable plan.",
    tags: ["Next.js", "AI", "Research", "Data"],
  },
  {
    index: "02",
    title: "Mettavia",
    eyebrow: "Product / Applied AI",
    description:
      "A structured school of mind training designed around progressive learning rather than an endless library of passive meditation content.",
    tags: ["Product", "AI", "UX", "Learning"],
  },
  {
    index: "03",
    title: "AI Pipelines",
    eyebrow: "Architecture / Engineering",
    description:
      "Production-grade AI applications built as explicit, observable pipelines: retrieval, model invocation, validation, evaluation, and orchestration.",
    tags: ["Python", "LLMs", "RAG", "Agents"],
  },
  {
    index: "04",
    title: "Protolithic",
    eyebrow: "Venture Studio / Systems",
    description:
      "A product studio for testing, building, and operating software ventures with a disciplined validation-first approach.",
    tags: ["Strategy", "Build", "Validate"],
  },
];

export default function Home() {
  return (
    <main id="top" className="overflow-hidden">
      <Header />

      <section className="relative min-h-screen border-b rule">
        <div className="absolute inset-0">
          <PatternWaves
            preset="mesh"
            color="#c7ff3d"
            backgroundColor="#0a0a0a"
            opacity={0.95}
            fade="edges"
            fadeSize={0.5}
            speed={0.22}
            spacing={15}
            interactive
            cursorSize={80}
            cursorStrength={0.8}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/80" />

          <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-5 pt-20 md:px-8 md:pt-24">

          {/* Headline group */}
          <div className="mt-[7vh] md:mt-[8vh]">

            <p className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-acid">
              AI ENGINEERING / PRODUCT SYSTEMS / CHICAGO
            </p>

            {/* Interactive BUILDING */}
            <div className="h-[80px] w-full max-w-[650px] -translate-x-[70px] sm:h-[95px] sm:max-w-[720px] md:h-[110px] md:max-w-[800px] md:-translate-x-[118px]">
              <TechText
                text="DC AGENTIC"
                fontWeight={600}
                fontSize={130}
                letterSpacing={-0.055}
                color="#c7ff3d"
                accentColor="#c7ff3d"
                reveal="letter"
                selection
                labels
                draggable
                sweep
                speed={0.8}
                reach={160}
                specks={12}
              />
            </div>

            <h1 className="mt-4 max-w-[900px] text-[56px] font-bold leading-[1.02] tracking-[-0.055em] sm:text-[70px] md:text-[86px] lg:text-[60px]">
              understanding AI
            </h1>

          </div>

          {/* Bottom content */}
          <div className="mt-auto grid gap-6 border-t border-white/30 py-7 md:grid-cols-12">
            <p className="max-w-xl text-base leading-6 text-white/70 md:col-span-5">
              AI engineer focused on turning models into reliable products—not
              demos. Clean architecture, observable pipelines, useful interfaces,
              measurable outcomes.
            </p>

            <div className="md:col-span-4 md:col-start-9">
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-white/50">
                Currently exploring
              </p>
              <p className="mt-2 text-sm">
                Production AI · RAG · Agents · Product validation
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-[1600px] px-5 py-24 md:px-8 md:py-36">
        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-acid md:col-span-3">Selected work</p>
          <h2 className="text-5xl font-bold tracking-tighter2 md:col-span-8 md:text-6xl">
            Systems with a reason to exist.
          </h2>
        </div>

        <div className="border-b rule">
          {projects.map(project => <ProjectCard key={project.index} {...project} />)}
        </div>
      </section>

      <section id="about" className="bg-paper text-ink">
        <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-24 md:grid-cols-12 md:px-8 md:py-36">
          <div className="md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[.18em]">About / 05</p>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-5xl font-bold leading-[.95] tracking-tighter2 md:text-8xl">
              Software engineering first. AI where it earns its place.
            </h2>
            <div className="mt-12 grid gap-8 border-t border-black/20 pt-8 md:grid-cols-2">
              <p className="text-lg leading-7">
                I design AI applications as understandable software systems: explicit stages,
                strong interfaces, replaceable components, observability, and tests. Frameworks
                are useful until they hide the architecture.
              </p>
              <p className="text-lg leading-7 text-black/60">
                My work sits between engineering and product—building the system, interrogating
                the assumptions behind it, and making sure the result solves a problem someone
                actually has.
              </p>
            </div>

            <div className="mt-20 grid grid-cols-2 gap-px bg-black/20 border border-black/20 md:grid-cols-4">
              {[
                ["01", "AI Architecture"],
                ["02", "Python / TypeScript"],
                ["03", "RAG + Agents"],
                ["04", "Product Engineering"],
              ].map(([n, label]) => (
                <div key={n} className="bg-paper p-5">
                  <p className="font-mono text-[10px] text-black/40">{n}</p>
                  <p className="mt-8 text-sm font-bold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[70vh] border-y rule">
        <div className="absolute inset-0">
          <PatternWaves
            preset="lines"
            color="#f2f0e9"
            backgroundColor="#0a0a0a"
            opacity={0.72}
            fade="center"
            fadeSize={0.42}
            speed={0.14}
            spacing={13}
            direction={325}
          />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-[1600px] items-center px-5 py-24 md:px-8">
          <p className="max-w-5xl text-5xl font-bold leading-[.92] tracking-tighter2 md:text-6xl">
          Clear explanations, practical tutorials, and lessons from building real AI systems.
          </p>
        </div>
      </section>

      <footer id="contact" className="mx-auto max-w-[1600px] px-5 pb-8 pt-24 md:px-8 md:pt-36">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-acid">Have a hard problem?</p>
        <a
          href="mailto:hello@example.com"
          className="mt-6 block text-[15vw] font-bold uppercase leading-[.8] tracking-tighter2 hover:text-acid md:text-[2vw]"
        >
          Let’s talk.
        </a>
        <div className="mt-20 flex flex-col justify-between gap-5 border-t rule pt-5 text-xs uppercase tracking-[.12em] md:flex-row">
          <p>Dan Collins | AI Engineer</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-acid">LinkedIn ↗</a>
            <a href="#" className="hover:text-acid">GitHub ↗</a>
          </div>
          <p>© 2026</p>
        </div>
      </footer>
    </main>
  );
}
