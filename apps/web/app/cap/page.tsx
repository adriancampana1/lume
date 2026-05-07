import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { PageShell } from '../components/page-shell.js';
import { Footer } from '../components/landing/footer.js';
import { CapCard } from '../components/cap/cap-card.js';

export const metadata = { title: 'Cap atingido · Lume' };

async function loadCap() {
  const h = await headers();
  const cookie = h.get('cookie') ?? '';
  const apiUrl = process.env['API_URL'] ?? 'http://localhost:3001';
  const [meRes, capRes] = await Promise.all([
    fetch(`${apiUrl}/me`, { headers: { cookie }, cache: 'no-store' }),
    fetch(`${apiUrl}/me/cap`, { headers: { cookie }, cache: 'no-store' }),
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
