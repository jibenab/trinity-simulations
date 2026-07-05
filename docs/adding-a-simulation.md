# Adding a simulation

The whole workflow is: copy the template, fill in one comment block, build the
sim, run two commands. No registry edits, no per-sim seed scripts.

## 1. Start from the template

```
cp simulation/_template.html simulation/<slug>.html
```

Use a kebab-case slug (`displacement-time-graph`). The slug becomes the URL:
`/sim/<slug>` or `/game/<slug>`.

The template is a complete working pendulum sim with the 4-zone anatomy
(header strip / stage / parameter strip / prompt), the design tokens, the
parent-frame bridge, and the responsive breakpoints already in place. Replace
the stage and physics; keep the bones.

## 2. Fill in the trinity-meta block

Metadata lives in the HTML file itself, in a comment near the top:

```html
<!-- trinity-meta
{
  "title": "Solubility of Salts",
  "type": "simulation",
  "subject": "Chemistry",
  "grade": "Class 9",
  "chapter": "Solutions",
  "level": "Core",
  "minutes": 8,
  "concepts": ["saturation", "temperature"],
  "prompt": "What happens to solubility as the water warms?"
}
-->
```

Required: `title`, `subject` (Physics / Chemistry / Biology / Math), `grade`
(Class 8 – Class 12), `chapter`. Optional: `type` (defaults to `simulation`),
`level` (Intro / Core / Advanced), `minutes`, `concepts`, `prompt`.

## 3. Games and quizzes must report a score

Anything scored calls `sendScore` exactly once, when the activity finishes
(the template includes the helper):

```js
sendScore(score);                          // plain score
sendScore(score, seconds, adjustedScore);  // with time taken + leaderboard value
```

The checker fails any file whose meta says `"type": "game"` but never posts a
score message. `docs/demo-hw-quiz.html` is a minimal scored example.

## 4. Thumbnail (optional)

Put an abstract geometric SVG at `svg/<slug>.svg` — tokens only, no gradients,
no hardcoded hex. If there is no SVG, catalog cards fall back to the subject
glyph, which is fine. A missing thumbnail never blocks publishing.

## 5. Check and upload

```
npm run check:sim
node scripts/upload-sim.mjs <slug> --dry-run   # see what would be uploaded
node scripts/upload-sim.mjs <slug> --publish   # upload to the dev deployment
node scripts/upload-sim.mjs <slug> --publish --prod   # production
```

The script reads the trinity-meta block, picks up `svg/<slug>.svg`
automatically, and upserts by slug via an internal Convex mutation. On
re-upload it keeps the existing published/featured flags (and thumbnail)
unless you pass `--publish` / `--unpublish` / `--feature` / `--unfeature` /
`--svg <path>`. It needs `npx convex login` or a running `npx convex dev`.

### Without a terminal

Open `/admin/edit/new` and drag the `.html` (and optionally the `.svg`) into
the Import files panel — the form prefills from the trinity-meta block. Review,
tick Published, save.

## Design rules that trip people up

CLAUDE.md is the full spec; these are the common misses:

- Accent (teal) marks the single live/moving thing only — never buttons or chrome.
- Body ≥ 17 px on iPad / 16 px on phone; mono labels ≥ 13 px; stage readouts ≥ 14 px.
- Hit targets ≥ 44 px. At most 4 parameters.
- The page itself never scrolls: `100dvh` locked shell, one internal scroll
  panel at most.
- No emoji, no gradients, no site nav/footer inside the sim file.
