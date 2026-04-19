"use client";

import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { PublicContent } from "@/lib/content";

import { Footer } from "./Footer";
import { TopNav } from "./TopNav";

export function AdminList() {
  const content = useQuery(api.content.listAdmin, {}) as PublicContent[] | undefined;

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

      <section className="panel overflow-hidden">
        <div className="grid grid-cols-[1.4fr_0.6fr_0.7fr_0.8fr_0.5fr_120px] gap-4 border-b border-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute">
          <span>Title</span>
          <span>Type</span>
          <span>Subject</span>
          <span>Status</span>
          <span>Level</span>
          <span />
        </div>
        {content?.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1.4fr_0.6fr_0.7fr_0.8fr_0.5fr_120px] gap-4 border-t border-[var(--rule-soft)] px-5 py-4"
          >
            <div>
              <div className="font-semibold">{item.title}</div>
              <div className="mt-1 text-xs text-ink-mute">{item.slug}</div>
            </div>
            <span className="label-mono">{item.type}</span>
            <span className="label-mono">{item.subject}</span>
            <span className="label-mono">{item.published ? "Published" : "Draft"}</span>
            <span className="label-mono">{item.level}</span>
            <div className="flex justify-end">
              <Link href={`/admin/edit/${item._id}`} className="btn ghost h-10 px-4 py-2">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
