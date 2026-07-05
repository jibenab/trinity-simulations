# SUVAT Sign Conventions Simulation

## Output
`simulation/suvat-sign-conventions.html` — single self-contained HTML file

## Conventions (from existing sims)
- No `<nav>`, no auth chrome, no site-level navigation
- 4-zone lab UI: header strip, stage, parameter/actions strip, status strip
- Viewport-locked (`100dvh`, `overflow: hidden`), single scroll owner
- Google Fonts loaded via `<link>`, inline `<style>` and `<script>`
- Canvas-based stage rendering
- Mobile responsive via `@media (max-width: 820px)` breakpoint
- Must pass `npm run check:simulation-chrome`

## Design System (custom dark theme)
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0d1b2a` | Dark navy background |
| `--bg-alt` | `#1b2838` | Panel backgrounds |
| `--pos` | `#e0a526` | Gold for positive quantities |
| `--neg` | `#4ea8de` | Cyan for negative quantities |
| `--ink` | `#e8edf2` | Primary text |
| `--ink-mute` | `#8899aa` | Secondary text |
| `--zero` | `#6c7a89` | Zero/neutral |
| `--sans` | `'Manrope'` | UI labels |
| `--mono` | `'Space Mono'` | All numeric readouts, equations, graph labels |

## Layout (landscape iPad, single screen, no scroll)

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER: Title │ [Braking] [Reversing] [Ball↑] [Free fall] │ [⟲±] │ ~48px
├──────────────────────────────────┬──────────────────────────────────┤
│                                  │ READOUTS (sign-coloured)         │
│  CANVAS (motion track)           │  s = +15 m  → distance = 15 m   │
│  • Horizontal track line         │  v = +2 m/s → speed = 2 m/s     │
│  • Ball/cart with velocity arrow │  a = −2 m/s²                    │
│  • Axis arrow showing + dir      │  t = 3.0 s                      │
│  • Turning-point label at v=0    │──────────────────────────────────│
│                                  │ LIVE EQUATIONS                   │
│                                  │  v = u + at                     │
│                                  │    = (+8) + (−2)(3) = +2 m/s   │
│                                  │  s = ut + ½at²                 │
│                                  │    = (+8)(3)+½(−2)(9) = +15 m  │
├──────────────────────────────────┴──────────────────────────────────┤
│  [x–t graph]        [v–t graph]        [a–t graph]                 │ ~140px
├─────────────────────────────────────────────────────────────────────┤
│  u: [━━━━━●━━━━━] +8   a: [━━━━━━●━━━] −2   [▶ Play] [↺ Reset]   │
│  Time: [━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━] t = 3.0 s         │
└─────────────────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: HTML skeleton + CSS theme
- Standard Trinity shell: `.shell > .scroll-panel > .content > .lab-shell`
- Custom dark-navy CSS variables
- Grid layout for stage-content (canvas left, readouts right)
- Graph strip with three `<canvas>` elements
- Actions strip with sliders and buttons
- Responsive `@media` for mobile (stack vertically, allow scroll)

### Step 2: Physics engine (JS)
```
state = {
  u: 8,           // initial velocity (signed, in current convention)
  a: -2,          // acceleration (signed, in current convention)
  t: 0,           // current time
  playing: false,
  positiveRight: true,  // axis direction
  maxTime: 10,
  turningPointLabeled: false,
  pauseAtTurning: 0,    // countdown for turning-point pause
}
```

Core functions:
- `velocity(t) = u + a * t`
- `displacement(t) = u * t + 0.5 * a * t²`
- `distanceTraveled(t)`: compute turning point `t_turn = -u/a`, if within [0,t] sum absolute segments
- `speed(t) = |velocity(t)|`
- `flipAxis()`: negate u and a, toggle positiveRight, recompute

