# CLAUDE.md — Trinity Simulation Lab

Persistent design instructions for this project. Read before building new simulations, cards, pages, or components. The goal is a **consistent, minimal, instrument-panel feel** across every simulation.

---

## 1. Brand in one line

> A quiet lab for curious high-school students. Understand a concept by playing with it.

Tone: precise, calm, textbook-scientific. Never playful-cartoon. Never corporate-SaaS. Never Claude-warm-ivory.

---

## 2. Canvas & device

- **Primary viewport:** iPad landscape — **1194 × 834**.
- Design at iPad-landscape first. Must gracefully reflow to iPad portrait (834 × 1194) and phone (≥ 375 px).
- Hit targets ≥ **44 px** on touch.
- Minimum body font size on mobile: **15 px**. Minimum label-mono: **11 px**.
- In iPad fullscreen/PWA use, do not let the document body become the primary scroll surface. Lock page-level scroll (`html`, `body`, and the app root at `100dvh`, `overflow: hidden`, `overscroll-behavior: none`) and put any necessary vertical scrolling inside an internal content panel with `overflow-y: auto`, `-webkit-overflow-scrolling: touch`, and `overscroll-behavior: contain`. This reduces accidental pull-down minimization / browser chrome reveal gestures.

---

## 3. Color tokens — use these, don't invent new ones

All tokens live in `styles.css` under `:root`. Reference via `var(--token)` — never hardcode hex in component styles.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#EFF2F5` | page background |
| `--bg-alt` | `#E2E7EC` | subtle zebra / hover background |
| `--paper` | `#F7F8FA` | cards, surfaces raised above bg |
| `--ink` | `#0C1115` | primary text, borders, dark shapes |
| `--ink-soft` | `#2B333A` | body copy |
| `--ink-mute` | `#6B7680` | captions, metadata, axis labels |
| `--rule-soft` | `rgba(12,17,21,0.14)` | hairline dividers |
| `--dark` | `#FFFFFF` | simulation stage background (white) |
| `--dark-ink` | `#0C1115` | text on `--dark` |
| `--dark-mute` | `#4A5560` | captions on `--dark` |
| `--accent` | `oklch(0.52 0.12 200)` (teal) | **single** interactive/live element |
| `--accent-ink` | `#F7F8FA` | text on accent |

### Accent rules (important)

- Use the accent **sparingly** — one accent moment per screen is the goal.
- In a simulation, the accent marks **the live/moving thing**: the pendulum bob, the reactant level, the moving dot on a graph.
- Never use the accent for chrome (buttons, borders, backgrounds of large areas). Primary CTAs use `--ink` background with `--bg` text.
- Never pair accent on accent.

### Forbidden

- No warm ivory / beige backgrounds (too Claude-like).
- No color gradients. Anywhere. Including SVG fills.
- No shadows except the single 2px/6px offset "paper" shadow used on hover (`box-shadow: 6px 6px 0 var(--ink)` on cards).
- No saturations above ~0.14 chroma in oklch. No neon.

---

## 4. Type

**One family: Manrope** (via Google Fonts). All type is sans-serif. No italic display type.

| Role | Weight | Size range | Letter-spacing |
|---|---|---|---|
| Display headline (`.display`) | 500 | 48–104 px, `clamp()` encouraged | `-0.025em` |
| Section title | 600 | 26–48 px | `-0.02em` |
| Card title | 600 | 18–24 px | `-0.01em` |
| Body | 400 | 14–16 px | 0 |
| Body small | 400 | 12–13 px | 0 |
| Eyebrow (`.eyebrow`) | 500 (via mono) | 11 px | `0.14em`, UPPERCASE |
| Label-mono (`.label-mono`) | 500 | 11 px | `0.08em`, UPPERCASE |

**Monospace** (`JetBrains Mono`) is allowed for:
- Section eyebrows ("§ 01 — Featured")
- Numeric readouts inside simulations (`θ 12.4°`, `T 2.01s`, `pH 7.42`)
- Axis labels on graphs
- Chip labels and status pills

Never set monospace larger than 14 px. Never use it for body copy.

---

## 5. Simulation anatomy

Every simulation should follow the same 4-zone layout so students build muscle memory.

```
┌──────────────────────────────────────────┐
│ 1. HEADER STRIP  (subject · title · controls)
├──────────────────────────────────────────┤
│                                          │
│   2. STAGE                               │
│   (the visual thing being simulated,     │
│    on --dark bg with a 0.5px grid)       │
│                                          │
│   readouts bottom-left, mono, muted      │
├──────────────────────────────────────────┤
│ 3. PARAMETER STRIP                       │
│   2–4 labelled sliders, mono labels,     │
│   current value right-aligned            │
├──────────────────────────────────────────┤
│ 4. PROMPT (optional)                     │
│   One-sentence nudge in body type:       │
│   "Try halving the length. What happens  │
│    to the period?"                       │
└──────────────────────────────────────────┘
```

### Header strip
- Eyebrow: "SIMULATION · {SUBJECT}" in mono
- Title: `.display` size 32, weight 600
- Right side: 42×42 circular outline buttons for **play/pause**, **reset**. Nothing else.

