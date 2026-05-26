// UI primitives — buttons, badges, avatars, surfaces

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- Avatar ----------
function Avatar({ name, size = 36, isAi, src }) {
  const [bg, fg] = avatarColor(name || '?');
  const init = initials(name || '?');
  if (isAi) {
    return (
      <div
        style={{
          width: size, height: size, borderRadius: size / 2,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #0B0B0F 0%, #1A1A21 60%, #006C82 100%)',
          color: '#00B8D9',
          fontWeight: 600, fontSize: size * 0.36,
          boxShadow: 'inset 0 0 0 1px rgba(0,184,217,0.4)',
          flexShrink: 0,
        }}
      >
        <Icon name="bot" size={size * 0.55} />
      </div>
    );
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: size / 2,
        background: bg, color: fg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 600, fontSize: size * 0.38,
        flexShrink: 0,
        letterSpacing: '-0.01em',
      }}
    >
      {init}
    </div>
  );
}

// ---------- Button ----------
function Button({
  children, kind = 'secondary', size = 'md', icon, iconRight, onClick,
  disabled, full, style, type = 'button', danger, toast,
}) {
  function handleClick(e) {
    if (disabled) return;
    if (onClick) return onClick(e);
    // Fallback: fire a toast so static buttons still feel alive in demo
    const label = (toast && toast.title) || (typeof children === 'string' ? children : 'Action triggered');
    window.toast && window.toast({
      title: label,
      description: (toast && toast.description),
      tone: (toast && toast.tone) || (danger ? 'danger' : kind === 'brand' ? 'brand' : kind === 'whatsapp' ? 'wa' : kind === 'vox' ? 'vox' : 'default'),
      icon: (toast && toast.icon) || icon,
    });
  }
  const palettes = {
    primary:    { bg: 'var(--ink)',       fg: '#fff',           border: 'var(--ink)',         hover: '#1A1A21' },
    brand:      { bg: 'var(--brand)',     fg: '#fff',           border: 'var(--brand)',       hover: 'var(--brand-deep)' },
    secondary:  { bg: 'var(--card)',        fg: 'var(--ink)',     border: 'var(--line)',        hover: 'var(--surface)' },
    ghost:      { bg: 'transparent',      fg: 'var(--ink)',     border: 'transparent',        hover: 'rgba(128,128,128,0.08)' },
    danger:     { bg: 'var(--card)',       fg: 'var(--danger)',  border: 'var(--line)',        hover: 'var(--danger-soft)' },
    vox:        { bg: 'var(--vox-soft)',  fg: 'var(--vox-deep)',border: 'rgba(0,184,217,0.3)', hover: '#D9F4F8' },
    whatsapp:   { bg: 'var(--wa)',        fg: '#fff',           border: 'var(--wa)',          hover: 'var(--wa-deep)' },
  };
  const sizes = {
    sm: { h: 28, px: 10, fs: 12.5, gap: 6, icon: 14, radius: 7 },
    md: { h: 34, px: 12, fs: 13.5, gap: 7, icon: 16, radius: 8 },
    lg: { h: 42, px: 16, fs: 14.5, gap: 8, icon: 18, radius: 10 },
  };
  const p = palettes[danger ? 'danger' : kind];
  const s = sizes[size];
  const [hover, setHover] = useState(false);
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: s.h,
        padding: `0 ${s.px}px`,
        background: hover && !disabled ? p.hover : p.bg,
        color: p.fg,
        border: `1px solid ${p.border}`,
        borderRadius: s.radius,
        fontSize: s.fs,
        fontWeight: 500,
        letterSpacing: '-0.005em',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: full ? '100%' : undefined,
        transition: 'background 120ms ease, transform 60ms ease',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={s.icon} />}
      {children && <span>{children}</span>}
      {iconRight && <Icon name={iconRight} size={s.icon} />}
    </button>
  );
}

// ---------- IconButton ----------
function IconButton({ icon, size = 32, iconSize, onClick, tone = 'neutral', active, title, badge, style, toast }) {
  function handleClick(e) {
    if (onClick) return onClick(e);
    if (toast) window.toast && window.toast(toast);
    else if (title) window.toast && window.toast({ title, icon, tone: tone === 'brand' ? 'brand' : tone === 'vox' ? 'vox' : 'default' });
  }
  const tones = {
    neutral: { fg: 'var(--ink-2)', hov: 'rgba(0,0,0,0.05)' },
    brand:   { fg: 'var(--brand)', hov: 'var(--brand-soft)' },
    vox:     { fg: 'var(--vox-deep)', hov: 'var(--vox-soft)' },
    danger:  { fg: 'var(--danger)', hov: 'var(--danger-soft)' },
  };
  const p = tones[tone];
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={handleClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: size, height: size,
        background: active ? p.hov : (hov ? p.hov : 'transparent'),
        color: p.fg,
        border: '1px solid ' + (active ? 'var(--line)' : 'transparent'),
        borderRadius: 8,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'background 120ms ease',
        ...style,
      }}
    >
      <Icon name={icon} size={iconSize || Math.round(size * 0.5)} />
      {badge && (
        <span style={{
          position: 'absolute', top: 4, right: 4,
          minWidth: 14, height: 14, padding: '0 4px',
          background: 'var(--brand)', color: '#fff',
          borderRadius: 7, fontSize: 9.5, fontWeight: 600,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          lineHeight: 1,
        }}>{badge}</span>
      )}
    </button>
  );
}

