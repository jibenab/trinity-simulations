export const STUB_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        --dark: #0C1115;
        --dark-ink: #EFF2F5;
        --dark-mute: #7F8892;
        --accent: oklch(0.52 0.12 200);
        --mono: "JetBrains Mono", monospace;
        --sans: Manrope, sans-serif;
      }
      * { box-sizing: border-box; }
      html, body { margin: 0; min-height: 100%; font-family: var(--sans); background: var(--dark); color: var(--dark-ink); }
    </style>
  </head>
  <body>
    <main style="min-height:100vh;display:grid;place-items:center;padding:24px;">
      <section style="width:min(560px,100%);border:1px solid #2A2A2A;border-radius:4px;padding:28px;background:rgba(255,255,255,0.02);">
        <div style="font-family:var(--mono);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--dark-mute);">Simulation scaffold</div>
        <h1 style="margin:16px 0 0;font-size:32px;line-height:1;">Coming soon</h1>
        <p style="margin:18px 0 0;color:var(--dark-mute);line-height:1.6;">This entry is seeded in the catalog and ready to be replaced from the admin editor with pasted HTML or JSX.</p>
      </section>
    </main>
    <script>
      parent.postMessage({ type: "ready" }, "*");
    </script>
  </body>
</html>`;

export const PENDULUM_CODE = `
const App = () => {
  const [playing, setPlaying] = React.useState(true);
  const [length, setLength] = React.useState(0.9);
  const [gravity, setGravity] = React.useState(9.8);
  const [t, setT] = React.useState(0);
  const rafRef = React.useRef(null);
  const lastRef = React.useRef(performance.now());

  React.useEffect(() => {
    const tick = (now) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      if (playing) setT((prev) => prev + dt);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const L = 1 + length * 2;
  const omega = Math.sqrt(gravity / L);
  const amplitude = 0.5;
  const angle = amplitude * Math.cos(omega * t);
  const period = (2 * Math.PI) / omega;

  const W = 760;
  const H = 480;
  const pivotX = W / 2;
  const pivotY = 56;
  const pxPerM = (H - 110) / 3;
  const bobX = pivotX + Math.sin(angle) * L * pxPerM;
  const bobY = pivotY + Math.cos(angle) * L * pxPerM;

  return (
    <div style={{ minHeight: "100vh", background: "var(--dark)", color: "var(--dark-ink)", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--dark-mute)" }}>Simulation · Physics</div>
          <h1 style={{ margin: "10px 0 0", fontSize: 32, lineHeight: 1, fontWeight: 600 }}>Simple Pendulum</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setPlaying((value) => !value)} style={{ width: 42, height: 42, borderRadius: 999, border: "1px solid #EFF2F5", background: "transparent", color: "#EFF2F5" }}>
            {playing ? "II" : "▶"}
          </button>
          <button onClick={() => { setT(0); lastRef.current = performance.now(); }} style={{ width: 42, height: 42, borderRadius: 999, border: "1px solid #EFF2F5", background: "transparent", color: "#EFF2F5" }}>
            ↺
          </button>
        </div>
      </div>

      <div style={{ border: "1px solid #2A2A2A", borderRadius: 4, overflow: "hidden", background: "var(--dark)" }}>
        <svg viewBox={\`0 0 \${W} \${H}\`} width="100%" height="100%">
          {Array.from({ length: 8 }).map((_, index) => (
            <line key={\`gy-\${index}\`} x1="0" y1={index * (H / 8)} x2={W} y2={index * (H / 8)} stroke="#2A2A2A" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 12 }).map((_, index) => (
            <line key={\`gx-\${index}\`} x1={index * (W / 12)} y1="0" x2={index * (W / 12)} y2={H} stroke="#2A2A2A" strokeWidth="0.5" />
          ))}
          <line x1={pivotX - 90} y1={pivotY - 10} x2={pivotX + 90} y2={pivotY - 10} stroke="var(--dark-ink)" strokeWidth="1.5" />
          {Array.from({ length: 10 }).map((_, index) => (
            <line key={\`hatch-\${index}\`} x1={pivotX - 80 + index * 18} y1={pivotY - 10} x2={pivotX - 86 + index * 18} y2={pivotY - 20} stroke="var(--dark-ink)" strokeWidth="1" />
          ))}
          <path
            d={\`M \${pivotX - Math.sin(amplitude) * L * pxPerM} \${pivotY + Math.cos(amplitude) * L * pxPerM} A \${L * pxPerM} \${L * pxPerM} 0 0 0 \${pivotX + Math.sin(amplitude) * L * pxPerM} \${pivotY + Math.cos(amplitude) * L * pxPerM}\`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            strokeDasharray="2 4"
            opacity="0.55"
          />
          <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="var(--dark-ink)" strokeWidth="1.2" />
          <circle cx={bobX} cy={bobY} r="18" fill="var(--accent)" stroke="var(--dark-ink)" strokeWidth="1" />
          <circle cx={pivotX} cy={pivotY} r="3.5" fill="var(--dark-ink)" />
          <text x="18" y="28" fill="var(--dark-mute)" fontFamily="var(--mono)" fontSize="11" letterSpacing="0.08em">θ  {(angle * 180 / Math.PI).toFixed(1)}°</text>
          <text x="18" y="46" fill="var(--dark-mute)" fontFamily="var(--mono)" fontSize="11" letterSpacing="0.08em">T  {period.toFixed(2)}s</text>
        </svg>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mute)" }}>
            <span>Length</span>
            <span>{L.toFixed(1)} m</span>
          </span>
          <input type="range" min="0" max="1" step="0.01" value={length} onChange={(event) => setLength(Number(event.target.value))} style={{ accentColor: "var(--accent)" }} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mute)" }}>
            <span>Gravity</span>
            <span>{gravity.toFixed(1)} m/s²</span>
          </span>
          <input type="range" min="1.6" max="24.8" step="0.1" value={gravity} onChange={(event) => setGravity(Number(event.target.value))} style={{ accentColor: "var(--accent)" }} />
        </label>
      </div>
    </div>
  );
};
`;

export const seedContent = [
  {
    slug: "pendulum",
    type: "simulation",
    title: "Simple Pendulum",
    subject: "Physics",
    grade: "Class 11",
    chapter: "Oscillations",
    level: "Intro",
    minutes: 12,
    concepts: ["Period", "Gravity", "Harmonic motion"],
    prompt: "Try halving the length. What happens to the period?",
    featured: true,
    code: PENDULUM_CODE,
  },
  {
    slug: "projectile",
    type: "simulation",
    title: "Projectile Motion",
    subject: "Physics",
    grade: "Class 11",
    chapter: "Motion in a Plane",
    level: "Core",
    minutes: 15,
    concepts: ["Trajectory", "Vectors"],
    featured: false,
    code: STUB_HTML,
  },
  {
    slug: "springs",
    type: "simulation",
    title: "Mass on a Spring",
    subject: "Physics",
    grade: "Class 11",
    chapter: "Oscillations",
    level: "Core",
    minutes: 10,
    concepts: ["Hookes Law", "Oscillation"],
    featured: false,
    code: STUB_HTML,
  },
  {
    slug: "circuit",
    type: "simulation",
    title: "Ohms Law Circuit",
    subject: "Physics",
    grade: "Class 10",
    chapter: "Electricity",
    level: "Intro",
    minutes: 9,
    concepts: ["Voltage", "Resistance"],
    featured: false,
    code: STUB_HTML,
  },
  {
    slug: "titration",
    type: "simulation",
    title: "Acid Base Titration",
    subject: "Chemistry",
    grade: "Class 11",
    chapter: "Equilibrium",
    level: "Core",
    minutes: 18,
    concepts: ["pH", "Equivalence point"],
    featured: true,
    code: STUB_HTML,
  },
  {
    slug: "gaslaw",
    type: "simulation",
    title: "Ideal Gas Laws",
    subject: "Chemistry",
    grade: "Class 11",
    chapter: "States of Matter",
    level: "Intro",
    minutes: 11,
    concepts: ["Pressure", "Volume", "Temperature"],
    featured: false,
    code: STUB_HTML,
  },
  {
    slug: "reaction",
    type: "simulation",
    title: "Reaction Rates",
    subject: "Chemistry",
    grade: "Class 12",
    chapter: "Chemical Kinetics",
    level: "Advanced",
    minutes: 14,
    concepts: ["Kinetics", "Catalysts"],
    featured: false,
    code: STUB_HTML,
  },
  {
    slug: "punnett",
    type: "simulation",
    title: "Punnett Squares",
    subject: "Biology",
    grade: "Class 10",
    chapter: "Heredity & Evolution",
    level: "Intro",
    minutes: 8,
    concepts: ["Genetics", "Inheritance"],
    featured: false,
    code: STUB_HTML,
  },
  {
    slug: "osmosis",
    type: "simulation",
    title: "Osmosis & Diffusion",
    subject: "Biology",
    grade: "Class 11",
    chapter: "Transport in Plants",
    level: "Core",
    minutes: 12,
    concepts: ["Membranes", "Gradients"],
    featured: true,
    code: STUB_HTML,
  },
  {
    slug: "transport-of-sperm",
    type: "simulation",
    title: "Transport of Sperm",
    subject: "Biology",
    grade: "Class 12",
    chapter: "Human Reproduction",
    level: "Core",
    minutes: 12,
    concepts: [
      "Seminiferous tubules",
      "Epididymis",
      "Vas deferens",
      "Seminal vesicle",
      "Prostate gland",
    ],
    prompt:
      "Trace the route. When does the sperm become strongly motile, and which gland protects the urethra first?",
    featured: false,
    code: STUB_HTML,
  },
  {
    slug: "enzyme",
    type: "simulation",
    title: "Enzyme Kinetics",
    subject: "Biology",
    grade: "Class 12",
    chapter: "Biomolecules",
    level: "Advanced",
    minutes: 16,
    concepts: ["Catalysis", "Substrate"],
    featured: false,
    code: STUB_HTML,
  },
  {
    slug: "functions",
    type: "simulation",
    title: "Graphing Functions",
    subject: "Math",
    grade: "Class 10",
    chapter: "Coordinate Geometry",
    level: "Intro",
    minutes: 10,
    concepts: ["Linear", "Quadratic", "Trig"],
    featured: false,
    code: STUB_HTML,
  },
  {
    slug: "calculus",
    type: "simulation",
    title: "Derivatives Visualised",
    subject: "Math",
    grade: "Class 12",
    chapter: "Continuity & Differentiability",
    level: "Advanced",
    minutes: 14,
    concepts: ["Slope", "Tangents"],
    featured: true,
    code: STUB_HTML,
  },
  {
    slug: "vectors",
    type: "simulation",
    title: "Vector Addition",
    subject: "Math",
    grade: "Class 11",
    chapter: "Vector Algebra",
    level: "Core",
    minutes: 9,
    concepts: ["Head-to-tail", "Components"],
    featured: false,
    code: STUB_HTML,
  },
] as const;
