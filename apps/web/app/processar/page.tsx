'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { Wordmark } from '../components/wordmark.js';
import { SseConsumer } from '../components/processing/sse-consumer.js';
import { copy } from '../lib/copy.js';

export default function ProcessPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  useEffect(() => {
    void fetch(`${process.env['NEXT_PUBLIC_API_URL']}/sessions/active`, { credentials: 'include' })
      .then(async (r) => {
        if (r.status === 401) router.push('/upload' as Route);
        else if (r.ok) {
          const b = (await r.json()) as { sessionId: string };
          setSessionId(b.sessionId);
        } else router.push('/upload' as Route);
      })
      .catch(() => router.push('/upload' as Route));
  }, [router]);

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10 sm:py-16">
      <header className="mx-auto max-w-2xl">
        <Link href="/" className="inline-flex">
          <Wordmark size="sm" />
        </Link>
      </header>
      <section className="mx-auto mt-16 max-w-2xl">
        <h1 className="font-serif text-3xl italic sm:text-5xl" style={{ fontFamily: 'var(--font-serif)' }}>
          {copy.processing.title}
        </h1>
        <p className="mt-3 text-sm text-[var(--color-ink-soft)]">{copy.processing.helper}</p>
        <div className="mt-10">{sessionId ? <SseConsumer sessionId={sessionId} /> : null}</div>
      </section>
    </main>
  );
}