// ---------- Badge ----------
function Badge({ children, tone = 'neutral', icon, size = 'md', style }) {
  const tones = {
    neutral:  { bg: 'var(--surface)',  fg: 'var(--ink-2)', bd: 'transparent' },
    soft:     { bg: 'var(--card)',    fg: 'var(--ink-3)', bd: 'var(--line)' },
    brand:    { bg: 'var(--brand-soft)', fg: 'var(--brand-deep)', bd: 'rgba(159,18,57,0.12)' },
    success:  { bg: 'var(--success-soft)', fg: 'var(--success)', bd: 'rgba(21,128,61,0.15)' },
    warn:     { bg: 'var(--warn-soft)', fg: 'var(--warn)', bd: 'rgba(180,83,9,0.18)' },
    danger:   { bg: 'var(--danger-soft)', fg: 'var(--danger)', bd: 'rgba(185,28,28,0.18)' },
    vox:      { bg: 'var(--vox-soft)', fg: 'var(--vox-deep)', bd: 'rgba(0,184,217,0.25)' },
    wa:       { bg: '#E8FFF1', fg: 'var(--wa-deep)', bd: 'rgba(18,140,126,0.18)' },
    dark:     { bg: 'var(--ink)', fg: '#fff', bd: 'var(--ink)' },
  };
  const p = tones[tone];
  const sz = size === 'sm'
    ? { h: 18, px: 6, fs: 10.5, ic: 11, gap: 3 }
    : { h: 22, px: 8, fs: 11.5, ic: 12, gap: 4 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: sz.gap,
      height: sz.h, padding: `0 ${sz.px}px`,
      background: p.bg, color: p.fg,
      border: `1px solid ${p.bd}`,
      borderRadius: 999,
      fontSize: sz.fs, fontWeight: 500, letterSpacing: '0.005em',
      textTransform: 'none',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {icon && <Icon name={icon} size={sz.ic} />}
      {children}
    </span>
  );
}

// ---------- Card ----------
function Card({ children, style, padding = 16, hover, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 12,
        padding,
        cursor: onClick ? 'pointer' : undefined,
        transition: 'box-shadow 160ms ease, border-color 160ms ease',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ---------- Section title ----------
function SectionTitle({ kicker, title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        {kicker && (
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
            {kicker}
          </div>
        )}
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

// ---------- Search input ----------
function SearchInput({ value, onChange, placeholder = 'Search…', style }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <Icon name="search" size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
      <input
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: 34,
          padding: '0 12px 0 32px',
          border: '1px solid var(--line)',
          borderRadius: 8,
          background: 'var(--card)',
          fontSize: 13,
          color: 'var(--ink)',
          outline: 'none',
        }}
      />
    </div>
  );
}

// ---------- KPI tile ----------
function KpiTile({ label, value, delta, suffix, prefix, accent }) {
  const up = delta >= 0;
  return (
    <Card padding={18} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', letterSpacing: '0.01em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {prefix && <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>{prefix}</span>}
        <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: accent || 'var(--ink)' }} className="tnum">{value}</span>
        {suffix && <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>{suffix}</span>}
      </div>
      {delta !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          <Icon name={up ? 'arrowUp' : 'arrowDown'} size={12} color={up ? 'var(--success)' : 'var(--danger)'} />
          <span style={{ color: up ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
            {up ? '+' : ''}{delta}%
          </span>
          <span style={{ color: 'var(--muted)' }}>vs last month</span>
        </div>
      )}
    </Card>
  );
}

// ---------- Tabs ----------
function Tabs({ tabs, value, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      borderBottom: '1px solid var(--line)',
    }}>
      {tabs.map(t => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            style={{
              padding: '10px 14px',
              background: 'transparent',
              border: 'none',
              fontSize: 13.5,
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--ink)' : 'var(--muted)',
              borderBottom: `2px solid ${active ? 'var(--ink)' : 'transparent'}`,
              marginBottom: -1,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            {t.icon && <Icon name={t.icon} size={14} />}
            {t.label}
            {t.count !== undefined && (
              <span style={{
                fontSize: 11, padding: '1px 6px', borderRadius: 10,
                background: active ? 'var(--ink)' : 'var(--line-2)',
                color: active ? '#fff' : 'var(--muted)',
                fontWeight: 500,
              }}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Divider with label ----------
function DateDivider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0', color: 'var(--muted)', fontSize: 11, fontWeight: 500 }}>
      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
    </div>
  );
}

// ---------- VoxBadge (the AI indicator) ----------
function VoxBadge({ live, label = 'Vox', size = 'md' }) {
  const sz = size === 'sm'
    ? { h: 20, px: 6, fs: 10.5, gap: 4 }
    : { h: 24, px: 8, fs: 12, gap: 5 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: sz.gap,
      height: sz.h, padding: `0 ${sz.px}px`,
      background: 'linear-gradient(135deg, #0B0B0F, #1A1A21)',
      color: 'var(--vox)',
      borderRadius: 999,
      fontSize: sz.fs, fontWeight: 600,
      letterSpacing: '0.01em',
      border: '1px solid rgba(0,184,217,0.35)',
      boxShadow: 'inset 0 0 0 1px rgba(0,184,217,0.08)',
    }}>
      {live && (
        <span className="vox-bars" style={{ color: 'var(--vox)', height: 10 }}>
          <span /><span /><span /><span />
        </span>
      )}
      {!live && <Icon name="bot" size={size === 'sm' ? 11 : 13} />}
      <span>{label}</span>
    </span>
  );
}

// ---------- Country flag ----------
function FlagDot({ country }) {
  const map = { SG: '🇸🇬', MY: '🇲🇾', ID: '🇮🇩', PH: '🇵🇭', TH: '🇹🇭', VN: '🇻🇳' };
  return <span style={{ fontSize: 13, lineHeight: 1 }}>{map[country] || '🌐'}</span>;
}

Object.assign(window, {
  Avatar, Button, IconButton, Badge, Card, SectionTitle, SearchInput,
  KpiTile, Tabs, DateDivider, VoxBadge, FlagDot,
});
