import dynamic from 'next/dynamic';

const LoginPage = dynamic(
  () => import('../project/src/login/LoginPage'),
  { ssr: false }
);

export default function Page() {
  return <LoginPage />;
}
