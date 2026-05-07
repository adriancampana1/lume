import Link from 'next/link';
import type { Route } from 'next';
import { copy } from '../../lib/copy.js';
import { Wordmark } from '../wordmark.js';

export function Footer() {
  const { links, tagline } = copy.landing.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-sunk)] px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Wordmark size="md" />
            <p className="mt-5 max-w-[36ch] t-body text-[var(--color-ink-2)]">{tagline}</p>
            <p className="mt-3 t-eyebrow">independente · solo · 2026</p>
          </div>

          <nav className="lg:col-span-3" aria-label="Links institucionais">
            <p className="mb-3 t-eyebrow">site</p>
            <ul className="flex flex-col gap-2 t-body-s">
              {links
                .filter((l) => l.href.startsWith('/'))
                .map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href as Route}
                      className="inline-flex items-center text-[var(--color-ink)] underline decoration-[var(--color-border-strong)] decoration-1 underline-offset-[6px] transition-colors hover:decoration-[var(--color-accent)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <nav className="lg:col-span-3" aria-label="Links externos">
            <p className="mb-3 t-eyebrow">criador</p>
            <ul className="flex flex-col gap-2 t-body-s">
              {links
                .filter((l) => !l.href.startsWith('/'))
                .map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[var(--color-ink)] underline decoration-[var(--color-border-strong)] decoration-1 underline-offset-[6px] transition-colors hover:decoration-[var(--color-accent)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-2 border-t border-[var(--color-border)] pt-6 t-caption sm:flex-row sm:items-center">
          <p>© {year} Lume · LGPD compliant</p>
          <p>hospedado no Brasil · sem cookies de rastreamento</p>
        </div>
      </div>
    </footer>
  );
}
