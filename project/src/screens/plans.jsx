// Payment plans — list + plan builder with debtor selection + WA draft modal

// ─── WhatsApp Plan Draft Modal ─────────────────────────────────────
function PlanWAModal({ plan, n, each, onClose }) {
  const [template, setTemplate] = useState('confirm');
  const [sent, setSent]         = useState(false);

  const firstName = plan.debtor.split(' ')[0];
  const dates = Array.from({ length: n }, (_, i) =>
    new Date(2026, 4 + i, 26).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
  );
  const firstDate  = dates[0];
  const lastDate   = dates[dates.length - 1];
  const totalFmt   = `RM ${plan.total.toLocaleString()}`;
  const eachFmt    = `RM ${each.toLocaleString()}`;

  const TEMPLATES = [
    {
      value: 'confirm',
      label: 'Plan confirmation',
      icon:  'check',
      desc:  'Confirm the new payment plan',
      msg: () =>
`Dear ${firstName},

Your payment plan has been set up for your ${plan.id} account.

📋 *Plan summary:*
• Total: *${totalFmt}*
• ${n} monthly instalment${n > 1 ? 's' : ''} of *${eachFmt}*
• First payment: *${firstDate}*
• Final payment: *${lastDate}*

Payments will be processed on the 26th of each month. Please ensure funds are available.

Reply *CONFIRM* to acknowledge or contact us for any changes.

DVA Collections`,
    },
    {
      value: 'reminder',
      label: 'Instalment reminder',
      icon:  'bell',
      desc:  'Remind about upcoming payment',
      msg: () =>
`Dear ${firstName},

This is a friendly reminder that your next instalment of *${eachFmt}* is due on *${firstDate}*.

Account: ${plan.id}
Amount due: *${eachFmt}*

Please ensure payment is made on time to keep your plan on track.

Need help? Reply to this message.

DVA Collections`,
    },
    {
      value: 'broken',
      label: 'Missed payment',
      icon:  'alert',
      desc:  'Follow up on a missed instalment',
      msg: () =>
`Dear ${firstName},

⚠️ We noticed your instalment of *${eachFmt}* for account ${plan.id} was not received on the scheduled date.

Your plan remains active. Please make the overdue payment as soon as possible to avoid penalties.

Outstanding: *${totalFmt}*

Reply to speak with an agent or make a payment now.

DVA Collections`,
    },
    {
      value: 'ptp',
      label: 'PTP follow-up',
      icon:  'clock',
      desc:  'Confirm a promise to pay',
      msg: () =>
`Dear ${firstName},

Thank you for your commitment to settle your account ${plan.id}.

We've noted your promise to pay *${eachFmt}* on *${firstDate}*.

We'll check in after the payment date. If circumstances change, please let us know before the due date.

DVA Collections`,
    },
    {
      value: 'early',
      label: 'Early settlement',
      icon:  'sparkle',
      desc:  'Offer early full settlement discount',
      msg: () =>
`Dear ${firstName},

Great news! As a valued customer, we're offering you an *early settlement discount* on your account ${plan.id}.

Settle the full outstanding balance of *${totalFmt}* by *${firstDate}* and we'll waive all late fees.

This offer is valid for 7 days only. Reply *SETTLE* to learn more or speak with an agent.

DVA Collections`,
    },
  ];

  const active = TEMPLATES.find(t => t.value === template);

  function handleSend() {
    setSent(true);
    setTimeout(() => { onClose(); }, 1600);
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(11,11,15,0.48)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, animation: 'fadeIn 180ms ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 520, maxHeight: '90vh',
        background: 'var(--card)', borderRadius: 18,
        boxShadow: '0 40px 80px -20px rgba(11,11,15,0.5)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        animation: 'slideUp 260ms cubic-bezier(.2,.8,.2,1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 18px', flexShrink: 0,
          background: 'linear-gradient(135deg,rgba(37,211,102,0.09),rgba(37,211,102,0.01))',
          borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg,#128C7E,#25D366)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px -4px rgba(37,211,102,0.5)',
          }}><Icon name="whatsapp" size={18} color="#fff" /></div>
          <div style={{ flex: 1, lineHeight: 1.25 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700 }}>Draft WhatsApp message</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
              To: <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{plan.debtor}</span>
              &nbsp;·&nbsp;Plan <span className="mono">{plan.id}</span>
              &nbsp;·&nbsp;{n} × {eachFmt}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 7, background: 'transparent',
            border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)',
          }}><Icon name="close" size={13} /></button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* 5 template choices */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Message type</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {TEMPLATES.map(t => {
                const sel = template === t.value;
                return (
                  <button key={t.value} onClick={() => setTemplate(t.value)} style={{
                    padding: '9px 12px',
                    background: sel ? 'rgba(18,140,126,0.07)' : 'transparent',
                    border: '1.5px solid ' + (sel ? '#128C7E' : 'var(--line)'),
                    borderRadius: 9, cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'all 130ms ease',
                  }}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.background = 'var(--surface)'; }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                      background: sel ? '#128C7E' : 'var(--surface)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}><Icon name={t.icon} size={13} color={sel ? '#fff' : 'var(--muted)'} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: sel ? '#0B5F58' : 'var(--ink-2)' }}>{t.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{t.desc}</div>
                    </div>
                    {sel && <Icon name="check" size={13} color="#128C7E" strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live message preview */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Preview</div>
            <div style={{ background: '#ECF5E9', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ width: 26, height: 26, borderRadius: 999, background: 'linear-gradient(135deg,#128C7E,#25D366)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="whatsapp" size={13} color="#fff" />
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700 }}>DVA Collections</div>
              </div>
              <div style={{
                background: 'var(--card)', borderRadius: '4px 12px 12px 12px',
                padding: '10px 12px', fontSize: 12, lineHeight: 1.65,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)', color: 'var(--ink)',
              }}>
                {active.msg()}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'right', marginTop: 4 }}>
                {new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })} ✓✓
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--line)', display: 'flex', gap: 8, flexShrink: 0, background: 'var(--card)' }}>
          <button onClick={onClose} style={{
            height: 40, padding: '0 14px', background: 'var(--card)', color: 'var(--ink-2)',
            border: '1px solid var(--line)', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleSend} disabled={sent} style={{
            flex: 1, height: 40,
            background: sent ? '#ECFDF3' : 'linear-gradient(135deg,#128C7E,#25D366)',
            color: sent ? '#15803D' : '#fff', border: sent ? '1px solid #BBF7D0' : 'none',
            borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: sent ? 'default' : 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: sent ? 'none' : '0 6px 18px -6px rgba(18,140,126,0.6)',
            transition: 'all 240ms ease',
          }}>
            {sent
              ? <><Icon name="check" size={14} color="#15803D" strokeWidth={2.5} /> Sent!</>
              : <><Icon name="whatsapp" size={15} /> Send to {plan.debtor.split(' ')[0]}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product icon + colour helper ─────────────────────────────────
function productMeta(product = '') {
  const p = product.toLowerCase();
  if (p.includes('credit card') || p.includes('cimb card') || p.includes('rhb card'))
    return { icon: 'card',     label: 'Credit Card',        color: '#6366F1', soft: 'rgba(99,102,241,0.1)' };
  if (p.includes('housing') || p.includes('home') || p.includes('mortgage'))
    return { icon: 'building', label: 'Home Financing',     color: '#0284C7', soft: 'rgba(2,132,199,0.1)' };
  if (p.includes('personal'))
    return { icon: 'document', label: 'Personal Financing', color: '#059669', soft: 'rgba(5,150,105,0.1)' };
  if (p.includes('asb'))
    return { icon: 'cash',     label: 'ASB Financing',      color: '#D97706', soft: 'rgba(217,119,6,0.1)' };
  if (p.includes('auto') || p.includes('car'))
    return { icon: 'cash',     label: 'Auto Finance',       color: '#DC2626', soft: 'rgba(220,38,38,0.1)' };
  if (p.includes('postpaid') || p.includes('device') || p.includes('broadband') || p.includes('fibre'))
    return { icon: 'mobile',   label: 'Telco / Device',     color: '#7C3AED', soft: 'rgba(124,58,237,0.1)' };
  if (p.includes('rental') || p.includes('purifier') || p.includes('mattress'))
    return { icon: 'refresh',  label: 'Rental Product',     color: '#0891B2', soft: 'rgba(8,145,178,0.1)' };
  if (p.includes('sme') || p.includes('business') || p.includes('term loan') || p.includes('working capital'))
    return { icon: 'building', label: 'Business Loan',      color: '#B45309', soft: 'rgba(180,83,9,0.1)' };
  return   { icon: 'receipt',  label: 'Loan / Financing',   color: 'var(--muted)', soft: 'var(--surface-2)' };
}

// ─── Plan Builder ──────────────────────────────────────────────────
function PlanBuilder({ plan, onClearPlan }) {
  const [n, setN]             = useState(plan ? plan.instalments : 3);
  const [clientId, setClientId] = useState('maybank');
  const [clientOpen, setClientOpen] = useState(false);
  const [waOpen, setWaOpen]   = useState(false);
  const clientRef = useRef(null);

  // Sync slider + client when a plan row is selected
  useEffect(() => {
    if (plan) {
      setN(plan.instalments);
      if (plan.clientId) setClientId(plan.clientId);
    }
  }, [plan]);

  const clients = window.CLIENT_ORGS || [
    { id: 'maybank', code: 'MB', name: 'Maybank', sub: 'Cards & loans · MY', bg: 'linear-gradient(135deg,#FEF3C7,#FCD34D)', fg: '#92400E' },
  ];
  const activeClient = clients.find(c => c.id === clientId) || clients[0];

  const total = plan ? plan.total : 6780;
  const each  = Math.round(total / n);
  const sliderPct = ((n - 1) / 11) * 100;

  const activePlan = plan || { id: 'P-9762', debtor: 'Lim Hui Min', total: 6780, instalments: 3, state: 'new', next: '26 May' };

  useEffect(() => {
    if (!clientOpen) return;
    function onDoc(e) { if (clientRef.current && !clientRef.current.contains(e.target)) setClientOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [clientOpen]);

  return (
    <>
      <Card padding={0} style={{ position: 'sticky', top: 80 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="sparkle" size={15} color="var(--vox-deep)" />
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Build a plan</h3>
            <div style={{ flex: 1 }} />
            {plan && (
              <button onClick={onClearPlan} style={{
                fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px',
              }}>Clear ×</button>
            )}
            <Badge tone="vox" size="sm" icon="bot">Vox draft</Badge>
          </div>
        </div>

        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Client */}
          <div ref={clientRef} style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, marginBottom: 6 }}>Client</div>
            <button onClick={() => setClientOpen(v => !v)} style={{
              width: '100%', padding: '8px 10px',
              background: 'var(--surface-2)', border: '1px solid var(--line)',
              borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                background: activeClient.bg, color: activeClient.fg,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 11,
              }}>{activeClient.code}</div>
              <div style={{ flex: 1, lineHeight: 1.2 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{activeClient.name}</div>
                <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{activeClient.sub}</div>
              </div>
              <Icon name="chevDown" size={13} color="var(--muted)" />
            </button>
            {clientOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                background: 'var(--card)', border: '1px solid var(--line)',
                borderRadius: 10, padding: 4, zIndex: 30, boxShadow: 'var(--shadow-lg)',
              }}>
                {clients.map(c => {
                  const active = c.id === clientId;
                  return (
                    <button key={c.id} onClick={() => { setClientId(c.id); setClientOpen(false); }} style={{
                      width: '100%', padding: '7px 8px',
                      background: active ? 'var(--surface-2)' : 'transparent',
                      border: 'none', borderRadius: 7,
                      display: 'flex', alignItems: 'center', gap: 10,
                      cursor: 'pointer', textAlign: 'left',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface)'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{
                        width: 24, height: 24, borderRadius: 5, flexShrink: 0,
                        background: c.bg, color: c.fg,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 10,
                      }}>{c.code}</div>
                      <div style={{ flex: 1, lineHeight: 1.2 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{c.name}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{c.sub}</div>
                      </div>
                      {active && <Icon name="check" size={12} color="var(--brand)" strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, marginBottom: 6 }}>Product</div>
            {(() => {
              const prod = plan ? plan.product : null;
              const meta = prod ? productMeta(prod) : null;
              return (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px',
                  background: meta ? meta.soft : 'var(--surface-2)',
                  border: '1px solid ' + (meta ? meta.color + '33' : 'var(--line)'),
                  borderRadius: 8, transition: 'all 200ms ease',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 7, flexShrink: 0,
                    background: meta ? meta.color : 'var(--line)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={meta ? meta.icon : 'receipt'} size={15} color="#fff" />
                  </div>
                  <div style={{ flex: 1, lineHeight: 1.25 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: meta ? meta.color : 'var(--muted)' }}>
                      {prod || '—'}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                      {meta ? meta.label : 'Select a debtor to see product'}
                    </div>
                  </div>
                  {prod && (
                    <div style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 7px',
                      background: meta.color + '22', color: meta.color,
                      borderRadius: 999, letterSpacing: '0.04em',
                    }}>
                      {meta.label.toUpperCase().split(' ')[0]}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Debtor — selected from table or default */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, marginBottom: 6 }}>
              Debtor
              {!plan && <span style={{ marginLeft: 6, color: 'var(--brand)', fontSize: 10.5 }}>← click a row to select</span>}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: 10,
              background: plan ? 'rgba(225,29,72,0.05)' : 'var(--surface-2)',
              border: plan ? '1.5px solid rgba(225,29,72,0.2)' : '1.5px dashed var(--line)',
              borderRadius: 9, transition: 'all 200ms ease',
            }}>
              <Avatar name={activePlan.debtor} size={34} />
              <div style={{ flex: 1, lineHeight: 1.25 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{activePlan.debtor}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {activePlan.id} · {activePlan.state === 'broken' ? '⚠️ Broken' : activePlan.state === 'due-today' ? '🔴 Due today' : 'Next: ' + activePlan.next}
                </div>
              </div>
              {plan && <Badge tone={plan.state === 'broken' ? 'danger' : plan.state === 'new' ? 'brand' : 'success'} size="sm">{plan.state}</Badge>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Outstanding" value={fmtMoney(total, 'MYR')} mono large />
            <Field label="Total agreed" value={fmtMoney(total, 'MYR')} mono large />
          </div>

          {/* Slider */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>Number of instalments</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }} className="tnum">{n}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>month{n !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div style={{ position: 'relative', padding: '4px 0 2px' }}>
              <style>{`
                .plan-slider{-webkit-appearance:none;appearance:none;width:100%;height:5px;border-radius:999px;outline:none;cursor:pointer;background:linear-gradient(to right,var(--ink) 0%,var(--ink) ${sliderPct}%,var(--line) ${sliderPct}%,var(--line) 100%);}
                .plan-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:var(--ink);border:2px solid var(--card);box-shadow:0 1px 4px rgba(0,0,0,0.25);cursor:pointer;transition:transform 100ms ease;}
                .plan-slider::-webkit-slider-thumb:hover{transform:scale(1.15);}
                .plan-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:var(--ink);border:2px solid var(--card);cursor:pointer;}
              `}</style>
              <input type="range" min={1} max={12} value={n} onChange={e => setN(Number(e.target.value))} className="plan-slider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 10.5, color: 'var(--muted)' }}>
                <span>1 month</span>
                <span style={{ color: 'var(--ink-2)', fontWeight: 500 }} className="tnum">RM {each.toLocaleString()} / mo</span>
                <span>12 months</span>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <Card padding={12} style={{ background: 'var(--surface-2)' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>
              Schedule · monthly on 26th
            </div>
            <div style={{ maxHeight: 180, overflowY: n > 4 ? 'auto' : 'visible' }} className="thin-scroll">
              {Array.from({ length: n }).map((_, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0',
                  borderBottom: i === n - 1 ? 'none' : '1px solid var(--line-2)',
                }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: 10, fontSize: 10, fontWeight: 600,
                    background: 'var(--card)', color: 'var(--ink-2)', border: '1px solid var(--line)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 12, color: 'var(--ink-2)' }}>
                    {new Date(2026, 4 + i, 26).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600 }} className="tnum">RM {each.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)', display: 'flex' }}>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>Total</span>
              <span style={{ fontSize: 13.5, fontWeight: 600 }} className="tnum">RM {total.toLocaleString()}</span>
            </div>
          </Card>

          {/* Vox */}
          <div style={{ padding: 10, background: 'var(--vox-soft)', border: '1px solid rgba(0,184,217,0.25)', borderRadius: 8, fontSize: 11.5, color: 'var(--vox-deep)', lineHeight: 1.4 }}>
            <b>Vox suggests {n <= 3 ? '3×' : n <= 6 ? '6×' : '12×'}.</b> Customer's payment-history shows reliable monthly bursts. 26th aligns with salary day.
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <Button kind="primary" full icon="whatsapp" onClick={() => setWaOpen(true)}>Send via WhatsApp</Button>
            <Button kind="secondary" icon="document">Save</Button>
          </div>
        </div>
      </Card>

      {waOpen && (
        <PlanWAModal
          plan={activePlan}
          n={n}
          each={each}
          onClose={() => setWaOpen(false)}
        />
      )}
    </>
  );
}

// ─── Plans Screen ──────────────────────────────────────────────────
function PlansScreen({ onOpenDebtor }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { id: 'P-9821', debtor: 'Aishah binti Rahman',       ccy: 'MYR', total: 12450,  instalments: 2, next: '22 May', state: 'active',    progress: 0,  agent: 'You',        clientId: 'maybank', product: 'Personal Financing-i' },
    { id: 'P-9818', debtor: 'Chong Wei Lim',             ccy: 'MYR', total: 28400,  instalments: 3, next: '15 May', state: 'on-track',  progress: 33, agent: 'You',        clientId: 'maybank', product: 'Housing Loan' },
    { id: 'P-9810', debtor: 'Mohd Ridzuan bin Zainal',   ccy: 'MYR', total: 8450,   instalments: 2, next: '20 May', state: 'on-track',  progress: 50, agent: 'Hassan T.',  clientId: 'rhb',     product: 'Personal Loan' },
    { id: 'P-9802', debtor: 'Ahmad Firdaus bin Ismail',  ccy: 'MYR', total: 15800,  instalments: 4, next: 'Today',  state: 'due-today', progress: 25, agent: 'You',        clientId: 'maybank', product: 'Credit Card' },
    { id: 'P-9786', debtor: 'Tan Wei Ming',              ccy: 'MYR', total: 1250,   instalments: 3, next: '26 May', state: 'on-track',  progress: 33, agent: 'Vox AI',     clientId: 'cimb',    product: 'CIMB Credit Card' },
    { id: 'P-9762', debtor: 'Lim Hui Min',               ccy: 'MYR', total: 6780,   instalments: 3, next: '26 May', state: 'new',       progress: 0,  agent: 'Vox AI',     clientId: 'cimb',    product: 'Personal Financing' },
    { id: 'P-9701', debtor: 'Wong Chee Kiong',           ccy: 'MYR', total: 88300,  instalments: 6, next: '12 May', state: 'broken',    progress: 16, agent: 'Hassan T.',  clientId: 'rhb',     product: 'Mortgage' },
  ];

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Summary tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <KpiTile label="Active plans" value="47" delta={12.4} />
          <KpiTile label="Promised this month" value="284,500" prefix="RM" delta={8.1} />
          <KpiTile label="Plans kept" value="81" suffix="%" delta={3.6} accent="var(--success)" />
          <KpiTile label="Plans broken" value="9" delta={-2.4} accent="var(--danger)" />
        </div>

        {/* Plans table */}
        <Card padding={0}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Active payment plans</h3>
            {selectedPlan && (
              <span style={{ marginLeft: 10, fontSize: 11.5, color: 'var(--brand)', fontWeight: 500 }}>
                · {selectedPlan.debtor} loaded in builder →
              </span>
            )}
            <div style={{ flex: 1 }} />
            <Button kind="ghost" size="sm" icon="filter">Filter</Button>
            <Button kind="brand" size="sm" icon="plus">New plan</Button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                <Th>Plan ID</Th><Th>Debtor</Th>
                <Th align="right">Total</Th><Th align="center">Instalments</Th>
                <Th>Next due</Th><Th>Progress</Th><Th>Status</Th><Th>Owner</Th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p, i) => {
                const sel = selectedPlan?.id === p.id;
                return (
                  <tr key={p.id}
                    onClick={() => setSelectedPlan(sel ? null : p)}
                    style={{
                      borderBottom: i === plans.length - 1 ? 'none' : '1px solid var(--line-2)',
                      cursor: 'pointer',
                      background: sel ? 'rgba(225,29,72,0.04)' : 'transparent',
                      transition: 'background 120ms ease',
                    }}
                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = 'var(--surface-2)'; }}
                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {sel && <span style={{ width: 3, height: 18, background: 'var(--brand)', borderRadius: 2, flexShrink: 0 }} />}
                        <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{p.id}</span>
                      </div>
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={p.debtor} size={26} />
                        <span style={{ fontWeight: sel ? 700 : 500 }}>{p.debtor}</span>
                      </div>
                    </Td>
                    <Td align="right"><span className="tnum" style={{ fontWeight: 600 }}>{fmtMoney(p.total, p.ccy)}</span></Td>
                    <Td align="center">
                      <span style={{ padding: '2px 8px', background: 'var(--surface-2)', borderRadius: 999, fontSize: 11.5, color: 'var(--ink-2)', fontWeight: 500 }} className="tnum">
                        {Math.round(p.instalments * p.progress / 100)} of {p.instalments}
                      </span>
                    </Td>
                    <Td>
                      <span style={{ fontWeight: 500, color: p.state === 'due-today' ? 'var(--brand)' : p.state === 'broken' ? 'var(--danger)' : 'var(--ink-2)' }}>{p.next}</span>
                    </Td>
                    <Td>
                      <div style={{ width: 100, height: 6, background: 'var(--line-2)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${p.progress}%`, background: p.state === 'broken' ? 'var(--danger)' : 'var(--success)' }} />
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }} className="tnum">{p.progress}%</div>
                    </Td>
                    <Td>
                      <Badge tone={p.state==='broken'?'danger':p.state==='due-today'?'warn':p.state==='new'?'brand':p.state==='on-track'?'success':'soft'} size="sm">
                        {p.state==='on-track'?'On track':p.state==='due-today'?'Due today':p.state==='broken'?'Broken':p.state==='new'?'New':'Active'}
                      </Badge>
                    </Td>
                    <Td>
                      {p.agent === 'Vox AI' ? <VoxBadge size="sm" /> :
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Avatar name={p.agent === 'You' ? 'Farah Aziz' : p.agent} size={22} />
                          <span style={{ fontSize: 12 }}>{p.agent}</span>
                        </div>}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Right — plan builder */}
      <PlanBuilder plan={selectedPlan} onClearPlan={() => setSelectedPlan(null)} />
    </div>
  );
}

function Field({ label, value, mono, large }) {
  return (
    <div style={{ padding: 10, background: 'var(--surface-2)', borderRadius: 8 }}>
      <div style={{ fontSize: 10.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div className={mono ? 'tnum' : ''} style={{ fontSize: large ? 17 : 13, fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  );
}

window.PlansScreen = PlansScreen;
