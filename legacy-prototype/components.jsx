// Shared components for Trinity Simulation Lab
// Use React hooks via React.* in this file to avoid scope clashes with inline scripts

// Inline SVG icon set
const Icon = ({ name, size = 18, stroke = 1.5 }) => {
  const s = size;
  const common = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'search': return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'user': return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case 'arrow-right': return <svg {...common}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>;
    case 'play': return <svg {...common} fill="currentColor" stroke="none"><path d="M7 5v14l12-7z"/></svg>;
    case 'pause': return <svg {...common} fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>;
    case 'reset': return <svg {...common}><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>;
    case 'filter': return <svg {...common}><path d="M4 5h16"/><path d="M7 12h10"/><path d="M10 19h4"/></svg>;
    case 'grid': return <svg {...common}><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>;
    case 'list': return <svg {...common}><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>;
    case 'settings': return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>;
    case 'sparkle': return <svg {...common}><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></svg>;
    case 'book': return <svg {...common}><path d="M4 4v16a2 2 0 0 1 2-2h14V4H6a2 2 0 0 0-2 2z"/><path d="M8 4v14"/></svg>;
    default: return null;
  }
};

// Topnav
const TopNav = ({ current = 'home', onNav }) => (
  <nav className="topnav">
    <a href="home.html" className="logo" onClick={(e) => { if (onNav) { e.preventDefault(); onNav('home'); } }}>
      <span className="logo-mark swing" aria-hidden="true"></span>
      <span>Trinity<span style={{ fontStyle: 'normal', fontFamily: 'var(--mono)', fontSize: 11, marginLeft: 8, letterSpacing: '0.12em', color: 'var(--ink-mute)' }}>SIM LAB</span></span>
    </a>
    <div className="navlinks">
      {['home','simulations','subjects','for teachers','help'].map(k => (
        <a key={k} href={k==='simulations' ? 'catalog.html' : '#'}
           onClick={(e) => { if (onNav && (k==='home'||k==='simulations')) { e.preventDefault(); onNav(k==='simulations'?'simulations':'home'); } }}
           className={current === k || (current==='simulations' && k==='simulations') ? 'active' : ''}>
          {k.charAt(0).toUpperCase() + k.slice(1)}
        </a>
      ))}
    </div>
    <div className="navactions">
      <button className="iconbtn" aria-label="Search"><Icon name="search" size={16} /></button>
      <button className="btn small ghost">Student login</button>
      <button className="btn small">Admin</button>
    </div>
  </nav>
);

