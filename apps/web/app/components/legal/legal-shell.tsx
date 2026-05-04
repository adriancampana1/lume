import Link from 'next/link';
import { Wordmark } from '../wordmark.js';
import { Footer } from '../landing/footer.js';

export function LegalShell({ title, updatedAt, children }: { title: string; updatedAt: string; children: React.ReactNode }) {
  return (
    <>
      <header className="px-6 pt-10 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="inline-flex">
            <Wordmark size="sm" />
          </Link>
        </div>
      </header>
      <main className="px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif text-4xl italic sm:text-5xl" style={{ fontFamily: 'var(--font-serif)' }}>
            {title}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">Atualizado em {updatedAt}</p>
          <div className="prose-lume mt-10 space-y-6 text-base leading-relaxed text-[var(--color-ink)]">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
