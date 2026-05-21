# Electric Flux Simulation — UI Restyle Design

**Date:** 2026-05-18  
**File:** `files/simulations/futuresimulations/electric flux.html`  
**Scope:** UI restyle only — Three.js 3D scene is preserved unchanged.

---

## Goal

Restyle the electric flux simulation's chrome to match the Trinity Simulation Lab design system (as defined in CLAUDE.md and exemplified by `Dipole.html`), without touching the Three.js simulation logic.

---

## Layout

Mirrors the Dipole.html sidebar pattern:

```
┌─ app-frame (page-shell > app-frame) ─────────────────────────┐
│ header: eyebrow + title + reset button                        │
├──────────────────────────────────┬────────────────────────────┤
│                                  │  sidebar (360px, --paper)  │
│  Three.js canvas (flex-grow: 1)  │  - mode chips (tabs)       │
│  background: --dark (#0C1115)    │  - formula block (mono)    │
│  CSS grid overlay via ::before   │  - parameter legend        │
│  (the Three.js scene is intact)  │  - sliders (2–3 per mode)  │
│                                  │  - live Φ readout at bottom│
├──────────────────────────────────┴────────────────────────────┤
│ footer prompt: one sentence, changes per mode                 │
└───────────────────────────────────────────────────────────────┘
```

---

## Design Tokens Used

All inline in `<style>` block (file is standalone HTML, no external CSS):

| Token | Value | Use |
|---|---|---|
| `--bg` | `#EFF2F5` | page background |
| `--paper` | `#F7F8FA` | app-frame, sidebar |
| `--ink` | `#0C1115` | primary text, borders |
| `--ink-soft` | `#2B333A` | body copy |
| `--ink-mute` | `#6B7680` | labels, captions |
| `--rule-soft` | `rgba(12,17,21,0.14)` | dividers |
| `--dark` | `#0C1115` | canvas/stage background |
| `--dark-ink` | `#EFF2F5` | text on dark |
| `--dark-mute` | `#7F8892` | muted text on dark |
| `--accent` | `#72c0d4` | slider thumb, active tab fill |
| `--accent-soft` | `rgba(114,192,212,0.16)` | thumb ring |
| `--sans` | Manrope → Inter → system | all body text |
| `--mono` | JetBrains Mono → IBM Plex Mono → monospace | labels, readouts, formula |

---

## Header

- `eyebrow`: `SIMULATION · ELECTRICITY` — mono, 11px, `--ink-mute`, uppercase, 0.14em tracking
- `title`: "Electric Flux" — Manrope 600, `clamp(30px, 4vw, 48px)`, letter-spacing -0.035em
- Right side: reset `iconbtn` (44×44, outline circle, `--rule-soft` border, `--ink` on hover)
- Bottom border: `1px solid var(--rule-soft)`

---

## Canvas / Stage

- `margin: 18px 0 18px 18px`, `border-radius: 18px`, `border: 1px solid #2a2a2a`
- CSS `::before` adds faint grid: `rgba(127,136,146,0.08)` lines, 42px grid, 0.18 opacity
- Three.js `scene.background` stays `#0f172a` → updated to `#0C1115` to match `--dark`
- Three.js renderer fills the container; no other change to scene/animation code

---

## Sidebar (360px)

### Mode Chips (Tab Switcher)
- Two pill chips: "Area Flux" and "Gauss's Law"
- Ghost style (transparent, `1px --ink` border) when inactive
- Active: `--ink` background, `--bg` text
- Mono 11px, uppercase, 0.08em tracking
- `min-height: 38px`

### Formula Block
- Panel section: `border: 1px solid var(--rule-soft)`, `border-radius: 16px`, `--paper` bg
- Section heading: mono 11px, uppercase, `--ink-mute`, border-bottom
- Formula: mono, centered, `--ink-soft`
- Legend rows: variable letter in accent/warm/ink-mute, description in `--ink-soft`, 13px

### Sliders
- Same pattern as Dipole.html
- Label: mono 11px uppercase `--ink-soft` (left) | value + unit: mono, bold `--ink` (right)
- Track: 4px, `--rule-soft` fill, `border-radius: 999px`
- Thumb: 16px, `--accent`, 2px `--paper` border, `--accent-soft` ring

### Live Φ Readout
- At bottom of sidebar
- Panel section with label "Total Flux (Φ)" in mono 11px `--ink-mute`
- Value: 32px, bold, `--ink` (flux-positive → teal accent, flux-negative → warm/red, zero → `--ink-mute`)
- Explanation text: 12px, `--ink-soft`

---

## Footer Prompt

- `border-top: 1px solid var(--rule-soft)`
- Two sentences, one per mode:
  - Flux mode: "Try rotating the surface to 90°. What happens to the flux through it?"
  - Gauss mode: "Try increasing the radius of the Gaussian surface. Does the total flux change?"
- Body text, 14px, `--ink-soft`, `padding: 14px 18px`

---

## What Does NOT Change

- All Three.js imports, scene setup, geometry, materials
- All animation loop logic (`animate()`, field line / radial line movement)
- All orbit controls (mouse/touch drag, scroll zoom)
- All simulation math and slider event listeners
- All JavaScript `params`, `updateSimulation()`, `switchMode()` logic
- Both tab modes (flux and gauss) continue to function identically

---

## Responsive

- iPad landscape (1194×834): sidebar always visible, canvas fills remaining width
- iPad portrait / phone (≤ 768px): sidebar moves below canvas, becomes horizontal scroll or stacked section
- Hit targets ≥ 44px on all interactive elements
