import { copy } from '../../lib/copy.js';

export function WhatShows() {
  const { title, cards } = copy.landing.whatShows;

  return (
    <section className="px-6 py-20 sm:px-10 sm:py-28 bg-[var(--color-ink)]/[0.03]">
      <div className="mx-auto max-w-3xl">
        <h2
          className="mb-12 font-serif text-3xl tracking-tight sm:text-4xl"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          {title}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {cards.map((card, i) => (
            <li
              key={i}
              className="rounded-[var(--radius-card)] border border-[var(--color-ink)]/10 bg-[var(--color-cream)]/40 p-5"
            >
              <h3 className="mb-2 font-serif text-lg italic text-[var(--color-ink)]">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {card.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
