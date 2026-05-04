'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { Stepper } from './stepper.js';
import { streamReport } from '../../lib/api.js';
import { copy } from '../../lib/copy.js';

const STAGE_INDEX: Record<string, number> = {
  extracting: 0,
  anonymizing: 1,
  reconciling: 2,
  categorizing: 3,
  aggregating: 4,
  narrating: 5,
};

export function SseConsumer({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    void streamReport(
      sessionId,
      (e) => {
        if (e.type === 'stage') setCurrent(STAGE_INDEX[e.stage] ?? 0);
        else if (e.type === 'completed') router.push(`/resultado/${e.reportId}` as Route);
        else if (e.type === 'error') {
          if (e.code === 'cap_reached') router.push('/cap' as Route);
          else setError(copy.error.body);
        }
      },
      ctrl.signal,
    );
    return () => ctrl.abort();
  }, [sessionId, router]);

  return (
    <div>
      <Stepper current={current} error={error} />
      {error ? (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-8 text-base font-medium text-[var(--color-cream)] hover:bg-[var(--color-terracotta)]"
        >
          {copy.error.cta}
        </button>
      ) : null}
    </div>
  );
}
