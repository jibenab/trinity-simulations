"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  CONTENT_TYPES,
  gradeOptions,
  subjectOptions,
  type AdminContent,
  type LeaderboardRow,
} from "@/lib/content";

import { ChipButton } from "./Chip";
import { Footer } from "./Footer";
import { TopNav } from "./TopNav";

const PAGE_SIZE = 12;
const toolbarControlClassName =
  "h-11 rounded-pill border border-ink bg-transparent px-4 font-mono text-[11px] uppercase tracking-[0.08em]";

type TypeFilter = "All" | (typeof CONTENT_TYPES)[number];
type StatusFilter = "All" | "Published" | "Draft";
type SortMode = "updated" | "usage" | "az";

function formatUsage(item: AdminContent) {
  return item.type === "game" ? item.stats.gamePlays : item.stats.simulationUses;
}

function formatTime(seconds?: number) {
  if (seconds === undefined) return "—";
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function formatLastUsed(timestamp?: number) {
  if (!timestamp) return "Never";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function AdminList() {
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [featuredOverrides, setFeaturedOverrides] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [subject, setSubject] = useState<(typeof subjectOptions)[number]>("All");
  const [grade, setGrade] = useState<(typeof gradeOptions)[number]>("All");
  const [chapter, setChapter] = useState("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [sort, setSort] = useState<SortMode>("updated");
  const [selectedGameSlug, setSelectedGameSlug] = useState<string | null>(null);

  const content = useQuery(api.content.listAdminWithStats, {}) as
    | AdminContent[]
    | undefined;
  const setFeatured = useMutation(api.content.setFeatured);

  const contentWithOverrides = useMemo(() => {
    return (content ?? []).map((item) =>
      item._id in featuredOverrides
        ? {
            ...item,
            featured: featuredOverrides[item._id],
          }
        : item,
    );
  }, [content, featuredOverrides]);

  const games = useMemo(
    () => contentWithOverrides.filter((item) => item.type === "game"),
    [contentWithOverrides],
  );
  const selectedGame =
    games.find((item) => item.slug === selectedGameSlug) ?? games[0] ?? null;
  const scores = useQuery(
    api.leaderboard.topScores,
    selectedGame ? { slug: selectedGame.slug, limit: 10 } : "skip",
  ) as LeaderboardRow[] | undefined;

  useEffect(() => {
    if (!content) return;

    setFeaturedOverrides((current) => {
      let changed = false;
      const next = { ...current };

      for (const item of content) {
        if (next[item._id] === item.featured) {
          delete next[item._id];
          changed = true;
        }
      }

      return changed ? next : current;
    });
  }, [content]);

  useEffect(() => {
    if (!selectedGameSlug && games[0]) {
      setSelectedGameSlug(games[0].slug);
      return;
    }

    if (selectedGameSlug && !games.some((item) => item.slug === selectedGameSlug)) {
      setSelectedGameSlug(games[0]?.slug ?? null);
    }
  }, [games, selectedGameSlug]);

  const chapters = useMemo(() => {
    const pool = contentWithOverrides.filter((item) => {
      if (typeFilter !== "All" && item.type !== typeFilter) return false;
      if (subject !== "All" && item.subject !== subject) return false;
      if (grade !== "All" && item.grade !== grade) return false;
      return true;
    });

    return Array.from(new Set(pool.map((item) => item.chapter))).sort();
  }, [contentWithOverrides, grade, subject, typeFilter]);

  const filteredContent = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const rows = contentWithOverrides.filter((item) => {
      if (typeFilter !== "All" && item.type !== typeFilter) return false;
      if (subject !== "All" && item.subject !== subject) return false;
      if (grade !== "All" && item.grade !== grade) return false;
      if (chapter !== "All" && item.chapter !== chapter) return false;
      if (status === "Published" && !item.published) return false;
      if (status === "Draft" && item.published) return false;

      if (normalizedQuery) {
        return (
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.slug.toLowerCase().includes(normalizedQuery) ||
          item.chapter.toLowerCase().includes(normalizedQuery) ||
          item.grade.toLowerCase().includes(normalizedQuery) ||
          item.subject.toLowerCase().includes(normalizedQuery)
        );
      }

      return true;
    });

    rows.sort((a, b) => {
      if (sort === "usage") return formatUsage(b) - formatUsage(a);
      if (sort === "az") return a.title.localeCompare(b.title);
      return b.updatedAt - a.updatedAt;
    });

    return rows;
  }, [
    chapter,
    contentWithOverrides,
    grade,
    query,
    sort,
    status,
    subject,
    typeFilter,
  ]);

  const totals = useMemo(() => {
    return contentWithOverrides.reduce(
      (acc, item) => {
        acc.content += 1;
        acc.simulationUses += item.stats.simulationUses;
        acc.gamePlays += item.stats.gamePlays;
        acc.scoreSubmissions += item.stats.scoreSubmissions;
        return acc;
      },
      {
        content: 0,
        simulationUses: 0,
        gamePlays: 0,
        scoreSubmissions: 0,
      },
    );
  }, [contentWithOverrides]);

  const totalPages = Math.max(1, Math.ceil(filteredContent.length / PAGE_SIZE));
  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredContent.slice(start, start + PAGE_SIZE);
  }, [filteredContent, page]);

  useEffect(() => {
    setPage(1);
  }, [chapter, grade, query, sort, status, subject, typeFilter]);

  useEffect(() => {
    if (chapter !== "All" && !chapters.includes(chapter)) {
      setChapter("All");
    }
  }, [chapter, chapters]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  async function handleToggleFeatured(item: AdminContent) {
    const id = item._id as Id<"content">;
    const nextFeatured = !item.featured;

    try {
      setPendingId(id);
      setError(null);
      setFeaturedOverrides((current) => ({
        ...current,
        [id]: nextFeatured,
      }));
      await setFeatured({
        id,
        featured: nextFeatured,
      });
    } catch (err) {
      setFeaturedOverrides((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      const message = err instanceof Error ? err.message : "Could not update featured status.";
      setError(message);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="shell">
      <TopNav current="catalog" />

      <section className="flex flex-wrap items-end justify-between gap-4 py-10">
        <div>
          <div className="eyebrow">§ Admin catalog</div>
          <h1 className="display mt-3 text-[clamp(48px,7vw,84px)]">
            Manage simulations
            <br />
            and games.
          </h1>
        </div>
        <Link href="/admin/edit/new" className="btn">
          New content
        </Link>
      </section>

      <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="panel px-5 py-4">
          <div className="label-mono text-ink-mute">Content</div>
          <div className="mt-2 text-3xl font-semibold">{totals.content}</div>
        </div>
        <div className="panel px-5 py-4">
          <div className="label-mono text-ink-mute">Simulation uses</div>
          <div className="mt-2 text-3xl font-semibold">{totals.simulationUses}</div>
        </div>
        <div className="panel px-5 py-4">
          <div className="label-mono text-ink-mute">Game plays</div>
          <div className="mt-2 text-3xl font-semibold">{totals.gamePlays}</div>
        </div>
        <div className="panel px-5 py-4">
          <div className="label-mono text-ink-mute">Score submissions</div>
          <div className="mt-2 text-3xl font-semibold">{totals.scoreSubmissions}</div>
        </div>
      </section>

      {error ? (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mb-6 border-y border-ink py-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-[220px] flex-1 basis-full items-center gap-3 rounded-pill border border-ink px-4 sm:basis-[280px]">
            <span className="label-mono text-ink-mute">Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Title, slug, chapter..."
              className="h-11 w-full border-0 bg-transparent text-sm outline-none"
            />
          </label>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
            className={toolbarControlClassName}
          >
            <option value="All">All types</option>
            {CONTENT_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={subject}
            onChange={(event) =>
              setSubject(event.target.value as (typeof subjectOptions)[number])
            }
            className={toolbarControlClassName}
          >
            {subjectOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={grade}
            onChange={(event) =>
              setGrade(event.target.value as (typeof gradeOptions)[number])
            }
            className={toolbarControlClassName}
          >
            {gradeOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={chapter}
            onChange={(event) => setChapter(event.target.value)}
            className={toolbarControlClassName}
          >
            <option value="All">All chapters</option>
            {chapters.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className={toolbarControlClassName}
          >
            <option value="All">All status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
            className={toolbarControlClassName}
          >
            <option value="updated">Recently updated</option>
            <option value="usage">Most used</option>
            <option value="az">A-Z</option>
          </select>
        </div>
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,0.8fr)]">
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1040px]">
              <div className="grid grid-cols-[minmax(0,1.5fr)_0.55fr_0.7fr_0.75fr_0.8fr_0.75fr_170px] gap-4 border-b border-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute">
                <span>Title</span>
                <span>Type</span>
                <span>Subject</span>
                <span>Status</span>
                <span>Usage</span>
                <span>Featured</span>
                <span />
              </div>
              {pageRows.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-[minmax(0,1.5fr)_0.55fr_0.7fr_0.75fr_0.8fr_0.75fr_170px] gap-4 border-t border-[var(--rule-soft)] px-5 py-4"
                >
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="mt-1 text-xs text-ink-mute">{item.slug}</div>
                  </div>
                  <span className="label-mono">{item.type}</span>
                  <span className="label-mono">{item.subject}</span>
                  <span className="label-mono">{item.published ? "Published" : "Draft"}</span>
                  <div>
                    <div className="label-mono text-accent">
                      {formatUsage(item)} {item.type === "game" ? "plays" : "uses"}
                    </div>
                    <div className="mt-1 text-xs text-ink-mute">
                      Last: {formatLastUsed(item.stats.lastUsedAt)}
                    </div>
                  </div>
                  <div>
                    <ChipButton
                      type="button"
                      active={item.featured}
                      onClick={() => void handleToggleFeatured(item)}
                      disabled={pendingId === item._id}
                      className="disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {pendingId === item._id ? "Saving..." : item.featured ? "Featured" : "Off"}
                    </ChipButton>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    {item.type === "game" ? (
                      <ChipButton
                        type="button"
                        active={selectedGame?.slug === item.slug}
                        onClick={() => setSelectedGameSlug(item.slug)}
                      >
                        Board
                      </ChipButton>
                    ) : null}
                    <Link href={`/admin/edit/${item._id}`} className="btn ghost h-10 px-4 py-2">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
              {!pageRows.length ? (
                <div className="px-5 py-12 text-sm text-ink-mute">
                  No content matches these filters.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="panel overflow-hidden">
          <div className="border-b border-ink px-5 py-4">
            <div className="label-mono text-ink-mute">Game leaderboard</div>
            <select
              value={selectedGame?.slug ?? ""}
              onChange={(event) => setSelectedGameSlug(event.target.value)}
              className={`${toolbarControlClassName} mt-3 w-full`}
              disabled={!games.length}
            >
              {games.length ? null : <option value="">No games</option>}
              {games.map((item) => (
                <option key={item._id} value={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          {selectedGame ? (
            <div>
              <div className="border-b border-[var(--rule-soft)] px-5 py-4">
                <h2 className="text-xl font-semibold leading-tight">{selectedGame.title}</h2>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink-mute">
                  <span>{selectedGame.stats.gamePlays} plays</span>
                  <span>{selectedGame.stats.scoreSubmissions} score submissions</span>
                </div>
              </div>
              <div className="grid grid-cols-[56px_1fr_80px_70px] gap-3 border-b border-[var(--rule-soft)] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute">
                <span>Rank</span>
                <span>Student</span>
                <span>Score</span>
                <span>Time</span>
              </div>
              {scores === undefined ? (
                <div className="px-5 py-10 text-sm text-ink-mute">Loading leaderboard...</div>
              ) : scores.length ? (
                scores.map((row, index) => (
                  <div
                    key={row._id}
                    className="grid grid-cols-[56px_1fr_80px_70px] gap-3 border-t border-[var(--rule-soft)] px-5 py-4"
                  >
                    <span className="label-mono text-ink-mute">#{index + 1}</span>
                    <span className="min-w-0 truncate font-medium">{row.userName}</span>
                    <span className="label-mono text-accent">{row.score}</span>
                    <span className="label-mono text-ink-mute">{formatTime(row.timeTaken)}</span>
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-sm text-ink-mute">
                  No scores submitted yet.
                </div>
              )}
            </div>
          ) : (
            <div className="px-5 py-10 text-sm text-ink-mute">
              Create a game to see leaderboard entries here.
            </div>
          )}
        </aside>
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
        <div>
          {filteredContent.length} result{filteredContent.length === 1 ? "" : "s"} · Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <ChipButton
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </ChipButton>
          <ChipButton
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </ChipButton>
        </div>
      </div>

      <Footer />
    </div>
  );
}
