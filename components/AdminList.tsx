"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { PublicContent } from "@/lib/content";

import { ChipButton } from "./Chip";
import { Footer } from "./Footer";
import { TopNav } from "./TopNav";

const PAGE_SIZE = 12;

export function AdminList() {
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [stableOrder, setStableOrder] = useState<string[]>([]);
  const [featuredOverrides, setFeaturedOverrides] = useState<Record<string, boolean>>({});
  const content = useQuery(api.content.listAdmin, {}) as PublicContent[] | undefined;
  const setFeatured = useMutation(api.content.setFeatured);

  useEffect(() => {
    if (!content) return;

    const nextIds = content.map((item) => item._id);
    setStableOrder((current) => {
      if (current.length === 0) {
        return nextIds;
      }

      if (current.length !== nextIds.length) {
        return nextIds;
      }

      const currentIds = new Set(current);
      const sameIds = nextIds.every((id) => currentIds.has(id));
      return sameIds ? current : nextIds;
    });
  }, [content]);

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

  const orderedContent = useMemo(() => {
    if (!content) return [];

    const contentById = new Map(content.map((item) => [item._id, item]));
    const orderedIds =
      stableOrder.length === content.length ? stableOrder : content.map((item) => item._id);

    return orderedIds
      .map((id) => contentById.get(id))
      .filter((item): item is PublicContent => item !== undefined)
      .map((item) =>
        item._id in featuredOverrides
          ? {
              ...item,
              featured: featuredOverrides[item._id],
            }
          : item,
      );
  }, [content, featuredOverrides, stableOrder]);

  const totalPages = Math.max(1, Math.ceil(orderedContent.length / PAGE_SIZE));
  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return orderedContent.slice(start, start + PAGE_SIZE);
  }, [orderedContent, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  async function handleToggleFeatured(item: PublicContent) {
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

      {error ? (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="panel overflow-hidden">
        <div className="grid grid-cols-[minmax(0,1.4fr)_0.6fr_0.7fr_0.8fr_0.7fr_120px] gap-4 border-b border-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute">
          <span>Title</span>
          <span>Type</span>
          <span>Subject</span>
          <span>Status</span>
          <span>Featured</span>
          <span />
        </div>
        {pageRows.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[minmax(0,1.4fr)_0.6fr_0.7fr_0.8fr_0.7fr_120px] gap-4 border-t border-[var(--rule-soft)] px-5 py-4"
          >
            <div>
              <div className="font-semibold">{item.title}</div>
              <div className="mt-1 text-xs text-ink-mute">{item.slug}</div>
            </div>
            <span className="label-mono">{item.type}</span>
            <span className="label-mono">{item.subject}</span>
            <span className="label-mono">{item.published ? "Published" : "Draft"}</span>
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
            <div className="flex justify-end">
              <Link href={`/admin/edit/${item._id}`} className="btn ghost h-10 px-4 py-2">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
        <div>
          {orderedContent.length} result{orderedContent.length === 1 ? "" : "s"} · Page {page} of {totalPages}
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
