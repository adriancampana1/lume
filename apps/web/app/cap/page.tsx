import { redirect } from 'next/navigation';
import { apiFetch } from '../lib/api-server.js';
import { PageShell } from '../components/page-shell.js';
import { Footer } from '../components/landing/footer.js';
import { CapCard } from '../components/cap/cap-card.js';

export const metadata = { title: 'Cap atingido · Lume' };

async function loadCap() {
  const [meRes, capRes] = await Promise.all([
    apiFetch(`/me`),
    apiFetch(`/me/cap`),
  ]);
  if (meRes.status === 401) redirect('/login');
  const me = await meRes.json();
  const cap = capRes.ok ? await capRes.json() : { daysLeft: 0 };
  return { me, cap };
}

export default async function CapPage() {
  const { me, cap } = await loadCap();
  return (
    <>
      <PageShell actions={[{ label: 'Minha conta', href: '/conta' }]}>
        <CapCard daysLeft={cap.daysLeft} marketingInitial={Boolean(me.marketingOptIn)} />
      </PageShell>
      <Footer />
    </>
  );
}
