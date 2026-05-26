// Mobile companion preview — three phone mockups side by side

function MobileScreen() {
  return (
    <div style={{ padding: 24 }}>
      <SectionTitle
        kicker="On the go"
        title="Mobile companion · for field & remote agents"
        action={<Button kind="secondary" size="sm" icon="download">TestFlight</Button>}
      />

      <div style={{
        marginTop: 8,
        padding: 32,
        background: 'linear-gradient(180deg, #FBF9F4 0%, #F3F1EC 100%)',
        borderRadius: 18,
        border: '1px solid var(--line)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.5,
          pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', position: 'relative', flexWrap: 'wrap' }}>
          <PhoneFrame title="Home queue"><MobileHome /></PhoneFrame>
          <PhoneFrame title="Vox call · live"><MobileCall /></PhoneFrame>
          <PhoneFrame title="WhatsApp thread"><MobileWhatsApp /></PhoneFrame>
        </div>
      </div>
    </div>
  );
}

function PhoneFrame({ title, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 300, height: 620,
        background: '#0B0B0F',
        borderRadius: 42,
        padding: 8,
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.35), 0 8px 24px -8px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.04)',
      }}>
        <div style={{
          width: '100%', height: '100%',
          borderRadius: 34,
          background: '#FBF9F4',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Status bar */}
          <div style={{
            height: 36, padding: '0 22px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: 11.5, fontWeight: 600, color: 'var(--ink)',
            position: 'relative',
          }}>
            <span className="tnum">9:41</span>
            {/* notch */}
            <div style={{
              position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
              width: 90, height: 22, background: '#0B0B0F', borderRadius: 12,
            }} />
            <span style={{ display: 'inline-flex', gap: 4 }}>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 7 Q7 1 13 7" stroke="currentColor" strokeWidth="1.4" /><circle cx="7" cy="8" r="1" fill="currentColor" /></svg>
              <span style={{ width: 16, height: 9, border: '1px solid currentColor', borderRadius: 2, position: 'relative' }}><span style={{ position: 'absolute', inset: 1, background: 'currentColor', borderRadius: 1, width: '70%' }} /></span>
            </span>
          </div>
          {children}
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)' }}>{title}</div>
    </div>
  );
}

