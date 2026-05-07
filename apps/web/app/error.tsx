'use client';
import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageShell } from './components/page-shell.js';
import { Button } from './components/primitives/button.js';
import { copy } from './lib/copy.js';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('lume route error', error.message);
  }, [error]);
  return (
    <PageShell actions={[]}>
      <p className="lume-rise t-eyebrow">erro</p>
      <h1
        className="lume-rise lume-rise-1 mt-3 t-display-m text-[var(--color-ink)]"
        style={{ textWrap: 'balance' }}
      >
        {copy.error.title}
      </h1>
      <p className="lume-rise lume-rise-2 mt-4 max-w-[52ch] t-body-l text-[var(--color-ink-2)]">
        {copy.error.body}
      </p>
      <div className="lume-rise lume-rise-3 mt-8">
        <Button
          type="button"
          onClick={() => reset()}
          trailing={<ArrowRight size={16} strokeWidth={2.4} />}
        >
          {copy.error.cta}
        </Button>
      </div>
    </PageShell>
  );
}
