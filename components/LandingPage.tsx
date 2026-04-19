"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { seedContent } from "@/convex/seedData";

import { Footer } from "./Footer";
import { Icon } from "./Icon";
import { SimCard } from "./SimCard";
import { TopNav } from "./TopNav";

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

export function LandingPage() {
  const featured = useMemo(() => seedContent.filter((item) => item.featured).slice(0, 4), []);

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
            View all 13
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((item, index) => (
            <SimCard
              key={item.slug}
              content={{
                _id: item.slug,
                _creationTime: Date.now(),
                ...item,
                concepts: [...item.concepts],
                svgCode: "",
                published: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              }}
              variant={index}
            />
          ))}
        </div>
      </section>

      <section className="pt-24">
        <div className="dark-section">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <div className="eyebrow">§ 02 — This week</div>
              <h2 className="display mt-4 text-[clamp(44px,5vw,64px)] text-dark-ink">
                Why does a
                <br />
                longer string
                <br />
                swing slower?
              </h2>
              <p className="mt-6 max-w-[360px] text-[15px] leading-7 text-dark-mute">
                Drag the sliders to change the pendulum&apos;s length and
                gravity. Watch the period change, then make a prediction before
                you move again.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/catalog" className="btn accent">
                  Open catalog <Icon name="arrow-right" size={16} />
                </Link>
                <Link href="/login" className="btn ghost border-dark-ink text-dark-ink">
                  Sign in
                </Link>
              </div>
            </div>
            <div className="rounded-md border border-[#2A2A2A] bg-dark p-4">
              <div className="label-mono text-dark-mute">Preview</div>
              <p className="mt-3 text-sm leading-6 text-dark-mute">
                The seeded pendulum simulation is ready in Convex and can be
                re-pasted or extended from the admin editor.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
