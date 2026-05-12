'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copy } from '../../lib/copy.js';

export function ShareBlock() {
  const [done, setDone] = useState(false);
  const onCopy = async () => {
    const url = `${window.location.origin}/?utm_source=share`;
    await navigator.clipboard.writeText(url);
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  };
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <p className="t-eyebrow text-[var(--color-ink-3)]">compartilhar</p>
      <p className="mt-2 t-h3 text-[var(--color-ink)]" style={{ textWrap: 'balance' }}>
        {copy.result.shareTitle}
      </p>
      <button
        type="button"
        onClick={onCopy}
        className="mt-5 inline-flex h-11 cursor-pointer items-center gap-2 rounded-[var(--radius-btn)] border border-[var(--color-border-strong)] bg-transparent px-4 t-body-s font-semibold text-[var(--color-ink)] transition-[transform,border-color] duration-[220ms] ease-[var(--ease-out-expo)] hover:-translate-y-px hover:border-[var(--color-border-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
      >
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center transition-transform duration-[260ms] ease-[var(--ease-out-expo)]"
          style={{ transform: done ? 'scale(1.05)' : 'scale(1)' }}
        >
          {done ? <Check size={14} strokeWidth={2.6} /> : <Copy size={14} strokeWidth={2.2} />}
        </span>
        <span>{done ? copy.result.copied : copy.result.copyLink}</span>
      </button>
    </div>
  );
}
