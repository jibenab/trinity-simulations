import Link from "next/link";

import type { PublicContent } from "@/lib/content";
import { formatList, formatMinutes } from "@/lib/utils";

import { Icon } from "./Icon";
import { SimThumb } from "./SimThumb";

export function SimCard({
  content,
  variant = 0,
}: {
  content: PublicContent;
  variant?: number;
}) {
  const href = content.type === "game" ? `/game/${content.slug}` : `/sim/${content.slug}`;

  return (
    <Link href={href} className="simcard">
      <SimThumb
        subject={content.subject}
        title={content.title.split(" ")[0] ?? content.title}
        svgCode={content.svgCode}
        variant={variant}
        badge={`${content.type === "game" ? "GAME" : "SIM"}·${String(variant + 1).padStart(2, "0")}`}
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[20px] font-semibold leading-tight tracking-[-0.01em]">
            {content.title}
          </h3>
          {content.featured ? (
            <span className="label-mono text-accent">Featured</span>
          ) : null}
        </div>
        <p className="text-sm leading-6 text-ink-mute">{formatList(content.concepts)}</p>
        <div className="flex items-center justify-between text-[12px] text-ink-mute">
          <span className="label-mono">
            {content.subject} · {content.level}
          </span>
          <span className="label-mono">{formatMinutes(content.minutes)}</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="label-mono text-ink-mute">{content.grade}</span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-bg">
            <Icon name={content.type === "game" ? "trophy" : "play"} size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
