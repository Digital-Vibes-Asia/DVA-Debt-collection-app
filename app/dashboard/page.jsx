import dynamic from 'next/dynamic';

const DVAPulse = dynamic(
  () => import('../../project/src/DVAPulse'),
  { ssr: false }
);

export default function DashboardPage() {
  return <DVAPulse />;
}
