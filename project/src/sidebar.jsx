// Left navigation sidebar

function PulseLogo({ size = 28 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: size, height: size, borderRadius: 8,
        background: 'linear-gradient(135deg, #0B0B0F 0%, #1A1A21 60%, #4C0519 100%)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 1px rgba(225,29,72,0.4), 0 4px 12px rgba(225,29,72,0.18)',
        position: 'relative',
        flexShrink: 0,
      }}>
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h3l2-5 4 10 2-5 2 3h5" />
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
          DVA <span style={{ color: 'var(--brand)' }}>Pulse</span>
        </span>
        <span style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Debt collection CRM
        </span>
      </div>
    </div>
  );
}

const NAV_GROUPS = [
  {
    label: 'Work',
    items: [
      { id: 'debtors',   label: 'Debtors',     icon: 'debtors',   count: 348 },
      { id: 'inbox',     label: 'WhatsApp',    icon: 'whatsapp',  count: 3, accent: 'wa' },
      { id: 'calls',     label: 'Call console', icon: 'call' },
      { id: 'plans',     label: 'Payment plans', icon: 'plans',  count: 47 },
    ],
  },
  {
    label: 'Casework',
    items: [
      { id: 'disputes',  label: 'Disputes',     icon: 'warn',     count: 4, accent: 'brand' },
      { id: 'hardship',  label: 'Hardship reviews', icon: 'heart', count: 2 },
      { id: 'legal',     label: 'Legal queue',  icon: 'shield',   count: 7 },
    ],
  },
  {
    label: 'Automate',
    items: [
      { id: 'workflows', label: 'Workflows',   icon: 'workflows' },
      { id: 'vox',       label: 'Vox AI',      icon: 'bot',       voxLive: true },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'reports',   label: 'Reports',     icon: 'reports' },
      { id: 'team',      label: 'Team',        icon: 'team' },
    ],
  },
  {
    label: 'Setup',
    items: [
      { id: 'settings',  label: 'Settings',    icon: 'settings' },
      { id: 'mobile',    label: 'Mobile preview', icon: 'mobile' },
    ],
  },
];

