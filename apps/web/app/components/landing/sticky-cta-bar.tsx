'use client';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel');
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry?.isIntersecting),
      { rootMargin: '0px 0px -50% 0px' },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Atalho para começar a análise"
      className="lume-cta-up fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 py-3 backdrop-blur-md sm:hidden"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
    >
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-3">
        <p className="t-body-s text-[var(--color-ink-2)]">
          1 mês <span className="text-[var(--color-ink)]">basta pra começar</span>.
        </p>
        <Link
          href="/upload"
          className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-[var(--radius-btn)] bg-[var(--color-ink)] px-4 t-body-s font-semibold text-[var(--color-ink-inverse)] transition-transform duration-[220ms] ease-[var(--ease-out-expo)] active:scale-[0.985]"
        >
          <span
            aria-hidden="true"
            className="lume-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
          />
          Analisar agora
          <ArrowRight size={14} strokeWidth={2.4} className="transition-transform duration-[320ms] ease-[var(--ease-out-expo)] group-hover:translate-x-[2px]" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
