import dynamic from 'next/dynamic';

const LoginPage = dynamic(
  () => import('../../../project/src/login/LoginPage'),
  { ssr: false }
);

export function generateStaticParams() {
  return [
    { role: 'sales-manager' },
    { role: 'senior-manager' },
    { role: 'head-of-sales' },
  ];
}

export default function RoleLoginPage() {
  return <LoginPage />;
}
