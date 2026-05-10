import { notFound } from 'next/navigation';
import { Download } from 'lucide-react';
import { apiFetch } from '../../lib/api-server.js';
import { PageShell } from '../../components/page-shell.js';
import { Stepper } from '../../components/primitives/stepper.js';
import { Button } from '../../components/primitives/button.js';
import { Footer } from '../../components/landing/footer.js';
import { ShareBlock } from '../../components/result/share-block.js';
import { MarketingOptIn } from '../../components/result/marketing-opt-in.js';
import { FollowCta } from '../../components/result/follow-cta.js';
import { copy } from '../../lib/copy.js';

const STEPS = [{ label: 'enviar' }, { label: 'analisar' }, { label: 'receber' }];

async function loadReport(id: string) {
  try {
    const [reportRes, meRes] = await Promise.all([
      apiFetch(`/reports/${id}`),
      apiFetch(`/me`),
    ]);
    if (reportRes.status === 404) return null;
    if (!reportRes.ok || !meRes.ok) throw new Error('result_load_failed');
    const report = await reportRes.json();
    const me = await meRes.json();
    return { report, me };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNREFUSED') {
      console.error('Connection refused when connecting to API:', error);
    }
    throw error;
  }
}

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadReport(id);
  if (!data) notFound();

  return (
    <>
      <PageShell contentWidthClass="max-w-[820px]" actions={[{ label: 'Minha conta', href: '/conta' }]}>
        <div className="lume-rise mb-8">
          <Stepper steps={STEPS} current={2} />
        </div>

        <div className="lume-rise lume-rise-1 inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-2.5 pr-3.5 t-eyebrow text-[var(--color-ink-2)]">
          <span className="lume-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          <span>pronto</span>
        </div>

        <h1
          className="lume-rise lume-rise-2 mt-5 t-display-m text-[var(--color-ink)]"
          style={{ textWrap: 'balance' }}
        >
          {copy.result.title}
        </h1>
        <p className="lume-rise lume-rise-3 mt-4 max-w-[58ch] t-body-l text-[var(--color-ink-2)]">
          {copy.result.sentTo(data.me.email)}
        </p>

        <div className="lume-rise lume-rise-4 mt-8">
          <a
            href={`/api/reports/${id}/pdf`}
            className="inline-flex"
          >
            <Button type="button" trailing={<Download size={16} strokeWidth={2.4} />}>
              {copy.result.download}
            </Button>
          </a>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <ShareBlock />
          <FollowCta />
        </div>

        <div className="mt-10 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7">
          <p className="t-eyebrow mb-3">opt-in marketing</p>
          <MarketingOptIn initial={Boolean(data.me.marketingOptIn)} />
        </div>
      </PageShell>

      <Footer />
    </>
  );
}
