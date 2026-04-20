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
  onScore?: (score: number, timeTaken?: number) => void;
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
        onScore?.(message.value, timeTaken);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [contentType, onScore, slug, userName]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(getFullscreenElement() === wrapperRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    handleFullscreenChange();
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  async function handleFullscreenToggle() {
    const wrapper = wrapperRef.current as FullscreenWrapper | null;
    const fullscreenDocument = document as FullscreenDocument;

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
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <div
        ref={wrapperRef}
        className={cn(
          "bg-dark",
          isFullscreen
            ? "fixed inset-0 z-50 flex flex-col rounded-none border-0"
            : "overflow-hidden rounded-md border border-[#2A2A2A]",
        )}
      >
        {/* Control bar — always outside the iframe so it never overlaps simulation UI */}
        <div
          className="flex shrink-0 items-center justify-end border-b border-[#2A2A2A] px-3 py-1.5"
          style={isFullscreen ? { paddingTop: "max(0.375rem, env(safe-area-inset-top))" } : undefined}
        >
          <button
            type="button"
            onClick={handleFullscreenToggle}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="inline-flex min-h-8 items-center gap-2 rounded-pill border border-[#424242] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-dark-mute transition hover:border-dark-ink hover:text-dark-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-ink"
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
            "w-full bg-dark",
            isFullscreen ? "min-h-0 flex-1" : "h-[540px]",
          )}
        />
      </div>
    </div>
  );
}
