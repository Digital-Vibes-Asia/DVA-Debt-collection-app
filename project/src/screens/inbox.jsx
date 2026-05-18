// WhatsApp inbox — 3-pane: thread list, conversation, context panel with Vox suggestion

// ---------- Quick reply templates (with localisation + interpolation) ----------
// Tokens: {first} {name} {amount} {ccy} {accountTail} {nextDue} {agent}
const QUICK_REPLY_TEMPLATES = [
  {
    id: 'plan',
    icon: '📅',
    label: 'Send payment plan link',
    en: 'Hi {first}, here is a secure link to set up a 2 or 3-instalment plan for your outstanding {amount}: dva.pl/plan/{accountTail}. Tap to pick the dates that work for you 🙏',
    ms: 'Hai {first}, ini link selamat untuk set up pelan bayaran 2 atau 3 ansuran untuk baki {amount}: dva.pl/plan/{accountTail}. Pilih tarikh yang sesuai untuk anda 🙏',
    id: 'Halo {first}, ini link aman untuk mengatur cicilan 2 atau 3 kali untuk sisa {amount}: dva.pl/plan/{accountTail}. Tap untuk memilih tanggal yang cocok 🙏',
    vi: 'Chào {first}, đây là liên kết an toàn để lập kế hoạch 2 hoặc 3 đợt cho số dư {amount}: dva.pl/plan/{accountTail}. Bấm để chọn ngày phù hợp 🙏',
    th: 'สวัสดีคุณ {first} นี่ลิงก์สำหรับตั้งแผนผ่อน 2 หรือ 3 งวดสำหรับยอดค้าง {amount} ค่ะ: dva.pl/plan/{accountTail} 🙏',
  },
  {
    id: 'received',
    icon: '🧾',
    label: 'Confirm payment received',
    en: 'Hi {first}, we received your payment — thank you 🙏 Your remaining balance is now {amount}. Receipt #PMT-{accountTail} sent to your email.',
    ms: 'Hai {first}, kami terima bayaran anda — terima kasih 🙏 Baki tertunggak sekarang {amount}. Resit #PMT-{accountTail} dihantar ke emel.',
    id: 'Halo {first}, pembayaran sudah kami terima — terima kasih 🙏 Sisa Anda saat ini {amount}. Kuitansi #PMT-{accountTail} dikirim ke email.',
    vi: 'Chào {first}, đã nhận được khoản thanh toán — cảm ơn 🙏 Số dư còn lại là {amount}. Biên nhận #PMT-{accountTail} đã gửi đến email.',
    th: 'รับชำระแล้วค่ะคุณ {first} — ขอบคุณค่ะ 🙏 ยอดคงเหลือ {amount} ใบเสร็จ #PMT-{accountTail} ส่งไปที่อีเมลแล้ว',
  },
  {
    id: 'reschedule',
    icon: '⏰',
    label: 'Reschedule call',
    en: 'Hi {first}, no problem at all — when works for you? Morning (9–11), afternoon (2–4), or evening (6–8)?',
    ms: 'Hai {first}, tak ada masalah — bila masa sesuai? Pagi (9–11), tengah hari (2–4), atau petang (6–8)?',
    id: 'Halo {first}, tidak masalah — kapan waktu yang cocok? Pagi (9–11), siang (2–4), atau sore (6–8)?',
    vi: 'Chào {first}, không sao cả — khi nào tiện cho anh/chị? Sáng (9–11), chiều (2–4), hay tối (6–8)?',
    th: 'ไม่เป็นไรค่ะคุณ {first} — สะดวกเวลาไหน? เช้า (9–11), บ่าย (2–4) หรือเย็น (6–8)?',
  },
  {
    id: 'hardship',
    icon: '🤝',
    label: 'Offer hardship review',
    en: 'Hi {first}, I hear you. If things are tight right now, we can run a quick hardship review and see what relief fits. Reply YES and I will send the short form — no commitment.',
    ms: 'Hai {first}, saya faham. Kalau kewangan agak ketat sekarang, kita boleh buat semakan hardship cepat — saya akan hantar borang ringkas. Tiada komitmen.',
    id: 'Halo {first}, saya mengerti. Jika kondisi sedang sulit, kami bisa lakukan tinjauan hardship cepat untuk lihat opsi keringanan. Balas YA, saya kirim formulirnya.',
    vi: 'Chào {first}, tôi hiểu. Nếu tình hình đang khó khăn, chúng tôi có thể xét hỗ trợ nhanh — trả lời YES tôi sẽ gửi mẫu đơn ngắn.',
    th: 'เข้าใจค่ะคุณ {first} — ถ้าตอนนี้การเงินตึงตัว เรามีตัวเลือกช่วยเหลือ ตอบ YES มาเดี๋ยวส่งแบบฟอร์มสั้น ๆ ให้ค่ะ',
  },
  {
    id: 'callback',
    icon: '📞',
    label: 'Request callback time',
    en: 'Hi {first}, when is a good time for a quick 5-minute call today? I will book it in.',
    ms: 'Hai {first}, bila masa sesuai untuk panggilan 5 minit hari ini? Saya akan tempahkan slot.',
    id: 'Halo {first}, kapan waktu yang pas untuk telpon singkat 5 menit hari ini? Akan saya pesankan slot-nya.',
    vi: 'Chào {first}, anh/chị có 5 phút để gọi nhanh hôm nay không? Tôi sẽ đặt lịch.',
    th: 'คุณ {first} ค่ะ มีเวลาคุย 5 นาทีวันนี้ไหม? จะจองเวลาให้ค่ะ',
  },
  {
    id: 'paylink',
    icon: '💳',
    label: 'Send one-tap pay link',
    en: 'Hi {first}, here is a one-tap pay link for {amount}. You can split or pay full: dva.pl/pay/{accountTail}',
    ms: 'Hai {first}, ini link bayar terus untuk {amount}. Boleh bayar penuh atau sebahagian: dva.pl/pay/{accountTail}',
    id: 'Halo {first}, ini link bayar instan untuk {amount}. Bisa bayar penuh atau sebagian: dva.pl/pay/{accountTail}',
    vi: 'Chào {first}, đây là liên kết thanh toán nhanh cho {amount}. Có thể trả toàn bộ hoặc một phần: dva.pl/pay/{accountTail}',
    th: 'ลิงก์จ่ายเงินด่วนสำหรับยอด {amount} ค่ะคุณ {first} จะจ่ายเต็มหรือบางส่วนก็ได้: dva.pl/pay/{accountTail}',
  },
  {
    id: 'docs',
    icon: '📎',
    label: 'Request documents',
    en: 'Hi {first}, to move your case forward could you share a recent bank statement and any supporting documents? You can attach them right here in this chat.',
    ms: 'Hai {first}, untuk teruskan kes anda, boleh kongsi penyata bank terkini dan dokumen sokongan? Lampirkan di sini saja.',
    id: 'Halo {first}, untuk memproses kasus Anda, mohon bagikan rekening koran terbaru dan dokumen pendukung. Bisa langsung dilampirkan di chat ini.',
    vi: 'Chào {first}, để tiếp tục xử lý, vui lòng chia sẻ sao kê ngân hàng gần đây và tài liệu hỗ trợ. Có thể đính kèm ngay trong chat này.',
    th: 'คุณ {first} ค่ะ เพื่อดำเนินเรื่องต่อ ขอสลิปธนาคารล่าสุดและเอกสารประกอบส่งทางแชทนี้ได้เลยค่ะ',
  },
  {
    id: 'thanks',
    icon: '💜',
    label: 'Acknowledge & thanks',
    en: 'Thank you {first} — really appreciate you getting back to me. I will follow up with the next step shortly.',
    ms: 'Terima kasih banyak {first} — hargai anda balas. Saya akan susul dengan langkah seterusnya sebentar lagi.',
    id: 'Terima kasih {first} — saya hargai responnya. Akan saya kirim langkah berikutnya sebentar lagi.',
    vi: 'Cảm ơn {first} — cảm ơn đã phản hồi. Tôi sẽ gửi bước tiếp theo ngay.',
    th: 'ขอบคุณค่ะคุณ {first} ที่ตอบกลับ จะส่งขั้นตอนต่อไปให้ทันทีค่ะ',
  },
];

