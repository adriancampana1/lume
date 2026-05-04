'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { Wordmark } from './components/wordmark.js';
import { copy } from './lib/copy.js';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('lume route error', error.message);
  }, [error]);
  return (
    <main className="min-h-screen px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="inline-flex">
          <Wordmark size="sm" />
        </Link>
        <h1 className="mt-16 font-serif text-3xl italic sm:text-5xl" style={{ fontFamily: 'var(--font-serif)' }}>
          {copy.error.title}
        </h1>
        <p className="mt-3 text-base text-[var(--color-ink-soft)]">{copy.error.body}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-8 text-base font-medium text-[var(--color-cream)] hover:bg-[var(--color-terracotta)]"
        >
          {copy.error.cta}
        </button>
      </div>
    </main>
  );
}
