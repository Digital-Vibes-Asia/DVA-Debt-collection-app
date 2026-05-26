// Workflow / cadence builder — visual chain of touchpoints

function WorkflowsScreen() {
  const [activeId, setActiveId] = useState('cadence-soft');

  const cadences = [
    { id: 'cadence-soft',  name: 'Soft empathetic · Hardship',  enrolled: 84,  bucket: '1–60 days', success: 71, color: '#15803D', state: 'active' },
    { id: 'cadence-firm',  name: 'Firm reminder · Standard',    enrolled: 142, bucket: '1–30 days', success: 64, color: '#E11D48', state: 'active' },
    { id: 'cadence-final', name: 'Pre-legal · Final notice',    enrolled: 22,  bucket: '90+ days',  success: 38, color: '#9F1239', state: 'active' },
    { id: 'cadence-bnpl',  name: 'BNPL · Light touch',          enrolled: 56,  bucket: '1–14 days', success: 82, color: '#0EA5E9', state: 'active' },
    { id: 'cadence-vip',   name: 'High-balance · White-glove',  enrolled: 8,   bucket: '31–90 days', success: 58, color: '#7C3AED', state: 'draft' },
  ];

  const active = cadences.find(c => c.id === activeId) || cadences[0];

  // Steps for active cadence
  const steps = [
    { day: 'D-3',  kind: 'trigger',  title: 'Trigger',    desc: 'Account becomes 0–3 days due', icon: 'bolt' },
    { day: 'D 0',  kind: 'whatsapp', title: 'WhatsApp · soft reminder', desc: 'Template: gentle-reminder-bm · auto-translated', icon: 'whatsapp', tone: 'wa' },
    { day: 'D+3',  kind: 'wait',     title: 'Wait',       desc: '3 days · skip on payment', icon: 'clock' },
    { day: 'D+3',  kind: 'vox',      title: 'Vox call',   desc: 'Empathetic check-in · escalate to agent if hardship', icon: 'bot', tone: 'vox' },
    { day: 'D+3',  kind: 'branch',   title: 'Branch · sentiment',  icon: 'workflows' },
    { day: 'D+3',  kind: 'whatsapp', title: 'WhatsApp · plan offer', desc: 'Send 2 or 3-instalment plan link', icon: 'whatsapp', tone: 'wa' },
    { day: 'D+7',  kind: 'wait',     title: 'Wait',       desc: '4 days', icon: 'clock' },
    { day: 'D+7',  kind: 'agent',    title: 'Assign agent',   desc: 'Senior agent reviews & calls', icon: 'user' },
    { day: 'D+14', kind: 'sms',      title: 'SMS reminder', desc: 'Backup channel · payment link', icon: 'sms' },
  ];

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
      {/* Left — cadence list */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Workflows</h2>
          <div style={{ flex: 1 }} />
          <IconButton icon="plus" size={28} tone="brand" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {cadences.map(c => {
            const active = c.id === activeId;
            return (
              <button key={c.id} onClick={() => setActiveId(c.id)} style={{
                padding: 12,
                background: active ? '#fff' : 'transparent',
                border: '1px solid ' + (active ? 'var(--line)' : 'transparent'),
                borderRadius: 10,
                textAlign: 'left',
                boxShadow: active ? 'var(--shadow-sm)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: c.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{c.name}</span>
                  {c.state === 'draft' && <Badge tone="soft" size="sm">Draft</Badge>}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', display: 'flex', gap: 8 }}>
                  <span><b className="tnum" style={{ color: 'var(--ink-2)' }}>{c.enrolled}</b> in flight</span>
                  <span>·</span>
                  <span>{c.bucket}</span>
                  <span>·</span>
                  <span><b style={{ color: 'var(--success)' }}>{c.success}%</b> resolve</span>
                </div>
              </button>
            );
          })}
        </div>

        <Card padding={14} style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Library</div>
          <div style={{ fontSize: 12, color: 'var(--ink-2)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <LibraryRow icon="whatsapp" label="14 message templates" />
            <LibraryRow icon="bot" label="8 Vox call scripts" />
            <LibraryRow icon="plans" label="6 payment plan presets" />
            <LibraryRow icon="receipt" label="12 outcome dispositions" />
          </div>
        </Card>
      </div>

      {/* Right — builder canvas */}
      <Card padding={20}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: active.color, marginTop: 8 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: '-0.015em' }}>{active.name}</h2>
              <Badge tone="success" size="sm">{active.state === 'draft' ? 'Draft' : 'Live'}</Badge>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
              Tone: empathetic · Trigger: 0–3 days due · Stops on: payment, PTP kept, opt-out
            </div>
          </div>
          <Button kind="secondary" size="sm" icon="copy">Duplicate</Button>
          <Button kind="secondary" size="sm" icon="pause2">Pause</Button>
          <Button kind="brand" size="sm" icon="check">Save changes</Button>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
          <MetricMini label="Enrolled" value="84" sub="customers" />
          <MetricMini label="Step completion" value="92%" sub="last 30 days" />
          <MetricMini label="Resolve rate" value="71%" sub="+ 4.2 vs last" tone="success" />
          <MetricMini label="Avg time to resolve" value="6.3d" sub="-1.8 vs baseline" tone="success" />
        </div>

        {/* Workflow canvas */}
        <div style={{
          padding: 24,
          background: 'var(--surface)',
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          borderRadius: 12,
          border: '1px solid var(--line)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <StepNode step={s} />
                {i < steps.length - 1 && <Connector branching={s.kind === 'branch'} />}
              </React.Fragment>
            ))}
            <Connector />
            <div style={{
              padding: '10px 16px',
              background: 'var(--card)',
              border: '1px dashed var(--line)',
              borderRadius: 10,
              color: 'var(--muted)',
              fontSize: 12.5,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name="plus" size={13} />
              Add step
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function MetricMini({ label, value, sub, tone }) {
  const c = { success: 'var(--success)' }[tone] || 'var(--ink)';
  return (
    <Card padding={14}>
      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: c, marginTop: 2 }} className="tnum">{value}</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>
    </Card>
  );
}

function StepNode({ step }) {
  const tones = {
    wa:  { bg: '#E8FFF1', fg: 'var(--wa-deep)', bd: 'rgba(18,140,126,0.25)' },
    vox: { bg: 'var(--vox-soft)', fg: 'var(--vox-deep)', bd: 'rgba(0,184,217,0.3)' },
    def: { bg: '#fff', fg: 'var(--ink)', bd: 'var(--line)' },
  };
  const p = tones[step.tone || 'def'];

  if (step.kind === 'branch') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          padding: '8px 14px',
          background: 'linear-gradient(135deg, #FEF3C7, #FFE4E6)',
          border: '1px solid rgba(159,18,57,0.18)',
          borderRadius: 999,
          fontSize: 12, fontWeight: 600,
          color: 'var(--brand-deep)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="workflows" size={13} />
          {step.title}
        </div>
      </div>
    );
  }
  if (step.kind === 'wait') {
    return (
      <div style={{
        padding: '5px 12px',
        background: 'var(--surface-2)',
        border: '1px dashed var(--line)',
        borderRadius: 999,
        fontSize: 11.5, fontWeight: 500,
        color: 'var(--muted)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <Icon name="clock" size={12} />
        {step.desc}
      </div>
    );
  }
  return (
    <div style={{
      width: 360,
      padding: '12px 14px',
      background: p.bg,
      border: `1px solid ${p.bd}`,
      borderRadius: 12,
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'var(--card)', color: p.fg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${p.bd}`,
        flexShrink: 0,
      }}>
        <Icon name={step.icon} size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{step.title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{step.desc}</div>
      </div>
      <span style={{
        fontSize: 10.5, padding: '3px 7px', borderRadius: 5,
        background: 'var(--card)', color: 'var(--muted)', border: '1px solid var(--line)',
        fontFamily: 'var(--font-mono)', fontWeight: 500,
      }}>{step.day}</span>
      <IconButton icon="more" size={26} iconSize={14} />
    </div>
  );
}

function Connector({ branching }) {
  return (
    <div style={{
      width: 2, height: 22,
      background: 'linear-gradient(180deg, var(--line) 0%, var(--line) 100%)',
      position: 'relative',
    }}>
      {branching && (
        <div style={{
          position: 'absolute', top: '50%', left: -10, right: -10, height: 1,
          background: 'var(--line)',
        }} />
      )}
    </div>
  );
}

function LibraryRow({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
      <Icon name={icon} size={14} color="var(--muted)" />
      <span style={{ flex: 1 }}>{label}</span>
      <Icon name="chevRight" size={12} color="var(--muted-2)" />
    </div>
  );
}

window.WorkflowsScreen = WorkflowsScreen;
