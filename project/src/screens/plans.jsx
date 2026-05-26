// Payment plans — list of active plans + a featured plan builder modal-like card

function PlansScreen({ onOpenDebtor }) {
  const plans = [
    { id: 'P-9821', debtor: 'Aishah binti Rahman',       ccy: 'MYR', total: 12450,  instalments: 2, next: '22 May', state: 'active',   progress: 0,  agent: 'You' },
    { id: 'P-9818', debtor: 'Chong Wei Lim',             ccy: 'MYR', total: 28400,  instalments: 3, next: '15 May', state: 'on-track', progress: 33, agent: 'You' },
    { id: 'P-9810', debtor: 'Mohd Ridzuan bin Zainal',   ccy: 'MYR', total: 8450,   instalments: 2, next: '20 May', state: 'on-track', progress: 50, agent: 'Hassan T.' },
    { id: 'P-9802', debtor: 'Ahmad Firdaus bin Ismail',  ccy: 'MYR', total: 15800,  instalments: 4, next: 'Today',  state: 'due-today',progress: 25, agent: 'You' },
    { id: 'P-9786', debtor: 'Tan Wei Ming',              ccy: 'MYR', total: 1250,   instalments: 3, next: '26 May', state: 'on-track', progress: 33, agent: 'Vox AI' },
    { id: 'P-9762', debtor: 'Lim Hui Min',               ccy: 'MYR', total: 6780,   instalments: 3, next: '26 May', state: 'new',      progress: 0,  agent: 'Vox AI' },
    { id: 'P-9701', debtor: 'Wong Chee Kiong',           ccy: 'MYR', total: 88300,  instalments: 6, next: '12 May', state: 'broken',   progress: 16, agent: 'Hassan T.' },
  ];

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Summary tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <KpiTile label="Active plans" value="47" delta={12.4} />
          <KpiTile label="Promised this month" value="284,500" prefix="S$" delta={8.1} />
          <KpiTile label="Plans kept" value="81" suffix="%" delta={3.6} accent="var(--success)" />
          <KpiTile label="Plans broken" value="9" delta={-2.4} accent="var(--danger)" />
        </div>

        {/* Plans table */}
        <Card padding={0}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Active payment plans</h3>
            <div style={{ flex: 1 }} />
            <Button kind="ghost" size="sm" icon="filter">Filter</Button>
            <Button kind="brand" size="sm" icon="plus">New plan</Button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                <Th>Plan ID</Th>
                <Th>Debtor</Th>
                <Th align="right">Total</Th>
                <Th align="center">Instalments</Th>
                <Th>Next due</Th>
                <Th>Progress</Th>
                <Th>Status</Th>
                <Th>Owner</Th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i === plans.length - 1 ? 'none' : '1px solid var(--line-2)', cursor: 'pointer' }} onClick={() => onOpenDebtor && onOpenDebtor()}>
                  <Td><span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{p.id}</span></Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={p.debtor} size={26} />
                      <span style={{ fontWeight: 500 }}>{p.debtor}</span>
                    </div>
                  </Td>
                  <Td align="right"><span className="tnum" style={{ fontWeight: 600 }}>{fmtMoney(p.total, p.ccy)}</span></Td>
                  <Td align="center">
                    <span style={{
                      padding: '2px 8px', background: 'var(--surface-2)', borderRadius: 999,
                      fontSize: 11.5, color: 'var(--ink-2)', fontWeight: 500,
                    }} className="tnum">
                      {Math.round(p.instalments * p.progress / 100)} of {p.instalments}
                    </span>
                  </Td>
                  <Td>
                    <span style={{
                      fontWeight: 500,
                      color: p.state === 'due-today' ? 'var(--brand)' : p.state === 'broken' ? 'var(--danger)' : 'var(--ink-2)',
                    }}>{p.next}</span>
                  </Td>
                  <Td>
                    <div style={{ width: 100, height: 6, background: 'var(--line-2)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${p.progress}%`,
                        background: p.state === 'broken' ? 'var(--danger)' : 'var(--success)',
                      }} />
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }} className="tnum">{p.progress}%</div>
                  </Td>
                  <Td>
                    <Badge tone={
                      p.state === 'broken' ? 'danger' :
                      p.state === 'due-today' ? 'warn' :
                      p.state === 'new' ? 'brand' :
                      p.state === 'on-track' ? 'success' : 'soft'
                    } size="sm">
                      {p.state === 'on-track' ? 'On track' :
                       p.state === 'due-today' ? 'Due today' :
                       p.state === 'broken' ? 'Broken' :
                       p.state === 'new' ? 'New' : 'Active'}
                    </Badge>
                  </Td>
                  <Td>
                    {p.agent === 'Vox AI' ? <VoxBadge size="sm" /> :
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Avatar name={p.agent === 'You' ? 'Farah Aziz' : p.agent} size={22} />
                        <span style={{ fontSize: 12 }}>{p.agent}</span>
                      </div>
                    }
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Right — plan builder */}
      <PlanBuilder />
    </div>
  );
}

