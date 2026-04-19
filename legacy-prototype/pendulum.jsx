// Live pendulum preview — SVG-driven simple harmonic motion
const PendulumPreview = ({ tall = false }) => {
  const [playing, setPlaying] = React.useState(true);
  const [length, setLength] = React.useState(0.9); // 0..1
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

  // Pendulum physics: angle = A * cos(sqrt(g/L) * t)
  const L = 1 + length * 2; // 1..3 m
  const omega = Math.sqrt(gravity / L);
  const amplitude = 0.5; // radians
  const angle = amplitude * Math.cos(omega * t);

  const W = 420, H = tall ? 340 : 260;
  const pivotX = W / 2, pivotY = 30;
  const pxPerM = (H - 80) / 3;
  const bobX = pivotX + Math.sin(angle) * L * pxPerM;
  const bobY = pivotY + Math.cos(angle) * L * pxPerM;

  const period = (2 * Math.PI) / omega;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dark-mute)' }}>Simulation of the week</div>
          <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 6 }}>Simple Pendulum</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'}
                  style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid var(--dark-ink)', color: 'var(--dark-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={playing ? 'pause' : 'play'} size={16} />
          </button>
          <button onClick={() => { setT(0); lastRef.current = performance.now(); }} aria-label="Reset"
                  style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid var(--dark-ink)', color: 'var(--dark-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="reset" size={16} />
          </button>
        </div>
      </div>

      <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 4, position: 'relative', overflow: 'hidden', flex: 1, minHeight: H }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          {/* grid */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={'gy'+i} x1="0" y1={i * (H/8)} x2={W} y2={i * (H/8)} stroke="#2A2A2A" strokeWidth="0.5"/>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={'gx'+i} x1={i * (W/12)} y1="0" x2={i * (W/12)} y2={H} stroke="#2A2A2A" strokeWidth="0.5"/>
          ))}
          {/* ceiling */}
          <line x1={pivotX - 60} y1={pivotY - 6} x2={pivotX + 60} y2={pivotY - 6} stroke="var(--dark-ink)" strokeWidth="1.5"/>
          {Array.from({length: 8}).map((_, i) => (
            <line key={'hatch'+i} x1={pivotX - 56 + i * 16} y1={pivotY - 6} x2={pivotX - 62 + i * 16} y2={pivotY - 14} stroke="var(--dark-ink)" strokeWidth="1"/>
          ))}
          {/* path arc */}
          <path d={`M ${pivotX - Math.sin(amplitude) * L * pxPerM} ${pivotY + Math.cos(amplitude) * L * pxPerM} A ${L*pxPerM} ${L*pxPerM} 0 0 0 ${pivotX + Math.sin(amplitude) * L * pxPerM} ${pivotY + Math.cos(amplitude) * L * pxPerM}`}
                fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 4" opacity="0.5"/>
          {/* rod */}
          <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="var(--dark-ink)" strokeWidth="1.2"/>
          {/* bob */}
          <circle cx={bobX} cy={bobY} r="12" fill="var(--accent)" stroke="var(--dark-ink)" strokeWidth="1"/>
          {/* pivot */}
          <circle cx={pivotX} cy={pivotY} r="3" fill="var(--dark-ink)"/>
          {/* angle readout */}
          <text x="14" y="22" fill="var(--dark-mute)" fontFamily="var(--mono)" fontSize="10" letterSpacing="0.1em">θ  {(angle * 180 / Math.PI).toFixed(1)}°</text>
          <text x="14" y="38" fill="var(--dark-mute)" fontFamily="var(--mono)" fontSize="10" letterSpacing="0.1em">T  {period.toFixed(2)}s</text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dark-mute)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Length</span><span>{L.toFixed(1)} m</span>
          </span>
          <input type="range" min="0" max="1" step="0.01" value={length} onChange={e => setLength(parseFloat(e.target.value))} style={{ accentColor: 'var(--accent)' }}/>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dark-mute)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Gravity</span><span>{gravity.toFixed(1)} m/s²</span>
          </span>
          <input type="range" min="1.6" max="24.8" step="0.1" value={gravity} onChange={e => setGravity(parseFloat(e.target.value))} style={{ accentColor: 'var(--accent)' }}/>
        </label>
      </div>
    </div>
  );
};

window.PendulumPreview = PendulumPreview;
