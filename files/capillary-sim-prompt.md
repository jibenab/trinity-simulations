# Prompt: Build a Capillary Rise & Angle of Contact Simulation

Copy this entire prompt and give it to the AI you want to build the simulation.

---

## Context

You are building an interactive physics simulation for **Trinity Simulation Lab**, a minimal, instrument-panel–style web app for high-school students (Class XI, ICSE). The simulation is a **self-contained HTML file** using **React 18 via CDN** (no build step). It must match the exact visual design system described below.

---

## Design System (read carefully — do not deviate)

### Color tokens (CSS variables, already defined in a `<style>` block you will write)

```css
:root {
  --bg:        #EFF2F5;
  --bg-alt:    #E2E7EC;
  --paper:     #F7F8FA;
  --ink:       #0C1115;
  --ink-soft:  #2B333A;
  --ink-mute:  #6B7680;
  --rule-soft: rgba(12,17,21,0.14);
  --dark:      #0C1115;
  --dark-ink:  #EFF2F5;
  --dark-mute: #7F8892;
  --accent:    oklch(0.52 0.12 200);   /* teal */
  --accent-ink:#F7F8FA;
  --sans: 'Manrope', system-ui, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

**Rules:**
- Never hardcode a hex colour — always use `var(--token)`.
- No gradients anywhere (including SVG fills).
- No drop shadows except the single card hover: `box-shadow: 6px 6px 0 var(--ink)`.
- No warm/ivory backgrounds.
- **Accent (`--accent`) is used on exactly one thing per screen: the moving liquid meniscus line.**
- Primary buttons: `--ink` background, `--bg` text, pill border-radius.

### Typography

- **One family: Manrope** (load via Google Fonts). No serif. No italic display type.
- **Monospace: JetBrains Mono** — only for numeric readouts, axis labels, eyebrows, parameter labels. Never larger than 14 px.
- Load both via a single `<link>` tag:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  ```

### Simulation layout — 4 zones, top to bottom

```
┌──────────────────────────────────────────────────┐
│ 1. HEADER STRIP                                  │
│    eyebrow: "SIMULATION · PHYSICS" (mono 11px)  │
│    title: "Capillary Rise" (Manrope 600, 32px)  │
│    right: play/pause + reset — 42×42 circle btns│
├──────────────────────────────────────────────────┤
│                                                  │
│   2. STAGE  (background #1A1A1A, border 1px      │
│              #2A2A2A, border-radius 4px)         │
│                                                  │
│   SVG canvas — faint grid (stroke #2A2A2A,       │
│   strokeWidth 0.5), every ~8 divisions.          │
│                                                  │
│   The animated element: liquid inside the tube.  │
│   The rising/falling meniscus stroke = --accent. │
│   Everything else = --dark-ink or --dark-mute.   │
│                                                  │
│   Readouts top-left: mono 10px --dark-mute        │
│   format: "LABEL  value unit" (two spaces gap)   │
│                                                  │
├──────────────────────────────────────────────────┤
│ 3. PARAMETER STRIP                               │
│    2–4 labelled range sliders                    │
│    Label row: mono 10px uppercase, name left /   │
│    value+unit right. accentColor: var(--accent)  │
├──────────────────────────────────────────────────┤
│ 4. PROMPT (one sentence, ≤18 words, interrogative│
│    "What happens to the rise when you halve r?"  │
└──────────────────────────────────────────────────┘
```

---

## Physics the simulation must model

### Capillary rise formula

$$h = \frac{2T \cos\theta}{\rho g r}$$

| Symbol | Meaning | Range to expose |
|--------|---------|-----------------|
| $T$    | Surface tension (N m⁻¹) | 0.020 – 0.080 |
| $\theta$ | Angle of contact (°) | 0° – 150° |
| $\rho$ | Liquid density (kg m⁻³) | 800 – 14000 |
| $r$    | Capillary radius (m) | 0.1 mm – 2.0 mm |

