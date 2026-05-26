// Settings — integrations + Vox AI configuration

function SettingsScreen() {
  const [tab, setTab] = useState('integrations');
  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
      {/* Side nav */}
      <div>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, padding: '0 10px' }}>
          Setup
        </div>
        {[
          { k: 'org',          l: 'Organisation', i: 'building' },
          { k: 'integrations', l: 'Integrations', i: 'link' },
          { k: 'vox',          l: 'Vox AI',       i: 'bot', accent: true },
          { k: 'templates',    l: 'Templates',    i: 'template' },
          { k: 'payments',     l: 'Payments',     i: 'card' },
          { k: 'compliance',   l: 'Compliance',   i: 'shield' },
          { k: 'roles',        l: 'Roles & permissions', i: 'lock' },
          { k: 'billing',      l: 'Billing',      i: 'receipt' },
        ].map(it => {
          const active = tab === it.k;
          return (
            <button key={it.k} onClick={() => setTab(it.k)} style={{
              width: '100%',
              padding: '8px 10px',
              background: active ? '#fff' : 'transparent',
              border: '1px solid ' + (active ? 'var(--line)' : 'transparent'),
              borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 13.5, fontWeight: active ? 600 : 500,
              color: active ? 'var(--ink)' : 'var(--ink-3)',
              textAlign: 'left',
              marginBottom: 2,
            }}>
              <Icon name={it.i} size={15} color={active ? 'var(--brand)' : (it.accent ? 'var(--vox-deep)' : 'currentColor')} />
              {it.l}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div>
        {tab === 'integrations' && <IntegrationsPanel />}
        {tab === 'vox' && <VoxPanel />}
        {tab !== 'integrations' && tab !== 'vox' && (
          <Card padding={32} style={{ textAlign: 'center', color: 'var(--muted)' }}>
            <Icon name="settings" size={28} color="var(--muted-2)" />
            <div style={{ marginTop: 8, fontSize: 13.5 }}>
              This section is wired up but content lives in the Integrations and Vox panels for this prototype.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function IntegrationsPanel() {
  const groups = [
    {
      title: 'Messaging',
      items: [
        { name: 'WhatsApp Business Cloud API', desc: '+60 3-7890 1234 · Verified business · 3 templates pending', icon: 'whatsapp', connected: true, status: 'Live', accent: 'wa' },
        { name: 'SMS · Twilio',                desc: 'Sender ID: DVAPULSE · Senders for MY/SG/ID', icon: 'sms', connected: true, status: 'Live' },
        { name: 'Email · Postmark',            desc: 'collections@dvapulse.com',                       icon: 'mail', connected: true, status: 'Live' },
        { name: 'Telegram',                    desc: 'Not connected',                                  icon: 'send', connected: false },
      ],
    },
    {
      title: 'Telephony',
      items: [
        { name: 'Twilio Programmable Voice',   desc: 'MY/SG/ID/PH/TH/VN numbers · 24 active', icon: 'phone', connected: true, status: 'Live' },
        { name: 'Vox AI runtime',              desc: 'cohort #1 · Empathetic-collections v3.2 · 5 voices', icon: 'bot', connected: true, status: 'Live', accent: 'vox' },
        { name: 'Sinch SIP',                   desc: 'Not connected · use for inbound IVR',  icon: 'voicemail', connected: false },
      ],
    },
    {
      title: 'Core banking & payments',
      items: [
        { name: 'Nusantara Bank · Core LOS',   desc: 'Daily sync · last 04:12 SGT',          icon: 'building', connected: true, status: 'Live' },
        { name: 'FPX (Malaysia)',              desc: 'Payment links · 12 banks',             icon: 'card', connected: true, status: 'Live' },
        { name: 'Xendit (Indonesia/Philippines)', desc: 'GCash, OVO, DANA, GrabPay',         icon: 'card', connected: true, status: 'Live' },
        { name: 'PayNow / SGQR',               desc: 'Singapore',                            icon: 'card', connected: true, status: 'Live' },
        { name: 'PromptPay (Thailand)',        desc: 'Not connected',                        icon: 'card', connected: false },
      ],
    },
    {
      title: 'Compliance & data',
      items: [
        { name: 'PDPA / PDP Indonesia',        desc: 'Consent logging enabled',              icon: 'shield', connected: true, status: 'Live' },
        { name: 'AWS S3 · call recordings',    desc: 'ap-southeast-1 · 30-day retention',    icon: 'document', connected: true, status: 'Live' },
        { name: 'Salesforce CRM',              desc: 'Two-way contact sync',                 icon: 'globe', connected: false },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SectionTitle
        kicker="Setup"
        title="Integrations"
        action={<Button kind="brand" size="sm" icon="plus">Browse marketplace</Button>}
      />
      {groups.map(g => (
        <div key={g.title}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            {g.title}
          </div>
          <Card padding={0}>
            {g.items.map((it, i) => (
              <div key={it.name} style={{
                padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
                borderBottom: i === g.items.length - 1 ? 'none' : '1px solid var(--line-2)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: it.accent === 'wa' ? '#E8FFF1' : it.accent === 'vox' ? 'var(--vox-soft)' : 'var(--surface)',
                  color: it.accent === 'wa' ? 'var(--wa-deep)' : it.accent === 'vox' ? 'var(--vox-deep)' : 'var(--ink-2)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--line-2)',
                  flexShrink: 0,
                }}>
                  <Icon name={it.icon} size={17} />
                </div>
                <div style={{ flex: 1, lineHeight: 1.3 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{it.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>{it.desc}</div>
                </div>
                {it.connected ? (
                  <>
                    <Badge tone="success" size="sm" icon="check">{it.status}</Badge>
                    <Button kind="secondary" size="sm">Configure</Button>
                  </>
                ) : (
                  <Button kind="primary" size="sm" icon="plus">Connect</Button>
                )}
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}

function VoxPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SectionTitle kicker="AI agent" title="Vox configuration" />

      {/* Hero */}
      <Card padding={24} style={{ background: 'linear-gradient(135deg, #0B0B0F 0%, #1A1A21 60%, #2D1518 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: -40, background: 'radial-gradient(circle at 80% 0%, rgba(0,184,217,0.18), transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 18 }}>
          <Avatar isAi name="Vox" size={64} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
              Active model
            </div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: '-0.015em' }}>
              Vox · Empathetic-collections <span style={{ color: 'var(--vox)' }}>v3.2</span>
            </h2>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
              5 voices · 4 languages (EN, BM, BI, VI) · trained on 142k anonymised SEA collection calls
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Button kind="vox" size="sm" icon="play">Test call</Button>
            <Button kind="secondary" size="sm" icon="refresh" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>Update model</Button>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card padding={18}>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600 }}>Voice & language</h4>
          <Field2 label="Default voice">
            <VoiceOption name="Ayu" desc="BM · warm female" active />
            <VoiceOption name="Adi" desc="BM · calm male" />
            <VoiceOption name="Linh" desc="VI · empathetic female" />
            <VoiceOption name="Aria" desc="EN · neutral female" />
          </Field2>
          <Field2 label="Tone">
            <ToggleRow l="Empathetic" sub="default · adapt to hardship signals" on />
            <ToggleRow l="Firm" sub="for late-stage, repeat defaulters" on />
            <ToggleRow l="Aggressive" sub="not recommended · disabled" />
          </Field2>
        </Card>

        <Card padding={18}>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600 }}>Autonomy & guardrails</h4>
          <ToggleRow
            l="Autonomous outbound" sub="Vox can place reminder calls without agent review" on
          />
          <ToggleRow
            l="Auto-offer payment plans" sub="Up to 4 instalments · within preset thresholds" on
          />
          <ToggleRow
            l="Auto-send WhatsApp drafts" sub="Approved templates only · agent must review" 
          />
          <ToggleRow
            l="Escalate on hardship" sub="Transfer to human within 30s of distress signals" on
          />
          <ToggleRow
            l="Record & transcribe" sub="Encrypted at rest · 30-day retention" on
          />
        </Card>

        <Card padding={18}>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600 }}>Calling windows</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 90px', gap: 8, alignItems: 'center' }}>
            {['Mon–Fri','Saturday','Sunday','Public hols'].map((d, i) => (
              <React.Fragment key={d}>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{d}</span>
                <div style={{ position: 'relative', height: 8, background: 'var(--line-2)', borderRadius: 4 }}>
                  <div style={{
                    position: 'absolute', top: 0, bottom: 0,
                    left: i === 0 ? '38%' : i === 1 ? '42%' : i === 2 ? '50%' : '0%',
                    right: i === 0 ? '20%' : i === 1 ? '30%' : i === 2 ? '37%' : '100%',
                    background: i === 3 ? 'var(--danger-soft)' : 'var(--brand)',
                    borderRadius: 4,
                  }} />
                </div>
                <span className="tnum" style={{ fontSize: 11, color: 'var(--muted)' }}>{
                  i === 0 ? '9:00–18:00' : i === 1 ? '10:00–15:00' : i === 2 ? '12:00–17:00' : 'Blocked'
                }</span>
              </React.Fragment>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 11.5, color: 'var(--muted)', padding: 10, background: 'var(--surface-2)', borderRadius: 8 }}>
            Times respect each debtor's local timezone (Asia/Singapore by default). Public-holiday calendar synced from each market.
          </div>
        </Card>

        <Card padding={18}>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600 }}>Performance · last 30 days</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Stat2 label="Calls placed" v="4,218" />
            <Stat2 label="Answer rate"  v="71%" tone="success" />
            <Stat2 label="Avg duration"  v="2m 48s" />
            <Stat2 label="PTPs collected" v="612" tone="success" />
            <Stat2 label="Escalations"   v="184" />
            <Stat2 label="CSAT (post-call)" v="4.4 / 5" tone="success" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Field2({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  );
}

function VoiceOption({ name, desc, active }) {
  return (
    <div style={{
      padding: '8px 10px',
      background: active ? 'var(--vox-soft)' : '#fff',
      border: '1px solid ' + (active ? 'rgba(0,184,217,0.3)' : 'var(--line)'),
      borderRadius: 8,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 14,
        background: 'linear-gradient(135deg, #0B0B0F, #006C82)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="play" size={11} color="var(--vox)" />
      </div>
      <div style={{ flex: 1, lineHeight: 1.2 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{desc}</div>
      </div>
      {active && <Icon name="check" size={14} color="var(--vox-deep)" />}
    </div>
  );
}

function ToggleRow({ l, sub, on }) {
  const [v, setV] = useState(!!on);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--line-2)' }}>
      <div style={{ flex: 1, lineHeight: 1.3 }}>
        <div style={{ fontSize: 12.5, fontWeight: 500 }}>{l}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{sub}</div>
      </div>
      <button onClick={() => setV(!v)} style={{
        width: 32, height: 18, borderRadius: 10,
        background: v ? 'var(--brand)' : '#D4D4D8',
        border: 'none',
        position: 'relative',
        transition: 'background 160ms ease',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: v ? 16 : 2,
          width: 14, height: 14, borderRadius: 7, background: 'var(--card)',
          transition: 'left 160ms ease',
        }} />
      </button>
    </div>
  );
}

function Stat2({ label, v, tone }) {
  const c = tone === 'success' ? 'var(--success)' : 'var(--ink)';
  return (
    <div style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 8 }}>
      <div style={{ fontSize: 10.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: c, marginTop: 2 }} className="tnum">{v}</div>
    </div>
  );
}

window.SettingsScreen = SettingsScreen;