// Pick locale from debtor's country
const COUNTRY_TO_LANG = { MY: 'ms', ID: 'id', VN: 'vi', TH: 'th', SG: 'en', PH: 'en' };
const LANG_LABEL = { en: 'EN', ms: 'BM', id: 'ID', vi: 'VI', th: 'TH' };

function applyTemplate(tpl, debtor, lang) {
  const useLang = lang === 'auto' ? (COUNTRY_TO_LANG[debtor.country] || 'en') : lang;
  const text = tpl[useLang] || tpl.en;
  const first = debtor.name.split(/\s+/)[0];
  const amount = fmtMoney(debtor.balance, debtor.ccy);
  const accountTail = debtor.accountNumber.slice(-4);
  return text
    .replace(/\{first\}/g, first)
    .replace(/\{name\}/g, debtor.name)
    .replace(/\{amount\}/g, amount)
    .replace(/\{ccy\}/g, debtor.ccy)
    .replace(/\{accountTail\}/g, accountTail)
    .replace(/\{nextDue\}/g, new Date(debtor.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
}

function InboxScreen({ onOpenDebtor }) {
  const [activeId, setActiveId] = useState('t-aishah');
  const [filter, setFilter] = useState('all');
  const [draft, setDraft] = useState('');
  const [voxAccepted, setVoxAccepted] = useState(false);
  const [language, setLanguage] = useState('auto');
  const [threadMessages, setThreadMessages] = useState(() => {
    const map = {};
    THREADS.forEach(t => { map[t.id] = [...(t.messages || [])]; });
    return map;
  });
  const messagesEndRef = useRef(null);

  const threadStatic = THREADS.find(t => t.id === activeId) || THREADS[0];
  const thread = { ...threadStatic, messages: threadMessages[threadStatic.id] || [] };
  const debtor = DEBTORS.find(d => d.id === thread.debtorId);

  useEffect(() => {
    setDraft('');
    setVoxAccepted(false);
  }, [activeId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [thread.messages.length, activeId]);

  function acceptVox() {
    if (thread.suggestion) {
      setDraft(thread.suggestion.text);
      setVoxAccepted(true);
    }
  }

  function useQuickReply(tpl) {
    if (!debtor) return;
    setDraft(applyTemplate(tpl, debtor, language));
  }

  function sendDraft() {
    if (!draft.trim()) return;
    const newMsg = {
      id: 'm' + Date.now(),
      from: 'me',
      at: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      text: draft.trim(),
    };
    setThreadMessages(prev => ({
      ...prev,
      [thread.id]: [...(prev[thread.id] || []), newMsg],
    }));
    setDraft('');
    setVoxAccepted(false);
  }

  const counts = {
    all: THREADS.length,
    unread: THREADS.filter(t => t.unread > 0).length,
    assigned: THREADS.filter(t => true).length,
    voxDrafted: THREADS.filter(t => t.suggestion).length,
  };

  // Filter thread list based on the active pill
  const filteredThreads = useMemo(() => {
    return THREADS.filter(t => {
      if (filter === 'unread')     return t.unread > 0;
      if (filter === 'voxDrafted') return !!t.suggestion;
      if (filter === 'assigned') {
        const d = DEBTORS.find(x => x.id === t.debtorId);
        return d && (d.assigned === 'You' || d.assigned === 'Farah Aziz');
      }
      return true;
    });
  }, [filter]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '300px 1fr 340px',
      height: 'calc(100vh - 60px)',
    }}>
      {/* Thread list */}
      <div style={{
        borderRight: '1px solid var(--line)',
        background: 'var(--surface-2)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: 14, borderBottom: '1px solid var(--line-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Icon name="whatsapp" size={18} color="var(--wa-deep)" />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>WhatsApp inbox</h3>
            <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 4 }}>· connected</span>
            <div style={{ flex: 1 }} />
            <IconButton icon="edit" size={26} iconSize={14} />
          </div>
          <SearchInput placeholder="Search conversations…" />
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 4, padding: '10px 14px', overflowX: 'auto' }} className="thin-scroll">
          {[
            { k: 'all',        l: 'All',        c: counts.all },
            { k: 'unread',     l: 'Unread',     c: counts.unread },
            { k: 'voxDrafted', l: 'Vox-drafted', c: counts.voxDrafted, vox: true },
            { k: 'assigned',   l: 'Mine',       c: counts.assigned },
          ].map(f => {
            const active = filter === f.k;
            return (
              <button
                key={f.k}
                onClick={() => setFilter(f.k)}
                style={{
                  height: 26, padding: '0 9px',
                  background: active ? 'var(--ink)' : '#fff',
                  color: active ? '#fff' : 'var(--ink-2)',
                  border: '1px solid ' + (active ? 'var(--ink)' : 'var(--line)'),
                  borderRadius: 999,
                  fontSize: 12, fontWeight: 500,
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  whiteSpace: 'nowrap',
                }}
              >
                {f.vox && <Icon name="bot" size={11} />}
                {f.l}
                <span style={{ fontSize: 10.5, color: active ? 'rgba(255,255,255,0.6)' : 'var(--muted)' }} className="tnum">{f.c}</span>
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }} className="thin-scroll">
          {filteredThreads.length === 0 && (
            <div style={{ padding: 30, textAlign: 'center', fontSize: 12.5, color: 'var(--muted)' }}>
              <Icon name="inbox" size={24} color="var(--muted-2)" />
              <div style={{ marginTop: 6 }}>No conversations match this filter</div>
            </div>
          )}
          {filteredThreads.map(t => {
            const active = t.id === activeId;
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: active ? '#fff' : 'transparent',
                  borderLeft: '3px solid ' + (active ? 'var(--brand)' : 'transparent'),
                  borderBottom: '1px solid var(--line-2)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  textAlign: 'left',
                }}
              >
                <Avatar name={t.name} size={40} />
                <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: t.unread > 0 ? 700 : 600, color: 'var(--ink)' }}>{t.name}</span>
                    {t.pinned && <Icon name="pin" size={11} color="var(--brand)" />}
                    {t.muted && <Icon name="micOff" size={11} color="var(--muted-2)" />}
                    <div style={{ flex: 1 }} />
                    <span style={{ fontSize: 10.5, color: t.unread > 0 ? 'var(--brand)' : 'var(--muted)', fontWeight: t.unread > 0 ? 600 : 500 }}>{t.at}</span>
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: t.unread > 0 ? 'var(--ink-2)' : 'var(--muted)',
                    fontWeight: t.unread > 0 ? 500 : 400,
                    marginTop: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{t.preview}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
                    {t.suggestion && <Badge size="sm" tone="vox" icon="bot">Vox draft</Badge>}
                    {t.unread > 0 && (
                      <span style={{
                        minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8,
                        background: 'var(--brand)', color: '#fff', fontSize: 10, fontWeight: 600,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>{t.unread}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        background: '#FBF9F4',
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(220,248,198,0.18) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(225,29,72,0.04) 0%, transparent 50%)',
      }}>
        {/* Thread header */}
        <div style={{
          padding: '10px 18px',
          borderBottom: '1px solid var(--line)',
          background: 'rgba(251,250,247,0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Avatar name={thread.name} size={38} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600 }}>
              {thread.name}
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted)' }}>
                · {debtor ? `${debtor.city}, ${debtor.country}` : ''}
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="live-dot wa" style={{ width: 6, height: 6 }} />
              Online · last seen just now
            </div>
          </div>
          <Button kind="secondary" size="sm" icon="phone">Call</Button>
          <Button kind="vox" size="sm" icon="bot">Vox call</Button>
          <IconButton icon="more" />
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 80px' }} className="thin-scroll" ref={messagesEndRef}>
          <DateDivider label="Today" />
          {thread.messages.map((m, i) => (
            <MessageBubble key={m.id} m={m} prev={thread.messages[i - 1]} />
          ))}
          {voxAccepted && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <Badge tone="vox" size="sm" icon="bot">Vox draft loaded — review and send</Badge>
            </div>
          )}
        </div>

        {/* Composer */}
        <div style={{
          margin: '0 12px 12px',
          padding: 10,
          background: '#fff',
          border: '1px solid var(--line)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-sm)',
        }}>
          {!voxAccepted && thread.suggestion && (
            <VoxSuggestionCard suggestion={thread.suggestion} onAccept={acceptVox} onDismiss={() => setVoxAccepted(true)} />
          )}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <IconButton icon="paperclip" size={32} iconSize={16} />
            <IconButton icon="template" size={32} iconSize={16} title="Templates" />
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message…"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendDraft();
                }
              }}
              style={{
                flex: 1,
                resize: 'none',
                border: 'none',
                outline: 'none',
                fontSize: 13.5,
                background: 'transparent',
                padding: '6px 4px',
                lineHeight: 1.4,
                fontFamily: 'inherit',
              }}
            />
            <Button kind="brand" size="sm" icon="bot" onClick={acceptVox}>Ask Vox</Button>
            <Button kind="whatsapp" size="sm" icon="send" onClick={sendDraft} disabled={!draft.trim()}>Send</Button>
          </div>
        </div>
      </div>

      {/* Context panel */}
      {debtor && (
        <ContextPanel
          debtor={debtor}
          onOpenDebtor={onOpenDebtor}
          onUseQuickReply={useQuickReply}
          language={language}
          onChangeLanguage={setLanguage}
        />
      )}
    </div>
  );
}

