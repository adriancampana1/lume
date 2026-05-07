import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageShell } from './components/page-shell.js';
import { Button } from './components/primitives/button.js';
import { copy } from './lib/copy.js';

export default function NotFound() {
  return (
    <PageShell actions={[]}>
      <p className="lume-rise t-eyebrow">404</p>
      <h1
        className="lume-rise lume-rise-1 mt-3 t-display-m text-[var(--color-ink)]"
        style={{ textWrap: 'balance' }}
      >
        {copy.notFound.title}
      </h1>
      <div className="lume-rise lume-rise-2 mt-8">
        <Link href="/" className="inline-flex">
          <Button type="button" trailing={<ArrowRight size={16} strokeWidth={2.4} />}>
            {copy.notFound.cta}
          </Button>
        </Link>
      </div>
    </PageShell>
  );
}
