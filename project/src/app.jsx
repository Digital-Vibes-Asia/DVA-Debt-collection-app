// App root — wires sidebar nav to screens

function App() {
  const [route, setRoute] = useState({ screen: 'debtors', debtorId: null, threadId: null });

  function nav(screen) {
    if (screen === 'vox') {
      // Vox AI lives inside settings → vox tab
      setRoute({ screen: 'settings', voxTab: true });
      return;
    }
    setRoute({ screen, debtorId: null });
  }

  function openDebtor(debtorId) {
    setRoute({ screen: 'debtor-detail', debtorId });
  }
  function openThread(threadId) {
    setRoute({ screen: 'inbox', threadId });
  }
  function openCall() {
    setRoute({ screen: 'calls' });
  }
  function openPlan() {
    setRoute({ screen: 'plans' });
  }

  const titles = {
    debtors:    { title: 'Debtors',       kicker: 'Work' },
    'debtor-detail': null,
    inbox:      null,
    calls:      null,
    plans:      { title: 'Payment plans', kicker: 'Work' },
    disputes:   { title: 'Disputes & complaints', kicker: 'Casework' },
    hardship:   { title: 'Hardship reviews',      kicker: 'Casework' },
    legal:      { title: 'Legal queue',           kicker: 'Casework' },
    workflows:  { title: 'Workflows',     kicker: 'Automate' },
    reports:    { title: 'Reports',       kicker: 'Insights' },
    team:       { title: 'Team',          kicker: 'Insights' },
    settings:   { title: 'Settings',      kicker: 'Setup' },
    mobile:     { title: 'Mobile preview', kicker: 'Setup' },
  };

  const currentNav =
    route.screen === 'debtor-detail' ? 'debtors' :
    route.screen;

  const showTopbar = route.screen !== 'inbox' && route.screen !== 'calls';

  let screen;
  switch (route.screen) {
    case 'debtors':         screen = <DebtorsScreen onOpenDebtor={openDebtor} />; break;
    case 'debtor-detail':   screen = <DebtorDetailScreen
                                debtorId={route.debtorId}
                                onBack={() => nav('debtors')}
                                onOpenThread={openThread}
                                onOpenCall={openCall}
                                onOpenPlan={openPlan}
                                onNav={nav}
                              />; break;
    case 'inbox':           screen = <InboxScreen onOpenDebtor={openDebtor} />; break;
    case 'calls':           screen = <CallConsoleScreen onOpenDebtor={openDebtor} />; break;
    case 'plans':           screen = <PlansScreen onOpenDebtor={() => openDebtor('D-2841')} />; break;
    case 'disputes':        screen = <DisputesScreen onOpenDebtor={openDebtor} />; break;
    case 'hardship':        screen = <HardshipScreen onOpenDebtor={openDebtor} />; break;
    case 'legal':           screen = <LegalScreen onOpenDebtor={openDebtor} />; break;
    case 'workflows':       screen = <WorkflowsScreen />; break;
    case 'reports':         screen = <ReportsScreen />; break;
    case 'team':            screen = <TeamScreen />; break;
    case 'settings':        screen = <SettingsScreen />; break;
    case 'mobile':          screen = <MobileScreen />; break;
    default: screen = null;
  }

  // Topbar config per screen
  let topbarProps = null;
  if (showTopbar) {
    if (route.screen === 'debtor-detail') {
      const d = DEBTORS.find(x => x.id === route.debtorId) || DEBTORS[0];
      topbarProps = {
        breadcrumb: ['Debtors', bucketOf(d.daysOverdue).label, d.name],
      };
    } else if (titles[route.screen]) {
      topbarProps = titles[route.screen];
    }
  }

  return (
    <div data-screen-label={`Pulse · ${route.screen}`} style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar current={currentNav} onNav={nav} />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {showTopbar && topbarProps && <Topbar {...topbarProps} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          {screen}
        </div>
      </main>
      <TweaksPanel />
      <ToastHost />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app-root')).render(<App />);
