'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { PageShell } from '../components/page-shell.js';
import { Stepper } from '../components/primitives/stepper.js';
import { SseConsumer } from '../components/processing/sse-consumer.js';
import { copy } from '../lib/copy.js';

const STEPS = [{ label: 'enviar' }, { label: 'analisar' }, { label: 'receber' }];

export default function ProcessPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  useEffect(() => {
    void fetch('/api/sessions/active', { credentials: 'include' })
      .then(async (r) => {
        if (r.status === 401) router.push('/upload' as Route);
        else if (r.ok) {
          const b = (await r.json()) as { sessionId: string; hasOnboarded: boolean };
          if (!b.hasOnboarded) {
            router.push('/onboarding?next=/processar' as Route);
          } else {
            setSessionId(b.sessionId);
          }
        } else router.push('/upload' as Route);
      })
      .catch(() => router.push('/upload' as Route));
  }, [router]);

  return (
    <PageShell actions={[]}>
      <div className="lume-rise mb-8">
        <Stepper steps={STEPS} current={1} />
      </div>

      <div className="lume-rise lume-rise-1 inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-2.5 pr-3.5 t-eyebrow text-[var(--color-ink-2)]">
        <span className="lume-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        <span>em andamento</span>
      </div>

      <h1
        className="lume-rise lume-rise-2 mt-5 t-display-m text-[var(--color-ink)]"
        style={{ textWrap: 'balance' }}
      >
        {copy.processing.title}
      </h1>
      <p className="lume-rise lume-rise-3 mt-4 max-w-[52ch] t-body-l text-[var(--color-ink-2)]">
        {copy.processing.helper}
      </p>

      <div className="lume-rise lume-rise-4 mt-10 rounded-[var(--radius-sheet)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sheet)] sm:p-8">
        {sessionId ? (
          <SseConsumer sessionId={sessionId} />
        ) : (
          <div className="flex items-center gap-3 t-body-s text-[var(--color-ink-3)]">
            <span className="lume-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            <span>conectando…</span>
          </div>
        )}
      </div>

      <p className="lume-rise lume-rise-5 mt-6 t-caption">
        <span className="font-mono">~30s</span> a <span className="font-mono">~1min30</span>
        <span className="mx-2 text-[var(--color-ink-3)]/50">·</span>
        nada é armazenado depois
      </p>
    </PageShell>
  );
}
