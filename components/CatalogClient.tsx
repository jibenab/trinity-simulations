"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { gradeOptions, levelOptions, subjectOptions, type PublicContent } from "@/lib/content";

import { ChipButton } from "./Chip";
import { Footer } from "./Footer";
import { Icon } from "./Icon";
import { SimCard } from "./SimCard";
import { TopNav } from "./TopNav";

type ViewMode = "grid" | "list";
type SortMode = "featured" | "newest" | "shortest" | "az";

export function CatalogClient() {
  const content = useQuery(api.content.listPublished, {}) as
    | PublicContent[]
    | undefined;
  const [subject, setSubject] = useState<(typeof subjectOptions)[number]>("All");
  const [level, setLevel] = useState<(typeof levelOptions)[number]>("All");
  const [grade, setGrade] = useState<(typeof gradeOptions)[number]>("All");
  const [chapter, setChapter] = useState("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortMode>("featured");
  const deferredQuery = useDeferredValue(query);

  const chapters = useMemo(() => {
    const pool = (content ?? []).filter((item) => {
      if (subject !== "All" && item.subject !== subject) return false;
      if (grade !== "All" && item.grade !== grade) return false;
      return true;
    });

    return Array.from(new Set(pool.map((item) => item.chapter))).sort();
  }, [content, grade, subject]);

  const filtered = useMemo(() => {
    const rows = (content ?? []).filter((item) => {
      if (subject !== "All" && item.subject !== subject) return false;
      if (level !== "All" && item.level !== level) return false;
      if (grade !== "All" && item.grade !== grade) return false;
      if (chapter !== "All" && item.chapter !== chapter) return false;

      if (deferredQuery.trim()) {
        const q = deferredQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.concepts.join(" ").toLowerCase().includes(q) ||
          item.chapter.toLowerCase().includes(q) ||
          item.grade.toLowerCase().includes(q)
        );
      }

      return true;
    });

    rows.sort((a, b) => {
      if (sort === "featured") {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.updatedAt - a.updatedAt;
      }
      if (sort === "newest") return b.updatedAt - a.updatedAt;
      if (sort === "shortest") return a.minutes - b.minutes;
      return a.title.localeCompare(b.title);
    });

    return rows;
  }, [chapter, content, deferredQuery, grade, level, sort, subject]);

  return (
    <div className="shell">
      <TopNav current="catalog" />

      <section className="py-10">
        <div className="eyebrow">§ Catalog · {String(content?.length ?? 0).padStart(2, "0")} simulations</div>
        <h1 className="display mt-4 text-[clamp(56px,8vw,96px)]">
          Pick a thing.
          <br />
          <span className="text-accent">Poke it</span> until it makes sense.
        </h1>
      </section>

      <section className="border-y border-ink py-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <label className="field-shell flex min-w-[220px] items-center gap-3">
              <Icon name="search" size={14} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search simulations..."
                className="w-full border-0 bg-transparent text-sm outline-none"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {subjectOptions.map((item) => (
                <ChipButton
                  key={item}
                  active={subject === item}
                  onClick={() => setSubject(item)}
                >
                  {item}
                </ChipButton>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {gradeOptions.map((item) => (
                <ChipButton key={item} active={grade === item} onClick={() => setGrade(item)}>
                  {item}
                </ChipButton>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {levelOptions.map((item) => (
                  <ChipButton key={item} active={level === item} onClick={() => setLevel(item)}>
                    {item}
                  </ChipButton>
                ))}
              </div>
              <select
                value={chapter}
                onChange={(event) => setChapter(event.target.value)}
                className="rounded-pill border border-ink bg-transparent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.08em]"
              >
                <option value="All">Chapter · All</option>
                {chapters.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortMode)}
                className="rounded-pill border border-ink bg-transparent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.08em]"
              >
                <option value="featured">Sort · Featured</option>
                <option value="newest">Sort · Newest</option>
                <option value="shortest">Sort · Shortest</option>
                <option value="az">Sort · A–Z</option>
              </select>
              <div className="flex overflow-hidden rounded-pill border border-ink">
                <button
                  className={`h-9 w-9 ${view === "grid" ? "bg-ink text-bg" : ""}`}
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                >
                  <Icon name="grid" size={14} />
                </button>
                <button
                  className={`h-9 w-9 ${view === "list" ? "bg-ink text-bg" : ""}`}
                  onClick={() => setView("list")}
                  aria-label="List view"
                >
                  <Icon name="list" size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
        {filtered.length} result{filtered.length === 1 ? "" : "s"}
      </div>

      {view === "grid" ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((item, index) => (
            <SimCard key={item._id} content={item} variant={index} />
          ))}
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-md border border-ink bg-paper">
          <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.9fr_40px] gap-4 border-b border-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute">
            <span>Title</span>
            <span>Class</span>
            <span>Subject</span>
            <span>Time</span>
            <span />
          </div>
          {filtered.map((item) => {
            const href = item.type === "game" ? `/game/${item.slug}` : `/sim/${item.slug}`;
            return (
              <Link
                key={item._id}
                href={href}
                className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.9fr_40px] gap-4 border-t border-[var(--rule-soft)] px-5 py-4 transition hover:bg-bg-alt"
              >
                <span className="text-[18px] font-semibold leading-tight tracking-[-0.01em]">
                  {item.title}
                </span>
                <span className="label-mono">{item.grade}</span>
                <span className="label-mono">{item.subject}</span>
                <span className="label-mono">{item.minutes} min</span>
                <span className="flex items-center justify-end">
                  <Icon name="arrow-right" size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      )}

      <Footer />
    </div>
  );
}