function MessageBubble({ m }) {
  const isMe = m.from === 'me';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isMe ? 'flex-end' : 'flex-start',
      marginBottom: 4,
    }}>
      <div style={{
        maxWidth: '70%',
        padding: '8px 12px',
        background: isMe ? 'var(--wa-bubble)' : '#fff',
        border: isMe ? 'none' : '1px solid var(--line)',
        borderRadius: 12,
        borderTopLeftRadius:  !isMe ? 4 : 12,
        borderTopRightRadius:  isMe ? 4 : 12,
        boxShadow: '0 1px 1px rgba(0,0,0,0.04)',
        position: 'relative',
      }}>
        <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
          {m.attachment && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
              background: 'rgba(0,0,0,0.04)', borderRadius: 6, marginBottom: 6,
            }}>
              <Icon name="document" size={16} color="var(--ink-3)" />
              <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{m.text.replace(/[\[\]]/g, '')}</span>
            </div>
          )}
          {!m.attachment && m.text}
        </div>
        <div style={{
          fontSize: 9.5, color: 'var(--muted)',
          textAlign: 'right', marginTop: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4,
        }}>
          <span>{m.at}</span>
          {isMe && <Icon name="check" size={11} color="var(--wa-deep)" />}
        </div>
      </div>
    </div>
  );
}

