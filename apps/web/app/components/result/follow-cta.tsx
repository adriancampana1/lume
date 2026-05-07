import { ArrowUpRight } from 'lucide-react';
import { copy } from '../../lib/copy.js';

export function FollowCta() {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <p className="t-eyebrow text-[var(--color-ink-3)]">o criador</p>
      <p className="mt-2 t-h3 text-[var(--color-ink)]" style={{ textWrap: 'balance' }}>
        {copy.result.follow.title}
      </p>
      <a
        href="https://instagram.com/"
        target="_blank"
        rel="noreferrer noopener"
        className="group mt-5 inline-flex h-11 items-center gap-2 rounded-[var(--radius-btn)] border border-[var(--color-border-strong)] bg-transparent px-4 t-body-s font-semibold text-[var(--color-ink)] transition-[transform,border-color] duration-[220ms] ease-[var(--ease-out-expo)] hover:-translate-y-px hover:border-[var(--color-border-ink)]"
      >
        <span>{copy.result.follow.cta}</span>
        <ArrowUpRight
          size={14}
          strokeWidth={2.4}
          className="transition-transform duration-[320ms] ease-[var(--ease-out-expo)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
        />
      </a>
    </div>
  );
}
