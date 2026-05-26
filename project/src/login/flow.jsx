// Login flow — each role has its own dedicated page.
// Role is read from the URL path (/login/sales-manager, etc.)
// Clicking a role chip navigates to that role's page.
// Sign in → verifying → welcome.

const { useState: useS, useEffect: useE, useRef: useR } = React;

const ROLE_CONFIG = {
  'sales-manager': {
    title: 'Sales Manager',
    sub: 'Your accounts',
    icon: 'user',
    accent: '#E11D48',
    accentSoft: '#FFF1F3',
    bg: 'linear-gradient(155deg, #FFE4E6 0%, #FBFAF7 55%, #F6F5F1 100%)',
    factor: 'sms',
    factorLabel: 'SMS code',
    factorHint: 'We\u2019ll text the code to +60 12 ••• •• 42',
    factorIcon: 'mobile',
    headlineLead: 'Your accounts.',
    headlineTail: 'Your moves.',
    blurb: 'Work the portfolio assigned to you — debtors, conversations, plans, and today\u2019s queue.',
    scopeLine: 'You only see accounts assigned to you.',
    welcomeRouting: 'Routing to your portfolio',
    user: { name: 'Farah Aziz', email: 'farah.aziz@nusantarabank.my', region: 'KL Central · Tier 2' },
  },
  'senior-manager': {
    title: 'Senior Manager',
    sub: 'All sales managers',
    icon: 'team',
    accent: '#B45309',
    accentSoft: '#FEF3C7',
    bg: 'linear-gradient(155deg, #FEF3C7 0%, #FAF4E8 55%, #F6F5F1 100%)',
    factor: 'push',
    factorLabel: 'Authenticator push',
    factorHint: 'We\u2019ll prompt your registered iPhone after sign in',
    factorIcon: 'mobile',
    headlineLead: 'Every manager.',
    headlineTail: 'One floor.',
    blurb: 'See aggregate book, utilisation, and casework across 5 sales managers and 26 agents.',
    scopeLine: 'Floor-wide visibility across all sales managers under you.',
    welcomeRouting: 'Routing to floor command',
    user: { name: 'Daniel Ong', email: 'd.ong@nusantarabank.my', region: 'MY · Multi-region · Tier 3' },
  },
  'head-of-sales': {
    title: 'Head of Sales',
    sub: 'Everyone · all dashboards',
    icon: 'star',
    accent: '#00B8D9',
    accentSoft: '#E6FAFD',
    bg: 'linear-gradient(160deg, #0B0B0F 0%, #1A1A21 55%, #003040 100%)',
    factor: 'key',
    factorLabel: 'Hardware security key',
    factorHint: 'YubiKey 5C · tap the contact within 30 seconds',
    factorIcon: 'cpu',
    headlineLead: 'Every dashboard.',
    headlineTail: 'One key away.',
    blurb: 'Cross-team, cross-region command console. See every senior manager, every sales manager, every account.',
    scopeLine: 'Network-wide read. Every action stored to legal hold.',
    welcomeRouting: 'Authorizing Head of Sales session',
    user: { name: 'Ravi Subramaniam', email: 'r.subramaniam@digitalvibesasia.com', region: 'Global · Tier 4' },
    dark: true,
  },
};

// ─── Right-pane previews ─────────────────────────────────────────

function SalesManagerPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#9F1239', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
          <StatDot color="#E11D48" pulse /> Tue 13 May · live
        </div>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', maxWidth: 460, lineHeight: 1.15, fontFamily: 'var(--font-serif)' }}>
          Farah, <em style={{ color: '#E11D48', fontStyle: 'italic' }}>23 accounts</em> and 4 calls before lunch.
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 6 }}>
        {[
          { label: 'Your book',  value: 'RM 1.24M', sub: '23 accounts' },
          { label: 'Today',      value: '4 calls',  sub: 'next 10:30' },
          { label: 'PTPs · wk',  value: '11',       sub: '↑ 2 vs last' },
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #EFEDE8', borderRadius: 12, padding: '14px 14px' }}>
            <div style={{ fontSize: 10.5, color: '#71717A', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }} className="tnum">{k.value}</div>
            <div style={{ fontSize: 11.5, color: '#A1A1AA', marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: '#fff', border: '1px solid #EFEDE8', borderRadius: 12,
        padding: '4px 0',
        boxShadow: '0 24px 48px -28px rgba(11,11,15,0.16)',
        flex: 1, overflow: 'hidden',
      }}>
        <div style={{ padding: '10px 14px 6px', borderBottom: '1px solid #F1F1EE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Your work queue · 23 of 23</div>
          <div style={{ fontSize: 11, color: '#A1A1AA' }} className="mono">sorted by due ↓</div>
        </div>
        {[
          { name: 'Lim Wei Jun', id: 'NB-2841', amt: 'RM 8,420',  bucket: '60–89d', tone: '#B45309', bg: '#FEF3C7', due: 'Today' },
          { name: 'Siti Nurhaliza', id: 'NB-2902', amt: 'RM 3,140',  bucket: '30–59d', tone: '#15803D', bg: '#ECFDF3', due: 'Today' },
          { name: 'Pradeep Kumar', id: 'NB-2715', amt: 'RM 14,280', bucket: '90+',    tone: '#B91C1C', bg: '#FEE2E2', due: 'Overdue' },
          { name: 'Chen Mei Hua', id: 'NB-3104', amt: 'RM 5,820',  bucket: '30–59d', tone: '#15803D', bg: '#ECFDF3', due: 'Tomorrow' },
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px',
            borderTop: i ? '1px solid #F5F4EE' : 'none',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 999,
              background: '#F1F1EE', color: '#3F3F46',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: 11,
            }}>{r.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: '#A1A1AA' }} className="mono">{r.id}</div>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: r.bg, color: r.tone }}>{r.bucket}</span>
            <div style={{ fontSize: 11, color: '#71717A', minWidth: 60, textAlign: 'right' }}>{r.due}</div>
            <div style={{ fontSize: 13, fontWeight: 600, minWidth: 84, textAlign: 'right' }} className="tnum">{r.amt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeniorManagerPreview() {
  const pods = [
    { name: 'Farah Aziz',    region: 'KL Central',    agents: 6, book: '1.24', util: 0.78, color: '#E11D48' },
    { name: 'Aisha Rahman',  region: 'Johor Bahru',   agents: 7, book: '1.45', util: 0.81, color: '#15803D' },
    { name: 'Vikram Suresh', region: 'Singapore',     agents: 4, book: '2.18', util: 0.72, color: '#006C82' },
    { name: 'Lim Cheng Wei', region: 'Penang',        agents: 5, book: '0.92', util: 0.64, color: '#B45309' },
    { name: 'Mei Lin Tan',   region: 'Sabah/Sarawak', agents: 4, book: '0.68', util: 0.55, color: '#9F1239' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#92400E', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
          <StatDot color="#B45309" pulse /> Floor command
        </div>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', maxWidth: 500, lineHeight: 1.15, fontFamily: 'var(--font-serif)' }}>
          Daniel, <em style={{ color: '#B45309', fontStyle: 'italic' }}>5 sales managers</em> · 26 agents · 348 active accounts.
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Floor book',     value: 'RM 6.47M', sub: '↑ 4.2% MoM' },
          { label: 'Managers',       value: '5',        sub: 'all online'  },
          { label: 'Agents',         value: '26',       sub: '24 active'   },
          { label: 'Promised · day', value: 'RM 184k',  sub: '63% kept'    },
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #EFEDE8', borderRadius: 12, padding: '12px 12px' }}>
            <div style={{ fontSize: 10, color: '#71717A', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em' }} className="tnum">{k.value}</div>
            <div style={{ fontSize: 11, color: '#A1A1AA', marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: '#fff', border: '1px solid #EFEDE8', borderRadius: 12,
        flex: 1, overflow: 'hidden',
        boxShadow: '0 24px 48px -28px rgba(11,11,15,0.16)',
      }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #F1F1EE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Sales managers under you</div>
          <div style={{ fontSize: 11, color: '#A1A1AA' }} className="mono">sort: utilisation ↓</div>
        </div>
        {pods.map((p, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '32px 1fr 80px 80px 1fr 50px',
            alignItems: 'center', gap: 12,
            padding: '10px 14px',
            borderTop: i ? '1px solid #F5F4EE' : 'none',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: p.color + '15', color: p.color,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 11,
              border: '1px solid ' + p.color + '33',
            }}>{p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 10.5, color: '#A1A1AA' }}>{p.region}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#A1A1AA' }}>Agents</div>
              <div style={{ fontSize: 12.5, fontWeight: 600 }} className="tnum">{p.agents}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#A1A1AA' }}>Book</div>
              <div style={{ fontSize: 12.5, fontWeight: 600 }} className="tnum">RM {p.book}M</div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#A1A1AA', marginBottom: 3 }}>
                <span>Util</span>
                <span style={{ color: '#0B0B0F', fontWeight: 600 }} className="tnum">{Math.round(p.util * 100)}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 999, background: '#F1F1EE', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: (p.util * 100) + '%', background: p.color }} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, padding: '2px 6px', borderRadius: 999, background: '#ECFDF3', color: '#15803D', fontWeight: 600 }}>
                <StatDot color="#15803D" /> on
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeadOfSalesPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', color: '#FBFAF7' }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#00B8D9', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
          <StatDot color="#00B8D9" pulse /> All dashboards · live
        </div>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', maxWidth: 460, lineHeight: 1.15, fontFamily: 'var(--font-serif)' }}>
          4 client orgs · 5 regions · <em style={{
            background: 'linear-gradient(120deg, #00B8D9, #FBFAF7, #E11D48)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontStyle: 'italic',
          }}>RM 184.6M</em> under your watch.
        </h2>
      </div>

      <div style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: '18px 18px',
        backdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Network book</div>
            <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.025em', marginTop: 4 }} className="tnum">
              RM <span style={{ color: '#00B8D9' }}>184.6M</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>Recovery YTD</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#86EFAC' }} className="tnum">+ 12.4%</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { name: 'Malaysia',            val: 64.2, pct: 0.35, color: '#E11D48' },
            { name: 'Singapore',           val: 51.8, pct: 0.28, color: '#00B8D9' },
            { name: 'Indonesia',           val: 41.4, pct: 0.22, color: '#B45309' },
            { name: 'Philippines',         val: 18.0, pct: 0.10, color: '#15803D' },
            { name: 'Thailand · Vietnam',  val:  9.2, pct: 0.05, color: '#9F1239' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 84px', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{r.name}</div>
              <div style={{ height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: (r.pct * 100 / 0.35) + '%', background: r.color, borderRadius: 999 }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, textAlign: 'right' }} className="tnum">RM {r.val.toFixed(1)}M</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        flex: 1,
        background: 'linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Client portfolios</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { code: 'NB', name: 'Nusantara',  book: '76.2', bg: 'linear-gradient(135deg, #FFE4E6, #FECDD3)', fg: '#9F1239' },
            { code: 'MB', name: 'Maybank',    book: '52.1', bg: 'linear-gradient(135deg, #FEF3C7, #FCD34D)', fg: '#92400E' },
            { code: 'GX', name: 'GXS',        book: '34.8', bg: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)', fg: '#3730A3' },
            { code: 'HC', name: 'HomeCredit', book: '21.5', bg: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)', fg: '#166534' },
          ].map((c, i) => (
            <div key={i} style={{
              padding: '12px 10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: c.bg, color: c.fg,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 11, flexShrink: 0,
              }}>{c.code}</div>
              <div style={{ lineHeight: 1.2, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }} className="tnum">RM {c.book}M</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 'auto',
          padding: '10px 12px',
          borderRadius: 10,
          background: 'linear-gradient(135deg, rgba(11,11,15,0.6), rgba(0,108,130,0.18))',
          border: '1px solid rgba(0,184,217,0.20)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 999,
            background: 'linear-gradient(135deg, #0B0B0F, #006C82)',
            color: '#00B8D9',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 0 0 1px rgba(0,184,217,0.4)',
            flexShrink: 0,
          }}>
            <Icon name="bot" size={16} />
          </div>
          <div style={{ flex: 1, lineHeight: 1.3 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600 }}>Vox has your morning briefing</div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)' }}>3 escalations · 1 hardship review pending</div>
          </div>
          <Icon name="chevRight" size={14} color="rgba(255,255,255,0.4)" />
        </div>
      </div>
    </div>
  );
}

const PREVIEWS = {
  'sales-manager': SalesManagerPreview,
  'senior-manager': SeniorManagerPreview,
  'head-of-sales': HeadOfSalesPreview,
};

// ─── Role selector — each chip is a page link ──────────────────

function RoleSelector({ value }) {
  const order = ['sales-manager', 'senior-manager', 'head-of-sales'];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 6, padding: 4,
      background: '#FBFAF7',
      border: '1px solid #EFEDE8',
      borderRadius: 12,
    }}>
      {order.map((k) => {
        const r = ROLE_CONFIG[k];
        const active = value === k;
        return (
          <a
            key={k}
            href={'/login/' + k}
            style={{
              padding: '10px 10px',
              background: active ? '#fff' : 'transparent',
              border: '1px solid ' + (active ? '#E7E5E0' : 'transparent'),
              borderRadius: 9,
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: active ? '0 1px 2px rgba(11,11,15,0.04)' : 'none',
              transition: 'all 160ms ease',
            }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: active ? r.accent : r.accentSoft,
              color: active ? '#fff' : r.accent,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 160ms ease',
              flexShrink: 0,
            }}>
              <Icon name={r.icon} size={14} />
            </div>
            <div style={{ minWidth: 0, lineHeight: 1.2 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: active ? '#0B0B0F' : '#3F3F46', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r.title}
              </div>
              <div style={{ fontSize: 10, color: '#A1A1AA', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r.sub}
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}

// ─── Security step display (varies by role) ────────────────────

function SecurityStep({ role, verifying }) {
  const r = ROLE_CONFIG[role];
  const accent = r.accent;
  const isKey = r.factor === 'key';
  const dark = !!r.dark;

  // Tone-aware text + surfaces so this stays readable on the dark Senior panel
  const titleColor = dark ? '#FBFAF7' : '#0B0B0F';
  const hintColor  = dark ? 'rgba(255,255,255,0.6)' : '#71717A';
  const cardBg = dark
    ? 'linear-gradient(135deg, rgba(0,184,217,0.16), rgba(0,108,130,0.06))'
    : (isKey ? 'linear-gradient(135deg, rgba(0,184,217,0.06), rgba(0,108,130,0.02))' : '#FBFAF7');
  const cardBorder = dark
    ? 'rgba(0,184,217,0.42)'
    : (isKey ? 'rgba(0,184,217,0.30)' : '#EFEDE8');
  const iconBg = dark
    ? 'rgba(0,184,217,0.22)'
    : (isKey ? 'rgba(0,184,217,0.14)' : r.accentSoft);
  const iconBorder = dark
    ? 'rgba(0,184,217,0.45)'
    : (isKey ? 'rgba(0,184,217,0.30)' : 'transparent');
  const iconColor = dark ? '#7BE5F5' : accent;

  return (
    <div style={{
      padding: '14px',
      borderRadius: 12,
      background: cardBg,
      border: '1px solid ' + cardBorder,
      display: 'flex', alignItems: 'center', gap: 12,
      transition: 'all 240ms ease',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: iconBg,
        color: iconColor,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid ' + iconBorder,
        flexShrink: 0,
      }}>
        <Icon name={r.factorIcon} size={20} />
      </div>
      <div style={{ flex: 1, lineHeight: 1.3, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: titleColor }}>
          {r.factorLabel} {verifying && <span style={{ color: iconColor, fontWeight: 500 }}>· verifying…</span>}
        </div>
        <div style={{ fontSize: 11.5, color: hintColor }}>{r.factorHint}</div>
      </div>
      {verifying ? (
        <span className="vox-bars" style={{ color: iconColor, height: 14 }}>
          <span /><span /><span /><span /><span />
        </span>
      ) : (
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 999,
          background: dark ? 'rgba(255,255,255,0.08)' : '#fff',
          border: '1px solid ' + (dark ? 'rgba(255,255,255,0.14)' : '#EFEDE8'),
          color: dark ? 'rgba(255,255,255,0.75)' : '#71717A',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>required</span>
      )}
    </div>
  );
}

// ─── Welcome card shown after verifying succeeds ──────────────

function WelcomeOverlay({ role, onEnter, onCancel }) {
  const r = ROLE_CONFIG[role];
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(11,11,15,0.45)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 280ms ease',
      zIndex: 50,
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
      <div style={{
        width: 440,
        background: '#FFFFFF',
        borderRadius: 18,
        boxShadow: '0 60px 120px -30px rgba(11,11,15,0.55)',
        overflow: 'hidden',
        animation: 'popIn 360ms cubic-bezier(.2,.8,.2,1)',
      }}>
        <div style={{
          padding: '24px 28px 18px',
          background: 'linear-gradient(135deg, ' + r.accent + '14, transparent 60%)',
          borderBottom: '1px solid #EFEDE8',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 999,
              background: r.accent + '18',
              color: r.accent,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid ' + r.accent + '40',
            }}>
              <Icon name="check" size={22} strokeWidth={2.4} />
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 11, color: '#71717A', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                Verified · {r.title}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>
                Welcome back, {r.user.name.split(' ')[0]}.
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 28px 22px' }}>
          <div style={{ fontSize: 13, color: '#3F3F46', lineHeight: 1.55 }}>
            {r.welcomeRouting}. Vox has prepared your briefing and your queue is loaded.
          </div>
          <div style={{
            marginTop: 14,
            padding: '10px 12px',
            background: '#FBFAF7',
            border: '1px solid #EFEDE8',
            borderRadius: 10,
            fontSize: 11.5, color: '#71717A',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <Icon name="shield" size={13} color="#15803D" />
            Session signed at <span className="mono" style={{ color: '#0B0B0F' }}> 09:14 · KL </span> · expires in 8h
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            <button onClick={onCancel} style={{
              height: 44, padding: '0 16px',
              background: '#fff', color: '#0B0B0F',
              border: '1px solid #E7E5E0', borderRadius: 10,
              fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
            }}>Switch role</button>
            <button onClick={onEnter} style={{
              flex: 1,
              height: 44, padding: '0 16px',
              background: '#0B0B0F', color: '#fff',
              border: '1px solid #0B0B0F', borderRadius: 10,
              fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 8px 24px -10px rgba(11,11,15,0.5)',
            }}>
              Enter DVA Pulse <Icon name="arrowRight" size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main flow ─────────────────────────────────────────────────

function getRoleFromURL() {
  if (typeof window === 'undefined') return 'sales-manager';
  const match = window.location.pathname.match(/\/login\/([^/]+)/);
  if (match && ROLE_CONFIG[match[1]]) return match[1];
  return 'sales-manager';
}

function LoginFlow() {
  const role = getRoleFromURL();
  const [step, setStep] = useS('signin');     // signin | verifying | welcome
  const [email, setEmail] = useS('');
  const [pwd, setPwd] = useS('');
  const r = ROLE_CONFIG[role];
  const dark = !!r.dark;

  // Sync default email on mount
  useE(() => { setEmail(r.user.email); setPwd('demo-password-2026'); }, []);

  const Preview = PREVIEWS[role];

  function handleSignIn(e) {
    e && e.preventDefault();
    setStep('verifying');
    setTimeout(() => setStep('welcome'), 1700);
  }

  function reset() {
    setStep('signin');
  }

  function enterApp() {
    // Open the existing demo app
    window.location.href = '/dashboard';
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative',
      background: r.bg,
      transition: 'background 600ms ease',
      overflow: 'hidden',
      color: dark ? '#FBFAF7' : '#0B0B0F',
    }}>
      {/* Dot grid for dark mode */}
      {dark && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.45, pointerEvents: 'none' }}>
          <defs>
            <pattern id="dotgrid2" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.07)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotgrid2)" />
        </svg>
      )}
      {/* Ambient glow tinted to role */}
      <div style={{
        position: 'absolute', top: '-15%', right: '-10%', width: 560, height: 560, borderRadius: 999,
        background: 'radial-gradient(circle, ' + r.accent + '28 0%, transparent 65%)',
        filter: 'blur(26px)',
        pointerEvents: 'none',
        transition: 'all 600ms ease',
      }} />

      {/* Header */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 36px',
        borderBottom: '1px solid ' + (dark ? 'rgba(255,255,255,0.05)' : 'rgba(11,11,15,0.04)'),
      }}>
        <PulseWordmark tone={dark ? 'dark' : 'light'} size={16} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, fontSize: 13 }}>
          <a href="#" style={{ color: dark ? 'rgba(255,255,255,0.65)' : '#3F3F46', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="globe" size={14} /> English (MY)
          </a>
          <a href="#" style={{ color: dark ? 'rgba(255,255,255,0.65)' : '#3F3F46', textDecoration: 'none' }}>Need help?</a>
          <a href="#" style={{ color: dark ? 'rgba(255,255,255,0.65)' : '#3F3F46', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="shield" size={14} /> Status
          </a>
        </div>
      </div>

      {/* Body */}
      <div style={{
        position: 'relative',
        height: 'calc(100% - 61px - 51px)',
        display: 'grid', gridTemplateColumns: '520px 1fr', gap: 0,
        alignItems: 'stretch',
      }}>
        {/* Form panel — always light */}
        <div style={{
          padding: '36px 44px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18,
          background: dark ? 'rgba(11,11,15,0.55)' : 'transparent',
          backdropFilter: dark ? 'blur(14px)' : undefined,
          borderRight: dark ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}>
          <div>
            <div style={{
              fontSize: 11.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: r.accent, marginBottom: 8,
              transition: 'color 240ms ease',
            }}>Sign in to DVA Pulse</div>
            <h1 style={{
              margin: 0, fontSize: 38, fontWeight: 500, letterSpacing: '-0.025em', lineHeight: 1.0,
              fontFamily: 'var(--font-serif)',
              color: dark ? '#FBFAF7' : '#0B0B0F',
            }}>
              {r.headlineLead}<br /><em style={{ color: r.accent, fontStyle: 'italic', transition: 'color 240ms ease' }}>{r.headlineTail}</em>
            </h1>
            <p style={{ margin: '12px 0 0', color: dark ? 'rgba(255,255,255,0.55)' : '#71717A', fontSize: 13.5, maxWidth: 400, lineHeight: 1.55 }}>
              {r.blurb}
            </p>
          </div>

          {/* Role selector */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: dark ? 'rgba(255,255,255,0.55)' : '#A1A1AA',
              marginBottom: 8,
            }}>I'm signing in as</div>
            <RoleSelector value={role} />
          </div>

          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field
              label="Work email"
              icon="user"
              type="email"
              value={email}
              autofocus
              key={'em-' + role}
            />
            <Field
              label="Password"
              type="password"
              icon="lock"
              value={pwd}
              key={'pw-' + role}
            />

            <SecurityStep role={role} verifying={step === 'verifying'} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: dark ? 'rgba(255,255,255,0.7)' : '#3F3F46', cursor: 'pointer' }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 4,
                  background: r.accent, border: '1px solid ' + r.accent,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="check" size={11} color="#fff" strokeWidth={3} />
                </span>
                Remember this device for 30 days
              </label>
              <a href="#" style={{ fontSize: 12.5, color: dark ? '#FBFAF7' : '#0B0B0F', fontWeight: 500, textDecoration: 'none' }}>Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={step === 'verifying'}
              style={{
                height: 48, padding: '0 18px',
                background: step === 'verifying' ? (dark ? 'rgba(255,255,255,0.08)' : '#F1F1EE') : r.accent,
                color: step === 'verifying' ? (dark ? 'rgba(255,255,255,0.6)' : '#71717A') : '#fff',
                border: '1px solid ' + (step === 'verifying' ? 'transparent' : r.accent),
                borderRadius: 11,
                fontSize: 14.5, fontWeight: 600,
                cursor: step === 'verifying' ? 'wait' : 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: step === 'verifying' ? 'none' : ('0 10px 28px -10px ' + r.accent + '90'),
                transition: 'all 200ms ease',
              }}
            >
              {step === 'verifying' ? (
                <>
                  Verifying <span className="vox-bars" style={{ color: dark ? 'rgba(255,255,255,0.7)' : '#71717A', height: 12, marginLeft: 6 }}>
                    <span /><span /><span /><span />
                  </span>
                </>
              ) : (
                <>Continue to {r.title.toLowerCase()} <Icon name="arrowRight" size={16} /></>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: dark ? 'rgba(255,255,255,0.4)' : '#A1A1AA', fontSize: 11, margin: '0' }}>
              <div style={{ flex: 1, height: 1, background: dark ? 'rgba(255,255,255,0.08)' : '#EFEDE8' }} />
              <span style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>or</span>
              <div style={{ flex: 1, height: 1, background: dark ? 'rgba(255,255,255,0.08)' : '#EFEDE8' }} />
            </div>

            <button type="button" style={{
              height: 44, padding: '0 18px',
              background: dark ? 'transparent' : '#fff',
              color: dark ? '#FBFAF7' : '#0B0B0F',
              border: '1px solid ' + (dark ? 'rgba(255,255,255,0.16)' : '#E7E5E0'),
              borderRadius: 10,
              fontSize: 13.5, fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Icon name="building" size={16} />
              Continue with company SSO
            </button>
          </form>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 11.5, color: dark ? 'rgba(255,255,255,0.45)' : '#A1A1AA',
            marginTop: 4,
          }}>
            <Icon name="lock" size={12} />
            {r.scopeLine}
          </div>
        </div>

        {/* Right preview pane — morphs on role change */}
        <div style={{
          padding: '36px 44px 36px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div
            key={role}
            style={{
              height: '100%',
              animation: 'previewIn 460ms cubic-bezier(.2,.8,.2,1)',
            }}
          >
            <Preview />
          </div>
          <style>{`
            @keyframes previewIn {
              from { opacity: 0; transform: translateY(12px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'relative' }}>
        <LoginFooter tone={dark ? 'dark' : 'light'}
          status={role === 'head-of-sales' ? 'All systems normal · Vox cohort #1 live' : 'All systems normal'}
          region={role === 'head-of-sales' ? 'Global' : (role === 'senior-manager' ? 'MY · SG · ID' : 'MY · SG')} />
      </div>

      {step === 'welcome' && (
        <WelcomeOverlay role={role} onEnter={enterApp} onCancel={reset} />
      )}
    </div>
  );
}

window.LoginFlow = LoginFlow;
