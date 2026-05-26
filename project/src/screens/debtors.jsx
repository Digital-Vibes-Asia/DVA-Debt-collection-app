// Debtors list — bucket cards, filter bar, table, bulk actions

function BucketCard({ label, amount, count, color, bg, active, onClick, delta }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: 0,
        padding: '14px 16px',
        background: active ? bg : '#fff',
        border: `1px solid ${active ? color + '30' : 'var(--line)'}`,
        borderRadius: 12,
        textAlign: 'left',
        position: 'relative',
        transition: 'all 160ms ease',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: color, display: 'inline-block' }} />
        <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)', letterSpacing: '0.01em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }} className="tnum">
        RM {amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>
          <span className="tnum" style={{ color: 'var(--ink-3)', fontWeight: 500 }}>{count}</span> accounts
        </span>
        {delta !== undefined && (
          <span style={{ fontSize: 11, color: delta >= 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 500 }}>
            {delta >= 0 ? '+' : ''}{delta}%
          </span>
        )}
      </div>
    </button>
  );
}

function FilterChip({ children, icon, active, onClick, hasMenu = true }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 30,
        padding: '0 10px',
        background: active ? 'var(--ink)' : '#fff',
        color: active ? '#fff' : 'var(--ink-2)',
        border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
        borderRadius: 8,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12.5,
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
      {hasMenu && <Icon name="chevDown" size={11} color={active ? 'rgba(255,255,255,0.6)' : 'var(--muted)'} />}
    </button>
  );
}

