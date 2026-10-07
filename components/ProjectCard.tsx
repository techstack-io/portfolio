type ProjectCardProps = {
  index: string;
  title: string;
  eyebrow: string;
  description: string;
  tags: string[];
  href?: string;
};

export default function ProjectCard({
  index, title, eyebrow, description, tags, href = "#"
}: ProjectCardProps) {
  return (
    <a href={href} className="project-card block border-t rule px-1 py-8 md:py-11">
      <div className="grid gap-6 md:grid-cols-12 md:items-start">
        <div className="project-index font-mono text-xs text-muted md:col-span-1">{index}</div>
        <div className="md:col-span-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[.18em] opacity-60">{eyebrow}</p>
          <h3 className="text-4xl font-bold tracking-tighter2 md:text-6xl">{title}</h3>
        </div>
        <p className="max-w-xl text-base leading-6 opacity-70 md:col-span-4 md:text-lg">
          {description}
        </p>
        <div className="flex items-start justify-between gap-4 md:col-span-3">
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="rounded-full border border-current/30 px-2.5 py-1 font-mono text-[10px] uppercase">
                {tag}
              </span>
            ))}
          </div>
          <span className="arrow text-2xl">↗</span>
        </div>
      </div>
    </a>
  );
}
