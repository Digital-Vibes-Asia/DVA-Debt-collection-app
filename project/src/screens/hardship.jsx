// Hardship review — full assessment form + Vox recommendation + approval flow

function HardshipScreen({ onOpenDebtor }) {
  const [activeId, setActiveId] = useState('HR-882');
  const active = HARDSHIP_REVIEWS.find(r => r.id === activeId) || HARDSHIP_REVIEWS[0];
  const debtor = DEBTORS.find(d => d.id === active.debtorId) || DEBTORS[2];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Assess customer hardship, simulate relief outcomes, and dispatch approved plans</div>
        <Button kind="brand" size="sm" icon="plus">New review</Button>
      </div>

      {/* Active reviews scroller */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }} className="thin-scroll">
        {HARDSHIP_REVIEWS.map(r => (
          <ReviewCard key={r.id} r={r} active={r.id === activeId} onClick={() => setActiveId(r.id)} />
        ))}
        <button style={{
          minWidth: 200, padding: 14,
          background: 'var(--surface-2)',
          border: '1px dashed var(--line)',
          borderRadius: 12,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          color: 'var(--muted)', fontSize: 12.5, fontWeight: 500,
          cursor: 'pointer',
        }}>
          <Icon name="plus" size={14} /> Start new review
        </button>
      </div>

      {/* Detail form */}
      <HardshipForm review={active} debtor={debtor} onOpenDebtor={onOpenDebtor} />
    </div>
  );
}

