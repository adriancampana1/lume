import Link from 'next/link';
import type { Route } from 'next';
import { Wordmark } from '../wordmark.js';
import { copy } from '../../lib/copy.js';

export function Hero() {
  return (
    <section className="px-6 pt-12 pb-20 sm:px-10 sm:pt-16 sm:pb-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 flex items-center justify-between">
          <Wordmark size="md" />
          <Link
            href={'/upload' as Route}
            className="text-sm text-[var(--color-ink-soft)] underline underline-offset-4 hover:text-[var(--color-terracotta)]"
          >
            Começar
          </Link>
        </div>
        <h1
          className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-6xl"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          A <em className="text-[var(--color-terracotta)]">clareza</em> que faltava
          <br className="hidden sm:block" /> nas suas contas do mês.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
          {copy.brand.tagline}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href={'/upload' as Route}
            className="inline-flex h-14 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-8 text-lg font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-terracotta)]"
          >
            {copy.landing.primaryCta}
          </Link>
          <a
            href="#como-funciona"
            className="inline-flex h-14 items-center justify-center px-4 text-lg font-medium text-[var(--color-ink)] underline underline-offset-[6px] decoration-1 transition-colors hover:decoration-[var(--color-terracotta)] hover:text-[var(--color-terracotta)]"
          >
            {copy.landing.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}
