"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { sandboxHtml } from "@/lib/sandboxHtml";
import { cn } from "@/lib/utils";

type FullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};

type FullscreenWrapper = HTMLDivElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

type SimFrameProps = {
  code: string;
  userName?: string | null;
  slug: string;
  contentType: "simulation" | "game";
  onScore?: (score: number, timeTaken?: number, leaderboardScore?: number) => void;
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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const html = useMemo(() => sandboxHtml(code), [code]);

  function getFullscreenElement() {
    const fullscreenDocument = document as FullscreenDocument;
    return (
      fullscreenDocument.fullscreenElement ??
      fullscreenDocument.webkitFullscreenElement ??
      null
    );
  }

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
        const timeTaken =
          typeof message.timeTaken === "number" ? message.timeTaken : undefined;
        const leaderboardScore =
          typeof message.leaderboardValue === "number"
            ? message.leaderboardValue
            : undefined;
        onScore?.(message.value, timeTaken, leaderboardScore);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [contentType, onScore, slug, userName]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      // Only sync from the native API when it exists; in the CSS-overlay
      // fallback the state is toggled directly.
      if (getFullscreenElement() !== null || document.fullscreenEnabled) {
        setIsFullscreen(getFullscreenElement() === wrapperRef.current);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  async function handleFullscreenToggle() {
    const wrapper = wrapperRef.current as FullscreenWrapper | null;
    const fullscreenDocument = document as FullscreenDocument;

    // iPhone Safari has no Fullscreen API for arbitrary elements; fall back to
    // a CSS overlay driven by the same isFullscreen state.
    const supportsNativeFullscreen = Boolean(
      wrapper && (wrapper.requestFullscreen || wrapper.webkitRequestFullscreen),
    );

    if (!supportsNativeFullscreen) {
      setIsFullscreen((current) => !current);
      return;
    }

    try {
      if (getFullscreenElement() === wrapper) {
        await Promise.resolve(
          document.exitFullscreen?.() ?? fullscreenDocument.webkitExitFullscreen?.(),
        );
        return;
      }

      await Promise.resolve(
        wrapper?.requestFullscreen?.() ?? wrapper?.webkitRequestFullscreen?.(),
      );
    } catch {
      setIsFullscreen(getFullscreenElement() === wrapperRef.current);
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {error ? (
        <div className="rounded-md border border-[var(--rule-soft)] bg-bg-alt px-4 py-3 text-sm text-ink">
          <span className="label-mono mr-3 text-ink-mute">Error</span>
          {error}
        </div>
      ) : null}
      <div
        ref={wrapperRef}
        className={cn(
          "bg-paper",
          isFullscreen
            ? "fixed inset-0 z-50 flex flex-col rounded-none border-0"
            : "overflow-hidden rounded-md border border-[var(--rule-soft)]",
        )}
      >
        {/* Control bar — always outside the iframe so it never overlaps simulation UI */}
        <div
          className="flex shrink-0 items-center justify-end border-b border-[var(--rule-soft)] px-3 py-1.5"
          style={isFullscreen ? { paddingTop: "max(0.375rem, env(safe-area-inset-top))" } : undefined}
        >
          <button
            type="button"
            onClick={handleFullscreenToggle}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-ink px-4 py-1 font-mono text-[13px] uppercase tracking-[0.08em] text-ink-mute transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <span aria-hidden="true">{isFullscreen ? "✕" : "⊞"}</span>
            <span>{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </button>
        </div>
        <iframe
          ref={iframeRef}
          title={`${slug} frame`}
          sandbox="allow-scripts"
          srcDoc={html}
          className={cn(
            "w-full bg-paper",
            isFullscreen
              ? "min-h-0 flex-1"
              : "h-[min(72dvh,700px)] min-h-[420px]",
          )}
        />
      </div>
    </div>
  );
}
