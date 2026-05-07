import { copy } from '../../lib/copy.js';

export function WhatShows() {
  const { cards } = copy.landing.whatShows;

  return (
    <section className="relative bg-[var(--color-surface-sunk)] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <header className="lg:col-span-5">
            <span className="t-eyebrow">02 · o que vem no pdf</span>
            <h2
              className="mt-4 t-display-m text-[var(--color-ink)]"
              style={{ textWrap: 'balance' }}
            >
              Sete seções,{' '}
              <span className="relative inline-block whitespace-nowrap rounded-[5px] bg-[var(--color-accent)] px-[8px] py-[2px] text-[var(--color-accent-deep)]">
                na ordem
              </span>{' '}
              em que fariam sentido pra você.
            </h2>
            <p className="mt-5 max-w-[36ch] t-body text-[var(--color-ink-2)]">
              Não é dashboard interativo. É um documento pra ler de uma sentada, guardar e reler
              depois.
            </p>
          </header>

          <ol className="lg:col-span-7 lg:pt-1.5">
            {cards.map((card, i) => (
              <li
                key={card.title}
                className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 border-t border-[var(--color-border)] py-5 first:border-t-0 first:pt-0 sm:gap-x-6"
              >
                <span
                  className="font-mono tabular text-[13px] font-semibold text-[var(--color-ink-3)]"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="t-h3 text-[var(--color-ink)]">{card.title}</h3>
                  <p className="mt-1.5 max-w-[58ch] t-body-s text-[var(--color-ink-2)]">
                    {card.body}
                  </p>
                </div>
                <span className="hidden font-mono tabular text-[12px] text-[var(--color-ink-3)] sm:inline">
                  pág {String((i + 1) * 2).padStart(2, '0')}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
