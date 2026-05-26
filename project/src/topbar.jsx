// Top bar with breadcrumb, search, command palette hint, vox status, notifications

function Topbar({ title, kicker, breadcrumb, right }) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [newCaseOpen, setNewCaseOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [region, setRegion] = useState({ flag: 'MY', label: 'Malaysia' });

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{
      height: 60,
      padding: '0 24px',
      borderBottom: '1px solid var(--line)',
      background: 'var(--topbar-bg)',
      backdropFilter: 'blur(8px)',
      position: 'sticky',
      top: 0,
      zIndex: 5,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {breadcrumb ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
            {breadcrumb.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Icon name="chevRight" size={12} />}
                <span style={{ color: i === breadcrumb.length - 1 ? 'var(--ink)' : 'var(--muted)', fontWeight: i === breadcrumb.length - 1 ? 500 : 400 }}>
                  {b}
                </span>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <>
            {kicker && (
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {kicker}
              </div>
            )}
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em' }}>
              {title}
            </h1>
          </>
        )}
      </div>

      {/* Command/search */}
      <button onClick={() => setCmdOpen(true)} style={{
        height: 34,
        padding: '0 10px 0 12px',
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 8,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        color: 'var(--muted)',
        fontSize: 13,
        minWidth: 260,
        cursor: 'text',
      }}>
        <Icon name="search" size={14} />
        <span style={{ flex: 1, textAlign: 'left' }}>Search debtors, accounts, threads…</span>
        <span style={{
          padding: '1px 5px',
          border: '1px solid var(--line)',
          borderRadius: 4,
          background: 'var(--surface)',
          fontSize: 10.5,
          color: 'var(--ink-3)',
          fontFamily: 'var(--font-mono)',
        }}>⌘K</span>
      </button>

      {/* Region selector */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setRegionOpen(v => !v)} style={{
          height: 34,
          padding: '0 10px',
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 8,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: 'var(--ink-2)',
          cursor: 'pointer',
        }}>
          <FlagDot country={region.flag} />
          <span>{region.label}</span>
          <Icon name="chevDown" size={12} color="var(--muted)" />
        </button>
        {regionOpen && (
          <>
            <div onClick={() => setRegionOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
            <div style={{
              position: 'absolute', top: 38, right: 0,
              minWidth: 180,
              background: 'var(--card)', border: '1px solid var(--line)',
              borderRadius: 10, padding: 4,
              boxShadow: 'var(--shadow-lg)',
              zIndex: 11,
            }}>
              {[
                { flag: 'MY', label: 'Malaysia' },
                { flag: 'ID', label: 'Indonesia' },
                { flag: 'TH', label: 'Thailand' },
                { flag: 'PH', label: 'Philippines' },
                { flag: 'VN', label: 'Vietnam' },
                { flag: 'SG', label: 'All regions' },
              ].map(r => (
                <button key={r.label} onClick={() => { setRegion(r); setRegionOpen(false); window.toast({ title: `Region: ${r.label}`, icon: 'globe' }); }} style={{
                  width: '100%', textAlign: 'left',
                  padding: '8px 10px',
                  background: region.label === r.label ? 'var(--surface-2)' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 13, color: 'var(--ink)',
                  cursor: 'pointer',
                }}>
                  <FlagDot country={r.flag} />
                  <span style={{ flex: 1 }}>{r.label}</span>
                  {region.label === r.label && <Icon name="check" size={12} color="var(--brand)" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {right}

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <IconButton icon="bell" badge={5} onClick={() => setNotifOpen(true)} title="Notifications" />
        <IconButton icon="bolt" onClick={() => window.toast({ title: 'Quick automations', description: 'Trigger a workflow on the active case', tone: 'vox', icon: 'bolt' })} title="Quick automations" />
      </div>

      <Button kind="brand" icon="plus" size="md" onClick={() => setNewCaseOpen(true)}>New case</Button>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <NewCaseModal open={newCaseOpen} onClose={() => setNewCaseOpen(false)} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}

function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState('');
  const items = [
    { icon: 'debtors',  label: 'Go to Debtors',         hint: 'Navigate' },
    { icon: 'whatsapp', label: 'Open WhatsApp inbox',   hint: 'Navigate' },
    { icon: 'call',     label: 'Open call console',     hint: 'Navigate' },
    { icon: 'plans',    label: 'Payment plans',          hint: 'Navigate' },
    { icon: 'reports',  label: 'View reports',           hint: 'Navigate' },
    { icon: 'plus',     label: 'Create new case',        hint: 'Action' },
    { icon: 'bot',      label: 'Ask Vox about this case',hint: 'AI · ⌘↑' },
    { icon: 'phone',    label: 'Start next call in queue', hint: 'Action' },
    { icon: 'receipt',  label: 'Log a payment',          hint: 'Action' },
  ];
  const filtered = items.filter(i => i.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <Modal open={open} onClose={onClose} width={520}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0 14px', borderBottom: '1px solid var(--line-2)' }}>
        <Icon name="search" size={16} color="var(--muted)" />
        <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search debtors, accounts, threads, actions…" style={{
          flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'var(--font-sans)', background: 'transparent',
        }} />
        <span style={{ padding: '2px 6px', border: '1px solid var(--line)', borderRadius: 4, background: 'var(--surface)', fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>esc</span>
      </div>
      <div style={{ maxHeight: 360, overflowY: 'auto', padding: '6px 0 0' }} className="thin-scroll">
        {filtered.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No matches</div>
        ) : filtered.map((it, i) => (
          <button key={i} onClick={() => { onClose(); window.toast({ title: it.label, icon: it.icon, tone: 'default' }); }} style={{
            width: '100%', textAlign: 'left',
            padding: '10px 12px',
            background: 'transparent', border: 'none', borderRadius: 8,
            display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer',
            fontSize: 13.5, color: 'var(--ink)',
          }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--surface)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)' }}>
              <Icon name={it.icon} size={14} />
            </div>
            <span style={{ flex: 1 }}>{it.label}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{it.hint}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

function NewCaseModal({ open, onClose }) {
  const [type, setType] = useState('debtor');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [channel, setChannel] = useState('whatsapp');

  function submit() {
    if (!name) { window.toast({ title: 'Please enter a name', tone: 'warn', icon: 'warn' }); return; }
    window.toast({ title: `Case opened for ${name}`, description: `Initial outreach via ${channel === 'whatsapp' ? 'WhatsApp' : channel === 'vox' ? 'Vox AI call' : 'email'}`, tone: 'brand', icon: 'plus' });
    onClose();
    setName(''); setAmount('');
  }
  return (
    <Modal open={open} onClose={onClose} width={520}
      title="New case"
      subtitle="Open a collections case for a debtor"
      footer={<>
        <Button kind="secondary" onClick={onClose}>Cancel</Button>
        <Button kind="brand" icon="check" onClick={submit}>Open case</Button>
      </>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Case type">
          <SegmentedControl value={type} onChange={setType} options={[
            { v: 'debtor',  label: 'Individual' },
            { v: 'sme',     label: 'SME' },
            { v: 'corp',    label: 'Corporate' },
          ]} />
        </Field>
        <Field label="Customer name">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Tan Wei Ming" style={inputStyle} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Outstanding amount (RM)">
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="6,780" style={inputStyle} />
          </Field>
          <Field label="Days overdue">
            <select style={inputStyle} defaultValue="30">
              <option>1–29 days</option>
              <option>30–59 days</option>
              <option>60–89 days</option>
              <option>90+ days</option>
            </select>
          </Field>
        </div>
        <Field label="First contact via">
          <SegmentedControl value={channel} onChange={setChannel} options={[
            { v: 'whatsapp', label: 'WhatsApp' },
            { v: 'vox',      label: 'Vox call' },
            { v: 'email',    label: 'Email' },
          ]} />
        </Field>
      </div>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', height: 36,
  padding: '0 12px',
  border: '1px solid var(--line)',
  borderRadius: 8,
  background: 'var(--card)',
  fontSize: 13.5,
  color: 'var(--ink)',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
};

function SegmentedControl({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
      {options.map(o => {
        const a = value === o.v;
        return (
          <button key={o.v} onClick={() => onChange(o.v)} style={{
            flex: 1, padding: '6px 8px',
            background: a ? 'var(--card)' : 'transparent',
            border: a ? '1px solid var(--line)' : '1px solid transparent',
            borderRadius: 6,
            fontSize: 12.5, color: a ? 'var(--ink)' : 'var(--muted)',
            fontWeight: a ? 600 : 500,
            cursor: 'pointer',
            boxShadow: a ? 'var(--shadow-sm)' : 'none',
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

function NotificationsPanel({ open, onClose }) {
  const items = [
    { icon: 'whatsapp', tone: 'wa',    title: 'Aishah Rahman replied',           desc: 'WhatsApp · “Can I pay tomorrow?”',           time: '2m ago', unread: true },
    { icon: 'check',    tone: 'success', title: 'PTP captured · Lim Hui Min',     desc: '3 × RM 2,260 starting 26 May',                  time: '4m ago', unread: true },
    { icon: 'warn',     tone: 'warn',  title: 'Dispute opened on case DC-9214',  desc: 'Unauthorised transaction — needs review',       time: '11m ago', unread: true },
    { icon: 'bot',      tone: 'vox',   title: 'Vox needs escalation help',       desc: 'Customer requested human agent on call 9442',   time: '18m ago', unread: true },
    { icon: 'shield',   tone: 'danger', title: 'Legal handover requested',       desc: 'Saidi Co. Solicitors · case LG-1841',           time: '32m ago', unread: true },
    { icon: 'plans',    tone: 'brand', title: 'Payment plan PL-0998 broken',     desc: 'Tan Wei Ming missed 2nd instalment',            time: '1h ago' },
    { icon: 'receipt',  tone: 'default', title: 'Payment received · RM 1,200',   desc: 'Mohd Ridzuan bin Zainal · via FPX',            time: '2h ago' },
  ];
  const toneBg = { wa: 'rgba(37,211,102,0.12)', success: 'var(--success-soft)', warn: 'var(--warn-soft)', vox: 'var(--vox-soft)', danger: 'var(--danger-soft)', brand: 'var(--brand-soft)', default: 'var(--surface-2)' };
  const toneFg = { wa: 'var(--wa-deep)', success: 'var(--success)', warn: 'var(--warn)', vox: 'var(--vox-deep)', danger: 'var(--danger)', brand: 'var(--brand-deep)', default: 'var(--ink-3)' };
  return (
    <Modal open={open} onClose={onClose} width={460}
      title="Notifications"
      subtitle="5 unread"
      footer={<>
        <Button kind="ghost" onClick={() => { window.toast({ title: 'All marked as read', icon: 'check' }); onClose(); }}>Mark all as read</Button>
        <Button kind="primary" onClick={onClose}>Close</Button>
      </>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: -6 }}>
        {items.map((n, i) => (
          <button key={i} onClick={() => { onClose(); window.toast({ title: n.title, description: n.desc, icon: n.icon, tone: n.tone }); }} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: 10,
            background: n.unread ? 'var(--surface-2)' : 'transparent',
            border: 'none', borderRadius: 8,
            textAlign: 'left', cursor: 'pointer',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 15,
              background: toneBg[n.tone], color: toneFg[n.tone],
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}><Icon name={n.icon} size={14} /></div>
            <div style={{ flex: 1, lineHeight: 1.3 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{n.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{n.desc}</div>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{n.time}</div>
            {n.unread && <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--brand)', marginTop: 4 }} />}
          </button>
        ))}
      </div>
    </Modal>
  );
}

window.Topbar = Topbar;
window.CommandPalette = CommandPalette;
window.NewCaseModal = NewCaseModal;