function VoxSuggestionCard({ suggestion, onAccept, onDismiss }) {
  return (
    <div style={{
      margin: '0 0 10px 0',
      padding: 12,
      background: 'linear-gradient(135deg, rgba(0,184,217,0.06), rgba(0,184,217,0.02))',
      border: '1px solid rgba(0,184,217,0.25)',
      borderRadius: 10,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Avatar isAi name="Vox" size={22} />
        <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--vox-deep)' }}>Vox suggested reply</span>
        <Badge tone="soft" size="sm">{suggestion.tone}</Badge>
        <div style={{ flex: 1 }} />
        <IconButton icon="refresh" size={22} iconSize={12} tone="vox" />
        <IconButton icon="close" size={22} iconSize={12} onClick={onDismiss} />
      </div>
      <div style={{
        fontSize: 13, color: 'var(--ink)', lineHeight: 1.5,
        padding: '6px 8px', background: 'rgba(255,255,255,0.6)',
        borderRadius: 6, marginBottom: 8,
      }}>
        "{suggestion.text}"
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 10, fontStyle: 'italic', lineHeight: 1.4 }}>
        <Icon name="sparkle" size={11} color="var(--vox-deep)" style={{ verticalAlign: '-1px', marginRight: 4 }} />
        {suggestion.rationale}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Button kind="vox" size="sm" icon="check" onClick={onAccept}>Use this draft</Button>
        <Button kind="ghost" size="sm" icon="edit" onClick={onAccept}>Edit & send</Button>
        <Button kind="ghost" size="sm" icon="refresh">Try another tone</Button>
      </div>
    </div>
  );
}

