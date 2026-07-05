#!/usr/bin/env node
/**
 * Upload any simulation/game to Convex — replaces the per-sim seed scripts.
 *
 * The sim HTML carries its own metadata in a comment block (single source of
 * truth), and the thumbnail is picked up from svg/<slug>.svg automatically:
 *
 *   <!-- trinity-meta
 *   {
 *     "title": "Solubility of Salts",
 *     "type": "simulation",
 *     "subject": "Chemistry",
 *     "grade": "Class 9",
 *     "chapter": "Solutions",
 *     "level": "Core",
 *     "minutes": 8,
 *     "concepts": ["saturation", "temperature"],
 *     "prompt": "What happens to solubility as the water warms?"
 *   }
 *   -->
 *
 * Usage:
 *   node scripts/upload-sim.mjs <slug | path/to/file.html> [options]
 *
 * Options:
 *   --publish     mark as published (existing published state is otherwise kept)
 *   --unpublish   mark as unpublished
 *   --feature     mark as featured
 *   --unfeature   remove featured flag
 *   --svg <path>  thumbnail SVG (default: svg/<slug>.svg if it exists)
 *   --prod        upload to the production deployment
 *   --dry-run     validate and show what would be uploaded, then exit
 *
 * Requires `npx convex login` (or an active `npx convex dev` session).
 */

import { existsSync, readFileSync } from "fs";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { basename, dirname, isAbsolute, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SUBJECTS = ["Physics", "Chemistry", "Biology", "Math"];
const GRADES = ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const LEVELS = ["Intro", "Core", "Advanced"];
const TYPES = ["simulation", "game"];

function fail(message) {
  console.error(`upload-sim: ${message}`);
  process.exit(1);
}

const args = process.argv.slice(2);
const flags = new Set();
let svgOverride = null;
let target = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--svg") {
    svgOverride = args[++i] ?? fail("--svg needs a path");
  } else if (arg.startsWith("--")) {
    flags.add(arg);
  } else if (!target) {
    target = arg;
  } else {
    fail(`unexpected argument: ${arg}`);
  }
}

if (!target) {
  fail("usage: node scripts/upload-sim.mjs <slug | path/to/file.html> [--publish] [--dry-run]");
}

const htmlPath = target.endsWith(".html")
  ? isAbsolute(target)
    ? target
    : join(root, target)
  : join(root, "simulation", `${target}.html`);

if (!existsSync(htmlPath)) fail(`file not found: ${htmlPath}`);

const slug = basename(htmlPath, ".html");
if (slug.startsWith("_")) fail(`"${slug}" looks like a template, not a sim`);

const code = readFileSync(htmlPath, "utf-8");

const metaMatch = code.match(/<!--\s*trinity-meta\s*([\s\S]*?)-->/);
if (!metaMatch) {
  fail(
    `no <!-- trinity-meta ... --> block found in ${htmlPath}.\n` +
      "Add one near the top of the file — see the usage header of this script.",
  );
}

let meta;
try {
  meta = JSON.parse(metaMatch[1]);
} catch (error) {
  fail(`trinity-meta block is not valid JSON: ${error.message}`);
}

const problems = [];
if (!meta.title || typeof meta.title !== "string") problems.push("title (string) is required");
if (!meta.chapter || typeof meta.chapter !== "string") problems.push("chapter (string) is required");
if (!SUBJECTS.includes(meta.subject)) problems.push(`subject must be one of: ${SUBJECTS.join(", ")}`);
if (!GRADES.includes(meta.grade)) problems.push(`grade must be one of: ${GRADES.join(", ")}`);
if (meta.type !== undefined && !TYPES.includes(meta.type)) problems.push(`type must be one of: ${TYPES.join(", ")}`);
if (meta.level !== undefined && !LEVELS.includes(meta.level)) problems.push(`level must be one of: ${LEVELS.join(", ")}`);
if (meta.minutes !== undefined && typeof meta.minutes !== "number") problems.push("minutes must be a number");
if (meta.prompt !== undefined && typeof meta.prompt !== "string") problems.push("prompt must be a string");
if (
  meta.concepts !== undefined &&
  (!Array.isArray(meta.concepts) || meta.concepts.some((c) => typeof c !== "string"))
) {
  problems.push("concepts must be an array of strings");
}
if (problems.length) fail(`invalid trinity-meta:\n- ${problems.join("\n- ")}`);

const svgPath = svgOverride
  ? isAbsolute(svgOverride)
    ? svgOverride
    : join(root, svgOverride)
  : join(root, "svg", `${slug}.svg`);
const svgCode = existsSync(svgPath) ? readFileSync(svgPath, "utf-8") : undefined;
if (svgOverride && svgCode === undefined) fail(`svg file not found: ${svgPath}`);

const payload = {
  slug,
  type: meta.type ?? "simulation",
  title: meta.title,
  subject: meta.subject,
  grade: meta.grade,
  chapter: meta.chapter,
  ...(meta.level !== undefined ? { level: meta.level } : {}),
  ...(meta.minutes !== undefined ? { minutes: meta.minutes } : {}),
  ...(meta.concepts !== undefined ? { concepts: meta.concepts } : {}),
  ...(meta.prompt !== undefined ? { prompt: meta.prompt } : {}),
  ...(svgCode !== undefined ? { svgCode } : {}),
  code,
  ...(flags.has("--publish") ? { published: true } : {}),
  ...(flags.has("--unpublish") ? { published: false } : {}),
  ...(flags.has("--feature") ? { featured: true } : {}),
  ...(flags.has("--unfeature") ? { featured: false } : {}),
};

console.log(`slug      ${payload.slug}`);
console.log(`type      ${payload.type}`);
console.log(`title     ${payload.title}`);
console.log(`subject   ${payload.subject} · ${payload.grade} · ${payload.chapter}`);
console.log(`code      ${(code.length / 1024).toFixed(1)} KB from ${htmlPath}`);
console.log(
  `thumbnail ${svgCode !== undefined ? `${(svgCode.length / 1024).toFixed(1)} KB from ${svgPath}` : "none (SimGlyph fallback, existing svg kept on update)"}`,
);
if (payload.published !== undefined) console.log(`published ${payload.published}`);
if (payload.featured !== undefined) console.log(`featured  ${payload.featured}`);

if (flags.has("--dry-run")) {
  console.log("\nDry run — nothing uploaded.");
  process.exit(0);
}

const convexBin = join(root, "node_modules", ".bin", "convex");
const runArgs = ["run", "content:upsertFromCli", JSON.stringify(payload)];
if (flags.has("--prod")) runArgs.push("--prod");

execFileSync(convexBin, runArgs, { stdio: "inherit", cwd: root });
console.log(`\nDone. ${flags.has("--prod") ? "(production)" : "(dev deployment)"}`);