function Sidebar({ current, onNav }) {
  const [orgOpen, setOrgOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [org, setOrg] = useState({ id: 'maybank', code: 'MB', name: 'Maybank', sub: 'Cards & loans · MY' });

  return (
    <aside style={{
      width: 232,
      flexShrink: 0,
      background: 'var(--surface-2)',
      borderRight: '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--line-2)' }}>
        <PulseLogo />
      </div>

      {/* Org switcher */}
      <div style={{ position: 'relative', margin: 12 }}>
        <button onClick={() => setOrgOpen(v => !v)} style={{
          width: '100%',
          padding: '8px 10px',
          background: '#fff',
          border: '1px solid var(--line)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textAlign: 'left',
          cursor: 'pointer',
        }}>
          {(() => {
            const orgData = (window.CLIENT_ORGS || []).find(o => o.id === org.id) || {};
            return (
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: orgData.bg || 'linear-gradient(135deg, #FEF3C7, #FCD34D)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: orgData.fg || '#92400E', fontWeight: 700, fontSize: 12,
              }}>{org.code}</div>
            );
          })()}
          <div style={{ flex: 1, lineHeight: 1.2 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{org.name}</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{org.sub}</div>
          </div>
          <Icon name="chevDown" size={14} color="var(--muted)" />
        </button>
        {orgOpen && (
          <>
            <div onClick={() => setOrgOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 20 }} />
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
              background: '#fff', border: '1px solid var(--line)',
              borderRadius: 10, padding: 4,
              boxShadow: 'var(--shadow-lg)',
              zIndex: 21,
            }}>
              {(window.CLIENT_ORGS || []).map(o => (
                <button key={o.id} onClick={() => { setOrg(o); setOrgOpen(false); window.ACTIVE_CLIENT_ID = o.id; window.__setActiveClient && window.__setActiveClient(o.id); window.toast({ title: `Switched to ${o.name}`, description: o.sub, icon: 'building' }); }} style={{
                  width: '100%', textAlign: 'left',
                  padding: '8px 8px',
                  background: org.id === o.id ? 'var(--surface-2)' : 'transparent',
                  border: 'none', borderRadius: 7,
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 6,
                    background: o.bg, color: o.fg,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 11,
                  }}>{o.code}</div>
                  <div style={{ flex: 1, lineHeight: 1.2 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{o.name}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{o.sub}</div>
                  </div>
                  {org.id === o.id && <Icon name="check" size={12} color="var(--brand)" />}
                </button>
              ))}
              <div style={{ height: 1, background: 'var(--line-2)', margin: '4px 0' }} />
              <button onClick={() => { setOrgOpen(false); window.toast({ title: 'Onboard new client', description: 'Opening client setup wizard', icon: 'plus', tone: 'brand' }); }} style={{
                width: '100%', textAlign: 'left',
                padding: '8px 10px',
                background: 'transparent', border: 'none',
                borderRadius: 7,
                display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer',
                fontSize: 12.5, color: 'var(--brand)',
                fontWeight: 500,
              }}>
                <Icon name="plus" size={13} />
                Onboard new client
              </button>
            </div>
          </>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 12px' }} className="thin-scroll">
        {NAV_GROUPS.map((g) => (
          <div key={g.label} style={{ marginTop: 10 }}>
            <div style={{
              padding: '6px 12px',
              fontSize: 10.5, fontWeight: 600,
              color: 'var(--muted-2)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>{g.label}</div>
            {g.items.map((it) => {
              const active = current === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => onNav(it.id)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    margin: '1px 0',
                    background: active ? '#fff' : 'transparent',
                    border: '1px solid ' + (active ? 'var(--line)' : 'transparent'),
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: active ? 'var(--ink)' : 'var(--ink-3)',
                    fontSize: 13.5,
                    fontWeight: active ? 600 : 500,
                    textAlign: 'left',
                    boxShadow: active ? 'var(--shadow-sm)' : 'none',
                    position: 'relative',
                  }}
                >
                  {active && (
                    <span style={{
                      position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)',
                      width: 3, height: 18, borderRadius: 2,
                      background: 'var(--brand)',
                    }} />
                  )}
                  <Icon name={it.icon} size={17} color={active ? 'var(--brand)' : 'currentColor'} />
                  <span style={{ flex: 1 }}>{it.label}</span>
                  {it.voxLive && (
                    <span className="live-dot vox" style={{ width: 6, height: 6 }} />
                  )}
                  {it.count !== undefined && (
                    <span style={{
                      fontSize: 10.5, padding: '1px 6px', borderRadius: 9,
                      background: it.accent === 'wa' ? 'var(--wa)' : it.accent === 'brand' ? 'var(--brand)' : (active ? 'var(--ink)' : 'var(--line-2)'),
                      color: (it.accent === 'wa' || it.accent === 'brand') ? '#fff' : (active ? '#fff' : 'var(--muted)'),
                      fontWeight: 600, lineHeight: 1.4,
                    }}>{it.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Vox status footer */}
      <div style={{
        margin: 10,
        padding: 12,
        borderRadius: 10,
        background: 'linear-gradient(135deg, #0B0B0F 0%, #1A1A21 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 100% 0%, rgba(0,184,217,0.18) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, position: 'relative' }}>
          <Avatar isAi name="Vox" size={26} />
          <div style={{ flex: 1, lineHeight: 1.2 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Vox · cohort #1</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>4 calls in progress</div>
          </div>
          <span className="vox-bars" style={{ color: 'var(--vox)', height: 12 }}>
            <span /><span /><span /><span /><span />
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, position: 'relative' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }} className="tnum">412</div>
            <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)' }}>active</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }} className="tnum">28%</div>
            <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)' }}>resolve rate</div>
          </div>
        </div>
      </div>

      {/* User */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setUserOpen(v => !v)} style={{
          width: '100%',
          padding: 10,
          borderTop: '1px solid var(--line-2)',
          background: 'transparent', border: 'none', borderBottom: 'none', borderLeft: 'none', borderRight: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
        }}>
          <Avatar name="Farah Aziz" size={32} />
          <div style={{ flex: 1, lineHeight: 1.2, textAlign: 'left' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>Farah Aziz</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>Senior Agent · MY/SG</div>
          </div>
          <Icon name="chevDown" size={14} color="var(--muted)" />
        </button>
        {userOpen && (
          <>
            <div onClick={() => setUserOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 20 }} />
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 4px)', left: 8, right: 8,
              background: '#fff', border: '1px solid var(--line)',
              borderRadius: 10, padding: 4,
              boxShadow: 'var(--shadow-lg)',
              zIndex: 21,
            }}>
              {[
                { icon: 'user',     label: 'Profile & status' },
                { icon: 'settings', label: 'Preferences',     onClick: () => onNav('settings') },
                { icon: 'bell',     label: 'Notification rules' },
                { icon: 'globe',    label: 'Language: English',    sub: 'BM · EN · 中文' },
              ].map((it, i) => (
                <button key={i} onClick={() => { setUserOpen(false); if (it.onClick) it.onClick(); else window.toast({ title: it.label, icon: it.icon }); }} style={{
                  width: '100%', textAlign: 'left',
                  padding: '8px 10px',
                  background: 'transparent', border: 'none',
                  borderRadius: 7,
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer',
                  fontSize: 12.5, color: 'var(--ink-2)',
                }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <Icon name={it.icon} size={14} color="var(--muted)" />
                  <span style={{ flex: 1 }}>{it.label}</span>
                  {it.sub && <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{it.sub}</span>}
                </button>
              ))}
              <div style={{ height: 1, background: 'var(--line-2)', margin: '4px 0' }} />
              <button onClick={() => { setUserOpen(false); window.toast({ title: 'Signed out', tone: 'default', icon: 'lock' }); }} style={{
                width: '100%', textAlign: 'left',
                padding: '8px 10px',
                background: 'transparent', border: 'none',
                borderRadius: 7,
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'pointer',
                fontSize: 12.5, color: 'var(--danger)',
                fontWeight: 500,
              }}>
                <Icon name="lock" size={13} />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
window.PulseLogo = PulseLogo;
