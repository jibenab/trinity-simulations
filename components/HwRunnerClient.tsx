"use client";

import { useCallback, useState } from "react";
import { useQuery } from "convex/react";

import { reportHomeworkScore } from "@/app/hw/actions";
import { api } from "@/convex/_generated/api";
import type { PublicContent } from "@/lib/content";

import { Footer } from "./Footer";
import { SimFrame } from "./SimFrame";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "done"; score: number; maxScore: number }
  | { kind: "error"; message: string };

export function HwRunnerClient({
  slug,
  token,
  maxScore,
}: {
  slug: string;
  token: string;
  maxScore: number;
}) {
  const content = useQuery(api.content.getBySlug, { slug }) as
    | PublicContent
    | null
    | undefined;
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });

  // The quiz/simulation posts {type:"score", value} from inside the sandboxed
  // iframe; SimFrame forwards it here. We re-verify + report from the server.
  const handleScore = useCallback(
    (score: number) => {
      setSubmit({ kind: "submitting" });
      reportHomeworkScore(token, score)
        .then((res) => setSubmit({ kind: "done", score: res.score, maxScore: res.maxScore }))
        .catch((err: unknown) =>
          setSubmit({
            kind: "error",
            message: err instanceof Error ? err.message : "Could not send your score.",
          }),
        );
    },
    [token],
  );

  if (content === undefined) {
    return <div className="shell py-20 text-[15px] text-ink-mute">Loading…</div>;
  }

  if (!content || !content.published) {
    return (
      <div className="shell py-20">
        <h1 className="display text-[40px] font-semibold">Not found</h1>
        <p className="mt-4 text-[17px] text-ink-soft">
          This homework is missing or has not been published yet.
        </p>
      </div>
    );
  }

  return (
    <div className="shell">
      <section className="py-8">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="eyebrow text-ink-mute">Trinity Homework · {content.subject}</div>
            <h1 className="display mt-3 text-[32px] font-semibold">{content.title}</h1>
          </div>
          <div className="label-mono text-ink-mute">Out of {maxScore}</div>
        </div>

        <div className="panel overflow-hidden">
          <div className="border-b border-[var(--rule-soft)] px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="label-mono text-ink-mute">{content.grade}</span>
              <span className="label-mono text-ink-mute">{content.chapter}</span>
            </div>
          </div>

          <div className="bg-paper p-3 sm:p-5">
            <SimFrame
              code={content.code}
              slug={content.slug}
              contentType={content.type}
              userName="Student"
              onScore={handleScore}
            />
          </div>
        </div>

        {content.prompt ? (
          <p className="mt-4 text-[17px] text-ink-soft">{content.prompt}</p>
        ) : null}

        <HwStatus state={submit} />
      </section>

      <Footer />
    </div>
  );
}

function HwStatus({ state }: { state: SubmitState }) {
  if (state.kind === "idle") {
    return (
      <p className="mt-4 text-[15px] text-ink-mute">
        Finish the activity to send your score to the Trinity app.
      </p>
    );
  }

  if (state.kind === "submitting") {
    return <p className="mt-4 text-[15px] text-ink-mute">Sending your score…</p>;
  }

  if (state.kind === "error") {
    return (
      <div className="mt-4 rounded-md border border-[var(--rule-soft)] bg-bg-alt px-4 py-3 text-[15px] text-ink">
        <span className="label-mono mr-3 text-ink-mute">Error</span>
        {state.message}
      </div>
    );
  }

  return (
    <div className="mt-4 panel px-4 py-4 sm:px-6">
      <div className="label-mono text-accent">Score sent</div>
      <div className="mt-1 text-[17px] text-ink-soft">
        You scored <span className="font-semibold text-ink">{state.score}</span> out of{" "}
        {state.maxScore}. You can close this tab and return to the Trinity app.
      </div>
    </div>
  );
}
