import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Wordmark } from '../../components/wordmark.js';
import { Footer } from '../../components/landing/footer.js';
import { PdfPreview } from '../../components/result/pdf-preview.js';
import { ShareBlock } from '../../components/result/share-block.js';
import { MarketingOptIn } from '../../components/result/marketing-opt-in.js';
import { FollowCta } from '../../components/result/follow-cta.js';
import { copy } from '../../lib/copy.js';
import { headers } from 'next/headers';

async function loadReport(id: string) {
  const h = await headers();
  const cookie = h.get('cookie') ?? '';
  const apiUrl = process.env['API_URL'] ?? 'http://localhost:3001';
  const [reportRes, meRes] = await Promise.all([
    fetch(`${apiUrl}/reports/${id}`, { headers: { cookie }, cache: 'no-store' }),
    fetch(`${apiUrl}/me`, { headers: { cookie }, cache: 'no-store' }),
  ]);
  if (reportRes.status === 404) return null;
  if (!reportRes.ok || !meRes.ok) throw new Error('result_load_failed');
  const report = await reportRes.json();
  const me = await meRes.json();
  return { report, me };
}

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadReport(id);
  if (!data) notFound();

  return (
    <>
      <header className="px-6 pt-10 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="inline-flex">
            <Wordmark size="sm" />
          </Link>
        </div>
      </header>

      <main className="px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1
            className="font-serif text-3xl italic sm:text-5xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {copy.result.title}
          </h1>
          <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
            {copy.result.sentTo(data.me.email)}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`${process.env['NEXT_PUBLIC_API_URL']}/reports/${id}/pdf`}
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-8 text-base font-medium text-[var(--color-cream)] hover:bg-[var(--color-terracotta)]"
            >
              {copy.result.download}
            </a>
          </div>

          <div className="mt-10">
            <PdfPreview reportId={id} />
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <ShareBlock />
            <FollowCta />
          </div>

          <div className="mt-10 rounded-[var(--radius-card)] border border-[var(--color-ink)]/10 p-6">
            <MarketingOptIn initial={Boolean(data.me.marketingOptIn)} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
