import type { ReactNode } from 'react';

export function Microcard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-ink)]/10 bg-[var(--color-cream)]/40 p-5">
      <h3 className="mb-2 font-serif text-lg italic text-[var(--color-ink)]">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">{children}</p>
    </div>
  );
}
