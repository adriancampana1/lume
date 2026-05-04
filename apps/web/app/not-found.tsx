import Link from 'next/link';
import { Wordmark } from './components/wordmark.js';
import { copy } from './lib/copy.js';

export default function NotFound() {
  return (
    <main className="min-h-screen px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="inline-flex">
          <Wordmark size="sm" />
        </Link>
        <h1 className="mt-16 font-serif text-3xl italic sm:text-5xl" style={{ fontFamily: 'var(--font-serif)' }}>
          {copy.notFound.title}
        </h1>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-8 text-base font-medium text-[var(--color-cream)] hover:bg-[var(--color-terracotta)]"
        >
          {copy.notFound.cta}
        </Link>
      </div>
    </main>
  );
}
