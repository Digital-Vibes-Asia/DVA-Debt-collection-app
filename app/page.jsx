import dynamic from 'next/dynamic';

// Load the entire app client-side only (ssr:false) because the components
// use window globals extensively — safe to skip SSR for a CRM dashboard.
const DVAPulse = dynamic(() => import('../project/src/DVAPulse'), { ssr: false });

export default function Page() {
  return <DVAPulse />;
}
