"use client";

import DOMPurify from "isomorphic-dompurify";

import type { Subject } from "@/lib/content";

import { SimGlyph } from "./SimGlyph";

export function SimThumb({
  subject,
  title,
  svgCode,
  variant = 0,
  badge,
}: {
  subject: Subject;
  title: string;
  svgCode?: string;
  variant?: number;
  badge?: string;
}) {
  const sanitized = svgCode
    ? DOMPurify.sanitize(svgCode, {
        USE_PROFILES: { svg: true, svgFilters: true },
        ADD_TAGS: [
          "style",
          "animate",
          "animateTransform",
          "animateMotion",
          "set",
          "mpath",
        ],
        ADD_ATTR: [
          "dur",
          "repeatCount",
          "begin",
          "end",
          "from",
          "to",
          "values",
          "keyTimes",
          "keySplines",
          "calcMode",
          "attributeName",
          "attributeType",
          "additive",
          "accumulate",
          "fill",
          "href",
          "xlink:href",
        ],
      })
    : "";

  return (
    <div className="thumb">
      <div className="stripes" />
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="label-mono rounded-sm border border-ink bg-paper px-2 py-1">
            {subject}
          </span>
          <span className="label-mono text-ink-mute">
            {badge ?? `SIM·${String(variant + 1).padStart(2, "0")}`}
          </span>
        </div>
        <div className="mx-auto flex w-full max-w-[170px] items-center justify-center">
          {sanitized ? (
            <div
              className="w-full text-ink"
              dangerouslySetInnerHTML={{ __html: sanitized }}
            />
          ) : (
            <SimGlyph subject={subject} variant={variant} />
          )}
        </div>
        <div className="text-[24px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
          {title}
        </div>
      </div>
    </div>
  );
}