function ReviewCard({ r, active, onClick }) {
  const tones = {
    'in-review':      { fg: 'var(--brand-deep)', bg: 'var(--brand-soft)' },
    'awaiting-docs':  { fg: 'var(--warn)',       bg: 'var(--warn-soft)' },
    'approved':       { fg: 'var(--success)',    bg: 'var(--success-soft)' },
    'rejected':       { fg: 'var(--danger)',     bg: 'var(--danger-soft)' },
  };
  const t = tones[r.state];
  return (
    <button onClick={onClick} style={{
      minWidth: 220,
      padding: 14,
      background: 'var(--card)',
      border: '2px solid ' + (active ? 'var(--ink)' : 'var(--line)'),
      borderRadius: 12,
      textAlign: 'left',
      cursor: 'pointer',
      boxShadow: active ? 'var(--shadow-md)' : 'none',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{r.id}</span>
        <div style={{ flex: 1 }} />
        <span style={{
          padding: '2px 6px', borderRadius: 999,
          background: t.bg, color: t.fg,
          fontSize: 10, fontWeight: 600,
        }}>{r.stateLabel}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar name={r.debtor} size={28} />
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{r.debtor}</div>
          <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{r.filed} · {r.severity} severity</div>
        </div>
      </div>
    </button>
  );
}

function HardshipForm({ review, debtor, onOpenDebtor }) {
  const [reasons, setReasons]   = useState(new Set(review.reasonCodes));
  const [relief, setRelief]     = useState(new Set(['reduced-payment', 'interest-freeze']));
  const [decision, setDecision] = useState(null);

  function toggleReason(code) {
    const n = new Set(reasons);
    if (n.has(code)) n.delete(code); else n.add(code);
    setReasons(n);
  }
  function toggleRelief(code) {
    const n = new Set(relief);
    if (n.has(code)) n.delete(code); else n.add(code);
    setRelief(n);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
      {/* LEFT — form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Customer header */}
        <Card padding={20}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar name={debtor.name} size={52} />
            <div style={{ flex: 1, lineHeight: 1.3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em' }}>{debtor.name}</h3>
                <Badge tone="warn" size="sm">{review.severity} severity</Badge>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FlagDot country={debtor.country} /> {debtor.city} · {debtor.product} · {debtor.id}
              </div>
            </div>
            <button onClick={() => onOpenDebtor(debtor.id)} style={{ padding: '6px 10px', background: 'transparent', border: '1px solid var(--line)', borderRadius: 7, color: 'var(--ink-2)', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              Full case <Icon name="external" size={11} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line-2)' }}>
            <Stat label="Outstanding"      value={fmtMoney(debtor.balance, debtor.ccy)} tone={debtor.daysOverdue > 60 ? 'warn' : 'neutral'} />
            <Stat label="Days overdue"     value={`${debtor.daysOverdue}d`} tone={debtor.daysOverdue > 60 ? 'danger' : 'neutral'} />
            <Stat label="Months banking"   value="14" />
            <Stat label="Past reviews"     value="0" />
          </div>
        </Card>

        {/* Section 1 — reason */}
        <FormSection
          number="01"
          title="Reason for hardship"
          subtitle="Select all that apply. This drives policy eligibility and Vox's recommendation."
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {HARDSHIP_REASONS.map(r => {
              const a = reasons.has(r.code);
              return (
                <button key={r.code} onClick={() => toggleReason(r.code)} style={{
                  padding: '12px 10px',
                  background: a ? 'var(--brand-soft)' : '#fff',
                  border: '1.5px solid ' + (a ? 'var(--brand)' : 'var(--line)'),
                  borderRadius: 10,
                  textAlign: 'left',
                  display: 'flex', flexDirection: 'column', gap: 6,
                  cursor: 'pointer',
                  position: 'relative',
                }}>
                  <Icon name={r.icon} size={16} color={a ? 'var(--brand)' : 'var(--ink-3)'} />
                  <span style={{ fontSize: 12.5, fontWeight: a ? 600 : 500, color: a ? 'var(--brand-deep)' : 'var(--ink-2)' }}>{r.label}</span>
                  {a && (
                    <div style={{ position: 'absolute', top: 8, right: 8 }}>
                      <Icon name="check" size={12} color="var(--brand)" strokeWidth={2.4} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </FormSection>

        {/* Section 2 — affordability */}
        <FormSection
          number="02"
          title="Affordability snapshot"
          subtitle="Customer-declared income and expenses, used to calculate disposable income."
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <SubBlock title="Monthly income">
              <TextField label="Salary / business income" value="S$ 2,800" delta={-1200} />
              <TextField label="Other income" value="S$ 240" />
            </SubBlock>
            <SubBlock title="Monthly outgoings">
              <TextField label="Rent / mortgage" value="S$ 1,400" />
              <TextField label="Other essential bills" value="S$ 980" />
              <TextField label="Other debts" value="S$ 320" />
            </SubBlock>
          </div>
          <Card padding={14} style={{ marginTop: 14, background: 'var(--surface-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Stat label="Net disposable" value="S$ 340" tone="warn" />
              <Stat label="vs 6-mo baseline" value="−74%" tone="danger" />
              <Stat label="Current instalment" value="S$ 520" />
              <Stat label="Sustainable amount" value="S$ 180" tone="success" />
              <div style={{ flex: 1 }} />
              <Badge tone="vox" size="sm" icon="bot">Vox · scored</Badge>
            </div>
          </Card>
        </FormSection>

        {/* Section 3 — documents */}
        <FormSection
          number="03"
          title="Supporting documents"
          subtitle="Bank statements, medical bills, employer letters — anything that substantiates the hardship."
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            <DocRow name="Bank statement · Apr-2026.pdf"    size="412 KB" verified />
            <DocRow name="Hospital invoice · 02-May-2026.pdf" size="84 KB" verified />
            <DocRow name="Employer letter · reduced-hours.pdf" size="142 KB" verified />
            <DocRow name="Medical certificate.pdf"            size="68 KB"  pending />
            <DocRow name="Bank statement · Mar-2026.pdf"     size="—"      missing />
            <button style={{
              padding: '12px 14px',
              background: 'transparent',
              border: '1.5px dashed var(--line)',
              borderRadius: 8,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 12.5, color: 'var(--muted)', fontWeight: 500,
              cursor: 'pointer',
            }}>
              <Icon name="plus" size={14} /> Request another document
            </button>
          </div>
        </FormSection>

        {/* Section 4 — relief options */}
        <FormSection
          number="04"
          title="Proposed relief"
          subtitle="Vox pre-selected the best fit for this customer's profile. Adjust as needed."
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {RELIEF_OPTIONS.map(r => {
              const a = relief.has(r.code);
              const voxRec = r.code === 'reduced-payment' || r.code === 'interest-freeze';
              return (
                <button key={r.code} onClick={() => toggleRelief(r.code)} style={{
                  padding: 12,
                  background: a ? 'var(--card)' : '#fff',
                  border: '1.5px solid ' + (a ? 'var(--ink)' : 'var(--line)'),
                  borderRadius: 10,
                  textAlign: 'left',
                  position: 'relative',
                  cursor: 'pointer',
                  boxShadow: a ? 'var(--shadow-sm)' : 'none',
                }}>
                  {voxRec && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      padding: '1px 5px', borderRadius: 4,
                      background: 'var(--vox-soft)', color: 'var(--vox-deep)',
                      fontSize: 9, fontWeight: 600, letterSpacing: '0.05em',
                    }}>VOX</div>
                  )}
                  <Icon name={r.icon} size={16} color={a ? 'var(--ink)' : 'var(--ink-3)'} />
                  <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 6 }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, lineHeight: 1.3 }}>{r.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Outcome simulator */}
          <Card padding={16} style={{ marginTop: 14, background: 'linear-gradient(135deg, var(--vox-soft), #F0FBFD)' }}>
            <div style={{ fontSize: 11, color: 'var(--vox-deep)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
              Outcome simulator · with selected relief
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              <Stat label="New instalment" value="S$ 180" suffix="/ month" tone="success" />
              <Stat label="Term extended"  value="+ 4 months" />
              <Stat label="Interest waived" value="S$ 240" />
              <Stat label="Default risk · 90d" value="14%" suffix="(was 71%)" tone="success" />
            </div>
          </Card>
        </FormSection>

        {/* Section 5 — decision */}
        <FormSection
          number="05"
          title="Decision"
          subtitle="Once approved, the plan is sent to the customer for e-signature via WhatsApp."
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
            {[
              { k: 'approve',  l: 'Approve as-is',   desc: 'Send for customer e-sign', icon: 'check',   tone: 'success' },
              { k: 'approve-modified', l: 'Approve with changes', desc: 'Edit terms then send', icon: 'edit', tone: 'soft' },
              { k: 'reject',   l: 'Reject',          desc: 'Resume normal cadence',     icon: 'close',   tone: 'danger' },
            ].map(o => {
              const a = decision === o.k;
              return (
                <button key={o.k} onClick={() => setDecision(o.k)} style={{
                  padding: '12px 14px',
                  background: a ? 'var(--surface-2)' : '#fff',
                  border: '1.5px solid ' + (a ? 'var(--ink)' : 'var(--line)'),
                  borderRadius: 10,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name={o.icon} size={14} color={a ? 'var(--ink)' : 'var(--muted)'} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{o.l}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>{o.desc}</div>
                </button>
              );
            })}
          </div>
          <textarea
            placeholder="Reviewer notes for the case file…"
            rows={3}
            style={{
              width: '100%', padding: 12,
              background: 'var(--surface-2)', border: '1px solid var(--line)',
              borderRadius: 8, fontSize: 13, color: 'var(--ink)',
              resize: 'none', outline: 'none', fontFamily: 'inherit',
              marginBottom: 12,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar name="Farah Aziz" size={28} />
            <div style={{ flex: 1, fontSize: 12, color: 'var(--muted)' }}>
              Reviewed by <b style={{ color: 'var(--ink)' }}>Farah Aziz</b> · countersign required from supervisor
            </div>
            <Button kind="ghost" size="sm">Save draft</Button>
            <Button kind="brand" size="md" icon="whatsapp" disabled={!decision}>
              Submit & send to customer
            </Button>
          </div>
        </FormSection>
      </div>

      {/* RIGHT — Vox recommendation sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 80 }}>
        <Card padding={18} style={{ background: 'linear-gradient(135deg, #0B0B0F, #1A1A21)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: -30, background: 'radial-gradient(circle at 100% 0%, rgba(0,184,217,0.25), transparent 50%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Avatar isAi name="Vox" size={30} />
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Vox · recommendation</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>generated 4 min ago</div>
              </div>
            </div>
            <div style={{ padding: 10, background: 'rgba(0,184,217,0.12)', border: '1px solid rgba(0,184,217,0.3)', borderRadius: 8, marginBottom: 10 }}>
              <div style={{ fontSize: 10.5, color: 'var(--vox)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Recommended</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>Approve with 6-month relief</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>Reduced payment + interest freeze · S$ 180/mo</div>
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.55, color: 'rgba(255,255,255,0.85)' }}>
              Customer has stable payment history (14 of 16 months on time) until medical emergency on 2 May. Income drop traceable to verified hospital records. Reducing payment to within disposable income lowers 90-day default risk from 71% → 14%, with a likely full recovery over 18 months.
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
              <Icon name="sparkle" size={11} />
              Based on 142k SEA cases with similar profile
            </div>
          </div>
        </Card>

        {/* Policy guardrails */}
        <Card padding={16}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
            Policy guardrails
          </div>
          <Guard label="Within first-time-relief limits"  ok />
          <Guard label="Eligible for interest freeze"      ok />
          <Guard label="Documents verified"                ok />
          <Guard label="Maximum 6 months · within policy"  ok />
          <Guard label="No fraud flags"                    ok />
        </Card>

        {/* Customer message preview */}
        <Card padding={16}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
            Customer notification · preview
          </div>
          <div style={{ padding: 10, background: 'var(--wa-bubble)', borderRadius: 10, fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.5 }}>
            Hi Priya, we've reviewed your hardship request. We're approving a 6-month relief — your monthly payment drops to S$ 180 and we'll pause new interest charges. Tap the link below to e-sign and we're set 💜
          </div>
          <Button kind="whatsapp" full size="sm" icon="send" style={{ marginTop: 10 }}>Send via WhatsApp</Button>
        </Card>
      </div>
    </div>
  );
}

function FormSection({ number, title, subtitle, children }) {
  return (
    <Card padding={20}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        <span style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'var(--ink)', color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)',
          flexShrink: 0,
        }}>{number}</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em' }}>{title}</h3>
          {subtitle && <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </Card>
  );
}

function SubBlock({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginBottom: 8, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  );
}

function TextField({ label, value, delta }) {
  return (
    <div style={{
      padding: '10px 12px',
      background: 'var(--card)',
      border: '1px solid var(--line)',
      borderRadius: 8,
      display: 'flex', alignItems: 'center',
    }}>
      <span style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>{label}</span>
      <span className="tnum" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{value}</span>
      {delta !== undefined && (
        <span style={{
          marginLeft: 8, fontSize: 10.5, fontWeight: 600,
          color: delta < 0 ? 'var(--danger)' : 'var(--success)',
        }} className="tnum">
          {delta > 0 ? '+' : ''}{delta}
        </span>
      )}
    </div>
  );
}

function DocRow({ name, size, verified, pending, missing }) {
  return (
    <div style={{
      padding: '10px 12px',
      background: missing ? 'var(--danger-soft)' : 'var(--surface-2)',
      border: '1px solid ' + (missing ? 'rgba(185,28,28,0.15)' : 'var(--line-2)'),
      borderRadius: 8,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <Icon name="document" size={14} color={missing ? 'var(--danger)' : 'var(--ink-3)'} />
      <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
        <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
        <div style={{ fontSize: 10.5, color: 'var(--muted)' }} className="tnum">{size}</div>
      </div>
      {verified && <Badge tone="success" size="sm" icon="check">Verified</Badge>}
      {pending && <Badge tone="warn" size="sm">Pending</Badge>}
      {missing && <Badge tone="danger" size="sm">Missing</Badge>}
    </div>
  );
}

function Guard({ label, ok }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
      <div style={{
        width: 18, height: 18, borderRadius: 9,
        background: ok ? 'var(--success-soft)' : 'var(--danger-soft)',
        color: ok ? 'var(--success)' : 'var(--danger)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={ok ? 'check' : 'close'} size={11} strokeWidth={2.5} />
      </div>
      <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{label}</span>
    </div>
  );
}

window.HardshipScreen = HardshipScreen;