// Footer
const Footer = () => (
  <footer style={{ borderTop: '1px solid var(--rule-soft)', marginTop: 96, padding: '48px 0 32px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: 40, alignItems: 'start' }}>
      <div>
        <div className="logo">
          <span className="logo-mark" aria-hidden="true"></span>
          <span>Trinity</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--ink-mute)', lineHeight: 1.55, marginTop: 16, maxWidth: 280 }}>
          A minimal lab for curious high-school students. Understand a concept by playing with it.
        </p>
      </div>
      {[
        ['Subjects', ['Physics', 'Chemistry', 'Biology', 'Math']],
        ['Product', ['Simulations', 'For teachers', 'Classroom mode', 'Changelog']],
        ['Account', ['Student login', 'Admin', 'Help centre', 'Contact']],
      ].map(([h, items]) => (
        <div key={h}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>{h}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            {items.map(i => <li key={i}><a href="#" style={{ color: 'var(--ink-soft)' }}>{i}</a></li>)}
          </ul>
        </div>
      ))}
    </div>
    <div style={{ borderTop: '1px solid var(--rule-soft)', marginTop: 40, paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      <span>© 2026 Trinity Simulation Lab</span>
      <span>v0.3 — Built for curiosity</span>
    </div>
  </footer>
);

// Sim card placeholder "thumb"
const SimThumb = ({ subject, title, variant = 0 }) => {
  // Decorative, abstract representation per subject
  const subjectColor = {
    Physics: 'var(--ink)',
    Chemistry: 'var(--ink)',
    Biology: 'var(--ink)',
    Math: 'var(--ink)',
  }[subject] || 'var(--ink)';

  return (
    <div className="thumb">
      <div className="stripes" />
      <div style={{ position: 'absolute', inset: 0, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="label-mono" style={{ background: 'var(--paper)', padding: '3px 7px', border: '1px solid var(--ink)' }}>
            {subject}
          </span>
          <span className="label-mono" style={{ color: 'var(--ink-mute)' }}>SIM·{String(variant+1).padStart(2, '0')}</span>
        </div>
        <SimGlyph subject={subject} variant={variant} />
        <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 24, lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          {title}
        </div>
      </div>
    </div>
  );
};

// Per-subject abstract glyph (no hand-drawn illustration — geometric only)
const SimGlyph = ({ subject, variant }) => {
  const stroke = 'var(--ink)';
  // Physics — pendulum
  if (subject === 'Physics') {
    return (
      <svg viewBox="0 0 200 140" width="100%" style={{ maxHeight: 120 }}>
        <line x1="20" y1="20" x2="180" y2="20" stroke={stroke} strokeWidth="1.2"/>
        {[0.2, 0.5, 0.8].map((t, i) => {
          const angle = (i - 1) * 0.5 + (variant * 0.1);
          const len = 90 - i * 10;
          const x = 100 + Math.sin(angle) * len;
          const y = 20 + Math.cos(angle) * len;
          return (
            <g key={i} opacity={i === 1 ? 1 : 0.25}>
              <line x1="100" y1="20" x2={x} y2={y} stroke={stroke} strokeWidth="1"/>
              <circle cx={x} cy={y} r={i === 1 ? 9 : 6} fill={i === 1 ? stroke : 'none'} stroke={stroke} strokeWidth="1"/>
            </g>
          );
        })}
      </svg>
    );
  }
  // Chemistry — beaker with level rings
  if (subject === 'Chemistry') {
    return (
      <svg viewBox="0 0 200 140" width="100%" style={{ maxHeight: 120 }}>
        <path d="M70 20 L70 55 L45 120 Q45 130 55 130 L145 130 Q155 130 155 120 L130 55 L130 20" fill="none" stroke={stroke} strokeWidth="1.2"/>
        <line x1="62" y1="20" x2="138" y2="20" stroke={stroke} strokeWidth="2"/>
        <line x1="58" y1="95" x2="142" y2="95" stroke={stroke} strokeWidth="1" strokeDasharray="3 3"/>
        <line x1="55" y1="110" x2="145" y2="110" stroke={stroke} strokeWidth="1" strokeDasharray="3 3"/>
        <circle cx="85" cy="115" r="2" fill={stroke}/>
        <circle cx="115" cy="112" r="2" fill={stroke}/>
        <circle cx="100" cy="120" r="1.5" fill={stroke}/>
      </svg>
    );
  }
  // Biology — cell / circle divisions
  if (subject === 'Biology') {
    return (
      <svg viewBox="0 0 200 140" width="100%" style={{ maxHeight: 120 }}>
        <circle cx="70" cy="70" r="48" fill="none" stroke={stroke} strokeWidth="1.2"/>
        <circle cx="70" cy="70" r="14" fill={stroke}/>
        <circle cx="135" cy="55" r="24" fill="none" stroke={stroke} strokeWidth="1"/>
        <circle cx="135" cy="55" r="7" fill={stroke}/>
        <circle cx="155" cy="100" r="16" fill="none" stroke={stroke} strokeWidth="1"/>
        <circle cx="155" cy="100" r="5" fill={stroke}/>
      </svg>
    );
  }
  // Math — coordinate grid with curve
  if (subject === 'Math') {
    return (
      <svg viewBox="0 0 200 140" width="100%" style={{ maxHeight: 120 }}>
        {[0,1,2,3,4].map(i => <line key={'v'+i} x1={20+i*40} y1="15" x2={20+i*40} y2="125" stroke={stroke} strokeWidth="0.5" opacity="0.3"/>)}
        {[0,1,2,3].map(i => <line key={'h'+i} x1="20" y1={15+i*37} x2="180" y2={15+i*37} stroke={stroke} strokeWidth="0.5" opacity="0.3"/>)}
        <path d="M20 110 Q 60 20, 100 70 T 180 30" fill="none" stroke={stroke} strokeWidth="1.5"/>
        <line x1="20" y1="125" x2="180" y2="125" stroke={stroke} strokeWidth="1.2"/>
        <line x1="20" y1="15" x2="20" y2="125" stroke={stroke} strokeWidth="1.2"/>
      </svg>
    );
  }
  return null;
};

// ScatterGlyphs — decorative physics/chem symbols in background
const ScatterGlyphs = ({ density = 6, dark = false }) => {
  const stroke = dark ? 'var(--dark-ink)' : 'var(--ink)';
  const glyphs = [
    (k, o) => <circle key={k} r="4" fill="none" stroke={stroke} strokeWidth="1" opacity={o}/>,
    (k, o) => <g key={k} opacity={o}><line x1="-8" y1="0" x2="8" y2="0" stroke={stroke} strokeWidth="0.8"/><circle cx="8" cy="0" r="2.5" fill={stroke}/></g>, // pendulum
    (k, o) => <g key={k} opacity={o}><circle cx="0" cy="0" r="3" fill={stroke}/><ellipse cx="0" cy="0" rx="9" ry="3" fill="none" stroke={stroke} strokeWidth="0.7"/><ellipse cx="0" cy="0" rx="9" ry="3" fill="none" stroke={stroke} strokeWidth="0.7" transform="rotate(60)"/></g>, // atom
    (k, o) => <g key={k} opacity={o}><path d="M-6 -6 L6 -6 L3 0 L6 8 L-6 8 L-3 0 Z" fill="none" stroke={stroke} strokeWidth="0.8"/></g>, // flask
  ];
  // Deterministic positions
  const positions = [
    [8, 12], [18, 72], [88, 8], [92, 62], [5, 40], [72, 20],
    [30, 88], [60, 92], [42, 6], [95, 30], [12, 92], [82, 84],
  ].slice(0, density);
  return (
    <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {positions.map(([x, y], i) => (
        <g key={i} transform={`translate(${x}% ${y}%) rotate(${(i*37) % 360})`}>
          {glyphs[i % glyphs.length](i, 0.35)}
        </g>
      ))}
    </svg>
  );
};

// Tweaks panel
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "teal",
  "density": "comfortable",
  "serif": "instrument",
  "darkInvert": false
}/*EDITMODE-END*/;

const ACCENT_MAP = {
  teal: 'oklch(0.52 0.12 200)',
  ink: 'oklch(0.30 0.02 240)',
  moss: 'oklch(0.58 0.09 140)',
  cobalt: 'oklch(0.48 0.14 250)',
  crimson: 'oklch(0.55 0.18 25)',
};

const SERIF_MAP = {
  instrument: "'Playfair Display', Georgia, serif",
  cormorant: "'Cormorant Garamond', Georgia, serif",
  ibmplex: "'IBM Plex Serif', Georgia, serif",
};

const TweaksPanel = () => {
  const [on, setOn] = React.useState(false);
  const [vals, setVals] = React.useState(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setOn(true);
      if (e.data?.type === '__deactivate_edit_mode') setOn(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', ACCENT_MAP[vals.accent]);
    document.documentElement.style.setProperty('--serif', SERIF_MAP[vals.serif]);
    document.body.dataset.density = vals.density;
    document.body.dataset.darkInvert = String(vals.darkInvert);
  }, [vals]);

  const set = (k, v) => {
    const next = { ...vals, [k]: v };
    setVals(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };

  return (
    <div className={`tweaks-panel ${on ? 'on' : ''}`}>
      <h4>Tweaks</h4>
      <div className="tweaks-row">
        <span className="label-mono">Accent</span>
        <div className="swatches">
          {Object.entries(ACCENT_MAP).map(([k, v]) => (
            <span key={k} className={`swatch ${vals.accent === k ? 'on' : ''}`}
                  style={{ background: v }} onClick={() => set('accent', k)} />
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <span className="label-mono">Serif</span>
        <select value={vals.serif} onChange={e => set('serif', e.target.value)}
                style={{ border: '1px solid var(--ink)', background: 'transparent', padding: '4px 8px', fontFamily: 'var(--mono)', fontSize: 11 }}>
          <option value="instrument">Playfair</option>
          <option value="cormorant">Cormorant</option>
          <option value="ibmplex">IBM Plex Serif</option>
        </select>
      </div>
      <div className="tweaks-row">
        <span className="label-mono">Density</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['cozy','comfortable','airy'].map(d => (
            <button key={d} onClick={() => set('density', d)}
                    className={`chip ${vals.density === d ? 'active' : ''}`}
                    style={{ fontSize: 10, padding: '3px 8px' }}>{d}</button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <span className="label-mono">Dark section</span>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontFamily: 'var(--mono)', fontSize: 11 }}>
          <input type="checkbox" checked={vals.darkInvert} onChange={e => set('darkInvert', e.target.checked)} />
          invert
        </label>
      </div>
    </div>
  );
};

Object.assign(window, {
  Icon, TopNav, Footer, SimThumb, SimGlyph, ScatterGlyphs, TweaksPanel,
});
