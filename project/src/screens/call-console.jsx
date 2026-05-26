// Call console — Vox AI live call UI with transcript, sentiment, supervisor controls

const PULSE_QUEUE = [
  { id: 'q1', name: 'Lim Hui Min',               status: 'live',     dur: '0:30', vox: true,  country: 'MY', sentiment: 'cooperative', debtorId: 'D-2810' },
  { id: 'q2', name: 'Datin Rohaiza binti Azman', status: 'queued',   scheduled: 'in 4 min',  vox: true,  country: 'MY' },
  { id: 'q3', name: 'Tan Wei Ming',              status: 'queued',   scheduled: 'in 7 min',  vox: true,  country: 'MY' },
  { id: 'q4', name: 'Aishah binti Rahman',       status: 'callback', scheduled: '15:30',                country: 'MY' },
  { id: 'q5', name: 'Chong Wei Lim',             status: 'queued',   scheduled: 'in 22 min', vox: true,  country: 'MY' },
  { id: 'q6', name: 'Mohd Ridzuan bin Zainal',   status: 'queued',   scheduled: 'in 31 min', vox: true,  country: 'MY' },
  { id: 'q7', name: 'Siti Norzahira binti Hamid',status: 'callback', scheduled: '16:00',                country: 'MY', priority: true },
];

const LIM_HUI_MIN_TRANSCRIPT = [
  { speaker: 'vox',      time: '00:00', text: "Hi, is this Lim Hui Min? This is Vox from DVA Pulse calling on behalf of Nusantara Bank — got a quick minute?" },
  { speaker: 'customer', time: '00:05', text: "Yes, speaking. What's this about?", sentiment: 0.45 },
  { speaker: 'vox',      time: '00:08', text: "It's about your card ending 0118 — there's RM 6,780 that's now 30 days overdue. I wanted to sort it out before any late fees kick in." },
  { speaker: 'customer', time: '00:15', text: "Ah… yeah. Things have been tight with the renovation lately.", sentiment: 0.34, tags: ['hardship-signal'] },
  { speaker: 'vox',      time: '00:19', text: "Totally understand. Would a 3-month plan at RM 2,260 each help — paid on the 26th, right after payday?", highlight: true },
  { speaker: 'customer', time: '00:25', text: "Yes, the 26th works. Let's do that.", sentiment: 0.78, tags: ['agreement'] },
  { speaker: 'vox',      time: 'now',   text: "Perfect — locking it in. I'll WhatsApp the confirmation to the number ending 2410 right after we hang up.", typing: true },
];