### Step 3: Canvas rendering — motion track
- Draw track line across canvas
- Draw axis arrow (always visible) with "+" label and direction indicator
- Draw ball/cart at position derived from `displacement(t)` mapped to pixels
- Draw velocity vector arrow on the object: direction from sign of v, length proportional to |v|
- At turning point (v ≈ 0): pause animation ~1s, draw label "v = 0, a ≠ 0"
- Grid background matching existing sim pattern

### Step 4: Readouts panel (HTML, updated each frame)
- Each quantity shown twice:
  - Signed value with sign-colour (gold if ≥ 0, cyan if < 0)
  - Magnitude counterpart: "speed = |v|", "distance = total path"
- Time always shown as positive
- Format: `+8.0` or `−2.0` with explicit sign

### Step 5: Live equation panel
- Two equations displayed with real-time numeric substitution
- `v = u + at` → `v = (+8) + (−2)(3.0) = +2.0 m/s`
- `s = ut + ½at²` → `s = (+8)(3.0) + ½(−2)(3.0)² = +15.0 m`
- Numbers colour-coded by sign
- Updates every animation frame

### Step 6: Three synchronized graphs (canvas-based)
- **x–t**: Plots `s(t) = ut + ½at²` — parabola. Bold zero line.
- **v–t**: Plots `v(t) = u + at` — straight line. Bold zero line.
- **a–t**: Plots `a(t) = a` — horizontal line. Bold zero line.
- Current time shown as vertical marker line
- Trail drawn up to current time
- Axes labeled, sign-coloured grid lines
- Auto-scaling Y axis based on max values in [0, maxTime]

### Step 7: Controls
- **u slider**: range −25 to +25, step 0.5
- **a slider**: range −15 to +15, step 0.1
- **Play/Pause button**: starts/stops animation loop
- **Reset button**: resets t=0, stops playback
- **Timeline scrubber**: range 0 to maxTime, updates t directly

### Step 8: Preset scenarios (buttons in header)
Each sets u, a, maxTime, and a teaching caption:

| Preset | u | a | maxTime | Caption |
|--------|---|---|---------|---------|
| Braking car | +20 | −4 | 10 | "Deceleration: a opposes u. No special rule needed." |
| Reversing | −5 | +2 | 10 | "Moving −, accel +. Speed drops, stops, reverses." |
| Ball thrown up | +15 | −9.8 | 4 | "One constant a = −9.8 handles ascent AND descent." |
| Free fall down | −5 | −9.8 | 3 | "Both negative. Speed increases. No sign flip." |

### Step 9: Flip axis feature
- Toggle button in header: "Flip ± direction"
- On click: `u → −u`, `a → −a`, `positiveRight → !positiveRight`
- All readouts, equations, graphs instantly re-sign
- Canvas motion stays identical (same pixel positions)
- Caption appears: "Same physics. Opposite signs. The choice of axis is yours — just be consistent."

### Step 10: Edge cases
- **a = 0**: Uniform motion. v stays constant, s is linear.
- **v = 0 instant**: Pause ~1s, label "v = 0 (turning point), a ≠ 0"
- **Direction reversal**: Velocity arrow shrinks to zero then grows opposite.
- **Object off-track**: Clamp display position, continue computing values.

### Step 11: Animation loop
- `requestAnimationFrame` based
- Exact kinematics (no integration error)
- During playback: increment t by dt (capped at 1/30s)
- Check for turning-point pause
- Update all DOM readouts, equation panel, and graphs each frame
- Stop at maxTime

### Step 12: Mobile responsive
- Stack layout vertically on narrow screens
- Canvas gets fixed height (300px)
- Graphs reduce height
- Controls wrap
- Allow vertical scroll on mobile (single scroll owner: `.scroll-panel`)

## Verification
1. Run `npm run check:simulation-chrome` — must pass
2. Open in browser, test each preset scenario
3. Test flip axis: verify motion stays identical, all signs flip
4. Test edge cases: a=0, v=0 turning point, direction reversal
5. Test timeline scrubber: drag to any time, verify readouts match
6. Test on iPad landscape viewport (1194×834)
7. Test mobile viewport (390×844)
