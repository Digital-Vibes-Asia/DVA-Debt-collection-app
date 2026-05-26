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

function DebtorsScreen({ onOpenDebtor }) {
  const [selected, setSelected] = useState(new Set());
  const [bucket, setBucket]     = useState('all');
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
          <Button kind="whatsapp" size="sm" icon="whatsapp">Send WhatsApp blast</Button>
          <Button kind="vox" size="sm" icon="bot">Queue Vox call</Button>
          <Button kind="secondary" size="sm" icon="workflows" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)' }}>Apply workflow</Button>
          <Button kind="secondary" size="sm" icon="user" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)' }}>Reassign</Button>
          <div style={{ flex: 1 }} />
          <IconButton icon="close" tone="neutral" onClick={() => setSelected(new Set())} style={{ color: '#fff' }} />
        </div>
      ) : null}

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
