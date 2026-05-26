// Reports & analytics

function ReportsScreen() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Period selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'inline-flex', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 9, padding: 3 }}>
          {['Today', 'Week', 'Month', 'Quarter', 'YTD'].map((p, i) => (
            <button key={p} style={{
              padding: '6px 12px',
              background: i === 2 ? 'var(--ink)' : 'transparent',
              color: i === 2 ? '#fff' : 'var(--ink-2)',
              border: 'none', borderRadius: 6,
              fontSize: 12.5, fontWeight: 500,
            }}>{p}</button>
          ))}
        </div>
        <Button kind="secondary" size="sm" icon="globe">All markets</Button>
        <Button kind="secondary" size="sm" icon="user">All agents</Button>
        <div style={{ flex: 1 }} />
        <Button kind="ghost" size="sm" icon="refresh">Refresh</Button>
        <Button kind="secondary" size="sm" icon="download">Export</Button>
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        <KpiTile label="Collected · month" value="1.28M" prefix="S$" delta={KPIS.collectedDelta} />
        <KpiTile label="Recovery rate" value={KPIS.recoveryRate} suffix="%" delta={KPIS.recoveryDelta} />
        <KpiTile label="PTP rate" value={KPIS.promiseToPayRate} suffix="%" delta={KPIS.promiseDelta} />
        <KpiTile label="PTPs kept" value={KPIS.ptpKept} suffix="%" delta={KPIS.ptpKeptDelta} accent="var(--success)" />
        <KpiTile label="Avg time to resolve" value={KPIS.avgDaysToResolve} suffix="d" delta={KPIS.avgDaysDelta} />
        <KpiTile label="Vox share" value={KPIS.voxResolutionShare} suffix="%" delta={KPIS.voxDelta} accent="var(--vox-deep)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        {/* Collection trend */}
        <Card padding={20}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Daily collections</h3>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>SGD-equivalent · last 30 days</div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: 12, fontSize: 11.5 }}>
              <LegendDot color="var(--brand)" label="Agent" />
              <LegendDot color="var(--vox)" label="Vox AI" />
              <LegendDot color="#A1A1AA" label="Self-serve" />
            </div>
          </div>
          <CollectionsChart />
        </Card>

        {/* Recovery by bucket */}
        <Card padding={20}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Recovery by aging</h3>
            <div style={{ flex: 1 }} />
            <Badge tone="soft" size="sm">SGD</Badge>
          </div>
          {RECOVERY_BY_BUCKET.map((r) => {
            const pct = (r.recovered / r.amount) * 100;
            const color = r.bucket === 'Current' ? '#15803D' :
                          r.bucket === '1–30' ? '#92400E' :
                          r.bucket === '31–60' ? '#B45309' :
                          r.bucket === '61–90' ? '#C2410C' : '#9F1239';
            return (
              <div key={r.bucket} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{r.bucket}</span>
                  <div style={{ flex: 1 }} />
                  <span className="tnum" style={{ color: 'var(--muted)' }}>S${r.recovered.toLocaleString()}</span>
                  <span style={{ width: 8 }} />
                  <span className="tnum" style={{ color: color, fontWeight: 600 }}>{pct.toFixed(0)}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Channel performance */}
        <Card padding={20}>
          <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 600 }}>Channel performance</h3>
          {CHANNEL_PERF.map(c => (
            <div key={c.channel} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: c.color }} />
                <span style={{ fontSize: 12.5, fontWeight: 500 }}>{c.channel}</span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>reach <b className="tnum" style={{ color: 'var(--ink-2)' }}>{c.reach}%</b></span>
                <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 10 }}>resolve <b className="tnum" style={{ color: 'var(--ink-2)' }}>{c.resolve}%</b></span>
              </div>
              <div style={{ position: 'relative', height: 6, background: 'var(--line-2)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${c.reach}%`, background: c.color, opacity: 0.3, borderRadius: 3 }} />
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${c.resolve}%`, background: c.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8, padding: 10, background: 'var(--vox-soft)', borderRadius: 8, fontSize: 12, color: 'var(--vox-deep)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="sparkle" size={14} />
            <span><b>Vox insight:</b> Agent calls resolve at 52% but reach only 64%. Pair with WhatsApp follow-up to lift resolve to ~71%.</span>
          </div>
        </Card>

        {/* Agent leaderboard */}
        <Card padding={20}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Agent leaderboard</h3>
            <div style={{ flex: 1 }} />
            <Badge tone="soft" size="sm">This month</Badge>
          </div>
          {AGENTS.map((a, i) => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              borderBottom: i === AGENTS.length - 1 ? 'none' : '1px solid var(--line-2)',
            }}>
              <span style={{
                width: 24, textAlign: 'center', fontSize: 12, color: 'var(--muted)', fontWeight: 600,
              }} className="tnum">{i + 1}</span>
              <Avatar name={a.name} isAi={a.isAi} size={32} />
              <div style={{ flex: 1, lineHeight: 1.3 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.region} · {a.resolved} resolved</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }} className="tnum">S${a.collected.toLocaleString()}</div>
                <div style={{ fontSize: 10.5, color: 'var(--success)' }}>+{(8 + Math.random() * 15).toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--muted)' }}>
      <span style={{ width: 8, height: 8, borderRadius: 4, background: color }} />
      {label}
    </span>
  );
}

function CollectionsChart() {
  // Stacked bar chart, 30 days
  const days = 30;
  // Generate plausible mock data
  const data = useMemo(() => {
    return Array.from({ length: days }).map((_, i) => {
      const seed = Math.sin(i * 1.7) * 0.5 + 0.5;
      const total = 32000 + seed * 28000 + (i > 22 ? 18000 : 0);
      const agent = total * (0.5 + Math.sin(i) * 0.08);
      const vox   = total * (0.22 + Math.cos(i * 0.7) * 0.05);
      const self  = total - agent - vox;
      return { agent, vox, self, total };
    });
  }, [days]);
  const max = Math.max(...data.map(d => d.total));

  return (
    <div>
      <div style={{ height: 220, display: 'flex', alignItems: 'flex-end', gap: 4, padding: '12px 0' }}>
        {data.map((d, i) => {
          const h = (d.total / max) * 100;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
              <div style={{ height: `${h}%`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ height: `${(d.self / d.total) * 100}%`, background: '#A1A1AA', borderRadius: '3px 3px 0 0' }} />
                <div style={{ height: `${(d.vox / d.total) * 100}%`, background: 'var(--vox)' }} />
                <div style={{ height: `${(d.agent / d.total) * 100}%`, background: 'var(--brand)', borderRadius: i === data.length - 1 ? 0 : 0 }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--muted)', paddingTop: 6, borderTop: '1px solid var(--line-2)' }}>
        <span>16 Apr</span><span>23 Apr</span><span>30 Apr</span><span>7 May</span><span>14 May</span>
      </div>
    </div>
  );
}

window.ReportsScreen = ReportsScreen;
