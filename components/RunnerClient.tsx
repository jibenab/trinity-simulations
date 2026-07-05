"use client";

import Link from "next/link";
import { startTransition, useEffect, useRef, useState } from "react";
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
  const recordContentUse = useMutation(api.usage.recordContentUse);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const recordedSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (!content || content.type !== expectedType || !viewer) return;
    if (recordedSlugRef.current === content.slug) return;

    recordedSlugRef.current = content.slug;
    startTransition(() => {
      void recordContentUse({ slug: content.slug });
    });
  }, [content, expectedType, recordContentUse, viewer]);

  if (content === undefined || viewer === undefined) {
    return (
      <div className="shell">
        <TopNav current="catalog" />
        <section className="animate-pulse py-8 motion-reduce:animate-none" aria-label="Loading">
          <div className="h-4 w-44 rounded-sm bg-bg-alt" />
          <div className="mt-4 h-10 w-72 max-w-full rounded-sm bg-bg-alt" />
          <div className="mt-6 h-[min(72dvh,700px)] min-h-[420px] rounded-md border border-[var(--rule-soft)] bg-paper" />
        </section>
      </div>
    );
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
            <Link href={`/leaderboard/${content.slug}`} className="btn ghost">
              Leaderboard <Icon name="trophy" size={15} />
            </Link>
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

          <div className="bg-paper p-3 sm:p-5">
            <SimFrame
              code={content.code}
              slug={content.slug}
              contentType={content.type}
              userName={viewer?.name}
              onScore={(score, timeTaken, leaderboardScore) => {
                const scoreToSubmit = leaderboardScore ?? score;
                setLastScore(scoreToSubmit);
                startTransition(() => {
                  void submitScore({ slug: content.slug, score: scoreToSubmit, timeTaken });
                });
              }}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
