import Link from "next/link";

const footerGroups = [
  ["Subjects", ["Physics", "Chemistry", "Biology", "Math"]],
  ["Product", ["Simulations", "Games", "Leaderboard", "Admin"]],
  ["Account", ["Student login", "Admin", "Help centre", "Contact"]],
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--rule-soft)] py-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <div className="logo">
            <span className="logo-mark" aria-hidden="true" />
            <span>Trinity</span>
          </div>
          <p className="mt-4 max-w-[280px] text-sm leading-6 text-ink-mute">
            A minimal lab for curious high-school students. Understand a concept
            by playing with it.
          </p>
        </div>
        {footerGroups.map(([heading, items]) => (
          <div key={heading}>
            <div className="eyebrow mb-4">{heading}</div>
            <ul className="space-y-2 text-sm text-ink-soft">
              {items.map((item) => (
                <li key={item}>
                  <Link href={item === "Simulations" ? "/catalog" : "/"}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col gap-3 border-t border-[var(--rule-soft)] pt-5 text-[11px] uppercase tracking-[0.08em] text-ink-mute sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Trinity Simulation Lab</span>
        <span>v1.0 — Built for curiosity</span>
      </div>
    </footer>
  );
}
