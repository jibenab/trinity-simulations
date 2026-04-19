"use client";

import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { LeaderboardRow, PublicContent } from "@/lib/content";

import { Footer } from "./Footer";
import { Icon } from "./Icon";
import { TopNav } from "./TopNav";

export function LeaderboardClient({ slug }: { slug: string }) {
  const content = useQuery(api.content.getBySlug, { slug }) as
    | PublicContent
    | null
    | undefined;
  const scores = useQuery(api.leaderboard.topScores, {
    slug,
    limit: 10,
  }) as LeaderboardRow[] | undefined;

  if (content === undefined || scores === undefined) {
    return <div className="shell py-20 text-sm text-ink-mute">Loading…</div>;
  }

  if (!content || content.type !== "game") {
    return (
      <div className="shell py-20">
        <h1 className="display text-[48px]">No leaderboard yet</h1>
        <p className="mt-4 text-ink-soft">
          This route only works for published games.
        </p>
      </div>
    );
  }

  return (
    <div className="shell">
      <TopNav current="catalog" />

      <section className="py-10">
        <div className="eyebrow">§ Leaderboard</div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="display text-[clamp(48px,8vw,86px)]">{content.title}</h1>
            <p className="mt-4 max-w-[420px] text-sm leading-6 text-ink-soft">
              Live top scores update as students play in another tab.
            </p>
          </div>
          <Link href={`/game/${slug}`} className="btn">
            Open game <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_120px] gap-4 border-b border-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute">
          <span>Rank</span>
          <span>Student</span>
          <span>Score</span>
        </div>
        {scores.length ? (
          scores.map((row, index) => (
            <div
              key={row._id}
              className="grid grid-cols-[80px_1fr_120px] gap-4 border-t border-[var(--rule-soft)] px-5 py-4"
            >
              <span className="label-mono text-ink-mute">#{index + 1}</span>
              <span className="text-base font-medium">{row.userName}</span>
              <span className="label-mono text-accent">{row.score}</span>
            </div>
          ))
        ) : (
          <div className="px-5 py-12 text-sm text-ink-mute">
            No scores yet. Play the game to seed the board.
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
