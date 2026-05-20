// Shared bits for all login variants

const { useState: useStateL } = React;

function PulseMark({ size = 36, glow = true }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: 'linear-gradient(135deg, #0B0B0F 0%, #1A1A21 55%, #4C0519 100%)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: glow ? '0 0 0 1px rgba(225,29,72,0.35), 0 10px 28px -8px rgba(225,29,72,0.45)' : '0 0 0 1px rgba(225,29,72,0.25)',
      flexShrink: 0, position: 'relative',
    }}>
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none"
        stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h3l2-5 4 10 2-5 2 3h5" />
      </svg>
    </div>
  );
}

function PulseWordmark({ tone = 'light', size = 18 }) {
  const ink = tone === 'dark' ? '#FBFAF7' : '#0B0B0F';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <PulseMark size={size + 14} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
        <span style={{ fontSize: size, fontWeight: 700, letterSpacing: '-0.015em', color: ink }}>
          DVA <span style={{ color: '#E11D48' }}>Pulse</span>
        </span>
        <span style={{ fontSize: size * 0.58, color: tone === 'dark' ? 'rgba(255,255,255,0.5)' : '#71717A', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
          Debt collection CRM
        </span>
      </div>
    </div>
  );
}

// A login form field — rendered slightly differently per tone
function Field({ label, type = 'text', value, placeholder, icon, trailing, hint, tone = 'light', autofocus, mono }) {
  const dark = tone === 'dark';
  const [show, setShow] = useStateL(type !== 'password');
  const inputType = type === 'password' && show ? 'text' : type;
  return (
    <label style={{ display: 'block' }}>
      <div style={{
        fontSize: 11.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: dark ? 'rgba(255,255,255,0.55)' : '#71717A',
        marginBottom: 8,
      }}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        height: 46,
        padding: '0 12px',
        background: dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
        border: '1px solid ' + (dark ? 'rgba(255,255,255,0.10)' : '#E7E5E0'),
        borderRadius: 10,
        boxShadow: dark ? 'inset 0 1px 0 rgba(255,255,255,0.04)' : '0 1px 2px rgba(11,11,15,0.03)',
      }}>
        {icon && <Icon name={icon} size={17} color={dark ? 'rgba(255,255,255,0.55)' : '#A1A1AA'} />}
        <input
          type={inputType}
          defaultValue={value}
          placeholder={placeholder}
          autoFocus={autofocus}
          style={{
            flex: 1, minWidth: 0,
            background: 'transparent', border: 'none', outline: 'none',
            fontSize: 14.5, fontWeight: 500, letterSpacing: mono ? '0.04em' : '-0.005em',
            fontFamily: mono ? 'var(--font-mono)' : 'inherit',
            color: dark ? '#FBFAF7' : '#0B0B0F',
          }}
        />
        {type === 'password' && (
          <button type="button" onClick={() => setShow(s => !s)} style={{
            background: 'transparent', border: 'none', padding: 4, cursor: 'pointer',
            color: dark ? 'rgba(255,255,255,0.55)' : '#A1A1AA',
            display: 'inline-flex',
          }}>
            <Icon name="eye" size={16} />
          </button>
        )}
        {trailing}
      </div>
      {hint && (
        <div style={{ fontSize: 11.5, color: dark ? 'rgba(255,255,255,0.45)' : '#A1A1AA', marginTop: 6 }}>
          {hint}
        </div>
      )}
    </label>
  );
}

// A small chip showing the role this login is for
function RoleChip({ icon, label, sub, tone = 'light' }) {
  const dark = tone === 'dark';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '6px 10px 6px 6px',
      borderRadius: 999,
      background: dark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
      border: '1px solid ' + (dark ? 'rgba(255,255,255,0.10)' : '#E7E5E0'),
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: 999,
        background: dark ? 'rgba(225,29,72,0.18)' : '#FFF1F3',
        color: '#E11D48',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={13} />
      </span>
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: dark ? '#FBFAF7' : '#0B0B0F', letterSpacing: '-0.005em' }}>{label}</div>
        {sub && <div style={{ fontSize: 9.5, color: dark ? 'rgba(255,255,255,0.5)' : '#A1A1AA', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{sub}</div>}
      </div>
    </div>
  );
}

// Footer strip: legal + locale + system status
function LoginFooter({ tone = 'light', status = 'All systems normal', region = 'MY · SG' }) {
  const dark = tone === 'dark';
  const muted = dark ? 'rgba(255,255,255,0.4)' : '#A1A1AA';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 32px',
      borderTop: '1px solid ' + (dark ? 'rgba(255,255,255,0.06)' : '#EFEDE8'),
      fontSize: 11.5, color: muted,
    }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
        <span>© 2026 Digital Vibes Asia</span>
        <span>·</span>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Acceptable use</a>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: '#15803D' }} />
          {status}
        </span>
        <span>·</span>
        <span>Region: {region}</span>
        <span>·</span>
        <span>v2.4.1</span>
      </div>
    </div>
  );
}

// Generic CTA button styled like the app's primary button
function CTA({ children, kind = 'primary', icon, iconRight, full = true, tone = 'light' }) {
  const palettes = {
    primary: { bg: '#0B0B0F', fg: '#fff', bd: '#0B0B0F' },
    brand:   { bg: '#E11D48', fg: '#fff', bd: '#E11D48' },
    vox:     { bg: '#00B8D9', fg: '#0B0B0F', bd: '#00B8D9' },
    ghost:   tone === 'dark'
      ? { bg: 'transparent', fg: '#FBFAF7', bd: 'rgba(255,255,255,0.16)' }
      : { bg: '#FFFFFF', fg: '#0B0B0F', bd: '#E7E5E0' },
  };
  const p = palettes[kind];
  return (
    <button type="button" style={{
      width: full ? '100%' : undefined,
      height: 46,
      padding: '0 18px',
      background: p.bg, color: p.fg,
      border: `1px solid ${p.bd}`,
      borderRadius: 10,
      fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.005em',
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      boxShadow: kind === 'brand' ? '0 8px 24px -10px rgba(225,29,72,0.55)' : (kind === 'primary' ? '0 6px 16px -8px rgba(11,11,15,0.5)' : 'none'),
    }}>
      {icon && <Icon name={icon} size={17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={17} />}
    </button>
  );
}

// Tiny dot status indicator
function StatDot({ color = '#15803D', pulse = false }) {
  return <span style={{ width: 7, height: 7, borderRadius: 999, background: color, boxShadow: pulse ? `0 0 0 3px ${color}33` : undefined, flexShrink: 0 }} />;
}

Object.assign(window, { PulseMark, PulseWordmark, Field, RoleChip, LoginFooter, CTA, StatDot });
