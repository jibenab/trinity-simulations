"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { sandboxHtml } from "@/lib/sandboxHtml";
import { cn } from "@/lib/utils";

type SimFrameProps = {
  code: string;
  userName?: string | null;
  slug: string;
  contentType: "simulation" | "game";
  onScore?: (score: number) => void;
  className?: string;
};

export function SimFrame({
  code,
  userName,
  slug,
  contentType,
  onScore,
  className,
}: SimFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const html = useMemo(() => sandboxHtml(code), [code]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!iframeRef.current?.contentWindow) return;
      if (event.source !== iframeRef.current.contentWindow) return;

      const message = event.data;
      if (!message || typeof message !== "object") return;

      if (message.type === "ready") {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "init",
            userName: userName ?? "Student",
            slug,
            contentType,
          },
          "*",
        );
        setError(null);
      }

      if (message.type === "error") {
        setError(
          typeof message.message === "string"
            ? message.message
            : "The simulation reported an error.",
        );
      }

      if (message.type === "score" && typeof message.value === "number") {
        onScore?.(message.value);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [contentType, onScore, slug, userName]);

  return (
    <div className={cn("space-y-3", className)}>
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <iframe
        ref={iframeRef}
        title={`${slug} frame`}
        sandbox="allow-scripts"
        srcDoc={html}
        className="h-[540px] w-full rounded-md border border-[#2A2A2A] bg-dark"
      />
    </div>
  );
}
