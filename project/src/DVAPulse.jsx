'use client';

// Boot order: setup (React globals) → data → ui primitives → screens → app
import './setup.js';
import './generated-debtors.jsx';
import './icons.jsx';
import './data.jsx';
import './casework-data.jsx';
import './ui.jsx';
import './toast.jsx';
import './sidebar.jsx';
import './topbar.jsx';
import './screens/debtors.jsx';
import './screens/debtor-detail.jsx';
import './screens/inbox.jsx';
import './screens/call-console.jsx';
import './screens/workflows.jsx';
import './screens/plans.jsx';
import './screens/disputes.jsx';
import './screens/hardship.jsx';
import './screens/legal.jsx';
import './screens/reports.jsx';
import './screens/team.jsx';
import './screens/settings.jsx';
import './screens/mobile.jsx';
import './tweaks.jsx';
import './app.jsx';

export default function DVAPulse() {
  const App = window.App;
  return <App />;
}
