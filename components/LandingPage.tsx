"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { PublicContent } from "@/lib/content";
import { seedContent } from "@/convex/seedData";

import { Footer } from "./Footer";
import { Icon } from "./Icon";
import { SimCard } from "./SimCard";
import { TopNav } from "./TopNav";

function DarkProjectileStage() {
  const [t, setT] = useState(0);

  const v0 = 20, g = 9.8, scale = 5.8;
  const originX = 28, originY = 196;
  const theta45 = Math.PI / 4;
  const T45 = (2 * v0 * Math.sin(theta45)) / g;

  useEffect(() => {
    let raf = 0;
    const startedAt = performance.now();
    const loopDuration = T45 + 0.8;
    const tick = (now: number) => {
      const elapsed = (now - startedAt) / 1000;
      setT(Math.min(elapsed % loopDuration, T45));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [T45]);

  const arcPath = (theta: number) => {
    const R = ((v0 * v0 * Math.sin(2 * theta)) / g) * scale;
    const H = (Math.pow(v0 * Math.sin(theta), 2) / (2 * g)) * scale;
    return `M ${originX} ${originY} Q ${originX + R / 2} ${originY - 2 * H} ${originX + R} ${originY}`;
  };

  const ballX = originX + v0 * Math.cos(theta45) * t * scale;
  const ballY = originY - (v0 * Math.sin(theta45) * t - 0.5 * g * t * t) * scale;
  const currentX = v0 * Math.cos(theta45) * t;
  const range45 = (v0 * v0 * Math.sin(2 * theta45)) / g;

  return (
    <div className="relative overflow-hidden rounded border border-[#2A2A2A]" style={{ background: "var(--dark)", aspectRatio: "16/10" }}>
      <svg viewBox="0 0 360 225" className="absolute inset-0 h-full w-full">
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="225" stroke="#2A2A2A" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 45} x2="360" y2={i * 45} stroke="#2A2A2A" strokeWidth="0.5" />
        ))}
        {/* Ground */}
        <line x1={originX} y1={originY} x2="352" y2={originY} stroke="var(--dark-ink)" strokeWidth="1" opacity="0.5" />
        {/* Ghost arcs */}
        {[20, 30, 60, 70].map((deg) => (
          <path key={deg} d={arcPath((deg * Math.PI) / 180)} fill="none" stroke="var(--dark-mute)" strokeWidth="0.8" strokeDasharray="3 6" opacity="0.35" />
        ))}
        {/* Range tick marks for ghost arcs */}
        {[20, 30, 60, 70].map((deg) => {
          const R = ((v0 * v0 * Math.sin(2 * (deg * Math.PI) / 180)) / g) * scale;
          return <line key={`r${deg}`} x1={originX + R} y1={originY} x2={originX + R} y2={originY + 5} stroke="var(--dark-mute)" strokeWidth="0.7" opacity="0.4" />;
        })}
        {/* 45° arc path */}
        <path d={arcPath(theta45)} fill="none" stroke="var(--accent)" strokeWidth="0.9" strokeDasharray="3 6" opacity="0.4" />
        {/* 45° range tick */}
        <line x1={originX + range45 * scale} y1={originY} x2={originX + range45 * scale} y2={originY + 7} stroke="var(--accent)" strokeWidth="1.2" opacity="0.8" />
        {/* Launch angle arc indicator */}
        <path d={`M ${originX + 22} ${originY} A 22 22 0 0 0 ${originX + 22 * Math.cos(theta45)} ${originY - 22 * Math.sin(theta45)}`} fill="none" stroke="var(--dark-mute)" strokeWidth="0.7" opacity="0.55" />
        {/* Ball */}
        <circle cx={ballX} cy={ballY} r="8" fill="var(--accent)" opacity="0.15" />
        <circle cx={ballX} cy={ballY} r="5.5" fill="var(--accent)" />
        {/* Launch dot */}
        <circle cx={originX} cy={originY} r="3" fill="var(--dark-ink)" opacity="0.6" />
      </svg>
      <div className="label-mono absolute left-3 top-3 text-[10px] leading-[1.8]" style={{ color: "var(--dark-mute)" }}>
        θ &nbsp;&nbsp;45°<br />
        v₀ &nbsp;20 m/s<br />
        x &nbsp;&nbsp;{currentX.toFixed(1)} m
      </div>
    </div>
  );
}

function HeroIllustration() {
  const [angle, setAngle] = useState(0.4);

  useEffect(() => {
    let raf = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startedAt) / 1000;
      setAngle(0.55 * Math.cos(elapsed * 1.6));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const bobX = 200 + Math.sin(angle) * 160;
  const bobY = 60 + Math.cos(angle) * 160;

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
      <line x1="40" y1="60" x2="360" y2="60" stroke="var(--ink)" strokeWidth="1.2" />
      {Array.from({ length: 10 }).map((_, index) => (
        <line
          key={index}
          x1={60 + index * 32}
          y1="60"
          x2={52 + index * 32}
          y2="50"
          stroke="var(--ink)"
          strokeWidth="1"
        />
      ))}
      <path
        d={`M ${200 - Math.sin(0.55) * 160} ${60 + Math.cos(0.55) * 160} A 160 160 0 0 0 ${
          200 + Math.sin(0.55) * 160
        } ${60 + Math.cos(0.55) * 160}`}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="0.7"
        strokeDasharray="3 5"
        opacity="0.45"
      />
      {[-0.4, -0.15, 0.15, 0.4].map((ghost, index) => (
        <g key={index} opacity="0.12">
          <line
            x1="200"
            y1="60"
            x2={200 + Math.sin(ghost) * 160}
            y2={60 + Math.cos(ghost) * 160}
            stroke="var(--ink)"
            strokeWidth="0.8"
          />
          <circle
            cx={200 + Math.sin(ghost) * 160}
            cy={60 + Math.cos(ghost) * 160}
            r="12"
            fill="var(--ink)"
          />
        </g>
      ))}
      <line x1="200" y1="60" x2={bobX} y2={bobY} stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx={bobX} cy={bobY} r="18" fill="var(--accent)" stroke="var(--ink)" strokeWidth="1.2" />
      <circle cx="200" cy="60" r="3.5" fill="var(--ink)" />
    </svg>
  );
}

