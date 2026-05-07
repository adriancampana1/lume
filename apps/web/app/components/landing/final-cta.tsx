import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight } from 'lucide-react';
import { copy } from '../../lib/copy.js';
import { Button } from '../primitives/button.js';

export function FinalCta() {
  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <div className="relative overflow-hidden rounded-[var(--radius-sheet)] bg-[var(--color-ink)] px-6 py-14 text-[var(--color-ink-inverse)] sm:px-12 sm:py-20 lg:px-16 lg:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              background:
                'radial-gradient(circle at 85% -10%, var(--color-accent) 0%, transparent 40%)',
            }}
          />

          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-8">
              <span className="t-eyebrow text-[var(--color-ink-inverse)]/60">04 · começar</span>
              <h2
                className="mt-4 t-display-m text-[var(--color-ink-inverse)]"
                style={{ textWrap: 'balance' }}
              >
                Comece com{' '}
                <span className="relative inline-block whitespace-nowrap rounded-[5px] bg-[var(--color-accent)] px-[8px] py-[2px] text-[var(--color-accent-deep)]">
                  um mês
                </span>
                . Pode ser o do banco que você já tem aberto.
              </h2>
              <p className="mt-5 max-w-[44ch] t-body text-[var(--color-ink-inverse)]/70">
                Quando ficar pronto, o PDF chega no seu email. Você descarta a aba, a Lume descarta
                seus dados. Ninguém guarda nada.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-4 lg:items-end">
              <Link href={'/upload' as Route} className="inline-flex w-full sm:w-auto">
                <Button block trailing={<ArrowRight size={16} strokeWidth={2.4} />}>
                  {copy.landing.primaryCta}
                </Button>
              </Link>
              <p className="t-caption text-[var(--color-ink-inverse)]/50">
                <span className="font-mono">~30s</span> a <span className="font-mono">~1min30</span>
                <span className="mx-1.5">·</span>1 a 6 meses
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
