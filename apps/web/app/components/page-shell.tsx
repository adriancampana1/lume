import Link from 'next/link';
import type { Route } from 'next';
import type { ReactNode } from 'react';
import { Wordmark } from './wordmark.js';

type Action = { label: string; href: string; variant?: 'ghost' | 'subtle' };

type Props = {
  children: ReactNode;
  /** Right-side action(s) in the top bar. */
  actions?: Action[];
  /** Optional max-width class override. Default 'max-w-[640px]'. */
  contentWidthClass?: string;
  /** Extra class on the <main>. */
  className?: string;
};

export function PageShell({
  children,
  actions = [{ label: 'Entrar', href: '/login' }],
  contentWidthClass = 'max-w-[640px]',
  className = '',
}: Props) {
  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <header className="sticky top-0 z-30 border-b border-transparent bg-[var(--color-bg)]/95 backdrop-blur-[6px]">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5 sm:h-16 sm:px-8">
          <Link href="/" aria-label="Lume — início" className="-ml-1 inline-flex items-center px-1">
            <Wordmark size="sm" />
          </Link>
          <nav className="flex items-center gap-1">
            {actions.map((a) => (
              <Link
                key={a.href}
                href={a.href as Route}
                className="inline-flex h-10 items-center rounded-[var(--radius-btn)] px-3 t-body-s font-medium text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-ink)]"
              >
                {a.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main
        className={`mx-auto ${contentWidthClass} px-5 pt-8 pb-24 sm:px-8 sm:pt-12 sm:pb-32 ${className}`}
      >
        {children}
      </main>
    </div>
  );
}
