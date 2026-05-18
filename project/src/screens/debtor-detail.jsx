// Debtor detail — profile, balance, timeline, contact actions

function DebtorDetailScreen({ debtorId, onBack, onOpenThread, onOpenCall, onOpenPlan, onNav }) {
  const d = DEBTORS.find(x => x.id === debtorId) || DEBTORS[0];
  const events = SAMPLE_TIMELINE;
  const [tab, setTab] = useState('timeline');

  const repaidPct = ((d.originalAmount - d.balance) / d.originalAmount) * 100;

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20, alignItems: 'start' }}>
      {/* Left — profile + balance */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80 }}>
        <Card padding={20}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <Avatar name={d.name} size={56} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em', display: 'flex', alignItems: 'center', gap: 6 }}>
                {d.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FlagDot country={d.country} /> {d.city}, {d.country}
              </div>
              <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                {d.promiseToPay && <Badge tone="success" size="sm" icon="check">PTP</Badge>}
                {d.tags.includes('hardship') && <Badge tone="warn" size="sm">Hardship</Badge>}
                {d.tags.includes('priority') && <Badge tone="danger" size="sm" icon="star">Priority</Badge>}
                {d.tags.includes('repeat') && <Badge tone="neutral" size="sm">Repeat</Badge>}
              </div>
            </div>
          </div>

          {/* Quick-action grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            <QuickAction icon="whatsapp" label="WhatsApp" tone="wa" onClick={() => onOpenThread('t-aishah')} />
            <QuickAction icon="phone"    label="Call"     tone="neutral" onClick={onOpenCall} />
            <QuickAction icon="bot"      label="Vox call" tone="vox"     onClick={onOpenCall} />
            <QuickAction icon="plans"    label="Plan"     tone="brand"   onClick={onOpenPlan} />
          </div>

          {/* Escalation actions */}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line-2)' }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Casework
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <QuickAction icon="warn"   label="File dispute"  tone="warnTone"  onClick={() => onNav && onNav('disputes')} />
              <QuickAction icon="heart"  label="Hardship review" tone="softTone" onClick={() => onNav && onNav('hardship')} />
              <QuickAction icon="shield" label="Send to legal" tone="dangerTone" onClick={() => onNav && onNav('legal')} />
            </div>
          </div>
        </Card>

        {/* Balance card */}
        <Card padding={20}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
            Outstanding
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--brand-deep)' }} className="tnum">
            {fmtMoney(d.balance, d.ccy)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }} className="tnum">
            of {fmtMoney(d.originalAmount, d.ccy)} originated
          </div>

          {/* Repayment progress */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
              <span>Repaid</span>
              <span className="tnum">{repaidPct.toFixed(0)}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--line-2)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${repaidPct}%`, background: 'linear-gradient(90deg, var(--brand), var(--brand-deep))', borderRadius: 3 }} />
            </div>
          </div>

          {/* Stats */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line-2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Stat label="Days overdue" value={`${d.daysOverdue}d`} tone={d.daysOverdue > 90 ? 'danger' : d.daysOverdue > 30 ? 'warn' : 'neutral'} />
            <Stat label="Risk score" value={d.riskScore} suffix="/ 100" tone={d.riskScore > 70 ? 'danger' : d.riskScore > 40 ? 'warn' : 'success'} />
            <Stat label="Due date" value={new Date(d.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} />
            <Stat label="Bucket" value={bucketOf(d.daysOverdue).label.replace(' days', '')} />
          </div>

          {d.promiseToPay && (
            <div style={{
              marginTop: 16, padding: 12,
              background: 'var(--success-soft)', border: '1px solid rgba(21,128,61,0.18)',
              borderRadius: 10,
            }}>
              <div style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
                Promise to pay · active
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }} className="tnum">
                {fmtMoney(d.promiseAmount, d.ccy)} by {new Date(d.promiseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              </div>
            </div>
          )}
        </Card>

        {/* Contact card */}
        <Card padding={16}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            Contact
          </div>
          <ContactRow icon="phone" value={d.phone} sub="Primary mobile" />
          <ContactRow icon="whatsapp" value={d.phone} sub="WhatsApp · last seen 2m ago" success />
          <ContactRow icon="mail" value={d.email} sub="Verified" />
          <ContactRow icon="pin" value={`${d.city}, ${d.country}`} sub="Last KYC update Jan 2026" />
        </Card>

        {/* Account */}
        <Card padding={16}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            Account
          </div>
          <KV k="Account #" v={d.accountNumber} mono />
          <KV k="Case ID" v={d.id} mono />
          <KV k="Product" v={d.product} />
          <KV k="Originated" v="14 Jan 2026" />
        </Card>
      </div>

      {/* Right — timeline */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Button kind="ghost" icon="chevLeft" size="sm" onClick={onBack}>All debtors</Button>
          <div style={{ flex: 1 }} />
          <Button kind="secondary" icon="archive" size="sm">Snooze 7d</Button>
          <Button kind="secondary" icon="user" size="sm">Reassign</Button>
          <Button kind="secondary" icon="more" size="sm">More</Button>
        </div>

        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'timeline',  label: 'Timeline',  icon: 'clock', count: events.length },
            { value: 'whatsapp',  label: 'WhatsApp',  icon: 'whatsapp' },
            { value: 'calls',     label: 'Calls',     icon: 'phone', count: 4 },
            { value: 'documents', label: 'Documents', icon: 'document', count: 3 },
            { value: 'notes',     label: 'Notes',     icon: 'edit',     count: 6 },
          ]}
        />

        <div style={{ marginTop: 18 }}>
          {tab === 'timeline' && <Timeline events={events} />}
          {tab !== 'timeline' && (
            <Card padding={28} style={{ textAlign: 'center', color: 'var(--muted)' }}>
              <Icon name={tab === 'documents' ? 'document' : tab === 'notes' ? 'edit' : 'inbox'} size={28} color="var(--muted-2)" />
              <div style={{ marginTop: 8, fontSize: 13.5 }}>
                Open the {tab} tab — content lives in the timeline for this prototype.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, tone, onClick }) {
  const tones = {
    wa:      { bg: 'var(--wa)', fg: '#fff', border: 'var(--wa)' },
    vox:     { bg: 'linear-gradient(135deg,#0B0B0F,#1A1A21)', fg: 'var(--vox)', border: 'rgba(0,184,217,0.35)' },
    brand:   { bg: 'var(--brand-soft)', fg: 'var(--brand-deep)', border: 'rgba(159,18,57,0.18)' },
    neutral: { bg: '#fff', fg: 'var(--ink)', border: 'var(--line)' },
    warnTone:   { bg: 'var(--warn-soft)',   fg: 'var(--warn)',   border: 'rgba(180,83,9,0.18)' },
    softTone:   { bg: '#fff',                fg: 'var(--ink-2)', border: 'var(--line)' },
    dangerTone: { bg: 'var(--danger-soft)',  fg: 'var(--danger)', border: 'rgba(185,28,28,0.18)' },
  };
  const p = tones[tone];
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 6px',
        background: p.bg,
        color: p.fg,
        border: `1px solid ${p.border}`,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        fontSize: 11.5,
        fontWeight: 500,
      }}
    >
      <Icon name={icon} size={18} />
      {label}
    </button>
  );
}

function Stat({ label, value, suffix, tone }) {
  const colors = { danger: 'var(--danger)', warn: 'var(--warn)', success: 'var(--success)', neutral: 'var(--ink)' };
  return (
    <div>
      <div style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 600, color: colors[tone || 'neutral'], letterSpacing: '-0.01em' }} className="tnum">
        {value} {suffix && <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>{suffix}</span>}
      </div>
    </div>
  );
}

function ContactRow({ icon, value, sub, success }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--line-2)' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: success ? '#E8FFF1' : 'var(--surface)',
        color: success ? 'var(--wa-deep)' : 'var(--ink-3)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={14} />
      </div>
      <div style={{ flex: 1, lineHeight: 1.2 }}>
        <div style={{ fontSize: 12.5, fontWeight: 500 }}>{value}</div>
        <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{sub}</div>
      </div>
      <Icon name="copy" size={13} color="var(--muted-2)" />
    </div>
  );
}

function KV({ k, v, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12.5 }}>
      <span style={{ color: 'var(--muted)' }}>{k}</span>
      <span className={mono ? 'mono' : ''} style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{v}</span>
    </div>
  );
}

// ---------- Timeline ----------
function Timeline({ events }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 30 }}>
      <div style={{
        position: 'absolute', left: 12, top: 6, bottom: 6,
        width: 1.5, background: 'var(--line)',
      }} />
      {events.map((e) => (
        <TimelineEvent key={e.id} e={e} />
      ))}
    </div>
  );
}

const KIND_META = {
  whatsapp:       { icon: 'whatsapp',  color: 'var(--wa-deep)', bg: '#E8FFF1', label: 'WhatsApp' },
  'whatsapp-vox': { icon: 'whatsapp',  color: 'var(--wa-deep)', bg: '#E8FFF1', label: 'WhatsApp · Vox' },
  call:           { icon: 'phone',     color: 'var(--ink-2)',   bg: 'var(--surface)', label: 'Call' },
  'vox-call':     { icon: 'bot',       color: 'var(--vox-deep)', bg: 'var(--vox-soft)', label: 'Vox call' },
  sms:            { icon: 'sms',       color: 'var(--muted)',   bg: '#F1F1EE', label: 'SMS' },
  payment:        { icon: 'cash',      color: 'var(--success)', bg: 'var(--success-soft)', label: 'Payment' },
  plan:           { icon: 'plans',     color: 'var(--brand-deep)', bg: 'var(--brand-soft)', label: 'Plan' },
  note:           { icon: 'edit',      color: 'var(--ink-3)',   bg: 'var(--surface)', label: 'Note' },
  origination:    { icon: 'document',  color: 'var(--muted)',   bg: 'var(--surface)', label: 'Origination' },
};

function TimelineEvent({ e }) {
  const meta = KIND_META[e.kind];
  return (
    <div style={{ position: 'relative', marginBottom: 16 }}>
      <div style={{
        position: 'absolute', left: -30, top: 0,
        width: 25, height: 25, borderRadius: 13,
        background: meta.bg, color: meta.color,
        border: '2px solid var(--surface)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 1px var(--line)',
      }}>
        <Icon name={meta.icon} size={12} />
      </div>
      <Card padding={14}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{e.title}</span>
          {e.kind === 'whatsapp-vox' && <VoxBadge size="sm" label="Vox drafted" />}
          {e.dir === 'out' && <Badge tone="soft" size="sm" icon="arrowRight">Outgoing</Badge>}
          {e.dir === 'in' && <Badge tone="brand" size="sm">Incoming</Badge>}
          {e.dur && <Badge tone="soft" size="sm" icon="clock">{e.dur}</Badge>}
          {e.sentiment === 'cooperative' && <Badge tone="success" size="sm">Cooperative</Badge>}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{e.at}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{e.body}</div>
        {e.by && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>by {e.by}</div>}
      </Card>
    </div>
  );
}

Object.assign(window, { DebtorDetailScreen, KV, Stat });
