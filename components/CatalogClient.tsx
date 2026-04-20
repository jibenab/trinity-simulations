"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { gradeOptions, subjectOptions, type PublicContent } from "@/lib/content";

import { ChipButton } from "./Chip";
import { Footer } from "./Footer";
import { Icon } from "./Icon";
import { SimCard } from "./SimCard";
import { TopNav } from "./TopNav";

type ViewMode = "grid" | "list";
type SortMode = "featured" | "newest" | "az";

const PAGE_SIZE = 12;
const toolbarControlClassName =
  "h-11 rounded-pill border border-ink bg-transparent px-4 font-mono text-[11px] uppercase tracking-[0.08em]";

export function CatalogClient() {
  const searchParams = useSearchParams();
  const content = useQuery(api.content.listPublished, {}) as
    | PublicContent[]
    | undefined;
  const [subject, setSubject] = useState<(typeof subjectOptions)[number]>("All");
  const [grade, setGrade] = useState<(typeof gradeOptions)[number]>("All");
  const [chapter, setChapter] = useState("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortMode>("featured");
  const [page, setPage] = useState(1);
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      if (grade !== "All" && item.grade !== grade) return false;
      if (chapter !== "All" && item.chapter !== chapter) return false;

      if (deferredQuery.trim()) {
        const q = deferredQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          (item.concepts ?? []).join(" ").toLowerCase().includes(q) ||
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
      return a.title.localeCompare(b.title);
    });

    return rows;
  }, [chapter, content, deferredQuery, grade, sort, subject]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [subject, grade, chapter, sort, deferredQuery]);

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

  useEffect(() => {
    if (searchParams.get("focus") === "search") {
      inputRef.current?.focus();
    }
  }, [searchParams]);

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
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-[220px] flex-1 basis-full items-center gap-3 rounded-pill border border-ink px-4 sm:basis-[280px]">
            <span className="text-ink-mute">
              <Icon name="search" size={14} />
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search simulations..."
              className="h-11 w-full border-0 bg-transparent text-sm outline-none"
            />
          </label>

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
            <option value="All">All</option>
            {chapters.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
            className={toolbarControlClassName}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="az">A–Z</option>
          </select>

          <div className="ml-auto flex overflow-hidden rounded-pill border border-ink">
            <button
              className={`h-11 w-11 ${view === "grid" ? "bg-ink text-bg" : ""}`}
              onClick={() => setView("grid")}
              aria-label="Grid view"
              type="button"
            >
              <Icon name="grid" size={14} />
            </button>
            <button
              className={`h-11 w-11 ${view === "list" ? "bg-ink text-bg" : ""}`}
              onClick={() => setView("list")}
              aria-label="List view"
              type="button"
            >
              <Icon name="list" size={14} />
            </button>
          </div>
        </div>
      </section>

      {view === "grid" ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {pageRows.map((item, index) => (
            <SimCard
              key={item._id}
              content={item}
              variant={(page - 1) * PAGE_SIZE + index}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-md border border-ink bg-paper">
          <div className="grid grid-cols-[minmax(0,1.5fr)_0.8fr_0.8fr_40px] gap-4 border-b border-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute">
            <span>Title</span>
            <span>Class</span>
            <span>Subject</span>
            <span />
          </div>
          {pageRows.map((item) => {
            const href = item.type === "game" ? `/game/${item.slug}` : `/sim/${item.slug}`;
            return (
              <Link
                key={item._id}
                href={href}
                className="grid grid-cols-[minmax(0,1.5fr)_0.8fr_0.8fr_40px] gap-4 border-t border-[var(--rule-soft)] px-5 py-4 transition hover:bg-bg-alt"
              >
                <span className="text-[18px] font-semibold leading-tight tracking-[-0.01em]">
                  {item.title}
                </span>
                <span className="label-mono">{item.grade}</span>
                <span className="label-mono">{item.subject}</span>
                <span className="flex items-center justify-end">
                  <Icon name="arrow-right" size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
        <div>
          {filtered.length} result{filtered.length === 1 ? "" : "s"} · Page {page} of {totalPages}
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
