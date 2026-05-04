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
    <div className="rounded-[var(--radius-card)] border border-[var(--color-ink)]/10 bg-[var(--color-cream)]/40 p-6">
      <p className="font-serif text-xl italic" style={{ fontFamily: 'var(--font-serif)' }}>
        {copy.result.shareTitle}
      </p>
      <button
        type="button"
        onClick={onCopy}
        className="mt-4 inline-flex h-11 items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-ink)]/20 px-5 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-ink)]"
      >
        {done ? <Check size={14} /> : <Copy size={14} />}
        {done ? copy.result.copied : copy.result.copyLink}
      </button>
    </div>
  );
}
