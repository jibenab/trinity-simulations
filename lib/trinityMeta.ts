/**
 * Parses the `<!-- trinity-meta { ... } -->` block that simulation HTML files
 * carry as their single source of metadata truth.
 *
 * Browser-side counterpart of the parsing in scripts/upload-sim.mjs — kept
 * forgiving here (returns null instead of throwing) so the admin editor can
 * still import files with a missing or broken block.
 */
export type TrinityMeta = {
  title?: string;
  type?: string;
  subject?: string;
  grade?: string;
  chapter?: string;
  level?: string;
  minutes?: number;
  concepts?: string[];
  prompt?: string;
};

export function parseTrinityMeta(source: string): TrinityMeta | null {
  const match = source.match(/<!--\s*trinity-meta\s*([\s\S]*?)-->/);
  if (!match) return null;

  try {
    const parsed: unknown = JSON.parse(match[1]);
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed as TrinityMeta;
  } catch {
    return null;
  }
}
