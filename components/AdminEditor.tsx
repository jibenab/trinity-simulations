"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  CONTENT_TYPES,
  GRADES,
  LEVELS,
  SUBJECTS,
  type PublicContent,
} from "@/lib/content";
import { parseConcepts, titleToSlug } from "@/lib/utils";

import { Button } from "./Button";
import { Chip } from "./Chip";
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
  level: (typeof LEVELS)[number];
  minutes: number;
  conceptsText: string;
  svgCode: string;
  code: string;
  prompt: string;
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
  level: "Intro",
  minutes: 10,
  conceptsText: "",
  svgCode: "",
  code: "",
  prompt: "",
  published: false,
  featured: false,
};

export function AdminEditor({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === "new";
  const contentId = id as Id<"content">;
  const doc = useQuery(
    api.content.getById,
    isNew ? "skip" : { id: contentId },
  ) as PublicContent | null | undefined;
  const upsert = useMutation(api.content.upsert);
  const remove = useMutation(api.content.remove);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOn, setPreviewOn] = useState(true);

  useEffect(() => {
    if (!doc || isNew) return;
    setForm({
      type: doc.type,
      title: doc.title,
      slug: doc.slug,
      subject: doc.subject,
      grade: doc.grade,
      chapter: doc.chapter,
      level: doc.level,
      minutes: doc.minutes,
      conceptsText: doc.concepts.join(", "),
      svgCode: doc.svgCode,
      code: doc.code,
      prompt: doc.prompt ?? "",
      published: doc.published,
      featured: doc.featured,
    });
  }, [doc, isNew]);

  const previewSlug = useMemo(
    () => form.slug || titleToSlug(form.title) || "preview",
    [form.slug, form.title],
  );

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      const nextSlug = form.slug || titleToSlug(form.title);

      const payload = {
        ...(isNew ? {} : { id: contentId }),
        type: form.type,
        title: form.title.trim(),
        slug: nextSlug,
        subject: form.subject,
        grade: form.grade,
        chapter: form.chapter.trim(),
        level: form.level,
        minutes: Number(form.minutes),
        concepts: parseConcepts(form.conceptsText),
        svgCode: form.svgCode,
        code: form.code,
        prompt: form.prompt.trim() || undefined,
        published: form.published,
        featured: form.featured,
      };

      const savedId = await upsert(payload);
      startTransition(() => {
        router.push(`/admin/edit/${savedId}`);
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (isNew) return;
    if (!window.confirm("Delete this content item?")) return;

    try {
      await remove({ id: contentId });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
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
            <Button variant="ghost" onClick={handleDelete}>
              Delete
            </Button>
          ) : null}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </section>

      {error ? (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px]">
        <div className="space-y-6">
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
                  value={form.chapter}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      chapter: event.target.value,
                    }))
                  }
                  className="field-shell w-full"
                />
              </label>

              <label className="space-y-2">
                <span className="label-mono text-ink-mute">Level</span>
                <select
                  value={form.level}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      level: event.target.value as FormState["level"],
                    }))
                  }
                  className="field-shell w-full"
                >
                  {LEVELS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="label-mono text-ink-mute">Minutes</span>
                <input
                  type="number"
                  min={1}
                  value={form.minutes}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      minutes: Number(event.target.value),
                    }))
                  }
                  className="field-shell w-full"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="label-mono text-ink-mute">Concepts</span>
                <input
                  value={form.conceptsText}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      conceptsText: event.target.value,
                    }))
                  }
                  placeholder="Period, Gravity, Harmonic motion"
                  className="field-shell w-full"
                />
                <div className="flex flex-wrap gap-2">
                  {parseConcepts(form.conceptsText).map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </div>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="label-mono text-ink-mute">Prompt</span>
                <textarea
                  value={form.prompt}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      prompt: event.target.value,
                    }))
                  }
                  rows={3}
                  className="field-shell w-full resize-y"
                />
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
