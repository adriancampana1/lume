'use client';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Checkbox } from '../primitives/checkbox.js';
import { copy } from '../../lib/copy.js';

export function CapCard({
  daysLeft,
  marketingInitial,
}: {
  daysLeft: number;
  marketingInitial: boolean;
}) {
  const [opt, setOpt] = useState(marketingInitial);
  const onChange = async (v: boolean) => {
    setOpt(v);
    await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ marketingOptIn: v }),
    });
  };
  return (
    <div>
      <p className="lume-rise t-eyebrow">limite atingido</p>
      <h1
        className="lume-rise lume-rise-1 mt-3 t-display-m text-[var(--color-ink)]"
        style={{ textWrap: 'balance' }}
      >
        {copy.cap.title}
      </h1>
      <p className="lume-rise lume-rise-2 mt-4 max-w-[58ch] t-body-l text-[var(--color-ink-2)]">
        {copy.cap.body}
      </p>
      <p className="lume-rise lume-rise-3 mt-3 t-body text-[var(--color-ink)]">
        {copy.cap.next(daysLeft)}
      </p>

      <div className="lume-rise lume-rise-4 mt-10 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7">
        <p className="t-eyebrow mb-3">opt-in marketing</p>
        <Checkbox
          checked={opt}
          onCheckedChange={(v) => { void onChange(v === true); }}
          label={copy.cap.marketing}
        />
      </div>

      <div className="lume-rise lume-rise-5 mt-8">
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex h-11 items-center gap-2 rounded-[var(--radius-btn)] border border-[var(--color-border-strong)] bg-transparent px-4 t-body-s font-semibold text-[var(--color-ink)] transition-[transform,border-color] duration-[220ms] ease-[var(--ease-out-expo)] hover:-translate-y-px hover:border-[var(--color-border-ink)]"
        >
          <span>{copy.cap.follow}</span>
          <ArrowUpRight
            size={14}
            strokeWidth={2.4}
            className="transition-transform duration-[320ms] ease-[var(--ease-out-expo)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
          />
        </a>
      </div>
    </div>
  );
}