// ---- Mobile · Home queue ----
function MobileHome() {
  const items = DEBTORS.slice(0, 5);
  return (
    <div style={{ height: 'calc(100% - 36px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '4px 18px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name="Farah Aziz" size={32} />
          <div style={{ flex: 1, lineHeight: 1.2 }}>
            <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>Good morning</div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Farah</div>
          </div>
          <IconButton icon="bell" size={32} badge={3} iconSize={15} />
        </div>

        {/* Hero today */}
        <div style={{
          marginTop: 12,
          padding: 14,
          borderRadius: 14,
          background: 'linear-gradient(135deg, #0B0B0F, #2D1518)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle at 100% 100%, rgba(225,29,72,0.35), transparent 50%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Today's target</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2, letterSpacing: '-0.02em' }} className="tnum">S$ 18,400</div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ width: '64%', height: '100%', background: 'linear-gradient(90deg, var(--brand), #F87171)', borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>
              <span><span className="tnum" style={{ color: '#fff', fontWeight: 600 }}>S$ 11,820</span> collected</span>
              <span className="tnum">64%</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <MobStat l="Cases" v="28" />
          <MobStat l="WA unread" v="3" accent="wa" />
          <MobStat l="Calls due" v="7" accent="brand" />
        </div>
      </div>

      <div style={{ padding: '6px 18px 4px', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Priority queue</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 500 }}>See all</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 80px' }} className="thin-scroll">
        {items.map((d, i) => (
          <div key={d.id} style={{
            margin: '6px 0', padding: 10,
            background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Avatar name={d.name} size={32} />
            <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }} className="tnum">
                {fmtMoney(d.balance, d.ccy)} · {d.daysOverdue}d
              </div>
            </div>
            {d.daysOverdue > 90 && <Badge tone="danger" size="sm">90+</Badge>}
            {d.promiseToPay && <Badge tone="success" size="sm" icon="check">PTP</Badge>}
            <IconButton icon="whatsapp" size={28} iconSize={14} tone="neutral" />
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <MobileTabBar active="home" />
    </div>
  );
}

function MobStat({ l, v, accent }) {
  const color = accent === 'wa' ? 'var(--wa-deep)' : accent === 'brand' ? 'var(--brand)' : 'var(--ink)';
  return (
    <div style={{ flex: 1, padding: '8px 10px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10 }}>
      <div style={{ fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color, marginTop: 1 }} className="tnum">{v}</div>
    </div>
  );
}

function MobileTabBar({ active }) {
  const tabs = [
    { k: 'home', l: 'Queue', i: 'debtors' },
    { k: 'wa',   l: 'Chats', i: 'whatsapp' },
    { k: 'call', l: 'Calls', i: 'call' },
    { k: 'me',   l: 'You',   i: 'user' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 76, paddingBottom: 18,
      background: 'rgba(251,249,244,0.95)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--line)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    }}>
      {tabs.map(t => {
        const a = t.k === active;
        return (
          <div key={t.k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Icon name={t.i} size={20} color={a ? 'var(--brand)' : 'var(--muted)'} />
            <span style={{ fontSize: 9.5, color: a ? 'var(--brand)' : 'var(--muted)', fontWeight: a ? 600 : 500 }}>{t.l}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---- Mobile · Vox call live ----
function MobileCall() {
  return (
    <div style={{ height: 'calc(100% - 36px)', background: 'linear-gradient(180deg, #0B0B0F 0%, #1A1A21 70%, #2D1518 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: -40, background: 'radial-gradient(circle at 50% 0%, rgba(0,184,217,0.25), transparent 50%)', pointerEvents: 'none' }} />

      {/* Top */}
      <div style={{ padding: '16px 22px 0', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <Icon name="chevDown" size={18} color="rgba(255,255,255,0.7)" />
        <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          Vox supervising
        </div>
        <Icon name="more" size={18} color="rgba(255,255,255,0.7)" />
      </div>

      <div style={{ position: 'relative', padding: '30px 22px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', position: 'relative' }}>
          <Avatar name="Lim Hui Min" size={92} />
          <div style={{
            position: 'absolute', inset: -8, borderRadius: '50%',
            border: '2px solid rgba(0,184,217,0.5)',
            animation: 'pulseGlow 1.8s ease-out infinite',
          }} />
        </div>
        <h2 style={{ margin: '14px 0 4px', fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em' }}>Lim Hui Min</h2>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)' }}>
          <span className="tnum">+60 17-998 2410</span> · MY
        </div>
        <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span className="live-dot vox" style={{ width: 7, height: 7 }} />
          <span className="tnum" style={{ fontSize: 13, color: 'var(--vox)', fontFamily: 'var(--font-mono)' }}>3:04</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>· Vox v3.2</span>
        </div>
      </div>

      {/* Transcript bubble */}
      <div style={{ position: 'relative', margin: '20px 18px', padding: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,184,217,0.25)', borderRadius: 14 }}>
        <div style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--vox)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
          <Icon name="bot" size={12} /> Vox · live
        </div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.92)', lineHeight: 1.5 }}>
          "Excellent. Three monthly instalments of RM 2,260 each, starting 26 May. Does that date work for you?"
        </div>
        <div style={{ marginTop: 10, padding: 8, background: 'rgba(21,128,61,0.18)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 8 }}>
          <div style={{ fontSize: 9, color: '#86efac', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Signal</div>
          <div style={{ fontSize: 11.5, color: '#fff', marginTop: 2 }}>Customer agreed · negotiating date</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ position: 'absolute', bottom: 36, left: 0, right: 0, padding: '0 28px', display: 'flex', justifyContent: 'space-between' }}>
        <MobCallBtn icon="mic" l="Mute" />
        <MobCallBtn icon="cpu" l="Take over" tone="vox" />
        <MobCallBtn icon="hangup" l="End" tone="end" />
      </div>
    </div>
  );
}

function MobCallBtn({ icon, l, tone }) {
  const tones = {
    def: { bg: 'rgba(255,255,255,0.1)', fg: '#fff', border: 'rgba(255,255,255,0.15)' },
    vox: { bg: 'rgba(0,184,217,0.18)', fg: 'var(--vox)', border: 'rgba(0,184,217,0.45)' },
    end: { bg: 'linear-gradient(135deg, #DC2626, #9F1239)', fg: '#fff', border: 'transparent' },
  };
  const p = tones[tone || 'def'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 60, height: 60, borderRadius: 30,
        background: p.bg, color: p.fg,
        border: `1px solid ${p.border}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: tone === 'end' ? '0 8px 24px rgba(220,38,38,0.4)' : 'none',
      }}>
        <Icon name={icon} size={22} />
      </div>
      <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.7)' }}>{l}</span>
    </div>
  );
}

// ---- Mobile · WhatsApp ----
function MobileWhatsApp() {
  const thread = THREADS[0];
  return (
    <div style={{ height: 'calc(100% - 36px)', background: '#FBF9F4', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '6px 14px 10px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--line)', background: 'var(--card)' }}>
        <Icon name="chevLeft" size={20} color="var(--brand)" />
        <Avatar name={thread.name} size={32} />
        <div style={{ flex: 1, lineHeight: 1.2 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{thread.name}</div>
          <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>online</div>
        </div>
        <IconButton icon="phone" size={28} iconSize={14} />
        <IconButton icon="bot" size={28} iconSize={14} tone="vox" />
      </div>

      <div style={{ flex: 1, padding: '14px 14px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }} className="thin-scroll">
        {thread.messages.slice(0, 5).map(m => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '78%', padding: '7px 10px',
              background: m.from === 'me' ? 'var(--wa-bubble)' : '#fff',
              border: m.from === 'me' ? 'none' : '1px solid var(--line)',
              borderRadius: 12,
              fontSize: 12, lineHeight: 1.4,
              color: 'var(--ink)',
            }}>
              {m.text}
              <div style={{ fontSize: 8.5, color: 'var(--muted)', textAlign: 'right', marginTop: 2 }}>{m.at}</div>
            </div>
          </div>
        ))}
        {/* Vox suggestion */}
        <div style={{ marginTop: 8, padding: 10, background: 'rgba(0,184,217,0.07)', border: '1px solid rgba(0,184,217,0.3)', borderRadius: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--vox-deep)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="bot" size={11} /> Vox suggests
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink)', lineHeight: 1.4, marginBottom: 6 }}>
            "Of course Aishah, I understand. Let's set up a 2-instalment plan: RM 4,150 by Fri 22 May and RM 8,300 by 12 June 💜"
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={{ flex: 1, padding: '5px 0', background: 'var(--vox-deep)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>Use draft</button>
            <button style={{ padding: '5px 8px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 6, fontSize: 11, fontWeight: 500 }}>Edit</button>
          </div>
        </div>
      </div>

      {/* Composer */}
      <div style={{ padding: 10, borderTop: '1px solid var(--line)', background: 'var(--card)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="plus" size={18} color="var(--muted)" />
        <div style={{ flex: 1, height: 32, padding: '0 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, display: 'flex', alignItems: 'center', fontSize: 12, color: 'var(--muted)' }}>
          Message…
        </div>
        <div style={{ width: 32, height: 32, borderRadius: 16, background: 'var(--wa)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="send" size={14} />
        </div>
      </div>
    </div>
  );
}

window.MobileScreen = MobileScreen;
