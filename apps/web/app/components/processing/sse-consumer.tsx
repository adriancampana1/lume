'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { RotateCw } from 'lucide-react';
import { Stepper } from './stepper.js';
import { Button } from '../primitives/button.js';
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
          else if (
            e.code === 'http_410' ||
            e.code === 'http_404' ||
            e.code === 'session_files_missing' ||
            e.code === 'session_not_found'
          ) {
            router.push('/upload' as Route);
          } else {
            setError(copy.error.body);
          }
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
        <div className="mt-8">
          <Button
            type="button"
            onClick={() => window.location.reload()}
            trailing={<RotateCw size={16} strokeWidth={2.4} />}
          >
            {copy.error.cta}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
