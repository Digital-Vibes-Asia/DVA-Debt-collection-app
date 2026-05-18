// Team / agent management

function TeamScreen() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Team</h2>
        <Badge tone="soft" size="sm">5 human · 1 AI</Badge>
        <div style={{ flex: 1 }} />
        <Button kind="secondary" size="sm" icon="globe">All regions</Button>
        <Button kind="brand" size="sm" icon="plus">Invite agent</Button>
      </div>

      {/* Top — workload heat */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <Card padding={18}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Active cases</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 26, fontWeight: 600 }} className="tnum">546</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>across the team</span>
          </div>
          <div style={{ marginTop: 10, display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
            {AGENTS.map(a => (
              <div key={a.id} title={a.name} style={{
                width: `${a.active / 546 * 100}%`,
                background: a.isAi ? 'var(--vox)' : ['#E11D48','#9F1239','#0EA5E9','#7C3AED','#0F766E'][AGENTS.indexOf(a) % 5],
              }} />
            ))}
          </div>
        </Card>
        <Card padding={18}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Average per agent</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 26, fontWeight: 600 }} className="tnum">27</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>cases (excl. Vox)</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--muted)' }}>Optimal range: 25–35</div>
        </Card>
        <Card padding={18}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Vox automation</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 26, fontWeight: 600, color: 'var(--vox-deep)' }} className="tnum">412</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>cases handled autonomously</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--success)' }}>+ 18% vs last month</div>
        </Card>
      </div>

      {/* Agent table */}
      <Card padding={0}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Roster · this month</h3>
          <div style={{ flex: 1 }} />
          <SearchInput placeholder="Filter agents…" style={{ width: 240 }} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              <Th>Agent</Th>
              <Th>Region</Th>
              <Th align="right">Active</Th>
              <Th align="right">Resolved</Th>
              <Th align="right">Collected (S$)</Th>
              <Th>Utilisation</Th>
              <Th align="center">Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {AGENTS.map((a, i) => {
              const util = (a.hours / 8) * 100;
              return (
                <tr key={a.id} style={{ borderBottom: i === AGENTS.length - 1 ? 'none' : '1px solid var(--line-2)' }}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ position: 'relative' }}>
                        <Avatar name={a.name} isAi={a.isAi} size={32} />
                        {a.online && !a.isAi && (
                          <span style={{
                            position: 'absolute', bottom: -1, right: -1,
                            width: 10, height: 10, borderRadius: 5,
                            background: 'var(--success)', border: '2px solid #fff',
                          }} />
                        )}
                      </div>
                      <div style={{ lineHeight: 1.2 }}>
                        <div style={{ fontWeight: 600 }}>{a.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.role}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{a.region}</Td>
                  <Td align="right"><span className="tnum" style={{ fontWeight: 600 }}>{a.active}</span></Td>
                  <Td align="right"><span className="tnum" style={{ fontWeight: 600 }}>{a.resolved}</span></Td>
                  <Td align="right"><span className="tnum" style={{ fontWeight: 600 }}>{a.collected.toLocaleString()}</span></Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 100, height: 6, background: 'var(--line-2)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, util)}%`, height: '100%',
                          background: util > 90 ? 'var(--danger)' : util > 70 ? 'var(--warn)' : 'var(--success)',
                          borderRadius: 3,
                        }} />
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }} className="tnum">{util.toFixed(0)}%</span>
                    </div>
                  </Td>
                  <Td align="center">
                    {a.isAi ? <VoxBadge size="sm" label="Always on" /> :
                      a.online ? <Badge tone="success" size="sm">Online</Badge> : <Badge tone="soft" size="sm">Offline</Badge>}
                  </Td>
                  <Td>
                    <IconButton icon="more" size={26} iconSize={14} />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

window.TeamScreen = TeamScreen;