### Stage
- Background `--dark` (white `#FFFFFF`), 1px `var(--stage-rule)` border, `border-radius: 4px`.
- A faint grid: `stroke="var(--stage-grid)" strokeWidth="0.5"`, every 8–12 divisions.
- The live moving thing is filled with `--accent`. Everything else is `--dark-ink` or `--dark-mute`.
- Trails / ghost positions use `--ink` at opacity 0.12.
- Readouts sit in the top-left, mono, 10px, color `--dark-mute`, format `LABEL  value` with two spaces.

### Parameters
- `<input type="range">` with `accent-color: var(--accent)`.
- Label row: mono 10px, uppercase, `justify-content: space-between`, name on left, current value + unit on right (e.g. `Length / 2.8 m`).
- 2 parameters per row on iPad landscape, 1 per row on phone.
- Never more than 4 parameters visible at once. If you need more, collapse into "Advanced".

### Prompt
- 1 sentence, max 18 words. Interrogative when possible.
- Never use emoji. Never add exclamation marks.

---

## 6. Cards (for the catalog)

Use the existing `.simcard` class. Anatomy:

1. **Thumb** — aspect-ratio 4:5, `--bg-alt` background, 135° diagonal stripes overlay at 8% opacity, abstract geometric glyph centered, subject chip top-left, SIM·NN label top-right.
2. **Meta** — title (weight 600, letter-spacing -0.01em), concepts row (mono 12px muted), subject·level + minutes row.

Hover: `translateY(-3px)` + `box-shadow: 6px 6px 0 var(--ink)`. Nothing else.

Never use photographic imagery inside the thumb. Never use emoji as a subject icon.

---

## 7. Illustration rules

- **Only abstract geometric SVG.** Circles, lines, arcs, dashed paths, coordinate grids. See `SimGlyph` in `components.jsx` for the four approved subject glyphs.
- **No hand-drawn characters, no mascots, no 3D rendering.**
- Stroke widths: `0.5` for background grid, `1–1.2` for diagram lines, `1.5` for the currently-live element.
- Every diagram must be annotatable: leave breathing room for a mono label like `θ`, `L`, `T`.
- Axes always have subtle hatching at the origin (see hero pendulum `HeroIllustration`).

---

## 8. Buttons & chips

- **Primary:** `.btn` — `--ink` background, `--bg` text, pill radius. Icon on the right, never left.
- **Ghost:** `.btn.ghost` — transparent, 1px `--ink` border.
- **Accent (rare):** `.btn.accent` — reserved for the single strongest CTA on a dark section.
- **Chips:** pill, 1px `--ink` border, mono 11px uppercase. Active state inverts to ink-on-bg.

Never stack two accent buttons side-by-side. Never use gradient or "glass" buttons.

---

## 9. Motion

- Micro-transitions: `0.15s ease`. Card lift: `0.2s ease`.
- Live simulation motion uses `requestAnimationFrame`, not CSS animations, for physics accuracy.
- Reduce motion: if `prefers-reduced-motion` is set, pause on mount; require an explicit play press.
- No parallax. No scroll-jacking.

---

## 10. Copy tone

- Address the student directly: "Drag the slider", "What do you predict?"
- Short sentences. Active voice.
- Avoid jargon without a gloss. If a term is new, italicise it on first mention.
- Never say "amazing", "powerful", "revolutionary". Never use 🚀 or any emoji.

---

---

## 11. Structural file layout

```
/styles.css              design tokens + base styles (edit here for global changes)
/components.jsx          TopNav, Footer, SimThumb, SimGlyph, ScatterGlyphs, TweaksPanel, Icon
/data.jsx                SIMS catalog array (id, title, subject, level, minutes, concepts)
/pendulum.jsx            reference implementation of a simulation stage
/home.html               landing page
/catalog.html            browse page
/<sim-id>.html           one file per simulation; mirror pendulum.jsx's structure
```

When adding a new simulation:
1. Add an entry to `SIMS` in `data.jsx`.
2. Add a case to `SimGlyph` in `components.jsx` if the subject glyph needs variation.
3. Create `<sim-id>.html` using `pendulum.jsx` as the skeleton.
4. Reuse `TopNav`, `Footer`, `Icon` — don't duplicate.

---

## 12. Don'ts checklist (before shipping anything)

- [ ] No warm/ivory backgrounds
- [ ] No serif or italic type anywhere
- [ ] No gradients, no drop shadows (except the offset card shadow)
- [ ] No emoji
- [ ] Accent used only once per screen, and only on the live element
- [ ] All text passes WCAG AA contrast on both light and dark surfaces
- [ ] Simulation has play/pause/reset and at most 4 parameters
- [ ] Stage has a faint grid and mono readouts
- [ ] Works at 1194×834 and at 375×667
- [ ] iPad fullscreen does not rely on body/page scroll; scrollable content is contained inside an internal panel
- [ ] No hardcoded colors in SVGs or component CSS — all use `var(--token)`

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
