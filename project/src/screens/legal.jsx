// Legal handover packet — pre-flight checklist, evidence bundle, partner selection

function LegalScreen({ onOpenDebtor }) {
  const [activeId, setActiveId] = useState('LG-217');
  const active = LEGAL_QUEUE.find(c => c.id === activeId) || LEGAL_QUEUE[0];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Pre-flight compliance checks, compile evidence packets, and route to partner counsel</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button kind="secondary" size="sm" icon="download">Audit log</Button>
          <Button kind="brand" size="sm" icon="plus">Nominate case</Button>
        </div>
      </div>

      {/* Summary tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <Card padding={16}>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>In queue</div>
          <div style={{ fontSize: 24, fontWeight: 600 }} className="tnum">7</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }} className="tnum">S$ 184,200 total</div>
        </Card>
        <Card padding={16}>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>With legal · in progress</div>
          <div style={{ fontSize: 24, fontWeight: 600 }} className="tnum">18</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>across 4 partner firms</div>
        </Card>
        <Card padding={16}>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>Recovery rate (LTM)</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--success)' }} className="tnum">61%</div>
          <div style={{ fontSize: 11, color: 'var(--success)', marginTop: 2 }}>+ 8.4 pts vs prior year</div>
        </Card>
        <Card padding={16}>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>Avg cost-to-recover</div>
          <div style={{ fontSize: 24, fontWeight: 600 }} className="tnum">28%</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>of recovered amount</div>
        </Card>
      </div>

      {/* Queue + detail */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 16, alignItems: 'start' }}>
        <Card padding={0}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)' }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Cases awaiting handover</h3>
          </div>
          {LEGAL_QUEUE.map(c => (
            <LegalRow key={c.id} c={c} active={c.id === activeId} onClick={() => setActiveId(c.id)} />
          ))}
        </Card>

        <LegalPacket c={active} onOpenDebtor={onOpenDebtor} />
      </div>
    </div>
  );
}

function LegalRow({ c, active, onClick }) {
  const debtor = DEBTORS.find(x => x.id === c.debtorId);
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left',
      padding: '12px 14px',
      background: active ? 'var(--surface-2)' : 'transparent',
      borderLeft: '3px solid ' + (active ? 'var(--brand)' : 'transparent'),
      borderBottom: '1px solid var(--line-2)',
      cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{c.id}</span>
        <div style={{ flex: 1 }} />
        <Badge tone={
          c.state === 'ready' ? 'success' :
          c.state === 'checklist' ? 'warn' :
          c.state === 'blocked' ? 'danger' :
          'soft'
        } size="sm">
          {c.stateLabel}
        </Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar name={c.debtor} size={28} />
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
          <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.debtor}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }} className="tnum">
            {fmtMoney(c.balance, c.ccy)} · {c.daysOverdue}d
          </div>
        </div>
      </div>
    </button>
  );
}

