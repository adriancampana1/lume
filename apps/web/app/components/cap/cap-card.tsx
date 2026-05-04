'use client';
import { useState } from 'react';
import { Checkbox } from '../primitives/checkbox.js';
import { copy } from '../../lib/copy.js';

export function CapCard({ daysLeft, marketingInitial }: { daysLeft: number; marketingInitial: boolean }) {
  const [opt, setOpt] = useState(marketingInitial);
  const onChange = async (v: boolean) => {
    setOpt(v);
    await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/me`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ marketingOptIn: v }),
    });
  };
  return (
    <div>
      <h1 className="font-serif text-3xl italic sm:text-5xl" style={{ fontFamily: 'var(--font-serif)' }}>
        {copy.cap.title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[var(--color-ink)]">{copy.cap.body}</p>
      <p className="mt-2 text-base font-medium">{copy.cap.next(daysLeft)}</p>

      <div className="mt-10 rounded-[var(--radius-card)] border border-[var(--color-ink)]/10 p-6">
        <Checkbox checked={opt} onCheckedChange={(v) => onChange(v === true)} label={copy.cap.marketing} />
      </div>

      <a
        href="https://instagram.com/"
        target="_blank"
        rel="noreferrer noopener"
        className="mt-6 inline-flex h-12 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-8 text-base font-medium text-[var(--color-cream)] hover:bg-[var(--color-terracotta)]"
      >
        {copy.cap.follow}
      </a>
    </div>
  );
}
