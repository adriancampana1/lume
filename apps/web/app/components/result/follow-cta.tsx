import { copy } from '../../lib/copy.js';

export function FollowCta() {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-ink)]/10 p-6">
      <p className="font-serif text-xl italic" style={{ fontFamily: 'var(--font-serif)' }}>
        {copy.result.follow.title}
      </p>
      <a
        href="https://instagram.com/"
        target="_blank"
        rel="noreferrer noopener"
        className="mt-4 inline-flex h-11 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-5 text-sm font-medium text-[var(--color-cream)] hover:bg-[var(--color-terracotta)]"
      >
        {copy.result.follow.cta}
      </a>
    </div>
  );
}
