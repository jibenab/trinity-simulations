"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useConvexAuth, useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  CONTENT_TYPES,
  GRADES,
  SUBJECTS,
  type PublicContent,
} from "@/lib/content";
import { parseTrinityMeta } from "@/lib/trinityMeta";
import { titleToSlug } from "@/lib/utils";

import { Button } from "./Button";
import { CodeEditor } from "./CodeEditor";
import { Footer } from "./Footer";
import { SimFrame } from "./SimFrame";
import { SimThumb } from "./SimThumb";
import { TopNav } from "./TopNav";

type FormState = {
  type: "simulation" | "game";
  title: string;
  slug: string;
  subject: (typeof SUBJECTS)[number];
  grade: string;
  chapter: string;
  svgCode: string;
  code: string;
  published: boolean;
  featured: boolean;
};

const DEFAULT_FORM: FormState = {
  type: "simulation",
  title: "",
  slug: "",
  subject: "Physics",
  grade: "Class 11",
  chapter: "",
  svgCode: "",
  code: "",
  published: false,
  featured: false,
};

export function AdminEditor({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const isNew = id === "new";
  const contentId = id as Id<"content">;
  const doc = useQuery(
    api.content.getById,
    isNew ? "skip" : { id: contentId },
  ) as PublicContent | null | undefined;
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const chapterOptions = useQuery(api.content.listChapters, {
    subject: form.subject,
    grade: form.grade,
  }) as string[] | undefined;
  const upsert = useMutation(api.content.upsert);
  const remove = useMutation(api.content.remove);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [previewOn, setPreviewOn] = useState(true);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!doc || isNew) return;
    setForm({
      type: doc.type,
      title: doc.title,
      slug: doc.slug,
      subject: doc.subject,
      grade: doc.grade,
      chapter: doc.chapter,
      svgCode: doc.svgCode,
      code: doc.code,
      published: doc.published,
      featured: doc.featured,
    });
  }, [doc, isNew]);

  const previewSlug = useMemo(
    () => form.slug || titleToSlug(form.title) || "preview",
    [form.slug, form.title],
  );

  function redirectToLogin() {
    router.push(`/login?next=${encodeURIComponent(pathname)}`);
  }

  async function importFiles(files: FileList | File[]) {
    const notes: string[] = [];

    for (const file of Array.from(files)) {
      const text = await file.text();

      if (file.name.toLowerCase().endsWith(".svg")) {
        setForm((current) => ({ ...current, svgCode: text }));
        notes.push(`${file.name} → thumbnail`);
        continue;
      }

      if (file.name.toLowerCase().endsWith(".html")) {
        const meta = parseTrinityMeta(text);
        const slugFromFile = titleToSlug(file.name.replace(/\.html?$/i, ""));

        setForm((current) => ({
          ...current,
          code: text,
          slug: current.slug || slugFromFile,
          ...(meta?.title ? { title: meta.title } : {}),
          ...(meta?.type === "simulation" || meta?.type === "game"
            ? { type: meta.type }
            : {}),
          ...(meta?.subject &&
          (SUBJECTS as readonly string[]).includes(meta.subject)
            ? { subject: meta.subject as FormState["subject"] }
            : {}),
          ...(meta?.grade && (GRADES as readonly string[]).includes(meta.grade)
            ? { grade: meta.grade }
            : {}),
          ...(meta?.chapter ? { chapter: meta.chapter } : {}),
        }));
        notes.push(
          meta
            ? `${file.name} → code + metadata`
            : `${file.name} → code (no trinity-meta block, fill the form manually)`,
        );
        continue;
      }

      notes.push(`${file.name} skipped — only .html and .svg`);
    }

    setImportNotice(notes.join(" · "));
  }

  async function handleSave() {
    if (authLoading) {
      setError("Checking your admin session. Please try again in a moment.");
      return;
    }
    if (!isAuthenticated) {
      setError("Your admin session expired. Please sign in again.");
      redirectToLogin();
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setNotice(null);
      const nextSlug = form.slug || titleToSlug(form.title);

      const payload = {
        ...(isNew ? {} : { id: contentId }),
        type: form.type,
        title: form.title.trim(),
        slug: nextSlug,
        subject: form.subject,
        grade: form.grade,
        chapter: form.chapter.trim(),
        svgCode: form.svgCode,
        code: form.code,
        published: form.published,
        featured: form.featured,
      };

      const savedId = await upsert(payload);
      setNotice("Saved.");
      startTransition(() => {
        if (pathname !== `/admin/edit/${savedId}`) {
          router.push(`/admin/edit/${savedId}`);
        }
        router.refresh();
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      setError(message);
      if (message.includes("Unauthenticated")) {
        redirectToLogin();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (isNew) return;
    if (!window.confirm("Delete this content item?")) return;

    if (authLoading) {
      setError("Checking your admin session. Please try again in a moment.");
      return;
    }
    if (!isAuthenticated) {
      setError("Your admin session expired. Please sign in again.");
      redirectToLogin();
      return;
    }

    try {
      await remove({ id: contentId });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      setError(message);
      if (message.includes("Unauthenticated")) {
        redirectToLogin();
      }
    }
  }

  if (!isNew && doc === undefined) {
    return <div className="shell py-20 text-sm text-ink-mute">Loading…</div>;
  }

  return (
    <div className="shell">
      <TopNav current="catalog" />

      <section className="flex flex-wrap items-start justify-between gap-4 py-10">
        <div>
          <div className="eyebrow">§ Admin editor</div>
          <h1 className="display mt-3 text-[clamp(42px,7vw,72px)]">
            {isNew ? "Create new content" : "Edit content"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin" className="btn ghost">
            Back to admin
          </Link>
          {!isNew ? (
            <Button
              variant="ghost"
              onClick={handleDelete}
              disabled={saving || authLoading || !isAuthenticated}
            >
              Delete
            </Button>
          ) : null}
          <Button onClick={handleSave} disabled={saving || authLoading || !isAuthenticated}>
            {saving ? "Saving..." : authLoading ? "Checking session..." : "Save"}
          </Button>
        </div>
      </section>

      {error ? (
        <div className="mb-6 rounded-md border border-[var(--rule-soft)] bg-bg-alt px-4 py-3 text-sm text-ink">
          <span className="label-mono mr-3 text-ink-mute">Error</span>
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="mb-6 rounded-md border border-[var(--rule-soft)] bg-paper px-4 py-3 text-sm text-ink">
          <span className="label-mono mr-3 text-accent">Saved</span>
          {notice}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px]">
        <div className="space-y-6">
          <div
            className={`panel border-dashed p-5 transition ${dragActive ? "bg-bg-alt" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragActive(false);
              if (event.dataTransfer.files?.length) {
                void importFiles(event.dataTransfer.files);
              }
            }}
          >
            <div className="label-mono text-ink-mute">Import files</div>
            <p className="mt-2 text-sm text-ink-soft">
              Drop the simulation .html here (plus an optional thumbnail .svg).
              The form prefills from the file&apos;s trinity-meta block.
            </p>
            <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-pill border border-ink px-4 font-mono text-[13px] uppercase tracking-[0.08em]">
              Choose files
              <input
                type="file"
                accept=".html,.svg"
                multiple
                className="hidden"
                onChange={(event) => {
                  if (event.target.files?.length) {
                    void importFiles(event.target.files);
                  }
                  event.target.value = "";
                }}
              />
            </label>
            {importNotice ? (
              <p className="mt-3 text-sm text-ink-mute">{importNotice}</p>
            ) : null}
          </div>

          <div className="panel p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="label-mono text-ink-mute">Type</span>
                <div className="flex gap-2">
                  {CONTENT_TYPES.map((item) => (
                    <button
                      key={item}
                      className={`chip ${form.type === item ? "active" : ""}`}
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          type: item,
                        }))
                      }
                      type="button"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </label>

              <label className="space-y-2">
                <span className="label-mono text-ink-mute">Title</span>
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                      slug:
                        current.slug || titleToSlug(event.target.value),
                    }))
                  }
                  className="field-shell w-full"
                />
              </label>

              <label className="space-y-2">
                <span className="label-mono text-ink-mute">Slug</span>
                <input
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      slug: titleToSlug(event.target.value),
                    }))
                  }
                  className="field-shell w-full"
                />
              </label>

              <label className="space-y-2">
                <span className="label-mono text-ink-mute">Subject</span>
                <select
                  value={form.subject}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subject: event.target.value as FormState["subject"],
                    }))
                  }
                  className="field-shell w-full"
                >
                  {SUBJECTS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="label-mono text-ink-mute">Grade</span>
                <select
                  value={form.grade}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      grade: event.target.value,
                    }))
                  }
                  className="field-shell w-full"
                >
                  {GRADES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="label-mono text-ink-mute">Chapter</span>
                <input
                  list="chapter-options"
                  value={form.chapter}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      chapter: event.target.value,
                    }))
                  }
                  className="field-shell w-full"
                />
                <datalist id="chapter-options">
                  {(chapterOptions ?? []).map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </label>
            </div>
          </div>

          <div className="panel p-5">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
              <label className="space-y-2">
                <span className="label-mono text-ink-mute">Thumbnail SVG</span>
                <textarea
                  value={form.svgCode}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      svgCode: event.target.value,
                    }))
                  }
                  rows={10}
                  className="field-shell w-full resize-y font-mono text-xs"
                />
              </label>
              <div className="space-y-2">
                <span className="label-mono text-ink-mute">Preview</span>
                <div className="rounded-md border border-[var(--rule-soft)] bg-paper p-3">
                  <SimThumb
                    subject={form.subject}
                    title={form.title || "Untitled"}
                    svgCode={form.svgCode}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="label-mono text-ink-mute">Simulation code</div>
                <p className="mt-2 text-sm text-ink-soft">
                  Paste a full HTML document or a React snippet named App.
                </p>
              </div>
              <Button variant="ghost" onClick={() => setPreviewOn((value) => !value)}>
                {previewOn ? "Hide preview" : "Show preview"}
              </Button>
            </div>
            <CodeEditor
              value={form.code}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  code: value,
                }))
              }
            />
          </div>

          <div className="panel flex flex-wrap gap-6 p-5">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    published: event.target.checked,
                  }))
                }
              />
              Published
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    featured: event.target.checked,
                  }))
                }
              />
              Featured
            </label>
          </div>
        </div>

        {previewOn ? (
          <aside className="space-y-4">
            <div className="panel p-4">
              <div className="label-mono text-ink-mute">Live preview</div>
              <div className="mt-4">
                <SimFrame
                  code={form.code}
                  slug={previewSlug}
                  contentType={form.type}
                  userName="Admin"
                />
              </div>
            </div>
          </aside>
        ) : null}
      </section>

      <Footer />
    </div>
  );
}
