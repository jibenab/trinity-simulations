  # SVG Design Guide — Trinity Simulation Lab

  Thumbnail SVGs are the first thing a student sees. They must communicate the physics or concept at a glance, feel like a diagram from a precise textbook, and animate just enough to imply motion without distracting.

  ---

  ## 1. Canvas & coordinate system

  Every thumbnail SVG uses a fixed `viewBox="0 0 200 140"` at `width="100%"` with a `maxHeight` of 120 px.

  ```svg
  <svg viewBox="0 0 200 140" width="100%" style="max-height:120px">
    <!-- content -->
  </svg>
  ```

  - Origin `(0,0)` is top-left. Center is `(100, 70)`.
  - Leave at least **12 px margin** on all sides — nothing should touch the edge.
  - Design for light mode (`--bg-alt` background). The SVG itself does not set a background.

  ---

  ## 2. Stroke & fill rules

  | Element | Stroke color | Stroke width | Fill |
  |---|---|---|---|
  | Background grid | `var(--ink)` at `opacity="0.15"` | `0.5` | none |
  | Secondary / ghost lines | `var(--ink)` | `1.0` | none |
  | Primary diagram lines | `var(--ink)` | `1.2` | none |
  | The live element | `var(--ink)` | `1.5` | `var(--ink)` (solid) or `var(--accent)` |
  | Ghost / past positions | `var(--ink)` at `opacity="0.12"` | `1.0` | none |
  | Annotation text | — | — | `var(--ink-mute)` |

  **Never** hardcode hex values in SVG attributes. Use `var(--token)` everywhere so theme overrides propagate.

  ```svg
  <!-- correct -->
  <circle cx="100" cy="70" r="8" fill="var(--ink)" />

  <!-- wrong -->
  <circle cx="100" cy="70" r="8" fill="#0C1115" />
  ```

  ---

  ## 3. Required background grid

  Every glyph must have a faint coordinate grid behind the main diagram. It grounds the image in a lab / instrument feel.

  ```svg
  <!-- Vertical lines every 40 px -->
  <line x1="20"  y1="12" x2="20"  y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="60"  y1="12" x2="60"  y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="100" y1="12" x2="100" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="140" y1="12" x2="140" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="180" y1="12" x2="180" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>

  <!-- Horizontal lines every 29 px -->
  <line x1="12" y1="12"  x2="188" y2="12"  stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="41"  x2="188" y2="41"  stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="70"  x2="188" y2="70"  stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="99"  x2="188" y2="99"  stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="128" x2="188" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  ```

  ---

  ## 4. Geometry vocabulary

  Use only these primitives. No freeform illustration.

  | Primitive | When to use |
  |---|---|
  | `<line>` | Rods, strings, axes, dividers |
  | `<circle>` | Bobs, particles, nodes, electron shells |
  | `<ellipse>` | Orbital paths, lens cross-sections |
  | `<rect>` | Blocks, capacitor plates, piston faces |
  | `<path>` with arcs/cubics | Curves, beaker outlines, wave shapes |
  | `<polyline>` | Sawtooth waves, zigzag resistors |
  | Dashed `stroke-dasharray` | Dashed guidelines, virtual/reference lines |
  | `<text>` (JetBrains Mono, 9–11 px) | Annotation labels only (`θ`, `L`, `T`, `+`, `−`) |

  **Never use**: `<image>`, `<pattern>` fills, `linearGradient`, `radialGradient`, `<filter>`, `<feGaussianBlur>`, hand-drawn paths that look organic or calligraphic.

  ---

  ## 5. Subject glyph archetypes

  Each subject has a canonical visual language. Extend it consistently.

  ### Physics

  Axes + the core mechanical object. Examples: pendulum bob on a string, spring-mass system, charged particle between plates.

  ```
  pivot bar ─────────────────
            \         \   ghost at 0.25 opacity
              \         \
              ● (filled, accent on live, ink on ghosts)
  ```

  Ghost positions at opacity 0.25 convey trajectory without clutter.

  ### Chemistry

  Apparatus outline in `stroke-width="1.2"`, level indicators as dashed horizontal rules inside.

  ```
  ──────     ← rim, stroke-width 2
  /        \
  │ ─ ─ ─ │   ← liquid level, dashed
  │   ·  · │   ← bubbles (r=2, filled)
  └────────┘
  ```

  Bubbles use `<circle r="2" fill="var(--ink)"/>` placed inside the apparatus outline.

  ### Biology

  Concentric or adjacent circles representing cell / nucleus hierarchy. Outer membrane is `stroke-width="1.2"`, nucleus is filled solid.

  ```
    ○ ──── large cell, stroke only
    ● ──── nucleus, filled solid
  ```

  Multiple cell groups with varying sizes suggest division or population.

  ### Math

  A 2D coordinate grid with one curve (`<path>`, `stroke-width="1.5"`). The axes are heavier than the grid. Use a subtle origin hatch (±4 px tick marks at the intersection).

  ```
  │          ↑ y-axis, stroke-width 1.2
  │   ╭──╮
  │ ─╯    ╰──  curve, stroke-width 1.5
  └──────────→ x-axis, stroke-width 1.2
  ```

  ---

  ## 6. Animation

  Animations must run only as inline SVG `<animate>` or `<animateTransform>` elements — no JavaScript, no CSS `@keyframes` tied to external class names. They must be **subtle and physically motivated**.

  ### Rules

  - Duration: **2–6 s**. Nothing faster than 2 s — it should feel like real physics, not a UI spinner.
  - `repeatCount="indefinite"` on all loops.
  - Always include `calcMode="spline"` with `keySplines` for easing. Linear animation looks mechanical.
  - The animated element must be the **live element** (the bob, the liquid, the particle) — never the grid, labels, or outlines.
  - Honor `prefers-reduced-motion`: wrap every animated group in a `<style>` block inside the SVG.

  ```svg
  <style>
    @media (prefers-reduced-motion: reduce) {
      .anim { animation: none; }
      .anim * { animateTransform { } }
    }
  </style>
  ```

  Because SVG `<animate>` doesn't respond to CSS media queries directly, conditionally add the `begin="indefinite"` attribute via JavaScript on page load when reduced motion is preferred — or simply skip the `<animate>` element in the JSX render when `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.

  ---

  ## 7. Animation recipes by subject

  ### Physics — pendulum swing

  Rotate the string + bob group around the pivot point.

  ```svg
  <g id="pendulum">
    <line x1="100" y1="20" x2="100" y2="110" stroke="var(--ink)" stroke-width="1"/>
    <circle cx="100" cy="110" r="9" fill="var(--ink)"/>
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="-28 100 20"
      to="28 100 20"
      dur="2.4s"
      repeatCount="indefinite"
      calcMode="spline"
      keyTimes="0;0.5;1"
      keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
      values="-28 100 20; 28 100 20; -28 100 20"
    />
  </g>
  ```

  - `from` / `to` angles in degrees; keep amplitude ≤ 30° for small-angle realism.
  - Pivot point (`100 20`) is the third argument in `rotate(angle cx cy)`.
  - Period should scale with simulated length: longer string → longer `dur`.

  ### Physics — spring oscillation

  Translate a mass block vertically while stretching a coil above it. Animate both the block and the coil height.

  ```svg
  <!-- Mass block -->
  <rect x="80" y="80" width="40" height="28" fill="none" stroke="var(--ink)" stroke-width="1.2">
    <animate attributeName="y" values="60;90;60" dur="2s"
      repeatCount="indefinite" calcMode="spline"
      keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"/>
  </rect>
  ```

  Draw the spring as a `<polyline>` whose y-coordinates are also animated, or use a `<path>` with a `d` attribute animated across two `values`.

  ### Physics — wave propagation

  Use `<path>` with a sine curve `d` value, then animate the `d` from one phase to the next.

  ```svg
  <path stroke="var(--ink)" stroke-width="1.5" fill="none">
    <animate attributeName="d"
      values="M20,70 C40,40 60,100 80,70 S120,40 140,70 S180,100 200,70;
              M20,70 C40,100 60,40 80,70 S120,100 140,70 S180,40 200,70;
              M20,70 C40,40 60,100 80,70 S120,40 140,70 S180,100 200,70"
      dur="3s" repeatCount="indefinite"
      calcMode="spline" keyTimes="0;0.5;1"
      keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
  </path>
  ```

  ### Chemistry — rising bubbles

  Animate small circles moving upward and fading out inside the apparatus outline. Use `clip-path` to mask them to the vessel interior.

  ```svg
  <clipPath id="vessel-clip">
    <path d="M75 50 L75 90 L52 128 L148 128 L125 90 L125 50 Z"/>
  </clipPath>

  <g clip-path="url(#vessel-clip)">
    <circle cx="95" cy="120" r="2.5" fill="var(--ink)" opacity="0.7">
      <animate attributeName="cy" values="120;60" dur="3s" repeatCount="indefinite"
        calcMode="spline" keyTimes="0;1" keySplines="0.2 0 0.8 1"/>
      <animate attributeName="opacity" values="0.7;0" dur="3s" repeatCount="indefinite"/>
    </circle>
    <!-- Offset a second bubble with begin="1s" for stagger -->
    <circle cx="110" cy="120" r="2" fill="var(--ink)" opacity="0.7">
      <animate attributeName="cy" values="120;65" dur="3s" begin="1s" repeatCount="indefinite"
        calcMode="spline" keyTimes="0;1" keySplines="0.2 0 0.8 1"/>
      <animate attributeName="opacity" values="0.7;0" dur="3s" begin="1s" repeatCount="indefinite"/>
    </circle>
  </g>
  ```

  ### Chemistry — liquid level oscillation

  Animate the `y` and `height` of a `<rect>` inside the vessel to simulate sloshing.

  ```svg
  <clipPath id="flask-clip">
    <path d="M75 50 L75 90 L52 128 L148 128 L125 90 L125 50 Z"/>
  </clipPath>
  <rect clip-path="url(#flask-clip)" x="40" width="120" fill="var(--ink)" opacity="0.12">
    <animate attributeName="y" values="90;82;90" dur="4s" repeatCount="indefinite"
      calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"/>
    <animate attributeName="height" values="40;48;40" dur="4s" repeatCount="indefinite"
      calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"/>
  </rect>
  ```

  ### Biology — cell division pulse

  Scale the outer membrane with a slow breathe, then at halfway split into two circles.

  For a simpler alternative that works without JS: animate the `r` of the nucleus circle to pulse (±2 px) with a slow dur of 4 s. This implies metabolic activity.

  ```svg
  <circle cx="70" cy="70" r="14" fill="var(--ink)">
    <animate attributeName="r" values="14;16;14" dur="4s" repeatCount="indefinite"
      calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"/>
  </circle>
  ```

  ### Math — curve tracing dot

  Draw the static curve as a `<path>`. Place a filled `<circle>` on the curve and animate it using `<animateMotion>` along the same path.

  ```svg
  <path id="curve-path" d="M20 110 Q 60 20, 100 70 T 180 30"
    fill="none" stroke="var(--ink)" stroke-width="1.5"/>

  <circle r="5" fill="var(--ink)">
    <animateMotion dur="4s" repeatCount="indefinite"
      calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1">
      <mpath href="#curve-path"/>
    </animateMotion>
  </circle>
  ```

  ---

  ## 8. Annotation labels

  Use `<text>` sparingly. One or two labels per glyph maximum.

  ```svg
  <text x="106" y="68" font-family="var(--mono)" font-size="10"
    fill="var(--ink-mute)" letter-spacing="0.06em">θ</text>
  ```

  - Font size: 9–11 px. Never larger.
  - Always `font-family="var(--mono)"`.
  - Color: `var(--ink-mute)` — never `var(--ink)` or `var(--accent)`.
  - Position labels in breathing room, not overlapping strokes.
  - Use Greek letters for angles (`θ`, `φ`), uppercase for lengths (`L`, `T`, `R`).

  ---

  ## 9. Composition checklist

  Before committing a new glyph:

  - [ ] `viewBox="0 0 200 140"` with `width="100%"` and `style="max-height:120px"`
  - [ ] Background grid present at `opacity="0.15"`, `stroke-width="0.5"`
  - [ ] No hex colors — all `var(--token)` references
  - [ ] No gradients, no filters, no `<image>` elements
  - [ ] Primary diagram lines at `stroke-width="1.2"`, live element at `1.5`
  - [ ] Ghost / secondary elements at `opacity="0.25"` or lower
  - [ ] At most 1–2 annotation labels, mono 9–11 px, `var(--ink-mute)`
  - [ ] Animation on the live element only, `dur` ≥ 2 s, `calcMode="spline"`
  - [ ] `prefers-reduced-motion` check in place
  - [ ] Works at 200 × 140 and at thumbnail crop (120 × 84 visible center)

  ---

  ## 10. Complete reference glyph — Physics (pendulum)

  This is the canonical implementation. Copy and adapt for new subjects.

  ```svg
  <svg viewBox="0 0 200 140" width="100%" style="max-height:120px" aria-hidden="true">

    <!-- Background grid -->
    <line x1="20"  y1="12" x2="20"  y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
    <line x1="60"  y1="12" x2="60"  y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
    <line x1="100" y1="12" x2="100" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
    <line x1="140" y1="12" x2="140" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
    <line x1="180" y1="12" x2="180" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
    <line x1="12" y1="12"  x2="188" y2="12"  stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
    <line x1="12" y1="41"  x2="188" y2="41"  stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
    <line x1="12" y1="70"  x2="188" y2="70"  stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
    <line x1="12" y1="99"  x2="188" y2="99"  stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
    <line x1="12" y1="128" x2="188" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>

    <!-- Pivot bar -->
    <line x1="30" y1="20" x2="170" y2="20" stroke="var(--ink)" stroke-width="1.2"/>

    <!-- Ghost position — left -->
    <g opacity="0.2">
      <line x1="100" y1="20" x2="72" y2="108" stroke="var(--ink)" stroke-width="1"/>
      <circle cx="72" cy="108" r="7" fill="none" stroke="var(--ink)" stroke-width="1"/>
    </g>

    <!-- Ghost position — right -->
    <g opacity="0.2">
      <line x1="100" y1="20" x2="128" y2="108" stroke="var(--ink)" stroke-width="1"/>
      <circle cx="128" cy="108" r="7" fill="none" stroke="var(--ink)" stroke-width="1"/>
    </g>

    <!-- Live pendulum (animated) -->
    <g>
      <line x1="100" y1="20" x2="100" y2="110" stroke="var(--ink)" stroke-width="1.2"/>
      <circle cx="100" cy="110" r="9" fill="var(--ink)"/>
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="-26 100 20; 26 100 20; -26 100 20"
        dur="2.6s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;0.5;1"
        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
      />
    </g>

    <!-- Annotation -->
    <text x="108" y="62" font-family="var(--mono)" font-size="10"
      fill="var(--ink-mute)" letter-spacing="0.06em">θ</text>

  </svg>
  ```