// Dropdown filter — chip + popover menu
function FilterDropdown({ icon, label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const current = options.find(o => o.value === value) || options[0];
  const isFiltered = value !== options[0].value;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <FilterChip
        icon={icon}
        active={isFiltered}
        onClick={() => setOpen(!open)}
      >
        {label}: {current.label}
      </FilterChip>
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          minWidth: 200,
          background: '#fff',
          border: '1px solid var(--line)',
          borderRadius: 10,
          boxShadow: 'var(--shadow-lg)',
          padding: 4,
          zIndex: 30,
        }}>
          {options.map(o => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false); }}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  background: active ? 'var(--surface-2)' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12.5,
                  fontWeight: active ? 600 : 500,
                  color: 'var(--ink-2)',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--surface)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                {o.flag && <FlagDot country={o.flag} />}
                {o.dot && <span style={{ width: 8, height: 8, borderRadius: 4, background: o.dot }} />}
                <span style={{ flex: 1 }}>{o.label}</span>
                {o.count !== undefined && (
                  <span style={{ fontSize: 10.5, color: 'var(--muted)' }} className="tnum">{o.count}</span>
                )}
                {active && <Icon name="check" size={13} color="var(--brand)" strokeWidth={2.4} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Multi-select filter — chip + popover with checkboxes
function MultiFilterDropdown({ icon, label, values, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const isFiltered = values && values.length > 0;
  const summary = !isFiltered
    ? 'All'
    : values.length === 1
      ? (options.find(o => o.value === values[0])?.label || values[0])
      : `${values.length} selected`;

  function toggle(v) {
    const set = new Set(values);
    if (set.has(v)) set.delete(v); else set.add(v);
    onChange([...set]);
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <FilterChip icon={icon} active={isFiltered} onClick={() => setOpen(!open)}>
        {label}: {summary}
      </FilterChip>
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          minWidth: 220,
          background: '#fff',
          border: '1px solid var(--line)',
          borderRadius: 10,
          boxShadow: 'var(--shadow-lg)',
          padding: 4,
          zIndex: 30,
        }}>
          {isFiltered && (
            <button
              onClick={() => onChange([])}
              style={{
                width: '100%',
                padding: '6px 10px',
                margin: '2px 0 4px',
                background: 'var(--brand-soft)',
                color: 'var(--brand-deep)',
                border: 'none',
                borderRadius: 6,
                fontSize: 11.5, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
                cursor: 'pointer',
              }}
            >
              <Icon name="close" size={11} />
              Clear all ({values.length})
            </button>
          )}
          {options.map(o => {
            const checked = values.includes(o.value);
            return (
              <button
                key={o.value}
                onClick={() => toggle(o.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12.5,
                  fontWeight: checked ? 600 : 500,
                  color: 'var(--ink-2)',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{
                  width: 14, height: 14, borderRadius: 4,
                  border: `1.5px solid ${checked ? 'var(--brand)' : 'var(--line)'}`,
                  background: checked ? 'var(--brand)' : '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {checked && <Icon name="check" size={9} color="#fff" strokeWidth={3} />}
                </span>
                {o.flag && <FlagDot country={o.flag} />}
                {o.dot && <span style={{ width: 8, height: 8, borderRadius: 4, background: o.dot }} />}
                <span style={{ flex: 1 }}>{o.label}</span>
                {o.count !== undefined && (
                  <span style={{ fontSize: 10.5, color: 'var(--muted)' }} className="tnum">{o.count}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── WhatsApp Blast Modal ──────────────────────────────────────────
function WhatsAppBlastModal({ debtors, onClose, onConfirm }) {
  const [template, setTemplate] = useState('reminder');
  const [language, setLanguage] = useState('en');
  const [sent, setSent]         = useState(false);

  const totalAmt = debtors.reduce((s, d) => s + d.balance, 0);

  const TEMPLATES = [
    {
      value: 'reminder',
      label: 'Payment reminder',
      icon: 'bell',
      desc: 'Friendly first-touch reminder',
    },
    {
      value: 'final',
      label: 'Final notice',
      icon: 'alert',
      desc: 'Urgency escalation — last warning',
    },
    {
      value: 'ptp',
      label: 'PTP follow-up',
      icon: 'check',
      desc: 'Confirm promised payment date',
    },
    {
      value: 'hardship',
      label: 'Hardship plan',
      icon: 'shield',
      desc: 'Offer restructuring options',
    },
  ];

  const LANGUAGES = [
    { value: 'en', label: 'English',          flag: '🇬🇧' },
    { value: 'ms', label: 'Bahasa Malaysia',  flag: '🇲🇾' },
    { value: 'zh', label: 'Mandarin',         flag: '🇨🇳' },
    { value: 'ta', label: 'Tamil',            flag: '🇮🇳' },
  ];

  // Message previews per template + language
  const PREVIEW = {
    reminder: {
      en: (d) => `Dear ${d.name.split(' ')[0]},\n\nThis is a friendly reminder that your ${d.product} account (${d.id}) has an outstanding balance of *RM ${d.balance.toLocaleString()}*.\n\nPlease make a payment at your earliest convenience to avoid further charges.\n\nThank you,\nDVA Collections`,
      ms: (d) => `Salam ${d.name.split(' ')[0]},\n\nIni adalah peringatan mesra bahawa akaun ${d.product} anda (${d.id}) mempunyai baki tertunggak sebanyak *RM ${d.balance.toLocaleString()}*.\n\nSila buat pembayaran secepat mungkin untuk mengelakkan caj lanjut.\n\nTerima kasih,\nDVA Collections`,
      zh: (d) => `亲爱的 ${d.name.split(' ')[0]}，\n\n此为友好提醒，您的${d.product}账户（${d.id}）尚有未结清余额 *RM ${d.balance.toLocaleString()}*。\n\n请尽快还款以避免额外费用。\n\n谢谢，\nDVA Collections`,
      ta: (d) => `அன்பான ${d.name.split(' ')[0]},\n\nஉங்கள் ${d.product} கணக்கு (${d.id}) இல் *RM ${d.balance.toLocaleString()}* நிலுவை உள்ளது என்று நட்பான நினைவூட்டல்.\n\nதயவுசெய்து விரைவில் கட்டணம் செலுத்தவும்.\n\nநன்றி,\nDVA Collections`,
    },
    final: {
      en: (d) => `⚠️ FINAL NOTICE\n\nDear ${d.name.split(' ')[0]},\n\nYour ${d.product} account (${d.id}) remains unpaid with a balance of *RM ${d.balance.toLocaleString()}* — now ${d.daysOverdue} days overdue.\n\nImmediate action is required. Failure to respond within 48 hours may result in legal proceedings.\n\nDVA Collections`,
      ms: (d) => `⚠️ NOTIS AKHIR\n\nSalam ${d.name.split(' ')[0]},\n\nAkaun ${d.product} anda (${d.id}) masih belum dibayar dengan baki *RM ${d.balance.toLocaleString()}* — kini ${d.daysOverdue} hari tertunggak.\n\nTindakan segera diperlukan. Kegagalan bertindak balas dalam 48 jam boleh mengakibatkan tindakan undang-undang.\n\nDVA Collections`,
      zh: (d) => `⚠️ 最终通知\n\n亲爱的 ${d.name.split(' ')[0]}，\n\n您的${d.product}账户（${d.id}）余额 *RM ${d.balance.toLocaleString()}* 至今未还清，已逾期 ${d.daysOverdue} 天。\n\n须立即处理。若48小时内未回应，可能将采取法律行动。\n\nDVA Collections`,
      ta: (d) => `⚠️ இறுதி அறிவிப்பு\n\n${d.name.split(' ')[0]},\n\nஉங்கள் ${d.product} கணக்கு (${d.id}) இல் *RM ${d.balance.toLocaleString()}* நிலுவை உள்ளது — ${d.daysOverdue} நாட்கள் தாமதமாகிவிட்டது.\n\n48 மணி நேரத்திற்குள் பதில் அளிக்காவிட்டால் சட்ட நடவடிக்கை எடுக்கப்படும்.\n\nDVA Collections`,
    },
    ptp: {
      en: (d) => `Dear ${d.name.split(' ')[0]},\n\nWe noted your commitment to pay *RM ${d.balance.toLocaleString()}* for your ${d.product} account (${d.id}).\n\nCould you please confirm your intended payment date? Reply with the date and we'll update your account accordingly.\n\nDVA Collections`,
      ms: (d) => `Salam ${d.name.split(' ')[0]},\n\nKami mengambil perhatian komitmen anda untuk membayar *RM ${d.balance.toLocaleString()}* bagi akaun ${d.product} anda (${d.id}).\n\nBoleh anda sahkan tarikh pembayaran yang dirancang? Balas dengan tarikh tersebut.\n\nDVA Collections`,
      zh: (d) => `亲爱的 ${d.name.split(' ')[0]}，\n\n我们注意到您承诺还清${d.product}账户（${d.id}）的 *RM ${d.balance.toLocaleString()}*。\n\n请确认您预计的还款日期，回复日期后我们将更新您的账户。\n\nDVA Collections`,
      ta: (d) => `அன்பான ${d.name.split(' ')[0]},\n\nஉங்கள் ${d.product} கணக்கு (${d.id}) இல் *RM ${d.balance.toLocaleString()}* செலுத்துவதற்கான உங்கள் உறுதிமொழியை நாங்கள் கவனித்தோம்.\n\nதயவுசெய்து உங்கள் திட்டமிட்ட கட்டண தேதியை உறுதிப்படுத்தவும்.\n\nDVA Collections`,
    },
    hardship: {
      en: (d) => `Dear ${d.name.split(' ')[0]},\n\nWe understand that circumstances can be challenging. Regarding your ${d.product} account (${d.id}) with a balance of *RM ${d.balance.toLocaleString()}*, we'd like to offer you a structured repayment plan.\n\nReply YES to speak with a financial advisor.\n\nDVA Collections`,
      ms: (d) => `Salam ${d.name.split(' ')[0]},\n\nKami faham keadaan boleh mencabar. Berkaitan akaun ${d.product} anda (${d.id}) dengan baki *RM ${d.balance.toLocaleString()}*, kami ingin menawarkan pelan bayaran balik berstruktur.\n\nBalas YA untuk bercakap dengan penasihat kewangan.\n\nDVA Collections`,
      zh: (d) => `亲爱的 ${d.name.split(' ')[0]}，\n\n我们理解情况有时会很困难。关于您的${d.product}账户（${d.id}），余额 *RM ${d.balance.toLocaleString()}*，我们希望为您提供分期还款计划。\n\n回复"是"以联系财务顾问。\n\nDVA Collections`,
      ta: (d) => `அன்பான ${d.name.split(' ')[0]},\n\nசூழ்நிலைகள் சவாலாக இருக்கலாம் என்பதை நாங்கள் புரிந்துகொள்கிறோம். உங்கள் ${d.product} கணக்கு (${d.id}) இல் *RM ${d.balance.toLocaleString()}* உள்ளது — ஒரு திட்டமிட்ட திருப்பிச் செலுத்தும் திட்டம் வழங்க விரும்புகிறோம்.\n\nஆம் என்று பதிலளிக்கவும்.\n\nDVA Collections`,
    },
  };

  // Preview debtor: use first selected debtor as sample
  const previewDebtor = debtors[0] || { name: 'Ahmad', product: 'Credit Card', id: 'MB-0001', balance: 12500, daysOverdue: 45 };
  const previewText = PREVIEW[template]?.[language]?.(previewDebtor) || '';

  const clientOrg = (window.CLIENT_ORGS || []).find(o => o.id === previewDebtor.clientId);

  function handleSend() {
    setSent(true);
    setTimeout(() => { onConfirm(); onClose(); }, 1400);
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(11,11,15,0.48)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200,
        animation: 'fadeIn 180ms ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 540,
          maxHeight: '90vh',
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 40px 80px -20px rgba(11,11,15,0.5)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          animation: 'slideUp 260ms cubic-bezier(.2,.8,.2,1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 20px 16px',
          background: 'linear-gradient(135deg, rgba(37,211,102,0.09), rgba(37,211,102,0.01))',
          borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'flex-start', gap: 12,
          flexShrink: 0,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #128C7E, #25D366)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px -4px rgba(37,211,102,0.5)',
          }}>
            <Icon name="whatsapp" size={20} color="#fff" />
          </div>
          <div style={{ flex: 1, lineHeight: 1.25 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Send WhatsApp Blast</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span><span className="tnum" style={{ fontWeight: 600, color: '#128C7E' }}>{debtors.length}</span> recipient{debtors.length !== 1 ? 's' : ''}</span>
              <span style={{ color: 'var(--line)' }}>·</span>
              <span>Total owing: <span className="tnum" style={{ fontWeight: 600, color: 'var(--ink-2)' }}>RM {totalAmt.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></span>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'transparent', border: '1px solid var(--line)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--muted)',
          }}>
            <Icon name="close" size={13} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Recipients list */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Recipients</div>
            <div style={{
              border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden',
              maxHeight: 160, overflowY: 'auto',
            }}>
              {debtors.map((d, i) => (
                <div key={d.id} style={{
                  display: 'grid', gridTemplateColumns: '28px 1fr auto auto',
                  alignItems: 'center', gap: 10,
                  padding: '9px 12px',
                  borderTop: i ? '1px solid var(--line-2)' : 'none',
                  background: i % 2 === 0 ? '#fff' : '#FAFAF9',
                }}>
                  <Avatar name={d.name} size={26} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{d.product}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{d.id}</span>
                  <span className="tnum" style={{ fontSize: 12.5, fontWeight: 700, color: d.daysOverdue > 90 ? '#9F1239' : d.daysOverdue > 30 ? '#B45309' : 'var(--ink)', whiteSpace: 'nowrap' }}>
                    RM {d.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Template */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Message template</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 7 }}>
              {TEMPLATES.map(t => {
                const active = template === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTemplate(t.value)}
                    style={{
                      padding: '10px 12px',
                      background: active ? 'rgba(18,140,126,0.06)' : '#FAFAF9',
                      border: '1.5px solid ' + (active ? '#128C7E' : 'var(--line)'),
                      borderRadius: 9, cursor: 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 10,
                      transition: 'all 140ms ease',
                    }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: active ? '#128C7E' : '#F1F1EE',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name={t.icon} size={14} color={active ? '#fff' : 'var(--muted)'} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: active ? '#0B5F58' : 'var(--ink-2)' }}>{t.label}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>{t.desc}</div>
                    </div>
                    {active && (
                      <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                        <Icon name="check" size={13} color="#128C7E" strokeWidth={2.5} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Language</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7 }}>
              {LANGUAGES.map(lg => {
                const active = language === lg.value;
                return (
                  <button
                    key={lg.value}
                    onClick={() => setLanguage(lg.value)}
                    style={{
                      padding: '8px 6px',
                      background: active ? '#128C7E' : '#FAFAF9',
                      border: '1.5px solid ' + (active ? '#128C7E' : 'var(--line)'),
                      borderRadius: 9, cursor: 'pointer', textAlign: 'center',
                      transition: 'all 140ms ease',
                      boxShadow: active ? '0 4px 10px -3px rgba(18,140,126,0.4)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 3 }}>{lg.flag}</div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: active ? '#fff' : 'var(--ink-2)' }}>{lg.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message preview */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Message preview &nbsp;<span style={{ fontSize: 10.5, fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--muted)' }}>showing {previewDebtor.name.split(' ')[0]}'s message</span>
            </div>
            <div style={{
              background: '#ECF5E9',
              borderRadius: 12,
              padding: '12px 14px',
              position: 'relative',
            }}>
              {/* WA header bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 10, paddingBottom: 10,
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 999,
                  background: 'linear-gradient(135deg, #128C7E, #25D366)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="whatsapp" size={14} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>DVA Collections</div>
                  {clientOrg && <div style={{ fontSize: 10, color: 'var(--muted)' }}>via {clientOrg.name}</div>}
                </div>
              </div>
              {/* Bubble */}
              <div style={{
                background: '#fff',
                borderRadius: '4px 12px 12px 12px',
                padding: '10px 12px',
                fontSize: 12.5, lineHeight: 1.6,
                color: 'var(--ink)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
              }}>
                {previewText}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'right', marginTop: 4 }}>
                {new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })} ✓✓
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions — always visible */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--line)',
          display: 'flex', gap: 8, flexShrink: 0,
          background: '#fff',
        }}>
          <button onClick={onClose} style={{
            height: 42, padding: '0 16px',
            background: '#fff', color: 'var(--ink-2)',
            border: '1px solid var(--line)', borderRadius: 10,
            fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
          }}>Cancel</button>
          <button
            onClick={handleSend}
            disabled={sent}
            style={{
              flex: 1, height: 42, padding: '0 16px',
              background: sent ? '#ECFDF3' : 'linear-gradient(135deg, #128C7E, #25D366)',
              color: sent ? '#15803D' : '#fff',
              border: sent ? '1px solid #BBF7D0' : 'none',
              borderRadius: 10,
              fontSize: 13.5, fontWeight: 600, cursor: sent ? 'default' : 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: sent ? 'none' : '0 8px 20px -8px rgba(18,140,126,0.6)',
              transition: 'all 240ms ease',
            }}
          >
            {sent ? (
              <><Icon name="check" size={15} color="#15803D" strokeWidth={2.5} /> Messages sent!</>
            ) : (
              <><Icon name="whatsapp" size={15} /> Send to {debtors.length} debtor{debtors.length !== 1 ? 's' : ''}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Vox Queue Modal ───────────────────────────────────────────────
function VoxQueueModal({ count, onClose, onConfirm }) {
  const [timeSlot, setTimeSlot]     = useState('today-2pm');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [tries, setTries]           = useState(3);
  const [interval, setInterval]     = useState('1h');
  const [language, setLanguage]     = useState('en');
  const [queued, setQueued]         = useState(false);

  // Auto-fill today's date when switching to custom
  function selectCustom() {
    setTimeSlot('custom');
    if (!customDate) {
      const d = new Date();
      setCustomDate(d.toISOString().split('T')[0]);
    }
    if (!customTime) setCustomTime('10:00');
  }

  // Human-readable label for the summary sentence
  function scheduleLabel() {
    if (timeSlot === 'custom') {
      if (customDate && customTime) {
        const d = new Date(customDate + 'T' + customTime);
        return d.toLocaleString('en-MY', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
      return 'custom time';
    }
    const slot = TIME_SLOTS.find(t => t.value === timeSlot);
    return slot ? slot.label + ' ' + slot.sub : '';
  }

  const TIME_SLOTS = [
    { value: 'today-2pm',    label: 'Today',    sub: '2:00 PM' },
    { value: 'today-5pm',    label: 'Today',    sub: '5:00 PM' },
    { value: 'tomorrow-9am', label: 'Tomorrow', sub: '9:00 AM' },
    { value: 'tomorrow-2pm', label: 'Tomorrow', sub: '2:00 PM' },
  ];
  const TRIES = [1, 2, 3, 5];
  const INTERVALS = [
    { value: '30m', label: '30 min' },
    { value: '1h',  label: '1 hour' },
    { value: '2h',  label: '2 hours' },
    { value: '4h',  label: '4 hours' },
  ];
  const LANGUAGES = [
    { value: 'en',  label: 'English' },
    { value: 'ms',  label: 'Bahasa Malaysia' },
    { value: 'zh',  label: 'Mandarin' },
    { value: 'ta',  label: 'Tamil' },
  ];

  function handleConfirm() {
    setQueued(true);
    setTimeout(() => { onConfirm(); onClose(); }, 1400);
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(11,11,15,0.48)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200,
        animation: 'fadeIn 180ms ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform: translateY(10px) scale(0.98) } to { opacity:1; transform: translateY(0) scale(1) } }
      `}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 480,
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 40px 80px -20px rgba(11,11,15,0.5)',
          overflow: 'hidden',
          animation: 'slideUp 260ms cubic-bezier(.2,.8,.2,1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 20px 16px',
          background: 'linear-gradient(135deg, rgba(99,58,255,0.07), rgba(99,58,255,0.01))',
          borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px -4px rgba(99,58,255,0.5)',
          }}>
            <Icon name="bot" size={19} color="#fff" />
          </div>
          <div style={{ flex: 1, lineHeight: 1.25 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Queue Vox AI Call</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
              <span className="tnum" style={{ fontWeight: 600, color: '#4F46E5' }}>{count}</span>
              {count === 1 ? ' debtor' : ' debtors'} · automated outbound calling
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'transparent', border: '1px solid var(--line)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--muted)',
          }}>
            <Icon name="close" size={13} />
          </button>
        </div>

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Schedule */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Schedule</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 7 }}>
              {TIME_SLOTS.map(t => {
                const active = timeSlot === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTimeSlot(t.value)}
                    style={{
                      padding: '9px 6px',
                      background: active ? '#4F46E5' : '#FAFAF9',
                      border: '1.5px solid ' + (active ? '#4F46E5' : 'var(--line)'),
                      borderRadius: 9,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 140ms ease',
                      boxShadow: active ? '0 4px 10px -3px rgba(79,70,229,0.45)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: active ? '#fff' : 'var(--ink-2)' }}>{t.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: active ? 'rgba(255,255,255,0.85)' : 'var(--muted)', marginTop: 2 }}>{t.sub}</div>
                  </button>
                );
              })}
              {/* Custom time tile */}
              {(() => {
                const active = timeSlot === 'custom';
                return (
                  <button
                    onClick={selectCustom}
                    style={{
                      padding: '9px 6px',
                      background: active ? '#4F46E5' : '#FAFAF9',
                      border: '1.5px solid ' + (active ? '#4F46E5' : 'var(--line)'),
                      borderRadius: 9,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 140ms ease',
                      boxShadow: active ? '0 4px 10px -3px rgba(79,70,229,0.45)' : 'none',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
                    }}
                  >
                    <Icon name="clock" size={14} color={active ? '#fff' : 'var(--muted)'} />
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: active ? '#fff' : 'var(--ink-2)' }}>Custom</div>
                  </button>
                );
              })()}
            </div>

            {/* Custom time expand panel */}
            {timeSlot === 'custom' && (
              <div style={{
                marginTop: 8,
                padding: '12px 14px',
                background: 'rgba(79,70,229,0.04)',
                border: '1.5px solid rgba(79,70,229,0.18)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', gap: 10,
                animation: 'slideUp 180ms cubic-bezier(.2,.8,.2,1)',
              }}>
                <Icon name="clock" size={15} color="#4F46E5" />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Date</div>
                    <input
                      type="date"
                      value={customDate}
                      onChange={e => setCustomDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%',
                        height: 34,
                        padding: '0 10px',
                        background: '#fff',
                        border: '1.5px solid rgba(79,70,229,0.25)',
                        borderRadius: 7,
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--ink)',
                        outline: 'none',
                        cursor: 'pointer',
                        accentColor: '#4F46E5',
                      }}
                    />
                  </div>
                  <div style={{ width: 120 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Time</div>
                    <input
                      type="time"
                      value={customTime}
                      onChange={e => setCustomTime(e.target.value)}
                      style={{
                        width: '100%',
                        height: 34,
                        padding: '0 10px',
                        background: '#fff',
                        border: '1.5px solid rgba(79,70,229,0.25)',
                        borderRadius: 7,
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--ink)',
                        outline: 'none',
                        cursor: 'pointer',
                        accentColor: '#4F46E5',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Call attempts */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Call attempts &nbsp;<span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'none', fontWeight: 400, letterSpacing: 0 }}>per debtor</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7 }}>
              {TRIES.map(n => {
                const active = tries === n;
                return (
                  <button
                    key={n}
                    onClick={() => setTries(n)}
                    style={{
                      padding: '10px 8px',
                      background: active ? '#0B0B0F' : '#FAFAF9',
                      border: '1.5px solid ' + (active ? '#0B0B0F' : 'var(--line)'),
                      borderRadius: 9,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 140ms ease',
                    }}
                  >
                    <div style={{ fontSize: 18, fontWeight: 700, color: active ? '#fff' : 'var(--ink)' }}>{n}×</div>
                    <div style={{ fontSize: 10.5, color: active ? 'rgba(255,255,255,0.6)' : 'var(--muted)', marginTop: 1 }}>{n === 1 ? 'single try' : 'tries'}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two-column: retry interval + language */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Retry interval */}
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Retry interval</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {INTERVALS.map(iv => {
                  const active = interval === iv.value;
                  return (
                    <button
                      key={iv.value}
                      onClick={() => setInterval(iv.value)}
                      style={{
                        padding: '7px 10px',
                        background: active ? 'var(--brand-soft)' : 'transparent',
                        border: '1.5px solid ' + (active ? 'rgba(159,18,57,0.25)' : 'transparent'),
                        borderRadius: 7,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: 8,
                        transition: 'all 120ms ease',
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface)'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{
                        width: 14, height: 14, borderRadius: 999, flexShrink: 0,
                        border: '1.5px solid ' + (active ? 'var(--brand)' : 'var(--line)'),
                        background: active ? 'var(--brand)' : '#fff',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {active && <span style={{ width: 5, height: 5, borderRadius: 999, background: '#fff' }} />}
                      </span>
                      <span style={{ fontSize: 12.5, fontWeight: active ? 600 : 500, color: active ? 'var(--brand-deep)' : 'var(--ink-2)' }}>{iv.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language */}
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Call language</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {LANGUAGES.map(lg => {
                  const active = language === lg.value;
                  return (
                    <button
                      key={lg.value}
                      onClick={() => setLanguage(lg.value)}
                      style={{
                        padding: '7px 10px',
                        background: active ? 'var(--brand-soft)' : 'transparent',
                        border: '1.5px solid ' + (active ? 'rgba(159,18,57,0.25)' : 'transparent'),
                        borderRadius: 7,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: 8,
                        transition: 'all 120ms ease',
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface)'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{
                        width: 14, height: 14, borderRadius: 999, flexShrink: 0,
                        border: '1.5px solid ' + (active ? 'var(--brand)' : 'var(--line)'),
                        background: active ? 'var(--brand)' : '#fff',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {active && <span style={{ width: 5, height: 5, borderRadius: 999, background: '#fff' }} />}
                      </span>
                      <span style={{ fontSize: 12.5, fontWeight: active ? 600 : 500, color: active ? 'var(--brand-deep)' : 'var(--ink-2)' }}>{lg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary pill */}
          <div style={{
            padding: '10px 12px',
            background: 'linear-gradient(135deg, rgba(79,70,229,0.06), rgba(79,70,229,0.02))',
            border: '1px solid rgba(79,70,229,0.18)',
            borderRadius: 9,
            fontSize: 12, color: 'var(--ink-2)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon name="bot" size={14} color="#4F46E5" />
            <span>
              Vox will call <strong>{count}</strong> debtor{count !== 1 ? 's' : ''}, up to <strong>{tries}×</strong> each,{' '}
              every <strong>{INTERVALS.find(i => i.value === interval)?.label.toLowerCase()}</strong>,{' '}
              starting <strong>{scheduleLabel()}</strong> — in <strong>{LANGUAGES.find(l => l.value === language)?.label}</strong>.
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
            <button onClick={onClose} style={{
              height: 42, padding: '0 16px',
              background: '#fff', color: 'var(--ink-2)',
              border: '1px solid var(--line)', borderRadius: 10,
              fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
            }}>Cancel</button>
            <button
              onClick={handleConfirm}
              disabled={queued}
              style={{
                flex: 1, height: 42, padding: '0 16px',
                background: queued ? '#ECFDF3' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                color: queued ? '#15803D' : '#fff',
                border: queued ? '1px solid #BBF7D0' : 'none',
                borderRadius: 10,
                fontSize: 13.5, fontWeight: 600, cursor: queued ? 'default' : 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: queued ? 'none' : '0 8px 20px -8px rgba(79,70,229,0.6)',
                transition: 'all 240ms ease',
              }}
            >
              {queued ? (
                <><Icon name="check" size={15} color="#15803D" strokeWidth={2.5} /> Queued successfully</>
              ) : (
                <><Icon name="bot" size={15} /> Queue {count} Vox call{count !== 1 ? 's' : ''}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DebtorsScreen({ onOpenDebtor }) {
  const [selected, setSelected] = useState(new Set());
  const [bucket, setBucket]     = useState('all');
  const [voxModal, setVoxModal] = useState(false);
  const [waModal, setWaModal]   = useState(false);
  const [query, setQuery]       = useState('');
  const [assigned, setAssigned] = useState('all');
  const [clients, setClients]   = useState([]); // multi-select
  const [product, setProduct]   = useState('all');
  const [channel, setChannel]   = useState('all');
  const [sort, setSort]         = useState('days-desc');
  const [activeClientId, setActiveClientId] = useState(window.ACTIVE_CLIENT_ID || 'maybank');

  useEffect(() => {
    window.__setActiveClient = setActiveClientId;
    return () => { window.__setActiveClient = null; };
  }, []);

  const allDebtors = useMemo(() => {
    const generated = (window.GENERATED_DEBTORS || []).filter(d => d.clientId === activeClientId);
    const detailed = (window.DEBTORS || []).filter(d => !d.clientId || d.clientId === activeClientId);
    return [...detailed, ...generated];
  }, [activeClientId]);

  const BUCKET_SUMMARY = useMemo(() => {
    const buckets = { current: 0, '1-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
    const amounts = { current: 0, '1-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
    allDebtors.forEach(d => {
      const b = d.bucket || 'current';
      buckets[b] = (buckets[b] || 0) + 1;
      amounts[b] = (amounts[b] || 0) + d.balance;
    });
    return [
      { key: 'current', label: 'Current',    amount: Math.round(amounts['current']),  count: buckets['current'],  color: '#15803D', bg: '#ECFDF3', delta: -3.2 },
      { key: '1-30',    label: '1–30 days',  amount: Math.round(amounts['1-30']),     count: buckets['1-30'],     color: '#92400E', bg: '#FEF3C7', delta: 8.1  },
      { key: '31-60',   label: '31–60 days', amount: Math.round(amounts['31-60']),    count: buckets['31-60'],    color: '#B45309', bg: '#FFEDD5', delta: 2.4  },
      { key: '61-90',   label: '61–90 days', amount: Math.round(amounts['61-90']),    count: buckets['61-90'],    color: '#C2410C', bg: '#FFE4E6', delta: -1.1 },
      { key: '90+',     label: '90+ days',   amount: Math.round(amounts['90+']),      count: buckets['90+'],      color: '#9F1239', bg: '#FFE4E6', delta: 12.8 },
    ];
  }, [allDebtors]);

  // Build option lists dynamically from allDebtors so they show real counts
  const assigneeOptions = useMemo(() => {
    const counts = {};
    allDebtors.forEach(d => { counts[d.assigned] = (counts[d.assigned] || 0) + 1; });
    return [
      { value: 'all', label: 'All assignees' },
      { value: 'You', label: 'You',     count: counts['You'] || 0 },
      { value: 'Vox AI', label: 'Vox AI', count: counts['Vox AI'] || 0, dot: 'var(--vox)' },
      { value: 'Hassan T.', label: 'Hassan T.', count: counts['Hassan T.'] || 0 },
    ];
  }, [allDebtors]);

  const clientOptions = useMemo(() => {
    const orgs = window.CLIENT_ORGS || [];
    const counts = {};
    (window.GENERATED_DEBTORS || []).forEach(d => { counts[d.clientId] = (counts[d.clientId] || 0) + 1; });
    return orgs.map(o => ({ value: o.id, label: o.name, count: counts[o.id] || 0 }));
  }, []);

  const productOptions = useMemo(() => {
    const counts = {};
    allDebtors.forEach(d => { counts[d.product] = (counts[d.product] || 0) + 1; });
    return [
      { value: 'all', label: 'All products' },
      ...Object.keys(counts).sort().map(p => ({ value: p, label: p, count: counts[p] })),
    ];
  }, [allDebtors]);

  const channelOptions = [
    { value: 'all',      label: 'All channels' },
    { value: 'whatsapp', label: 'WhatsApp',  dot: 'var(--wa)' },
    { value: 'call',     label: 'Agent call' },
    { value: 'vox-call', label: 'Vox AI call', dot: 'var(--vox)' },
    { value: 'sms',      label: 'SMS' },
    { value: 'email',    label: 'Email' },
  ];

  const sortOptions = [
    { value: 'days-desc',   label: 'Days overdue · most first' },
    { value: 'days-asc',    label: 'Days overdue · least first' },
    { value: 'bal-desc',    label: 'Balance · highest first' },
    { value: 'bal-asc',     label: 'Balance · lowest first' },
    { value: 'recent',      label: 'Recently contacted' },
    { value: 'name',        label: 'Name · A to Z' },
    { value: 'risk-desc',   label: 'Risk score · highest first' },
  ];

  // Convert balance to rough SGD-equivalent for sort comparison
  const SGD_RATES = { SGD: 1, MYR: 0.32, IDR: 0.000085, PHP: 0.024, THB: 0.039, VND: 0.000054 };

  const filtered = useMemo(() => {
    let out = allDebtors.filter(d => {
      if (bucket !== 'all'   && d.bucket !== bucket) return false;
      if (assigned !== 'all' && d.assigned !== assigned) return false;
      if (clients.length > 0 && !clients.includes(d.clientId)) return false;
      if (product !== 'all'  && d.product !== product) return false;
      if (channel !== 'all'  && d.lastChannel !== channel) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !d.name.toLowerCase().includes(q) &&
          !d.id.toLowerCase().includes(q) &&
          !d.company.toLowerCase().includes(q) &&
          !d.city.toLowerCase().includes(q) &&
          !d.accountNumber.includes(q)
        ) return false;
      }
      return true;
    });

    out = [...out];
    switch (sort) {
      case 'days-desc': out.sort((a, b) => b.daysOverdue - a.daysOverdue); break;
      case 'days-asc':  out.sort((a, b) => a.daysOverdue - b.daysOverdue); break;
      case 'bal-desc':  out.sort((a, b) => (b.balance * SGD_RATES[b.ccy]) - (a.balance * SGD_RATES[a.ccy])); break;
      case 'bal-asc':   out.sort((a, b) => (a.balance * SGD_RATES[a.ccy]) - (b.balance * SGD_RATES[b.ccy])); break;
      case 'risk-desc': out.sort((a, b) => b.riskScore - a.riskScore); break;
      case 'name':      out.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'recent': {
        const order = { 'Just now': 0, 'Minutes ago': 1, '1 hour ago': 2 };
        const score = (s) => {
          if (s.includes('Just now')) return 0;
          if (s.includes('min'))  return 1;
          if (s.includes('hour')) return 2 + parseInt(s) || 2;
          if (s.includes('Yesterday')) return 24;
          if (s.includes('day'))  return 24 + (parseInt(s) || 1);
          if (s.includes('week')) return 24 * 7;
          return 999;
        };
        out.sort((a, b) => score(a.lastContact) - score(b.lastContact));
        break;
      }
    }
    return out;
  }, [allDebtors, bucket, assigned, clients, product, channel, query, sort]);

  // SGD-equivalent total of filtered balances (for header)
  const filteredTotalSGD = useMemo(() => {
    return filtered.reduce((s, d) => s + d.balance * SGD_RATES[d.ccy], 0);
  }, [filtered]);

  const activeFilterCount = [
    bucket !== 'all',
    assigned !== 'all',
    clients.length > 0,
    product !== 'all',
    channel !== 'all',
    !!query,
  ].filter(Boolean).length;

  function clearAll() {
    setBucket('all'); setAssigned('all'); setClients([]);
    setProduct('all'); setChannel('all'); setQuery('');
  }

  function toggleSelect(id) {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id); else n.add(id);
    setSelected(n);
  }
  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(d => d.id)));
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Bucket cards */}
      <div style={{ display: 'flex', gap: 12 }}>
        <BucketCard
          label="All open"
          amount={allDebtors.reduce((s, d) => s + d.balance, 0)} count={allDebtors.length}
          color="#0B0B0F" bg="#F1F1EE"
          active={bucket === 'all'}
          onClick={() => setBucket('all')}
        />
        {BUCKET_SUMMARY.map(b => (
          <BucketCard key={b.key} {...b} active={bucket === b.key} onClick={() => setBucket(b.key)} />
        ))}
      </div>

      {/* Filter bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px',
        background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
        flexWrap: 'wrap',
      }}>
        <SearchInput value={query} onChange={setQuery} placeholder="Search by name, ID, account…" style={{ width: 280 }} />
        <div style={{ width: 1, height: 22, background: 'var(--line)' }} />
        <FilterDropdown icon="user"     label="Assignee" value={assigned} options={assigneeOptions} onChange={setAssigned} />
        <MultiFilterDropdown icon="building" label="Client" values={clients} options={clientOptions} onChange={setClients} />
        <FilterDropdown icon="tag"      label="Product"  value={product}  options={productOptions}  onChange={setProduct} />
        <FilterDropdown icon="bot"      label="Channel"  value={channel}  options={channelOptions}  onChange={setChannel} />
        {activeFilterCount > 0 && (
          <button onClick={clearAll} style={{
            height: 30, padding: '0 10px',
            background: 'var(--brand-soft)', color: 'var(--brand-deep)',
            border: '1px solid rgba(159,18,57,0.18)',
            borderRadius: 8, fontSize: 12, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer',
          }}>
            <Icon name="close" size={11} />
            Clear <span className="tnum">{activeFilterCount}</span>
          </button>
        )}
        <div style={{ flex: 1 }} />
        <FilterDropdown icon="sort" label="Sort" value={sort} options={sortOptions} onChange={setSort} />
        <Button kind="ghost" icon="download" size="sm">Export</Button>
      </div>

      {/* Bulk action bar OR list header */}
      {selected.size > 0 ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px',
          background: 'var(--ink)', color: '#fff', borderRadius: 10,
          boxShadow: 'var(--shadow-md)',
        }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            <span className="tnum" style={{ fontWeight: 600 }}>{selected.size}</span> selected
          </span>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)' }} />
          <Button kind="whatsapp" size="sm" icon="whatsapp" onClick={() => setWaModal(true)}>Send WhatsApp blast</Button>
          <Button kind="vox" size="sm" icon="bot" onClick={() => setVoxModal(true)}>Queue Vox call</Button>
          <Button kind="secondary" size="sm" icon="workflows" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)' }}>Apply workflow</Button>
          <Button kind="secondary" size="sm" icon="user" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)' }}>Reassign</Button>
          <div style={{ flex: 1 }} />
          <IconButton icon="close" tone="neutral" onClick={() => setSelected(new Set())} style={{ color: '#fff' }} />
        </div>
      ) : null}

      {/* WhatsApp Blast Modal */}
      {waModal && (
        <WhatsAppBlastModal
          debtors={filtered.filter(d => selected.has(d.id))}
          onClose={() => setWaModal(false)}
          onConfirm={() => { setSelected(new Set()); setWaModal(false); }}
        />
      )}

      {/* Vox Queue Modal */}
      {voxModal && (
        <VoxQueueModal
          count={selected.size}
          onClose={() => setVoxModal(false)}
          onConfirm={() => { setSelected(new Set()); setVoxModal(false); }}
        />
      )}

      {/* Table */}
      <div style={{
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          fontSize: 13,
        }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              <Th width={40}>
                <input type="checkbox"
                  checked={selected.size > 0 && selected.size === filtered.length}
                  onChange={toggleAll}
                  style={{ accentColor: 'var(--brand)' }}
                />
              </Th>
              <Th>Debtor</Th>
              <Th>Account · Product</Th>
              <Th align="right">Balance</Th>
              <Th align="center">Aging</Th>
              <Th>Last contact</Th>
              <Th>Assigned</Th>
              <Th align="center">Status</Th>
              <Th width={40}></Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <DebtorRow
                key={d.id}
                d={d}
                checked={selected.has(d.id)}
                onCheck={() => toggleSelect(d.id)}
                onOpen={() => onOpenDebtor(d.id)}
                last={i === filtered.length - 1}
              />
            ))}
          </tbody>
        </table>
        <div style={{
          padding: '10px 16px',
          fontSize: 12, color: 'var(--muted)',
          borderTop: '1px solid var(--line-2)',
          background: 'var(--surface-2)',
          display: 'flex', alignItems: 'center',
        }}>
          <span>
            <span className="tnum" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{filtered.length}</span> of <span className="tnum">{allDebtors.length}</span> accounts
            {activeFilterCount > 0 && (
              <span style={{ marginLeft: 8 }}>
                · <span className="tnum" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>RM {filteredTotalSGD.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> MYR-equiv balance
              </span>
            )}
          </span>
          <div style={{ flex: 1 }} />
          <span>Updated 2 min ago</span>
        </div>
      </div>
    </div>
  );
}

function Th({ children, align = 'left', width }) {
  return (
    <th style={{
      padding: '10px 14px',
      textAlign: align,
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--muted)',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      borderBottom: '1px solid var(--line)',
      width,
    }}>{children}</th>
  );
}

function DebtorRow({ d, checked, onCheck, onOpen, last }) {
  const b = bucketOf(d.daysOverdue);
  const [hover, setHover] = useState(false);
  const channelIcon = {
    whatsapp: 'whatsapp', call: 'phone', sms: 'sms', email: 'mail',
    'vox-call': 'bot',
  }[d.lastChannel] || 'inbox';
  const channelColor = {
    whatsapp: 'var(--wa-deep)', call: 'var(--ink-2)', sms: 'var(--muted)',
    email: 'var(--muted)', 'vox-call': 'var(--vox-deep)',
  }[d.lastChannel];
  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onOpen}
      style={{
        background: hover ? 'var(--surface-2)' : '#fff',
        cursor: 'pointer',
        borderBottom: last ? 'none' : '1px solid var(--line-2)',
      }}
    >
      <Td>
        <input type="checkbox" checked={checked} onChange={onCheck} onClick={(e) => e.stopPropagation()} style={{ accentColor: 'var(--brand)' }} />
      </Td>
      <Td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={d.name} size={32} />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 13.5 }}>
              {d.name}
              {d.tags.includes('priority') && (
                <Icon name="star" size={12} color="#C2410C" style={{ marginLeft: 6, verticalAlign: '-2px' }} />
              )}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FlagDot country={d.country} />
              {d.city} · {d.company !== '—' ? d.company : 'Individual'}
            </div>
          </div>
        </div>
      </Td>
      <Td>
        <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{d.id}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{d.product}</div>
      </Td>
      <Td align="right">
        <div style={{ fontWeight: 600, fontSize: 13.5 }} className="tnum">{fmtMoney(d.balance, d.ccy)}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }} className="tnum">
          of {fmtMoney(d.originalAmount, d.ccy)}
        </div>
      </Td>
      <Td align="center">
        <Badge tone={d.daysOverdue > 90 ? 'danger' : d.daysOverdue > 30 ? 'warn' : 'soft'}>
          {d.daysOverdue}d
        </Badge>
      </Td>
      <Td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name={channelIcon} size={13} color={channelColor} />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{d.lastContact}</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', textTransform: 'capitalize' }}>
              {d.lastChannel === 'vox-call' ? 'Vox call' : d.lastChannel}
            </div>
          </div>
        </div>
      </Td>
      <Td>
        {d.assigned === 'Vox AI' ? (
          <VoxBadge size="sm" />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Avatar name={d.assigned === 'You' ? 'Farah Aziz' : d.assigned} size={22} />
            <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{d.assigned}</span>
          </div>
        )}
      </Td>
      <Td align="center">
        <div style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {d.promiseToPay && <Badge tone="success" size="sm" icon="check">PTP</Badge>}
          {d.tags.includes('legal-review') && <Badge tone="danger" size="sm">Legal</Badge>}
          {d.tags.includes('hardship') && <Badge tone="warn" size="sm">Hardship</Badge>}
          {d.tags.includes('first-time') && <Badge tone="soft" size="sm">First</Badge>}
          {d.sentiment === 'avoidant' && <Badge tone="danger" size="sm">No-contact</Badge>}
        </div>
      </Td>
      <Td>
        <div style={{ display: 'flex', gap: 2, opacity: hover ? 1 : 0.4, transition: 'opacity 120ms' }}>
          <IconButton icon="whatsapp" size={28} iconSize={14} tone="neutral" onClick={(e) => { e.stopPropagation(); }} />
          <IconButton icon="phone" size={28} iconSize={14} tone="neutral" onClick={(e) => { e.stopPropagation(); }} />
        </div>
      </Td>
    </tr>
  );
}

function Td({ children, align = 'left' }) {
  return (
    <td style={{
      padding: '12px 14px',
      textAlign: align,
      verticalAlign: 'middle',
      color: 'var(--ink-2)',
    }}>{children}</td>
  );
}

Object.assign(window, { DebtorsScreen, Th, Td });
