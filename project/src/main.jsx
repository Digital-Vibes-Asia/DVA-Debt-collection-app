// Bootstrap order matters: setup runs first (sets React globals), then
// components load in dependency order, then app mounts.
import './setup.js';
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