const subjectStrip = [
  { name: "Physics", count: 4 },
  { name: "Chemistry", count: 3 },
  { name: "Biology", count: 3 },
  { name: "Math", count: 3 },
] as const;

function toFallbackContent(index: number): PublicContent {
  const item = seedContent[index];
  const createdAt = index + 1;
  return {
    _id: item.slug,
    _creationTime: createdAt,
    ...item,
    concepts: item.concepts ? [...item.concepts] : undefined,
    svgCode: "",
    published: true,
    createdAt,
    updatedAt: createdAt,
  };
}

function pickHomepageFeatured(rows: PublicContent[]) {
  const featured = rows.filter((item) => item.featured);
  const usedIds = new Set(featured.map((item) => item._id));
  const backfill = rows.filter((item) => !usedIds.has(item._id));
  return [...featured, ...backfill].slice(0, 4);
}

export function LandingPage() {
  const publishedContent = useQuery(api.content.listPublished, {}) as
    | PublicContent[]
    | undefined;
  const fallbackContent = useMemo(
    () => seedContent.map((_, index) => toFallbackContent(index)),
    [],
  );
  const featured = useMemo(() => {
    if (publishedContent === undefined) {
      return pickHomepageFeatured(fallbackContent);
    }

    return pickHomepageFeatured(publishedContent);
  }, [fallbackContent, publishedContent]);
  const totalContentCount = publishedContent?.length ?? fallbackContent.length;

  return (
    <div className="shell">
      <TopNav current="home" />

      <section className="relative overflow-hidden py-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14">
          <div>
            <div className="eyebrow">For curious high-school minds · est. 2026</div>
            <h1 className="display mt-5 text-[clamp(56px,8vw,104px)]">
              Understand
              <br />
              a concept
              <br />
              by <span className="text-accent">playing</span> with it.
            </h1>
            <p className="mt-7 max-w-[440px] text-base leading-7 text-ink-soft">
              Trinity is a quiet lab of focused simulations and games for
              students who learn best by doing. Explore on iPad first, then
              carry the same flow to phone or desktop.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalog" className="btn">
                Browse simulations <Icon name="arrow-right" size={16} />
              </Link>
              <Link href="/login" className="btn ghost">
                Student login
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
              <span>
                <b className="mr-1 font-sans text-[18px] font-bold text-ink">13</b>
                simulations
              </span>
              <span>
                <b className="mr-1 font-sans text-[18px] font-bold text-ink">04</b>
                subjects
              </span>
              <span>
                <b className="mr-1 font-sans text-[18px] font-bold text-ink">∞</b>
                curiosity
              </span>
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-lg border border-ink bg-paper">
            <div className="stripes opacity-60" />
            <HeroIllustration />
            <div className="label-mono absolute left-4 top-4 border border-ink bg-paper px-3 py-1">
              Fig. 01 — Harmonic Motion
            </div>
            <div className="label-mono absolute bottom-4 right-4 text-ink-mute">
              T = 2π√(L/g)
            </div>
          </div>
        </div>
      </section>

      <section className="grid border-y border-ink sm:grid-cols-2 lg:grid-cols-4">
        {subjectStrip.map((subject, index) => (
          <Link
            key={subject.name}
            href="/catalog"
            className="border-b border-ink px-6 py-7 transition hover:bg-bg-alt lg:border-b-0 lg:border-r last:border-r-0"
          >
            <div className="flex items-start justify-between">
              <span className="label-mono">
                {String(index + 1).padStart(2, "0")} / {subject.name}
              </span>
              <Icon name="arrow-right" size={14} />
            </div>
            <div className="mt-5 text-[30px] font-semibold leading-none tracking-[-0.02em]">
              {subject.name}
            </div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
              {subject.count} simulations
            </div>
          </Link>
        ))}
      </section>

      <section className="pt-16">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="eyebrow">§ 01 — Featured</div>
            <h2 className="display mt-2 text-[42px] sm:text-[48px]">
              Best opening experiments
            </h2>
          </div>
          <Link href="/catalog" className="text-sm underline underline-offset-4">
            View all {totalContentCount}
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((item, index) => (
            <SimCard key={item._id} content={item} variant={index} />
          ))}
        </div>
      </section>

      <section className="pt-24">
        <div className="dark-section">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <div className="eyebrow">§ 02 — This week</div>
              <h2 className="display mt-4 text-[clamp(44px,5vw,64px)] text-dark-ink">
                Why does 45°
                <br />
                send a ball
                <br />
                the farthest?
              </h2>
              <p className="mt-6 max-w-[360px] text-[15px] leading-7 text-dark-mute">
                Adjust the launch angle and watch every arc change. Try to beat
                45° — then check if the math agrees.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/sim/projectile" className="btn accent">
                  Try it <Icon name="arrow-right" size={16} />
                </Link>
                <Link href="/login" className="btn ghost" style={{ borderColor: "var(--dark-ink)", color: "var(--dark-ink)" }}>
                  Sign in
                </Link>
              </div>
            </div>
            <DarkProjectileStage />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
