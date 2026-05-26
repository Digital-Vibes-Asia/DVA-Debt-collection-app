// Global toast + modal system
// usage: window.toast("Message"), window.toast({title, description, tone, icon})

(function () {
  const listeners = new Set();

  window.toast = function (input, opts) {
    let item;
    if (typeof input === 'string') {
      item = { title: input, ...(opts || {}) };
    } else {
      item = { ...input };
    }
    item.id = Date.now() + Math.random();
    item.tone = item.tone || 'default';
    item.duration = item.duration || 2800;
    listeners.forEach(fn => fn(item));
    return item.id;
  };

  window.__toast_subscribe = function (fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };
})();

function ToastHost() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const off = window.__toast_subscribe((t) => {
      setItems(xs => [...xs, t]);
      setTimeout(() => setItems(xs => xs.filter(x => x.id !== t.id)), t.duration);
    });
    return off;
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column-reverse',
      gap: 10,
      pointerEvents: 'none',
      alignItems: 'flex-end',
      maxWidth: 'calc(100vw - 48px)',
    }}>
      {items.map(t => <ToastItem key={t.id} t={t} onDismiss={() => setItems(xs => xs.filter(x => x.id !== t.id))} />)}
    </div>
  );
}

function ToastItem({ t, onDismiss }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  const palettes = {
    default: { bg: '#0B0B0F', fg: '#fff',           accent: '#A1A1AA', icon: t.icon || 'check' },
    success: { bg: '#0B0B0F', fg: '#fff',           accent: '#86efac', icon: t.icon || 'check' },
    brand:   { bg: 'var(--brand)', fg: '#fff',      accent: '#FFE4E6', icon: t.icon || 'sparkle' },
    vox:     { bg: 'linear-gradient(135deg, #0B0B0F, #1A1A21 60%, #006C82)', fg: '#fff', accent: 'var(--vox)', icon: t.icon || 'bot' },
    wa:      { bg: 'var(--wa-deep)', fg: '#fff',    accent: '#DCF8C6', icon: t.icon || 'whatsapp' },
    warn:    { bg: '#7C2D12', fg: '#fff',           accent: '#FCD34D', icon: t.icon || 'warn' },
    danger:  { bg: '#7F1D1D', fg: '#fff',           accent: '#FCA5A5', icon: t.icon || 'warn' },
  };
  const p = palettes[t.tone] || palettes.default;

  return (
    <div
      style={{
        pointerEvents: 'auto',
        minWidth: 280, maxWidth: 380,
        padding: '12px 14px',
        background: p.bg,
        color: p.fg,
        borderRadius: 12,
        boxShadow: '0 16px 40px -12px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex', gap: 11, alignItems: 'flex-start',
        transform: show ? 'translate(0, 0)' : 'translate(20px, 8px)',
        opacity: show ? 1 : 0,
        transition: 'transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 180ms ease',
        fontFamily: 'var(--font-sans)',
      }}
      onClick={onDismiss}
    >
      <div style={{
        width: 24, height: 24, borderRadius: 12,
        background: 'rgba(255,255,255,0.1)',
        color: p.accent,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={p.icon} size={13} />
      </div>
      <div style={{ flex: 1, minWidth: 0, lineHeight: 1.4 }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.005em' }}>{t.title}</div>
        {t.description && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{t.description}</div>
        )}
        {t.action && (
          <button
            onClick={(e) => { e.stopPropagation(); t.action.onClick && t.action.onClick(); onDismiss(); }}
            style={{
              marginTop: 8,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '4px 9px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >{t.action.label}</button>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
        style={{
          background: 'transparent', border: 'none', padding: 2, cursor: 'pointer',
          color: 'rgba(255,255,255,0.5)', display: 'inline-flex',
        }}
      >
        <Icon name="close" size={12} />
      </button>
    </div>
  );
}

// ---------- Modal ----------
function Modal({ open, onClose, title, subtitle, children, width = 480, footer, dark }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose && onClose(); }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 8000,
        background: 'rgba(11,11,15,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 160ms ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: width,
          background: dark ? 'linear-gradient(180deg, #0B0B0F, #1A1A21)' : 'var(--card)',
          color: dark ? '#fff' : 'var(--ink)',
          border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--line)',
          borderRadius: 16,
          boxShadow: '0 32px 64px -16px rgba(0,0,0,0.4)',
          maxHeight: 'calc(100vh - 40px)',
          overflow: 'auto',
          animation: 'modalIn 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="thin-scroll"
      >
        {(title || subtitle) && (
          <div style={{
            padding: '18px 22px 16px',
            borderBottom: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--line-2)',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              {title && <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</div>}
              {subtitle && <div style={{ fontSize: 12.5, color: dark ? 'rgba(255,255,255,0.6)' : 'var(--muted)', marginTop: 3 }}>{subtitle}</div>}
            </div>
            <button onClick={onClose} style={{
              background: 'transparent', border: 'none', padding: 6, cursor: 'pointer',
              color: dark ? 'rgba(255,255,255,0.6)' : 'var(--muted)',
              borderRadius: 6,
            }}><Icon name="close" size={16} /></button>
          </div>
        )}
        <div style={{ padding: '18px 22px' }}>{children}</div>
        {footer && (
          <div style={{
            padding: '14px 22px',
            borderTop: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--line-2)',
            background: dark ? 'transparent' : 'var(--surface-2)',
            display: 'flex', gap: 8, justifyContent: 'flex-end',
          }}>{footer}</div>
        )}
      </div>
    </div>
  );
}

// ---------- Popover (lightweight, anchored center-screen) ----------
function ConfirmDialog({ open, title, body, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger, onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width={400} footer={
      <>
        <Button kind="secondary" onClick={onClose}>{cancelLabel}</Button>
        <Button kind={danger ? 'brand' : 'primary'} onClick={() => { onConfirm && onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </>
    }>
      <div style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.5 }}>{body}</div>
    </Modal>
  );
}

// Animation keyframes (inject once)
(function() {
  if (document.getElementById('__pulse_anim')) return;
  const style = document.createElement('style');
  style.id = '__pulse_anim';
  style.textContent = `
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @keyframes modalIn { from { opacity: 0; transform: translateY(8px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
  `;
  document.head.appendChild(style);
})();

Object.assign(window, { ToastHost, Modal, ConfirmDialog });
