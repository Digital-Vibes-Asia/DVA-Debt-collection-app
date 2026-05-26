// Disputes — list of all disputes + detail view with evidence and decision

function DisputesScreen({ onOpenDebtor }) {
  const [activeId, setActiveId] = useState('DS-1142');
  const [filter, setFilter] = useState('open');
  const [disputes, setDisputes] = useState(() => DISPUTES.map(d => ({ ...d })));
  const [toast, setToast] = useState(null);

  const open = disputes.filter(d => !d.state.startsWith('resolved'));
  const filtered = filter === 'open' ? open
                 : filter === 'all' ? disputes
                 : disputes.filter(d => d.state === filter);

  const active = disputes.find(d => d.id === activeId) || disputes[0];

  function submitDecision(disputeId, decision, note) {
    const stateMap = {
      uphold:   { state: 'resolved-upheld',   stateLabel: 'Upheld' },
      partial:  { state: 'resolved-upheld',   stateLabel: 'Partially upheld' },
      reject:   { state: 'resolved-rejected', stateLabel: 'Rejected' },
      escalate: { state: 'under-review',      stateLabel: 'Escalated' },
    };
    const update = stateMap[decision];
    const target = disputes.find(d => d.id === disputeId);
    if (!target || !update) return;

    setDisputes(prev => prev.map(d => d.id === disputeId
      ? { ...d, ...update, decision, decisionNote: note, decisionAt: new Date().toISOString() }
      : d
    ));
    setToast({ id: Date.now(), debtor: target.debtor, decision, dispute: target });
    setTimeout(() => setToast(t => t && t.id ? null : t), 6000);
  }

  // Summary tiles
  const tiles = [
    { label: 'Open disputes',       value: open.length,                                                           accent: 'var(--ink)' },
    { label: 'SLA breach risk',     value: open.filter(d => d.slaHours < 24).length,                              accent: 'var(--danger)' },
    { label: 'Auto-resolved by Vox', value: 14,                                                                   accent: 'var(--vox-deep)' },
    { label: 'Avg time to resolve', value: '3.4d',                                                                accent: 'var(--success)' },
    { label: 'Uphold rate',         value: '62%',                                                                 accent: 'var(--ink)' },
  ];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Header strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Track customer complaints, route evidence, and decide outcomes within SLA</div>
        <Button kind="brand" size="sm" icon="plus">File on behalf of customer</Button>
      </div>

      {/* Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {tiles.map((t) => (
          <Card key={t.label} padding={16}>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>{t.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4, color: t.accent }} className="tnum">{t.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 16, alignItems: 'start' }}>
        {/* List */}
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[
              { k: 'open',             l: 'Open', c: open.length },
              { k: 'evidence-requested', l: 'Awaiting evidence', c: disputes.filter(d => d.state === 'evidence-requested').length },
              { k: 'under-review',     l: 'Under review', c: disputes.filter(d => d.state === 'under-review').length },
              { k: 'all',              l: 'All', c: disputes.length },
            ].map(f => {
              const a = filter === f.k;
              return (
                <button key={f.k} onClick={() => setFilter(f.k)} style={{
                  height: 26, padding: '0 9px',
                  background: a ? 'var(--ink)' : '#fff',
                  color: a ? '#fff' : 'var(--ink-2)',
                  border: '1px solid ' + (a ? 'var(--ink)' : 'var(--line)'),
                  borderRadius: 999,
                  fontSize: 11.5, fontWeight: 500,
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  {f.l}
                  <span style={{ fontSize: 10, color: a ? 'rgba(255,255,255,0.6)' : 'var(--muted)' }} className="tnum">{f.c}</span>
                </button>
              );
            })}
          </div>
          <div style={{ maxHeight: 'calc(100vh - 360px)', overflowY: 'auto' }} className="thin-scroll">
            {filtered.map(d => (
              <DisputeRow key={d.id} d={d} active={d.id === activeId} onClick={() => setActiveId(d.id)} />
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No disputes in this view</div>
            )}
          </div>
        </Card>

        {/* Detail */}
        <DisputeDetail key={active.id} dispute={active} onOpenDebtor={onOpenDebtor} onSubmitDecision={submitDecision} />
      </div>

      {/* Toast */}
      {toast && <DecisionToast toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

function DisputeRow({ d, active, onClick }) {
  const slaCritical = d.slaHours > 0 && d.slaHours < 24;
  const isResolved = d.state.startsWith('resolved');
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left',
      padding: '12px 14px',
      background: active ? 'var(--surface-2)' : 'transparent',
      borderLeft: '3px solid ' + (active ? 'var(--brand)' : 'transparent'),
      borderBottom: '1px solid var(--line-2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{d.id}</span>
        <Badge tone={
          d.state === 'new' ? 'brand' :
          d.state === 'evidence-requested' ? 'warn' :
          d.state === 'under-review' ? 'soft' :
          d.state === 'resolved-upheld' ? 'success' :
          d.state === 'resolved-rejected' ? 'danger' : 'soft'
        } size="sm">
          {d.stateLabel}
        </Badge>
        <div style={{ flex: 1 }} />
        {!isResolved && (
          <span style={{
            fontSize: 10.5, fontWeight: 600,
            color: slaCritical ? 'var(--danger)' : 'var(--muted)',
          }} className="tnum">
            {slaCritical ? '⚠ ' : ''}SLA {d.slaHours}h
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar name={d.debtor} size={28} />
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {d.debtor}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {d.categoryLabel} · <span className="tnum">{d.amount > 0 ? fmtMoney(d.amount, d.ccy) : '—'}</span> · {d.filed}
          </div>
        </div>
      </div>
    </button>
  );
}

function DisputeDetail({ dispute, onOpenDebtor, onSubmitDecision }) {
  const d = dispute;
  const debtor = DEBTORS.find(x => x.id === d.debtorId);
  const isResolved = d.state.startsWith('resolved');

  const catIcons = {
    'unrecognised-charge': 'card',
    'billing-error':       'receipt',
    'fraud':               'shield',
    'service-quality':     'warn',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <Card padding={20}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'var(--brand-soft)', color: 'var(--brand-deep)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon name={catIcons[d.category] || 'warn'} size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{d.id}</span>
              <span style={{ color: 'var(--muted)', fontSize: 11 }}>·</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Filed via {d.channel === 'whatsapp' ? 'WhatsApp' : d.channel === 'email' ? 'Email' : 'Phone call'}, {d.filed}</span>
              <div style={{ flex: 1 }} />
              <Badge tone={
                d.state === 'new' ? 'brand' :
                d.state === 'evidence-requested' ? 'warn' :
                d.state === 'under-review' ? 'soft' :
                d.state === 'resolved-upheld' ? 'success' :
                d.state === 'resolved-rejected' ? 'danger' : 'soft'
              }>{d.stateLabel}</Badge>
            </div>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 600, letterSpacing: '-0.015em' }}>
              {d.categoryLabel}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8, fontSize: 12.5, color: 'var(--ink-3)' }}>
              <button onClick={() => onOpenDebtor(d.debtorId)} style={{ background: 'transparent', border: 'none', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)', cursor: 'pointer' }}>
                <Avatar name={d.debtor} size={22} />
                <span style={{ fontWeight: 600 }}>{d.debtor}</span>
                <Icon name="external" size={11} color="var(--muted)" />
              </button>
              <span>·</span>
              {d.amount > 0 && <span><b className="tnum">{fmtMoney(d.amount, d.ccy)}</b> in dispute</span>}
              {d.amount === 0 && <span>Non-monetary complaint</span>}
              <span>·</span>
              <span>Assigned to {d.assigned === 'You' ? 'you' : d.assigned}</span>
            </div>
          </div>
        </div>

        {/* SLA bar */}
        {!isResolved && (
          <div style={{ marginTop: 16, padding: '10px 12px', background: d.slaHours < 24 ? 'var(--danger-soft)' : 'var(--surface-2)', border: '1px solid ' + (d.slaHours < 24 ? 'rgba(185,28,28,0.18)' : 'var(--line-2)'), borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="clock" size={14} color={d.slaHours < 24 ? 'var(--danger)' : 'var(--muted)'} />
            <span style={{ fontSize: 12, fontWeight: 500, color: d.slaHours < 24 ? 'var(--danger)' : 'var(--ink-2)' }}>
              SLA — <span className="tnum">{d.slaHours}h</span> remaining for initial decision
            </span>
            <div style={{ flex: 1 }} />
            <div style={{ width: 120, height: 5, background: 'var(--card)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--line-2)' }}>
              <div style={{
                width: `${Math.min(100, 100 - (d.slaHours / 72 * 100))}%`,
                height: '100%',
                background: d.slaHours < 24 ? 'var(--danger)' : 'var(--warn)',
              }} />
            </div>
          </div>
        )}
      </Card>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Customer statement */}
          <Card padding={18}>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
              Customer's statement
            </div>
            <div style={{
              padding: 14, background: 'var(--surface-2)', borderRadius: 10,
              fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.6,
              borderLeft: '3px solid var(--brand)',
              fontStyle: 'italic',
            }}>
              "{d.customerStatement || d.summary}"
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <Button kind="secondary" size="sm" icon="whatsapp">Reply on WhatsApp</Button>
              <Button kind="secondary" size="sm" icon="document">Request more info</Button>
            </div>
          </Card>

          {/* Evidence */}
          <Card padding={18}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Evidence · <span className="tnum">{d.evidence.length}</span> {d.evidence.length === 1 ? 'item' : 'items'}
              </div>
              <div style={{ flex: 1 }} />
              <Button kind="ghost" size="sm" icon="plus">Upload</Button>
            </div>
            {d.evidence.length === 0 && (
              <div style={{ padding: 20, textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>No evidence attached yet</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {d.evidence.map(e => (
                <div key={e.name} style={{
                  padding: '10px 12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line-2)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 6,
                    background: 'var(--card)', color: 'var(--ink-3)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--line)',
                  }}>
                    <Icon name={e.kind === 'img' ? 'eye' : 'document'} size={13} />
                  </div>
                  <div style={{ flex: 1, lineHeight: 1.3 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500 }}>{e.name}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)' }} className="tnum">{e.size}</div>
                  </div>
                  {e.verified && <Badge tone="success" size="sm" icon="check">Verified</Badge>}
                  <IconButton icon="download" size={26} iconSize={13} />
                </div>
              ))}
            </div>
          </Card>

          {/* Investigation timeline */}
          <Card padding={18}>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
              Investigation trail
            </div>
            <div style={{ position: 'relative', paddingLeft: 24 }}>
              <div style={{ position: 'absolute', left: 9, top: 6, bottom: 6, width: 1.5, background: 'var(--line)' }} />
              {d.timeline.map((t, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: 14 }}>
                  <div style={{
                    position: 'absolute', left: -24, top: 2,
                    width: 18, height: 18, borderRadius: 9,
                    background: t.kind === 'vox' ? 'var(--vox-soft)' :
                                t.kind === 'sla' ? 'var(--warn-soft)' :
                                t.kind === 'in' ? 'var(--brand-soft)' :
                                'var(--surface)',
                    color: t.kind === 'vox' ? 'var(--vox-deep)' :
                           t.kind === 'sla' ? 'var(--warn)' :
                           t.kind === 'in' ? 'var(--brand-deep)' :
                           'var(--ink-3)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    border: '1.5px solid var(--card)',
                    boxShadow: '0 0 0 1px var(--line)',
                  }}>
                    <Icon name={
                      t.kind === 'vox' ? 'bot' :
                      t.kind === 'sla' ? 'clock' :
                      t.kind === 'in' ? 'arrowDown' :
                      'edit'
                    } size={10} />
                  </div>
                  <div style={{ lineHeight: 1.4 }}>
                    <div style={{ fontSize: 12.5 }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{t.who}</span>
                      <span style={{ color: 'var(--ink-3)', marginLeft: 6 }}>{t.what}</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>{t.at}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Vox recommendation */}
          {d.recommendation && !isResolved && (
            <Card padding={16} style={{ background: 'var(--vox-soft)', borderColor: 'rgba(0,184,217,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Icon name="sparkle" size={14} color="var(--vox-deep)" />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--vox-deep)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Vox · recommendation
                </span>
              </div>
              <div style={{
                padding: 10, background: 'var(--card)', borderRadius: 8,
                border: '1px solid rgba(0,184,217,0.25)',
                marginBottom: 10,
              }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Suggested decision</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--vox-deep)' }}>{d.recommendation.decisionLabel}</div>
                {d.recommendation.amount > 0 && (
                  <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 2 }}>
                    Waive <b className="tnum">{fmtMoney(d.recommendation.amount, d.ccy)}</b>
                  </div>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 12 }}>
                {d.recommendation.rationale}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)' }}>
                <span>Confidence</span>
                <div style={{ flex: 1, height: 5, background: 'var(--card)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${d.recommendation.confidence * 100}%`, height: '100%', background: 'var(--vox-deep)' }} />
                </div>
                <span className="tnum" style={{ fontWeight: 600, color: 'var(--vox-deep)' }}>{Math.round(d.recommendation.confidence * 100)}%</span>
              </div>
            </Card>
          )}

          {/* Decision panel */}
          {!isResolved && <DecisionPanel dispute={d} debtor={debtor} onSubmitDecision={onSubmitDecision} />}

          {/* Resolved summary */}
          {isResolved && <ResolvedSummary dispute={d} debtor={debtor} />}

          {/* Customer info card */}
          {debtor && (
            <Card padding={14}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Customer context</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Avatar name={debtor.name} size={32} />
                <div style={{ flex: 1, lineHeight: 1.3 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{debtor.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{debtor.id} · {debtor.product}</div>
                </div>
              </div>
              <KV k="Total balance" v={fmtMoney(debtor.balance, debtor.ccy)} mono />
              <KV k="Days overdue" v={`${debtor.daysOverdue}d`} />
              <KV k="Risk score" v={`${debtor.riskScore} / 100`} />
              <KV k="Lifetime disputes" v="2 (1 upheld)" />
              <Button kind="secondary" full size="sm" icon="external" onClick={() => onOpenDebtor(debtor.id)} style={{ marginTop: 8 }}>
                Open full case
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Customer message generator (interpolates by decision type) ----------
function customerMessageFor(dispute, debtor, decision) {
  const first = (debtor && debtor.name.split(/\s+/)[0]) || dispute.debtor.split(/\s+/)[0];
  const ccy = dispute.ccy;
  const fullAmount   = dispute.amount > 0 ? fmtMoney(dispute.amount, ccy) : '';
  const partAmount   = dispute.recommendation ? fmtMoney(dispute.recommendation.amount, ccy) : '';
  const keepAmount   = dispute.recommendation ? fmtMoney(dispute.amount - dispute.recommendation.amount, ccy) : '';

  switch (decision) {
    case 'uphold':
      return `Hi ${first}, good news — after reviewing your dispute ${dispute.id}, we're upholding it in full. We've credited ${fullAmount} back to your account; you'll see it within 1 business day. Thanks for your patience 🙏`;
    case 'partial':
      return `Hi ${first}, thanks for your patience on dispute ${dispute.id}. After our review, we're partially upholding it — crediting ${partAmount} back to your account. The remaining ${keepAmount} will stay on your statement; a detailed explanation is in the letter we just emailed.`;
    case 'reject':
      return `Hi ${first}, we've completed the review of dispute ${dispute.id}. After investigating the evidence we weren't able to uphold the claim — the charge will stand. We've emailed a detailed explanation. If anything is unclear please reply here and we'll talk it through.`;
    case 'escalate':
      return `Hi ${first}, your dispute ${dispute.id} has been escalated to our compliance team for a closer look. You'll hear back from them within 5 business days. We've paused all collection activity on this account in the meantime.`;
    default:
      return '';
  }
}

function DecisionPanel({ dispute, debtor, onSubmitDecision }) {
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState('');
  const [confirming, setConfirming] = useState(false);

  // Pre-fill from Vox recommendation
  useEffect(() => {
    if (dispute.recommendation) {
      const map = { 'uphold': 'uphold', 'partial-uphold': 'partial', 'reject': 'reject', 'investigate': 'escalate' };
      const pre = map[dispute.recommendation.decision];
      if (pre) setDecision(pre);
    }
  }, [dispute.id]);

  const options = [
    { k: 'uphold',  l: 'Uphold in full',  desc: 'Waive disputed amount', icon: 'check',  tone: 'success' },
    { k: 'partial', l: 'Uphold partially', desc: 'Waive part, keep part', icon: 'workflows', tone: 'soft' },
    { k: 'reject',  l: 'Reject',           desc: 'Charge stands',         icon: 'close',  tone: 'danger' },
    { k: 'escalate', l: 'Escalate',         desc: 'To compliance / legal', icon: 'forward', tone: 'warn' },
  ];

  const previewMessage = decision && debtor ? customerMessageFor(dispute, debtor, decision) : '';

  function handleSubmit() {
    if (!decision) return;
    if (!confirming) { setConfirming(true); return; }
    onSubmitDecision(dispute.id, decision, note);
    setConfirming(false);
  }

  return (
    <Card padding={16}>
      <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
        Make a decision
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {options.map(o => {
          const a = decision === o.k;
          return (
            <button key={o.k} onClick={() => { setDecision(o.k); setConfirming(false); }} style={{
              padding: '10px 12px',
              background: a ? 'var(--surface-2)' : '#fff',
              border: '1px solid ' + (a ? 'var(--ink)' : 'var(--line)'),
              borderRadius: 8,
              textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 10,
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
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{o.l}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{o.desc}</div>
              </div>
              <Icon name={o.icon} size={14} color="var(--muted)" />
            </button>
          );
        })}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add an internal note for the decision (audit trail)…"
        rows={3}
        style={{
          width: '100%',
          padding: 10,
          background: 'var(--surface-2)',
          border: '1px solid var(--line)',
          borderRadius: 8,
          fontSize: 12.5,
          color: 'var(--ink)',
          resize: 'none',
          outline: 'none',
          fontFamily: 'inherit',
          marginBottom: 10,
        }}
      />

      {/* Customer message preview */}
      {decision && previewMessage && (
        <div style={{
          padding: 10,
          background: '#E8FFF1',
          border: '1px solid rgba(18,140,126,0.2)',
          borderRadius: 8,
          marginBottom: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Icon name="whatsapp" size={12} color="var(--wa-deep)" />
            <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--wa-deep)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              WhatsApp message preview
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.5 }}>
            {previewMessage}
          </div>
        </div>
      )}

      {confirming ? (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button kind="brand" full icon="check" onClick={handleSubmit}>
            Confirm & send
          </Button>
          <Button kind="secondary" size="md" onClick={() => setConfirming(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button kind="brand" full icon="check" disabled={!decision} onClick={handleSubmit}>
          Submit decision &amp; notify customer
        </Button>
      )}
    </Card>
  );
}

// ---------- Resolved summary (shown after submission) ----------
function ResolvedSummary({ dispute, debtor }) {
  const message = customerMessageFor(dispute, debtor, dispute.decision || 'uphold');
  return (
    <Card padding={18} style={{
      background: 'linear-gradient(135deg, #ECFDF3 0%, #FFFFFF 60%)',
      borderColor: 'rgba(21,128,61,0.2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 14,
          background: 'var(--success)', color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="check" size={14} strokeWidth={2.6} />
        </div>
        <div style={{ flex: 1, lineHeight: 1.2 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Decision recorded</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {dispute.decisionAt
              ? `${new Date(dispute.decisionAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} · sent via WhatsApp`
              : 'Sent via WhatsApp · case closed'}
          </div>
        </div>
        <Badge tone="success" icon="check">{dispute.stateLabel}</Badge>
      </div>

      {dispute.decisionNote && (
        <div style={{ padding: 10, background: 'var(--surface-2)', borderRadius: 8, fontSize: 12, color: 'var(--ink-2)', marginBottom: 10, lineHeight: 1.5 }}>
          <div style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>Reviewer note</div>
          {dispute.decisionNote}
        </div>
      )}

      <div style={{
        padding: 10, background: 'var(--card)',
        border: '1px solid rgba(18,140,126,0.2)',
        borderRadius: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Icon name="whatsapp" size={12} color="var(--wa-deep)" />
          <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--wa-deep)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Sent to {dispute.debtor}
          </span>
          <div style={{ flex: 1 }} />
          <Icon name="check" size={12} color="var(--wa-deep)" />
          <Icon name="check" size={12} color="var(--wa-deep)" style={{ marginLeft: -7 }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.5 }}>
          {message}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
        <Button kind="secondary" size="sm" icon="external">View thread</Button>
        <Button kind="ghost" size="sm" icon="download">Download decision letter</Button>
      </div>
    </Card>
  );
}

// ---------- Toast that pops on submit ----------
function DecisionToast({ toast, onClose }) {
  const debtor = DEBTORS.find(d => d.id === toast.dispute.debtorId);
  const message = customerMessageFor(toast.dispute, debtor, toast.decision);
  return (
    <div style={{
      position: 'fixed',
      top: 80, right: 24,
      width: 360,
      background: 'var(--card)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
      zIndex: 9999,
      animation: 'toastSlide 240ms cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <style>{`
        @keyframes toastSlide {
          from { transform: translateX(20px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
      <div style={{
        padding: '12px 14px',
        background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
        color: '#fff',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 14,
          background: 'rgba(255,255,255,0.2)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="check" size={14} strokeWidth={2.6} />
        </div>
        <div style={{ flex: 1, lineHeight: 1.2 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Decision sent to {toast.debtor}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>WhatsApp delivered · case closed</div>
        </div>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none', color: '#fff',
          padding: 4, cursor: 'pointer', display: 'inline-flex',
        }}>
          <Icon name="close" size={14} />
        </button>
      </div>
      <div style={{ padding: 14, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>
        {message}
      </div>
    </div>
  );
}

window.DisputesScreen = DisputesScreen;