function ContextPanel({ debtor, onOpenDebtor, onUseQuickReply, language, onChangeLanguage }) {
  const autoLang = COUNTRY_TO_LANG[debtor.country] || 'en';
  const effective = language === 'auto' ? autoLang : language;
  return (
    <div style={{
      borderLeft: '1px solid var(--line)',
      background: 'var(--surface-2)',
      overflowY: 'auto',
      padding: 16,
      display: 'flex', flexDirection: 'column', gap: 14,
    }} className="thin-scroll">
      <div>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Customer
        </div>
        <Card padding={14}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Avatar name={debtor.name} size={42} />
            <div style={{ flex: 1, lineHeight: 1.3 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{debtor.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{debtor.id} · {debtor.product}</div>
            </div>
          </div>
          <Button kind="secondary" size="sm" full icon="external" onClick={() => onOpenDebtor(debtor.id)}>Open full case</Button>
        </Card>
      </div>

      <Card padding={14}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Outstanding</div>
          <Badge tone={debtor.daysOverdue > 30 ? 'warn' : 'soft'} size="sm">{debtor.daysOverdue}d overdue</Badge>
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--brand-deep)' }} className="tnum">
          {fmtMoney(debtor.balance, debtor.ccy)}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }} className="tnum">
          of {fmtMoney(debtor.originalAmount, debtor.ccy)} originated
        </div>
        {debtor.promiseToPay && (
          <div style={{ marginTop: 10, padding: 8, background: 'var(--success-soft)', borderRadius: 7, fontSize: 11.5 }}>
            <div style={{ fontWeight: 600, color: 'var(--success)' }}>Promise to pay</div>
            <div className="tnum" style={{ color: 'var(--ink)' }}>{fmtMoney(debtor.promiseAmount, debtor.ccy)} on {new Date(debtor.promiseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
          </div>
        )}
      </Card>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', flex: 1 }}>
            Quick replies
          </div>
          <span style={{ fontSize: 10, color: 'var(--muted)', marginRight: 6 }}>
            sends in <b style={{ color: 'var(--ink-2)', fontFamily: 'var(--font-mono)' }}>{LANG_LABEL[effective]}</b>
          </span>
        </div>

        {/* Language picker */}
        <div style={{ display: 'flex', gap: 3, padding: 2, background: '#fff', border: '1px solid var(--line)', borderRadius: 7, marginBottom: 8 }}>
          {[
            { v: 'auto', l: 'Auto' },
            { v: 'en',   l: 'EN' },
            { v: 'ms',   l: 'BM' },
            { v: 'id',   l: 'ID' },
            { v: 'vi',   l: 'VI' },
            { v: 'th',   l: 'TH' },
          ].map(o => {
            const active = language === o.v;
            return (
              <button key={o.v} onClick={() => onChangeLanguage(o.v)} style={{
                flex: 1, padding: '4px 0',
                background: active ? 'var(--ink)' : 'transparent',
                color: active ? '#fff' : 'var(--ink-3)',
                border: 'none',
                borderRadius: 5,
                fontSize: 10.5, fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
              }}>{o.l}</button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {QUICK_REPLY_TEMPLATES.map(tpl => {
            const preview = applyTemplate(tpl, debtor, language);
            return (
              <button
                key={tpl.id}
                onClick={() => onUseQuickReply(tpl)}
                title={preview}
                style={{
                  padding: '8px 10px',
                  background: '#fff',
                  border: '1px solid var(--line)',
                  borderRadius: 8,
                  fontSize: 12.5,
                  color: 'var(--ink-2)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  transition: 'background 120ms ease, border-color 120ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--brand-soft)';
                  e.currentTarget.style.borderColor = 'rgba(159,18,57,0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = 'var(--line)';
                }}
              >
                <span style={{ fontSize: 14, lineHeight: 1.2, flexShrink: 0 }}>{tpl.icon}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500 }}>{tpl.label}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {preview}
                  </div>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Vox style
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Badge tone="brand" size="sm" icon="check">Empathetic</Badge>
          <Badge tone="soft" size="sm">Firm</Badge>
          <Badge tone="soft" size="sm">Concise</Badge>
          <Badge tone="soft" size="sm">{LANG_LABEL[effective] === 'EN' ? 'English' : 'Bahasa / locale'}</Badge>
        </div>
      </div>
    </div>
  );
}

window.InboxScreen = InboxScreen;