The simulation should **animate the liquid smoothly** from its current height to the new equilibrium height whenever a parameter changes (use `requestAnimationFrame`, not CSS transitions, for physics-accurate motion).

When $\cos\theta < 0$ (i.e. $\theta > 90°$), $h$ is negative — the liquid is **depressed** below the reservoir level. The animation must show this correctly.

### What to draw on the stage

1. **Reservoir** — a wide rectangular container at the bottom, filled with liquid to a fixed reference level.
2. **Capillary tube** — a narrow vertical tube rising from the reservoir. Tube walls in `--dark-ink`, strokeWidth 1.2.
3. **Liquid column inside the tube** — filled rectangle. Color `--dark-ink` at 60% opacity.
4. **Meniscus** — a curved SVG arc at the top of the liquid column. Stroke `--accent`, strokeWidth 1.5. Concave when $\theta < 90°$, flat at $\theta = 90°$, convex when $\theta > 90°$.
5. **Height arrow** — a thin double-headed arrow from the reservoir surface to the meniscus, labelled `h` in mono. Arrow color `--dark-mute`.
6. **Angle of contact indicator** — a small arc near the tube wall at the meniscus showing $\theta$, with the label `θ` in mono. Color `--dark-mute`.
7. **Faint grid** — horizontal and vertical lines, stroke `#2A2A2A`, strokeWidth 0.5.

### Readouts (top-left of stage, mono 10px, --dark-mute)

```
h    +36.7 mm
T    0.072 N/m
θ    8°
r    0.40 mm
```

Use two spaces between the label and the value. Prefix `+` for rise, `−` for depression.

---

## Parameters (4 sliders)

| Slider | Label | Min | Max | Step | Default | Unit |
|--------|-------|-----|-----|------|---------|------|
| Surface tension | `Surface tension` | 0.020 | 0.080 | 0.001 | 0.072 | N/m |
| Angle of contact | `Angle of contact` | 0 | 150 | 1 | 8 | ° |
| Liquid density | `Density` | 800 | 14000 | 100 | 1000 | kg/m³ |
| Capillary radius | `Radius` | 0.1 | 2.0 | 0.1 | 0.4 | mm |

Show 2 sliders per row on wide screens, 1 per row on narrow screens (CSS grid, `minmax(200px, 1fr)`).

---

## Prompt strip

> What happens to the rise when you halve the radius?

One sentence. No emoji. No exclamation mark.

---

## Technical requirements

- **Self-contained `.html` file** — no external JS except React 18 UMD + ReactDOM from CDN:
  ```html
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  ```
  Write the component in a `<script type="text/babel">` block.

- **Primary viewport: iPad landscape — 1194 × 834 px.** Must reflow gracefully to phone (≥ 375 px).
- **Touch targets ≥ 44 px.** Min body font 15 px on mobile.
- **`requestAnimationFrame` loop** for the liquid animation. When play is paused, freeze the animation.
- **Reduced-motion**: if `prefers-reduced-motion` is set, start paused and require an explicit play press.
- **Reset button**: restores all sliders to their default values and snaps liquid to the corresponding equilibrium height instantly.
- All type is `var(--sans)` except readouts, labels, and eyebrows which are `var(--mono)`.
- No inline hex colours in JSX style props — define them as CSS variables in the `<style>` block.

---

## Don'ts checklist

- [ ] No warm ivory/beige backgrounds
- [ ] No serif or italic type
- [ ] No gradients, no drop shadows (except card hover offset)
- [ ] No emoji
- [ ] Accent on the meniscus only — not buttons, borders, or large areas
- [ ] No more than 4 parameters
- [ ] Stage has a faint grid and mono readouts
- [ ] Must work at 1194 × 834 and at 375 × 667

---

## Deliverable

A single file: `capillary-rise.html`

The file should open in a browser with no local server required (all assets are CDN or inline).