function PlanBuilder() {
  const [n, setN] = useState(3);
  const total = 6780;
  const ccy = 'MYR';
  const each = Math.round(total / n);

  return (
    <Card padding={0} style={{ position: 'sticky', top: 80 }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="sparkle" size={15} color="var(--vox-deep)" />
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Build a plan</h3>
          <div style={{ flex: 1 }} />
          <Badge tone="vox" size="sm" icon="bot">Vox draft</Badge>
        </div>
      </div>

      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, marginBottom: 6 }}>For</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, background: 'var(--surface-2)', borderRadius: 8 }}>
            <Avatar name="Lim Hui Min" size={32} />
            <div style={{ flex: 1, lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Lim Hui Min</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>D-2810 · Credit Card · 30d overdue</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Outstanding" value={fmtMoney(total, ccy)} mono large />
          <Field label="Total agreed" value={fmtMoney(total, ccy)} mono large />
        </div>

        {/* Instalments */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, marginBottom: 8 }}>Number of instalments</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[2, 3, 4, 6].map(k => (
              <button key={k} onClick={() => setN(k)} style={{
                flex: 1, padding: '10px 0',
                background: n === k ? 'var(--ink)' : '#fff',
                color: n === k ? '#fff' : 'var(--ink-2)',
                border: '1px solid ' + (n === k ? 'var(--ink)' : 'var(--line)'),
                borderRadius: 8,
                fontSize: 14, fontWeight: 600,
              }} className="tnum">{k}×</button>
            ))}
          </div>
        </div>

        {/* Generated plan */}
        <Card padding={12} style={{ background: 'var(--surface-2)' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>
            Schedule · monthly on 26th
          </div>
          {Array.from({ length: n }).map((_, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderBottom: i === n - 1 ? 'none' : '1px solid var(--line-2)',
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 11, fontSize: 11, fontWeight: 600,
                background: '#fff', color: 'var(--ink-2)',
                border: '1px solid var(--line)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 12, color: 'var(--ink-2)' }}>
                {new Date(2026, 4 + i, 26).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600 }} className="tnum">RM {each.toLocaleString()}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)', display: 'flex' }}>
            <span style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>Total</span>
            <span style={{ fontSize: 13.5, fontWeight: 600 }} className="tnum">RM {total.toLocaleString()}</span>
          </div>
        </Card>

        {/* Vox rationale */}
        <div style={{
          padding: 10, background: 'var(--vox-soft)',
          border: '1px solid rgba(0,184,217,0.25)', borderRadius: 8,
          fontSize: 11.5, color: 'var(--vox-deep)', lineHeight: 1.4,
        }}>
          <b>Vox suggests 3×.</b> Customer's payment-history shows reliable monthly bursts. 26th aligns with salary day.
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <Button kind="primary" full icon="whatsapp">Send via WhatsApp</Button>
          <Button kind="secondary" icon="document">Save</Button>
        </div>
      </div>
    </Card>
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
