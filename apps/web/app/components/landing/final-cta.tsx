import Link from 'next/link';
import type { Route } from 'next';
import { copy } from '../../lib/copy.js';

export function FinalCta() {
  return (
    <section className="px-6 py-20 sm:px-10 sm:py-28 bg-[var(--color-ink)]/[0.03]">
      <div className="mx-auto max-w-3xl text-center">
        <p
          className="mb-8 font-serif text-2xl leading-snug tracking-tight sm:text-3xl"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          {copy.landing.finalCta}
        </p>
        <Link
          href={'/upload' as Route}
          className="inline-flex h-14 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-8 text-lg font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-terracotta)]"
        >
          {copy.landing.primaryCta}
        </Link>
      </div>
    </section>
  );
}