function CallConsoleScreen({ onOpenDebtor }) {
  const [activeId, setActiveId] = useState('q1');
  const [muted, setMuted] = useState(false);
  const [voxLive, setVoxLive] = useState(true);   // false = agent has taken over
  const [held, setHeld] = useState(false);
  const [duration, setDuration] = useState(30);
  const [callEnded, setCallEnded] = useState(false);

  const [transferOpen, setTransferOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("PTP captured · 3 × RM 2,260 from 26 May. Customer flagged renovation hardship. Auto-enrolled in Soft cadence.");

  const [suggestion, setSuggestion] = useState('pending'); // pending | approved | modifying

  useEffect(() => {
    if (callEnded || held) return;
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, [callEnded, held]);

  const active = PULSE_QUEUE.find(q => q.id === activeId) || PULSE_QUEUE[0];
  const debtor = DEBTORS.find(d => d.id === (active.debtorId || 'D-2810')) || DEBTORS[0];
  const fmtDur = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  function startNextCall() {
    const next = PULSE_QUEUE.find(q => q.status === 'queued');
    if (next) {
      setActiveId(next.id);
      setDuration(0);
      setCallEnded(false);
      setMuted(false);
      setHeld(false);
      setVoxLive(true);
      window.toast({ title: `Dialing ${next.name}…`, description: 'Vox is initiating the call', tone: 'vox', icon: 'phone' });
    }
  }

  function selectQueue(qid) {
    if (qid === activeId) return;
    const q = PULSE_QUEUE.find(x => x.id === qid);
    setActiveId(qid);
    setDuration(0);
    setCallEnded(false);
    setMuted(false);
    setHeld(false);
    setVoxLive(true);
    if (q.status === 'live') {
      window.toast({ title: `Joined ${q.name}'s call`, tone: 'vox', icon: 'phone' });
    } else {
      window.toast({ title: `Switched to ${q.name}`, description: q.scheduled ? `Scheduled ${q.scheduled}` : '', tone: 'default', icon: 'call' });
    }
  }

  function handleMute() {
    setMuted(m => {
      window.toast({ title: !m ? 'Microphone muted' : 'Microphone live', icon: !m ? 'micOff' : 'mic' });
      return !m;
    });
  }
  function handleHold() {
    setHeld(h => {
      window.toast({ title: !h ? 'Call placed on hold' : 'Call resumed', tone: !h ? 'warn' : 'default', icon: !h ? 'pause' : 'play' });
      return !h;
    });
  }
  function handleTakeover() {
    setVoxLive(v => {
      window.toast({
        title: v ? "You're on the line" : 'Vox is back driving',
        description: v ? 'Vox is listening in. Speak normally.' : 'Resumed AI handling',
        tone: 'vox', icon: v ? 'mic' : 'bot',
      });
      return !v;
    });
  }
  function handleHangup() {
    setCallEnded(true);
    window.toast({ title: 'Call wrapped', description: 'PTP captured · WhatsApp confirmation queued', tone: 'success', icon: 'check' });
  }

  // ---- Live call view ----
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '280px 1fr 340px',
      height: 'calc(100vh - 60px)',
      background: 'var(--surface)',
    }}>
      <CallQueue activeId={activeId} onSelect={selectQueue} />

      <div style={{
        background: callEnded
          ? 'linear-gradient(180deg, #0B0B0F 0%, #1A1A21 65%, #0F2E1F 100%)'
          : voxLive
            ? 'linear-gradient(180deg, #0B0B0F 0%, #1A1A21 65%, #2D1518 100%)'
            : 'linear-gradient(180deg, #0B0B0F 0%, #1A1A21 65%, #1A0E2D 100%)',
        color: '#fff',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 400ms ease',
      }}>
        <div style={{
          position: 'absolute', inset: -40, pointerEvents: 'none',
          background: voxLive
            ? 'radial-gradient(circle at 50% 0%, rgba(0,184,217,0.18) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(225,29,72,0.22) 0%, transparent 55%)'
            : 'radial-gradient(circle at 50% 0%, rgba(225,29,72,0.18) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(159,18,57,0.22) 0%, transparent 55%)',
        }} />

        {/* Top status */}
        <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="live-dot" style={{ background: callEnded ? '#86efac' : held ? '#FCD34D' : '#ef4444' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {callEnded ? 'Call ended' : held ? 'On hold' : 'Live call'}
            </span>
          </div>
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.18)' }} />
          <span className="tnum" style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-mono)' }}>{fmtDur(duration)}</span>
          <div style={{ flex: 1 }} />
          <Badge tone="dark" size="sm" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
            Reminder cadence · Day 30
          </Badge>
          {voxLive ? <VoxBadge live={!callEnded && !held} label="Vox handling" /> : (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 24, padding: '0 8px',
              background: 'rgba(225,29,72,0.15)',
              color: '#fca5a5',
              borderRadius: 999,
              fontSize: 12, fontWeight: 600,
              border: '1px solid rgba(225,29,72,0.3)',
            }}>
              <span className="live-dot" style={{ width: 6, height: 6, background: '#fca5a5' }} />
              Agent live
            </span>
          )}
        </div>

        {/* Debtor + waveform */}
        <div style={{ padding: '30px 28px 20px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ position: 'relative' }}>
              <Avatar name={active.name} size={86} />
              {!callEnded && !held && (
                <div style={{
                  position: 'absolute', inset: -8, borderRadius: '50%',
                  border: `2px solid ${voxLive ? 'rgba(0,184,217,0.5)' : 'rgba(225,29,72,0.5)'}`,
                  animation: 'pulseGlow 1.8s ease-out infinite',
                }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                Outbound · {voxLive ? 'Vox AI' : 'Agent (Farah)'}
              </div>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>{active.name}</h2>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span><FlagDot country={active.country || debtor.country} /> {debtor.city}, MY</span>
                <span>·</span>
                <span className="mono">{debtor.phone}</span>
                <span>·</span>
                <span className="tnum">RM 6,780.00 · 30d overdue</span>
              </div>
            </div>
            <button onClick={() => onOpenDebtor(debtor.id)} style={{
              padding: '6px 10px', background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7,
              color: '#fff', fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6,
              cursor: 'pointer',
            }}>
              Open case <Icon name="external" size={12} />
            </button>
          </div>

          {/* Waveform */}
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 2, height: 56, justifyContent: 'center', opacity: held || callEnded ? 0.3 : 1 }}>
            {Array.from({ length: 80 }).map((_, i) => {
              const h = 8 + Math.abs(Math.sin(i * 0.6 + duration * 0.4)) * 44;
              const isVox = i % 7 < 4;
              return (
                <div key={i} style={{
                  width: 3, height: `${h}px`,
                  background: isVox ? (voxLive ? 'var(--vox)' : '#fca5a5') : 'rgba(255,255,255,0.35)',
                  borderRadius: 1.5,
                  transition: 'height 60ms ease',
                  opacity: isVox ? 0.9 : 0.6,
                }} />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
            <span><span style={{ width: 8, height: 8, borderRadius: 4, background: voxLive ? 'var(--vox)' : '#fca5a5', display: 'inline-block', marginRight: 5, verticalAlign: '1px' }} />{voxLive ? 'Vox' : 'Agent'} · 62% talk-time</span>
            <span><span style={{ width: 8, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.35)', display: 'inline-block', marginRight: 5, verticalAlign: '1px' }} />Customer · 38%</span>
          </div>
        </div>

        {/* Transcript or Wrap-up */}
        {callEnded ? (
          <WrapUpPanel debtor={debtor} active={active} duration={duration} onStartNext={startNextCall} onOpenDebtor={onOpenDebtor} />
        ) : (
          <Transcript active={active} />
        )}

        {/* Call controls */}
        {!callEnded && (
          <div style={{ padding: '18px 28px 24px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <CallControl icon={muted ? 'micOff' : 'mic'} label="Mute"      active={muted} onClick={handleMute} />
              <CallControl icon="pause"   label="Hold"      active={held}  onClick={handleHold} />
              <CallControl icon="cpu"     label={voxLive ? 'Take over' : 'Give back'} tone="vox" active={!voxLive} onClick={handleTakeover} />
              <CallControl icon="transfer" label="Transfer"  active={transferOpen} onClick={() => setTransferOpen(true)} />
              <CallControl icon="receipt"  label="Notes"     active={notesOpen} onClick={() => setNotesOpen(true)} />
              <button onClick={handleHangup} style={{
                width: 64, height: 64, borderRadius: 32,
                background: 'linear-gradient(135deg, #DC2626, #9F1239)',
                border: 'none',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(220,38,38,0.4)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: 8,
                cursor: 'pointer',
              }}>
                <Icon name="hangup" size={26} />
              </button>
            </div>
          </div>
        )}
      </div>

      <CallContextRail
        suggestion={suggestion}
        onApprove={() => { setSuggestion('approved'); window.toast({ title: 'Plan approved', description: 'WhatsApp confirmation will send on hangup', tone: 'vox', icon: 'check' }); }}
        onModify={() => setSuggestion('modifying')}
        onCancelModify={() => setSuggestion('pending')}
        onSaveModify={() => { setSuggestion('approved'); window.toast({ title: 'Plan updated & approved', tone: 'success', icon: 'check' }); }}
      />

      {/* Transfer popover modal */}
      <TransferModal open={transferOpen} onClose={() => setTransferOpen(false)} debtorName={active.name} />

      {/* Notes drawer */}
      <NotesDrawer open={notesOpen} onClose={() => setNotesOpen(false)} notes={notes} setNotes={setNotes} />
    </div>
  );
}

function Transcript({ active }) {
  // For Lim Hui Min show full transcript; for others show a "ringing/connecting" state
  if (active.id !== 'q1') {
    return (
      <div style={{
        flex: 1, margin: '0 18px', padding: 40,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
      }}>
        <div className="vox-bars" style={{ color: 'var(--vox)', height: 24 }}>
          <span /><span /><span /><span /><span />
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Vox is connecting to {active.name}…</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Transcript will appear here once the call begins.</div>
      </div>
    );
  }
  return (
    <div style={{
      flex: 1, margin: '0 18px', padding: 20,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      overflowY: 'auto',
      backdropFilter: 'blur(8px)',
    }} className="thin-scroll">
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        Live transcript · auto-translated (BM → EN)
        <span className="live-dot vox" style={{ width: 6, height: 6 }} />
      </div>
      {LIM_HUI_MIN_TRANSCRIPT.map((l, i) => (
        <TranscriptLine key={i} {...l} />
      ))}
    </div>
  );
}

function WrapUpPanel({ debtor, active, duration, onStartNext, onOpenDebtor }) {
  return (
    <div style={{
      flex: 1, margin: '0 18px 18px', padding: 22,
      background: 'rgba(21,128,61,0.08)',
      border: '1px solid rgba(21,128,61,0.3)',
      borderRadius: 14,
      backdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column', gap: 14,
      overflowY: 'auto',
    }} className="thin-scroll">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18,
          background: 'rgba(21,128,61,0.25)',
          color: '#86efac',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="check" size={18} /></div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#fff' }}>Call wrapped successfully</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{active.name} · {Math.floor(duration/60)}m {duration%60}s · PTP captured</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <WrapStat label="Outcome" value="PTP captured" tone="success" />
        <WrapStat label="Plan" value="3 × RM 2,260" />
        <WrapStat label="First payment" value="26 May 2026" />
      </div>

      <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Auto-actions completed
        </div>
        <WrapAction icon="whatsapp" tone="wa"      label="WhatsApp confirmation sent to •••2410" />
        <WrapAction icon="plans"    tone="brand"   label="Plan PL-1058 created & linked to case" />
        <WrapAction icon="bot"      tone="vox"     label="Enrolled in Soft cadence · Hardship workflow" />
        <WrapAction icon="receipt"  tone="default" label="Call notes saved to debtor timeline" />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <Button kind="brand" icon="phone" onClick={onStartNext}>Start next call</Button>
        <Button kind="secondary" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} icon="external" onClick={() => onOpenDebtor(debtor.id)}>Open case</Button>
        <div style={{ flex: 1 }} />
        <Button kind="ghost" style={{ color: 'rgba(255,255,255,0.7)' }} icon="play">Replay recording</Button>
      </div>
    </div>
  );
}

function WrapStat({ label, value, tone }) {
  return (
    <div style={{
      padding: '10px 12px',
      background: 'rgba(0,0,0,0.25)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10,
    }}>
      <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: tone === 'success' ? '#86efac' : '#fff', marginTop: 4 }}>{value}</div>
    </div>
  );
}

function WrapAction({ icon, tone, label }) {
  const tones = {
    wa:      { bg: 'rgba(37,211,102,0.15)',  fg: '#86efac' },
    brand:   { bg: 'rgba(225,29,72,0.15)',   fg: '#fca5a5' },
    vox:     { bg: 'rgba(0,184,217,0.15)',   fg: 'var(--vox)' },
    default: { bg: 'rgba(255,255,255,0.08)', fg: '#fff' },
  };
  const p = tones[tone];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: p.bg, color: p.fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={11} />
      </div>
      <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.85)' }}>{label}</div>
      <div style={{ flex: 1 }} />
      <Icon name="check" size={12} color="#86efac" />
    </div>
  );
}

function TransferModal({ open, onClose, debtorName }) {
  const [selected, setSelected] = useState(null);
  const team = [
    { id: 'farah-z', name: 'Farah Zainal',     role: 'Sr. Agent · Hardship',  status: 'available' },
    { id: 'irfan',   name: 'Irfan Mokhtar',    role: 'Agent · Recovery',      status: 'available' },
    { id: 'siti-r',  name: 'Siti Rashid',      role: 'Team Lead',             status: 'on-call' },
    { id: 'wei-jun', name: 'Tan Wei Jun',      role: 'Agent · Card products', status: 'available' },
    { id: 'legal',   name: 'Legal queue',      role: 'Department',            status: 'available', dept: true },
  ];
  return (
    <Modal open={open} onClose={onClose} dark width={460}
      title="Transfer call"
      subtitle={`Currently on call with ${debtorName}`}
      footer={
        <>
          <Button kind="ghost" style={{ color: 'rgba(255,255,255,0.7)' }} onClick={onClose}>Cancel</Button>
          <Button kind="brand" icon="transfer" disabled={!selected}
            onClick={() => {
              const t = team.find(x => x.id === selected);
              window.toast({ title: `Transferring to ${t.name}…`, description: 'Vox will brief them before connecting', tone: 'vox', icon: 'transfer' });
              onClose();
            }}>Transfer</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {team.map(t => {
          const a = selected === t.id;
          return (
            <button key={t.id} onClick={() => setSelected(t.id)} style={{
              padding: 10,
              background: a ? 'rgba(0,184,217,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${a ? 'rgba(0,184,217,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 10,
              textAlign: 'left', cursor: 'pointer',
              color: '#fff',
            }}>
              {t.dept
                ? <div style={{ width: 32, height: 32, borderRadius: 16, background: 'rgba(225,29,72,0.18)', color: '#fca5a5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="shield" size={14} /></div>
                : <Avatar name={t.name} size={32} />}
              <div style={{ flex: 1, lineHeight: 1.3 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{t.role}</div>
              </div>
              <span style={{
                fontSize: 10.5, padding: '2px 7px', borderRadius: 999,
                background: t.status === 'available' ? 'rgba(21,128,61,0.25)' : 'rgba(180,83,9,0.25)',
                color: t.status === 'available' ? '#86efac' : '#fcd34d',
                fontWeight: 500,
              }}>{t.status}</span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

function NotesDrawer({ open, onClose, notes, setNotes }) {
  const [val, setVal] = useState(notes);
  useEffect(() => { setVal(notes); }, [open]);
  return (
    <Modal open={open} onClose={onClose} dark width={520}
      title="Call notes"
      subtitle="Auto-drafted by Vox · editable"
      footer={
        <>
          <Button kind="ghost" style={{ color: 'rgba(255,255,255,0.7)' }} onClick={onClose}>Cancel</Button>
          <Button kind="brand" icon="check" onClick={() => { setNotes(val); window.toast({ title: 'Notes saved to timeline', icon: 'receipt', tone: 'success' }); onClose(); }}>Save notes</Button>
        </>
      }
    >
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={8}
        style={{
          width: '100%',
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10,
          padding: 12,
          fontSize: 13.5,
          color: '#fff',
          fontFamily: 'var(--font-sans)',
          resize: 'vertical',
          outline: 'none',
          lineHeight: 1.5,
        }}
      />
      <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
        {['PTP captured', 'Hardship flagged', 'Dispute raised', 'Refused', 'Callback requested'].map(t => (
          <button key={t} onClick={() => setVal(v => v + (v ? '\n• ' : '• ') + t)} style={{
            padding: '4px 9px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 999,
            color: 'rgba(255,255,255,0.7)',
            fontSize: 11.5,
            cursor: 'pointer',
          }}>+ {t}</button>
        ))}
      </div>
    </Modal>
  );
}

function TranscriptLine({ speaker, time, text, sentiment, tags, typing, highlight }) {
  const isVox = speaker === 'vox';
  return (
    <div style={{
      display: 'flex', gap: 12, marginBottom: 16,
      padding: highlight ? 10 : 0,
      background: highlight ? 'rgba(0,184,217,0.08)' : 'transparent',
      border: highlight ? '1px solid rgba(0,184,217,0.25)' : 'none',
      borderRadius: highlight ? 8 : 0,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 17, flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: isVox ? 'rgba(0,184,217,0.15)' : 'rgba(255,255,255,0.08)',
        color: isVox ? 'var(--vox)' : '#fff',
        border: isVox ? '1px solid rgba(0,184,217,0.35)' : '1px solid rgba(255,255,255,0.12)',
        fontSize: 11, fontWeight: 600,
      }}>
        {isVox ? <Icon name="bot" size={16} /> : initials('Lim Hui Min')}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: isVox ? 'var(--vox)' : 'rgba(255,255,255,0.85)' }}>
            {isVox ? 'Vox' : 'Lim Hui Min'}
          </span>
          <span className="mono" style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>{time}</span>
          {tags && tags.map(t => (
            <span key={t} style={{
              fontSize: 10, padding: '1px 6px', borderRadius: 4,
              background: t === 'agreement' ? 'rgba(21,128,61,0.25)' : t === 'hardship-signal' ? 'rgba(180,83,9,0.25)' : 'rgba(0,184,217,0.18)',
              color: t === 'agreement' ? '#86efac' : t === 'hardship-signal' ? '#fcd34d' : '#67e8f9',
              fontWeight: 500,
            }}>{t}</span>
          ))}
          {sentiment !== undefined && (
            <span style={{
              fontSize: 10, color: sentiment > 0.6 ? '#86efac' : sentiment > 0.4 ? '#fcd34d' : '#fca5a5',
              fontWeight: 500,
            }}>● {(sentiment * 100).toFixed(0)}% +ve</span>
          )}
        </div>
        <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.92)', lineHeight: 1.5 }}>
          {text}
          {typing && (
            <span style={{ display: 'inline-flex', gap: 3, marginLeft: 6, verticalAlign: 'middle' }}>
              <Dot /><Dot delay={0.2} /><Dot delay={0.4} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Dot({ delay = 0 }) {
  return (
    <span style={{
      width: 4, height: 4, borderRadius: 2,
      background: 'var(--vox)',
      display: 'inline-block',
      animation: `voxBar 0.9s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }} />
  );
}

function CallControl({ icon, label, active, onClick, tone }) {
  const tones = {
    default: { bg: 'rgba(255,255,255,0.08)', fg: '#fff', border: 'rgba(255,255,255,0.15)' },
    vox:     { bg: 'rgba(0,184,217,0.15)',   fg: 'var(--vox)', border: 'rgba(0,184,217,0.4)' },
  };
  const p = tones[tone || 'default'];
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 26,
        background: active ? 'var(--brand)' : p.bg,
        border: `1px solid ${active ? 'var(--brand)' : p.border}`,
        color: active ? '#fff' : p.fg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 120ms ease',
      }}>
        <Icon name={icon} size={20} />
      </div>
      <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{label}</span>
    </button>
  );
}

// ---------- Call queue (left rail) ----------
function CallQueue({ activeId, onSelect }) {
  return (
    <div style={{
      borderRight: '1px solid var(--line)',
      background: 'var(--surface-2)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: 14, borderBottom: '1px solid var(--line-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="call" size={16} color="var(--brand)" />
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Today's queue</h3>
          <div style={{ flex: 1 }} />
          <Badge size="sm" tone="brand">7 active</Badge>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 11, color: 'var(--muted)' }}>
          <div>
            <div className="tnum" style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>18</div>
            <div>completed</div>
          </div>
          <div>
            <div className="tnum" style={{ fontSize: 16, fontWeight: 600, color: 'var(--vox-deep)' }}>12</div>
            <div>by Vox</div>
          </div>
          <div>
            <div className="tnum" style={{ fontSize: 16, fontWeight: 600, color: 'var(--success)' }}>9</div>
            <div>PTPs got</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }} className="thin-scroll">
        {PULSE_QUEUE.map((q) => {
          const isActive = q.id === activeId;
          return (
            <button key={q.id} onClick={() => onSelect(q.id)} style={{
              width: '100%',
              textAlign: 'left',
              padding: 10,
              background: isActive ? '#fff' : 'transparent',
              border: isActive ? '1px solid var(--brand)' : '1px solid transparent',
              borderLeft: isActive ? '3px solid var(--brand)' : '1px solid transparent',
              borderRadius: 8,
              marginBottom: 2,
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              transition: 'background 100ms ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar name={q.name} size={30} />
                <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {q.name}
                    {q.priority && <Icon name="star" size={10} color="#C2410C" style={{ marginLeft: 4 }} />}
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {q.country && <FlagDot country={q.country} />}
                    {q.status === 'live' ? `Live · ${q.dur}` : q.scheduled}
                  </div>
                </div>
                {q.status === 'live' && <span className="live-dot" style={{ width: 6, height: 6 }} />}
                {q.vox && q.status !== 'live' && <Icon name="bot" size={12} color="var(--vox-deep)" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Right rail ----------
function CallContextRail({ suggestion, onApprove, onModify, onCancelModify, onSaveModify }) {
  const [editedMonths, setEditedMonths] = useState(3);

  return (
    <div style={{
      borderLeft: '1px solid var(--line)',
      background: 'var(--card)',
      overflowY: 'auto',
      padding: 16,
      display: 'flex', flexDirection: 'column', gap: 14,
    }} className="thin-scroll">

      {/* Sentiment */}
      <Card padding={14}>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Call sentiment</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 26, fontWeight: 600, color: 'var(--success)' }} className="tnum">72%</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>cooperative</span>
        </div>
        <div style={{ marginTop: 10, height: 36, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
          {[40, 42, 38, 45, 35, 32, 38, 48, 55, 62, 60, 68, 72, 70, 72].map((v, i) => (
            <div key={i} style={{
              flex: 1, height: `${v}%`,
              background: v > 60 ? 'var(--success)' : v > 40 ? '#FCD34D' : '#FCA5A5',
              borderRadius: 1.5,
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
          <span>0:00</span><span>now</span>
        </div>
      </Card>

      {/* Signals */}
      <div>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Signals detected</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Signal tone="warn" icon="warn" label="Hardship indicator" desc="“tight with the renovation”" />
          <Signal tone="success" icon="check" label="Agreement" desc="Customer accepted 3-month plan" />
          <Signal tone="vox" icon="bot" label="Negotiation" desc="Payment date: 26th of month" />
        </div>
      </div>

      {/* Next-best action */}
      <Card padding={14} style={{
        borderColor: suggestion === 'approved' ? 'rgba(21,128,61,0.4)' : 'rgba(0,184,217,0.3)',
        background: suggestion === 'approved' ? 'var(--success-soft)' : 'var(--vox-soft)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Icon name={suggestion === 'approved' ? 'check' : 'sparkle'} size={14} color={suggestion === 'approved' ? 'var(--success)' : 'var(--vox-deep)'} />
          <span style={{ fontSize: 11.5, fontWeight: 600, color: suggestion === 'approved' ? 'var(--success)' : 'var(--vox-deep)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {suggestion === 'approved' ? 'Approved · will execute on hangup' : 'Vox · suggested next step'}
          </span>
        </div>

        {suggestion === 'modifying' ? (
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Plan length</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
              {[2, 3, 4, 6].map(k => (
                <button key={k} onClick={() => setEditedMonths(k)} style={{
                  flex: 1, padding: '8px 0',
                  background: editedMonths === k ? 'var(--ink)' : '#fff',
                  color: editedMonths === k ? '#fff' : 'var(--ink-2)',
                  border: '1px solid ' + (editedMonths === k ? 'var(--ink)' : 'var(--line)'),
                  borderRadius: 6,
                  fontSize: 12, fontWeight: 600,
                  cursor: 'pointer',
                }}>{k} mo</button>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 10 }}>
              Each instalment: <b className="tnum">RM {(6780 / editedMonths).toFixed(0)}</b>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button kind="vox" size="sm" icon="check" onClick={onSaveModify}>Save & approve</Button>
              <Button kind="ghost" size="sm" onClick={onCancelModify}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5, marginBottom: 10 }}>
              Send the 3-instalment plan via WhatsApp on call end; auto-enrol customer in <b>Soft cadence · Hardship</b> workflow.
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {suggestion === 'approved' ? (
                <Badge tone="success" icon="check">Approved</Badge>
              ) : (
                <>
                  <Button kind="vox" size="sm" icon="check" onClick={onApprove}>Approve</Button>
                  <Button kind="ghost" size="sm" icon="edit" onClick={onModify}>Modify</Button>
                </>
              )}
            </div>
          </>
        )}
      </Card>

      {/* Script */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', flex: 1 }}>Script · empathetic</div>
          <Icon name="chevDown" size={12} color="var(--muted)" />
        </div>
        <Card padding={12}>
          <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>
            <div style={{ marginBottom: 6, color: 'var(--muted)', fontSize: 11 }}>1 · Acknowledge hardship</div>
            <div style={{ marginBottom: 8 }}>"I completely understand — [reason] can throw budgets off."</div>
            <div style={{ marginBottom: 6, color: 'var(--muted)', fontSize: 11 }}>2 · Offer options</div>
            <div>"Would a 2 or 3-month plan with smaller instalments help?"</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Signal({ tone, icon, label, desc }) {
  const tones = {
    warn:    { bg: 'var(--warn-soft)', fg: 'var(--warn)' },
    success: { bg: 'var(--success-soft)', fg: 'var(--success)' },
    vox:     { bg: 'var(--vox-soft)', fg: 'var(--vox-deep)' },
  };
  const p = tones[tone];
  return (
    <div style={{
      padding: 10,
      background: 'var(--card)',
      border: '1px solid var(--line)',
      borderRadius: 8,
      display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: p.bg, color: p.fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={11} />
      </div>
      <div style={{ lineHeight: 1.3 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{desc}</div>
      </div>
    </div>
  );
}

window.CallConsoleScreen = CallConsoleScreen;