function LegalPacket({ c, onOpenDebtor }) {
  const debtor = DEBTORS.find(d => d.id === c.debtorId);
  const [partner, setPartner] = useState('lp1');

  // Pre-flight checklist
  const checks = [
    { label: 'Final notice sent ≥ 7 days ago',     done: c.finalNoticeSent,    detail: c.finalNoticeAt ? `Sent ${c.finalNoticeAt}` : 'Not yet sent' },
    { label: 'At least 12 contact attempts logged', done: c.contactAttempts >= 12, detail: `${c.contactAttempts} attempts across all channels` },
    { label: 'No active hardship review',           done: c.state !== 'blocked', detail: c.state === 'blocked' ? 'Review HR-871 in progress' : 'None on file' },
    { label: 'No active dispute',                   done: true,                  detail: 'Last dispute resolved 14 days ago' },
    { label: 'Balance above legal threshold',       done: true,                  detail: `${debtor ? fmtMoney(c.balance, c.ccy) : ''} > minimum threshold` },
    { label: 'KYC documents on file',               done: true,                  detail: 'ID, address, employment verified' },
    { label: 'Signed loan agreement available',     done: true,                  detail: 'Original + 1 amendment, e-signed' },
    { label: 'Customer informed in writing of legal escalation', done: c.finalNoticeSent, detail: c.finalNoticeSent ? 'WhatsApp + email + SMS' : 'Send before handover' },
  ];
  const passed = checks.filter(x => x.done).length;
  const canSubmit = passed === checks.length;

  // Bundle items
  const bundle = [
    { name: 'Loan agreement & amendments',   count: 2,  size: '1.2 MB', icon: 'document', kind: 'core' },
    { name: 'KYC pack (ID, address, employment)', count: 6, size: '4.8 MB', icon: 'shield',  kind: 'core' },
    { name: 'Payment history (full ledger)', count: 1,  size: '218 KB', icon: 'receipt',  kind: 'core' },
    { name: 'Contact log · all channels',    count: 1,  size: '486 KB', icon: 'phone',    kind: 'evidence' },
    { name: 'WhatsApp transcripts',          count: 14, size: '92 KB',  icon: 'whatsapp', kind: 'evidence' },
    { name: 'Call recordings · index + 4 flagged calls', count: 4, size: '38 MB', icon: 'call', kind: 'evidence' },
    { name: 'Vox AI conversation logs',      count: 9,  size: '124 KB', icon: 'bot',      kind: 'evidence' },
    { name: 'Final notice receipts',         count: 3,  size: '84 KB',  icon: 'mail',     kind: 'notice' },
    { name: 'Resolved disputes & investigations', count: 1, size: '210 KB', icon: 'warn', kind: 'evidence' },
    { name: 'Internal investigator notes',   count: 18, size: '64 KB',  icon: 'edit',     kind: 'notes' },
  ];

  const selectedPartner = LEGAL_PARTNERS.find(p => p.id === partner);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <Card padding={20}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: 'linear-gradient(135deg, #4C0519, #9F1239)',
            color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(159,18,57,0.25)',
          }}>
            <Icon name="shield" size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{c.id}</span>
              <span style={{ color: 'var(--muted)', fontSize: 11 }}>·</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Reviewed by {c.reviewer}</span>
              <div style={{ flex: 1 }} />
              <Badge tone={c.state === 'ready' ? 'success' : c.state === 'blocked' ? 'danger' : 'warn'}>
                {c.stateLabel}
              </Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
                Handover packet · {c.debtor}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8, fontSize: 12.5, color: 'var(--ink-3)' }}>
              {debtor && (
                <button onClick={() => onOpenDebtor(debtor.id)} style={{ background: 'transparent', border: 'none', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)', cursor: 'pointer' }}>
                  <Avatar name={c.debtor} size={20} />
                  <span style={{ fontWeight: 600 }}>{c.debtor}</span>
                  <Icon name="external" size={11} color="var(--muted)" />
                </button>
              )}
              <span>·</span>
              <span><b className="tnum">{fmtMoney(c.balance, c.ccy)}</b> outstanding</span>
              <span>·</span>
              <span>{c.daysOverdue} days overdue</span>
              <span>·</span>
              <span>{c.contactAttempts} contact attempts · {c.promisesBroken} broken PTPs</span>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Pre-flight */}
          <Card padding={20}>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Pre-flight checklist</h3>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  Required conditions before submitting to external counsel
                </div>
              </div>
              <div style={{
                padding: '4px 10px', borderRadius: 999,
                background: canSubmit ? 'var(--success-soft)' : 'var(--warn-soft)',
                color: canSubmit ? 'var(--success)' : 'var(--warn)',
                fontSize: 12, fontWeight: 600,
              }}>
                <span className="tnum">{passed}</span> of <span className="tnum">{checks.length}</span> passed
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {checks.map((ch, i) => (
                <div key={i} style={{
                  padding: '10px 12px',
                  background: ch.done ? 'var(--success-soft)' : 'var(--warn-soft)',
                  border: '1px solid ' + (ch.done ? 'rgba(21,128,61,0.18)' : 'rgba(180,83,9,0.2)'),
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 10,
                    background: ch.done ? 'var(--success)' : 'var(--warn)',
                    color: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon name={ch.done ? 'check' : 'warn'} size={12} strokeWidth={2.5} />
                  </div>
                  <div style={{ flex: 1, lineHeight: 1.3 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{ch.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{ch.detail}</div>
                  </div>
                  {!ch.done && <Button kind="ghost" size="sm" icon="arrowRight">Resolve</Button>}
                </div>
              ))}
            </div>
          </Card>

          {/* Evidence bundle */}
          <Card padding={20}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Evidence bundle</h3>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  Compiled automatically · ZIP + cover letter PDF
                </div>
              </div>
              <Badge tone="vox" size="sm" icon="bot">Auto-compiled by Vox</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {bundle.map(b => (
                <div key={b.name} style={{
                  padding: '10px 12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line-2)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: '#fff', color: 'var(--ink-3)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--line)',
                    flexShrink: 0,
                  }}>
                    <Icon name={b.icon} size={13} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {b.name}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)' }} className="tnum">
                      {b.count} {b.count === 1 ? 'item' : 'items'} · {b.size}
                    </div>
                  </div>
                  <Icon name="check" size={13} color="var(--success)" strokeWidth={2.5} />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, padding: 12, background: 'var(--surface-2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="lock" size={14} color="var(--ink-3)" />
              <div style={{ flex: 1, fontSize: 11.5, color: 'var(--ink-3)', lineHeight: 1.4 }}>
                Bundle is encrypted end-to-end. Partner counsel receives a one-time access link. Customer PII is redacted in any internal copies.
              </div>
              <Button kind="ghost" size="sm" icon="eye">Preview</Button>
            </div>
          </Card>

          {/* Legal partner selection */}
          <Card padding={20}>
            <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 600 }}>Route to partner counsel</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {LEGAL_PARTNERS.map(p => {
                const a = partner === p.id;
                return (
                  <button key={p.id} onClick={() => setPartner(p.id)} style={{
                    padding: '12px 14px',
                    background: a ? 'var(--surface-2)' : '#fff',
                    border: '1.5px solid ' + (a ? 'var(--ink)' : 'var(--line)'),
                    borderRadius: 10,
                    textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 9,
                      border: '1.5px solid ' + (a ? 'var(--ink)' : 'var(--line)'),
                      background: a ? 'var(--ink)' : 'transparent',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {a && <Icon name="check" size={10} color="#fff" strokeWidth={2.5} />}
                    </div>
                    <div style={{ flex: 1, lineHeight: 1.3 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                        <FlagDot country={p.region} />
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{p.specialty} · {p.active} active cases</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)' }} className="tnum">{p.recoveryRate}%</div>
                      <div style={{ fontSize: 10.5, color: 'var(--muted)' }} className="tnum">recovery · {p.avgDays}d avg</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Final consent */}
          <Card padding={20}>
            <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 600 }}>Approval & dispatch</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <Consent label="I confirm the customer has been given reasonable opportunity to resolve voluntarily" />
              <Consent label="I confirm no active hardship review or unresolved dispute exists for this case" />
              <Consent label="I confirm this handover complies with PDPA / PDP and consumer-protection regulations in the customer's market" />
              <Consent label="I confirm the partner firm has signed an active DPA and case-handling SLA" />
            </div>

            <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 10, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                Estimated outcome with {selectedPartner ? selectedPartner.name.split(',')[0] : 'partner'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                <Stat label="Likely recovered" value={fmtMoney(c.estimatedRecovery, c.ccy)} tone="success" />
                <Stat label="Partner fee (28%)" value={fmtMoney(c.estimatedCost, c.ccy)} />
                <Stat label="Net to us" value={fmtMoney(c.estimatedRecovery - c.estimatedCost, c.ccy)} tone="success" />
                <Stat label="Time to resolve" value={`${selectedPartner ? selectedPartner.avgDays : 90}d`} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar name="Farah Aziz" size={28} />
              <div style={{ flex: 1, fontSize: 12, color: 'var(--muted)' }}>
                Submitter: <b style={{ color: 'var(--ink)' }}>Farah Aziz</b> · countersigned by <b style={{ color: 'var(--ink)' }}>Compliance Lead</b>
              </div>
              <Button kind="secondary" size="md" icon="archive">Hold</Button>
              <Button kind="brand" size="md" icon="forward" disabled={!canSubmit}>
                Submit handover packet
              </Button>
            </div>
          </Card>
        </div>

        {/* Right rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 80 }}>
          <Card padding={16}>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
              Vox · risk assessment
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: 'var(--danger)' }} className="tnum">8.4</span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>/ 10 · high recovery probability</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <RiskBar label="Customer cooperative-history" value={20} bad />
              <RiskBar label="Asset visibility (collateral)" value={75} />
              <RiskBar label="Verified contactability"        value={62} />
              <RiskBar label="Pattern matches recoverable cases" value={88} />
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.5, marginTop: 12, padding: 10, background: 'var(--surface-2)', borderRadius: 8 }}>
              <Icon name="sparkle" size={11} color="var(--vox-deep)" style={{ verticalAlign: '-1px', marginRight: 4 }} />
              Pattern strongly matches 1,200 prior cases. Recommend Cruz, Mendoza & Reyes — best track record on PH SME recovery.
            </div>
          </Card>

          {/* Case timeline summary */}
          <Card padding={16}>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
              Case journey
            </div>
            {[
              { l: 'Loan originated',           sub: '11 Aug 2025',   ok: true },
              { l: 'First missed payment',      sub: '02 Jan 2026',   ok: true },
              { l: 'Soft cadence started',      sub: '05 Jan 2026',   ok: true },
              { l: 'Hardship review · rejected', sub: '14 Feb 2026',  ok: true },
              { l: 'Firm cadence started',      sub: '20 Feb 2026',   ok: true },
              { l: 'Promise to pay broken (×2)', sub: '08 + 22 Mar', warn: true },
              { l: 'Final notice issued',       sub: '30 Apr 2026',   ok: true },
              { l: 'Pre-legal handover',        sub: 'Today',         active: true },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '4px 0', alignItems: 'center' }}>
                <div style={{
                  width: 14, height: 14, borderRadius: 7,
                  background: t.active ? 'var(--brand)' : t.warn ? 'var(--warn-soft)' : 'var(--success-soft)',
                  border: '1.5px solid ' + (t.active ? 'var(--brand)' : t.warn ? 'var(--warn)' : 'var(--success)'),
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, lineHeight: 1.2 }}>
                  <div style={{ fontSize: 12, fontWeight: t.active ? 600 : 500, color: t.active ? 'var(--brand-deep)' : 'var(--ink-2)' }}>{t.l}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{t.sub}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Consent({ label }) {
  const [v, setV] = useState(false);
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', padding: '4px 0' }}>
      <div style={{
        width: 18, height: 18, borderRadius: 4, marginTop: 1,
        background: v ? 'var(--ink)' : '#fff',
        border: '1.5px solid ' + (v ? 'var(--ink)' : 'var(--line)'),
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }} onClick={() => setV(!v)}>
        {v && <Icon name="check" size={11} color="#fff" strokeWidth={2.6} />}
      </div>
      <span style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }} onClick={() => setV(!v)}>{label}</span>
    </label>
  );
}

function RiskBar({ label, value, bad }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 2 }}>
        <span style={{ color: 'var(--muted)' }}>{label}</span>
        <span className="tnum" style={{ fontWeight: 600, color: bad ? 'var(--danger)' : 'var(--ink-2)' }}>{value}%</span>
      </div>
      <div style={{ height: 4, background: 'var(--line-2)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          width: `${value}%`, height: '100%',
          background: bad ? 'var(--danger)' : 'var(--success)',
        }} />
      </div>
    </div>
  );
}

window.LegalScreen = LegalScreen;
