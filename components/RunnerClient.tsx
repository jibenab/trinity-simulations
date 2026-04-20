"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { PublicContent } from "@/lib/content";

import { Footer } from "./Footer";
import { Icon } from "./Icon";
import { SimFrame } from "./SimFrame";
import { TopNav } from "./TopNav";

export function RunnerClient({
  slug,
  expectedType,
}: {
  slug: string;
  expectedType: "simulation" | "game";
}) {
  const content = useQuery(api.content.getBySlug, { slug }) as
    | PublicContent
    | null
    | undefined;
  const viewer = useQuery(api.users.viewer, {});
  const submitScore = useMutation(api.leaderboard.submitScore);
  const [lastScore, setLastScore] = useState<number | null>(null);

  if (content === undefined || viewer === undefined) {
    return <div className="shell py-20 text-sm text-ink-mute">Loading…</div>;
  }

  if (!content || content.type !== expectedType) {
    return (
      <div className="shell py-20">
        <h1 className="display text-[48px]">Not found</h1>
        <p className="mt-4 text-ink-soft">
          This {expectedType} is missing or has not been published yet.
        </p>
      </div>
    );
  }

  return (
    <div className="shell">
      <TopNav current="catalog" />

      <section className="py-8">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="eyebrow">
              {content.type === "game" ? "Game" : "Simulation"} · {content.subject}
            </div>
            <h1 className="display mt-3 text-[32px] font-semibold">{content.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {content.type === "game" ? (
              <Link href={`/leaderboard/${content.slug}`} className="btn ghost">
                Leaderboard <Icon name="trophy" size={15} />
              </Link>
            ) : null}
            <Link href="/catalog" className="btn ghost">
              Back to catalog
            </Link>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="border-b border-[var(--rule-soft)] px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="label-mono text-ink-mute">{content.grade}</span>
              <span className="label-mono text-ink-mute">{content.chapter}</span>
              {lastScore !== null ? (
                <span className="label-mono text-accent">Last score · {lastScore}</span>
              ) : null}
            </div>
          </div>

          <div className="bg-dark p-3 sm:p-5">
            <SimFrame
              code={content.code}
              slug={content.slug}
              contentType={content.type}
              userName={viewer?.name}
              onScore={
                content.type === "game"
                  ? (score, timeTaken) => {
                      setLastScore(score);
                      startTransition(() => {
                        void submitScore({ slug: content.slug, score, timeTaken });
                      });
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
