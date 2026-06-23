# Integer Arithmetic Lab — Design Spec

Date: 2026-06-23
Status: Approved (design), pending spec review

## Goal

A timed arithmetic game for high-school students to practice **addition and
subtraction of integers**, modelled on `simulation/round-off.html`. Two modes:

- **Practice** — ~10 freshly generated questions, untimed, private.
- **Leaderboard** — 180-second total countdown; solve as many as possible;
  reports the score to the parent Trinity app.

Questions are generated on the fly so they are new every run.

## Decisions (locked)

| Topic | Decision |
|---|---|
| Answer input | On-screen number pad (digits, sign toggle, backspace, Enter) + physical keyboard |
| Number range | Signed integers, each operand in −99…99 (two-digit max) |
| Operators | `+` and `−`, chosen randomly ~50/50 |
| Practice timer | Untimed |
| Leaderboard timer | 180 s total |
| Wrong answer | No penalty; flash red, record miss, advance (no retry) |
| Scoring submit | Leaderboard only; Practice stays private |
| Leaderboard value | `correctCount` via `parent.postMessage({type:'score', value}, '*')` |

## File

`simulation/integer-arithmetic.html` — single self-contained file, React 18 +
Babel standalone via CDN (same script tags as `round-off.html`). No app-level
nav/footer chrome. Follows the tcl-sim-lab 4-zone simulation anatomy.

Reuses the `<style>` block from `round-off.html` (design tokens + base) and adds
keypad-specific rules. All colors via `var(--token)` — no hardcoded hex in
component CSS.

## Question generator

```
genQuestion():
  a = randInt(-99, 99)
  b = randInt(-99, 99)
  op = random('+', '-')
  answer = op === '+' ? a + b : a - b
  return { a, b, op, answer, display: formatted with parens around negatives }
```

- Negatives shown in parentheses: `(−45) + 67`, `23 − (−18)`, `−56 − 14`
  (a leading negative needs no parens; an operand following an operator does).
- Uses the Unicode minus `−` (U+2212) for display, ASCII `-` internally.
- No distractor/answer bank is needed (number-pad input).

## Modes

Top-level menu replaces round-off's dp/sf/mixed chips with two chips:
**Practice** and **Leaderboard**.

### Practice
- Generates a queue of **10** questions up front (or generates lazily — either is
  fine since each is independent).
- Untimed. Header readouts: `Question N/10`, `Score`.
- After the 10th, go to result screen. Does **not** post a score.

### Leaderboard
- `timeLeft` starts at **180 s**, decremented every second by a single interval.
- Endless stream: a fresh `genQuestion()` after each answer.
- Header readouts: `Time M:SS`, `Solved` (correct count), optionally `Attempts`.
- On `timeLeft <= 0`: stop, go to result screen, fire
  `parent.postMessage({ type: 'score', value: correctCount }, '*')` exactly once
  (guard with a `reportedRef`).

## Answer interaction (number pad)

- Stage shows the equation with an input slot: `(−45) + 67 = [ __ ]`.
- The slot's current text is the single **accent**-colored element on the stage.
- Keypad (zone 3, where round-off's options-grid sits): `7 8 9 / 4 5 6 / 1 2 3 /
  ± 0 ⌫` plus a full-width **Enter**. All keys ≥ 44 px touch targets.
  - `±` toggles the sign of the current entry.
  - `⌫` backspace.
  - Empty Enter is ignored.
- Physical keyboard wired: digits 0–9, `-` (toggle sign), Backspace, Enter.
- On Enter:
  - **Correct** → slot flashes `--accent`; +1 score; next question after ~500 ms.
  - **Wrong** → slot flashes ink/red; record miss; advance after ~500 ms (no
    retry, no negative score).
- Brief lock during the ~500 ms flash so input can't double-fire.

## Result screen

Reuses round-off's `result-layout` (left summary / right scrollable review):

- **Practice:** `Score N/10`, Retry button (restarts Practice). Review list of
  each question with `your answer` vs `correct answer`.
- **Leaderboard:** `Solved N`, note that the score was sent to the leaderboard,
  Retry button (restarts a new 180 s run). Review list of all attempts.

## Layout & styling

- Header strip: eyebrow `SIMULATION · MATH`, title **Integer Arithmetic**
  (`.display`, 38 px), reset icon button → back to menu.
- Stage on `--dark` with faint 0.5px grid; mono readouts top-left, values in
  `--dark-ink`.
- Prompt (zone 4): *"Watch the signs — subtracting a negative adds."* (no emoji,
  no exclamation).
- Page-level scroll locked (`html, body` 100dvh, overflow hidden,
  overscroll-behavior none); internal scrolling contained in `.scroll-panel`.
- Responsive: keypad grid stays 3-wide; verify at 1194×834 and 375×667.

## Catalog (secondary)

Add a `SIMS` entry in `data.jsx` (id `integer-arithmetic`, subject Math, level,
minutes, concepts: integers, addition, subtraction) so it appears in the catalog.
Math glyph already exists in `SimGlyph` — no new case needed.

## Out of scope (YAGNI)

- Multiple difficulty levels / range selection.
- XP, streaks, combo multipliers.
- localStorage high scores (leaderboard handled by parent app).
- Distractor generation (no MCQ).

## Verification checklist

- [ ] New question every time (generator, not fixed list).
- [ ] Signed integers, each operand within −99…99.
- [ ] Practice = 10 questions, untimed, no score posted.
- [ ] Leaderboard = 180 s, endless, posts `{type:'score', value:correctCount}` once.
- [ ] Number pad + physical keyboard both work, incl. sign toggle.
- [ ] Wrong answer: no penalty, advances.
- [ ] tcl-sim-lab tokens only; accent only on the live input slot.
- [ ] Works at 1194×834 and 375×667; page scroll locked.
