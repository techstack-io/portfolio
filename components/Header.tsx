export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-8">
        <a href="#top" className="text-sm font-bold uppercase tracking-[-.02em]">
          Dan Collins / AI Engineer
        </a>
        <nav className="flex gap-5 text-xs uppercase tracking-[.12em] md:gap-8">
          <a href="#work" className="hover:opacity-60">Work</a>
          <a href="#about" className="hover:opacity-60">About</a>
          <a href="#contact" className="hover:opacity-60">Contact</a>
        </nav>
      </div>
    </header>
  );
}
