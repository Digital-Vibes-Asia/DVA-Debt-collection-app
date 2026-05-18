// Tweaks panel — accent, density, mobile companion

function useTweaks(defaults) {
  const [tweaks, setTweaks] = useState(() => ({ ...defaults }));
  const setTweak = (kOrObj, value) => {
    setTweaks(prev => {
      const next = typeof kOrObj === 'object' ? { ...prev, ...kOrObj } : { ...prev, [kOrObj]: value };
      try {
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*');
      } catch {}
      return next;
    });
  };
  return [tweaks, setTweak];
}

function TweaksPanel() {
  const [open, setOpen]   = useState(false);
  const [tweaks, setTweak] = useTweaks(window.PULSE_TWEAK_DEFAULTS || {});
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const dragRef = useRef(null);

  // Listen for host messages
  useEffect(() => {
    function onMsg(e) {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode')   setOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setOpen(false);
    }
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Apply CSS overrides
  useEffect(() => {
    const root = document.documentElement;
    const themes = {
      crimson:  { brand: '#E11D48', deep: '#9F1239', soft: '#FFF1F3' },
      midnight: { brand: '#DC2626', deep: '#7F1D1D', soft: '#FEE2E2' },
      rose:     { brand: '#F43F5E', deep: '#BE123C', soft: '#FFF1F3' },
      indigo:   { brand: '#4F46E5', deep: '#312E81', soft: '#E0E7FF' },
    };
    const t = themes[tweaks.accent] || themes.crimson;
    root.style.setProperty('--brand', t.brand);
    root.style.setProperty('--brand-deep', t.deep);
    root.style.setProperty('--brand-soft', t.soft);
  }, [tweaks.accent]);

  function close() {
    setOpen(false);
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch {}
  }

  function startDrag(e) {
    const startX = e.clientX, startY = e.clientY;
    const startPos = { ...pos };
    function move(ev) {
      setPos({
        x: Math.max(8, startPos.x - (ev.clientX - startX)),
        y: Math.max(8, startPos.y + (ev.clientY - startY)),
      });
    }
    function up() {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    }
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      right: pos.x, bottom: pos.y,
      width: 280,
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 14,
      boxShadow: '0 24px 48px -16px rgba(11,11,15,0.25), 0 8px 24px -8px rgba(11,11,15,0.12)',
      zIndex: 10000,
      overflow: 'hidden',
    }}>
      <div onMouseDown={startDrag} style={{
        padding: '10px 14px',
        background: 'var(--ink)', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 8,
        cursor: 'grab',
      }}>
        <Icon name="sparkle" size={14} />
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Tweaks</span>
        <div style={{ flex: 1 }} />
        <button onClick={close} style={{ background: 'transparent', border: 'none', color: '#fff', display: 'inline-flex', cursor: 'pointer' }}>
          <Icon name="close" size={14} />
        </button>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Brand accent</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {[
              { k: 'crimson',  color: '#E11D48' },
              { k: 'midnight', color: '#7F1D1D' },
              { k: 'rose',     color: '#F43F5E' },
              { k: 'indigo',   color: '#4F46E5' },
            ].map(o => (
              <button key={o.k} onClick={() => setTweak('accent', o.k)} style={{
                aspectRatio: '1',
                background: o.color,
                border: '2px solid ' + (tweaks.accent === o.k ? 'var(--ink)' : 'transparent'),
                borderRadius: 8,
                cursor: 'pointer',
                position: 'relative',
              }}>
                {tweaks.accent === o.k && (
                  <Icon name="check" size={14} color="#fff" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Density</div>
          <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', padding: 3, borderRadius: 8 }}>
            {['compact', 'cozy', 'spacious'].map(d => (
              <button key={d} onClick={() => setTweak('density', d)} style={{
                flex: 1, padding: '6px 0',
                background: tweaks.density === d ? '#fff' : 'transparent',
                border: 'none', borderRadius: 6,
                fontSize: 12, fontWeight: 500,
                color: tweaks.density === d ? 'var(--ink)' : 'var(--muted)',
                cursor: 'pointer',
                boxShadow: tweaks.density === d ? 'var(--shadow-sm)' : 'none',
                textTransform: 'capitalize',
              }}>{d}</button>
            ))}
          </div>
        </div>

        <ToggleField
          label="Vox live indicator"
          desc="Show the animated live-call dot in the sidebar"
          on={tweaks.voxLive}
          onChange={(v) => setTweak('voxLive', v)}
        />
        <ToggleField
          label="Show mobile companion peek"
          desc="Float a phone preview over the desktop console"
          on={tweaks.showMobileCompanion}
          onChange={(v) => setTweak('showMobileCompanion', v)}
        />
      </div>
    </div>
  );
}

function ToggleField({ label, desc, on, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, lineHeight: 1.3 }}>
        <div style={{ fontSize: 12.5, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{desc}</div>
      </div>
      <button onClick={() => onChange(!on)} style={{
        width: 34, height: 20, borderRadius: 10,
        background: on ? 'var(--brand)' : '#D4D4D8',
        border: 'none', position: 'relative', cursor: 'pointer',
        transition: 'background 160ms ease',
        flexShrink: 0,
      }}>
        <span style={{
          position: 'absolute', top: 2, left: on ? 16 : 2,
          width: 16, height: 16, borderRadius: 8, background: '#fff',
          transition: 'left 160ms ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
        }} />
      </button>
    </div>
  );
}

window.TweaksPanel = TweaksPanel;
