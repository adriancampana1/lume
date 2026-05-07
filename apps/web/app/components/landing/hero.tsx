import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight } from 'lucide-react';
import { Wordmark } from '../wordmark.js';
import { Button } from '../primitives/button.js';
import { BancosRow } from './bancos-row.js';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <header className="sticky top-0 z-30 border-b border-transparent bg-[var(--color-bg)]/95 backdrop-blur-[6px] transition-colors">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5 sm:h-16 sm:px-8">
          <Link href="/" aria-label="Lume — início" className="-ml-1 inline-flex items-center px-1">
            <Wordmark size="sm" />
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="#como-funciona"
              className="hidden h-10 items-center rounded-[var(--radius-btn)] px-3 t-body-s font-medium text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-ink)] sm:inline-flex"
            >
              Como funciona
            </a>
            <a
              href="#privacidade"
              className="hidden h-10 items-center rounded-[var(--radius-btn)] px-3 t-body-s font-medium text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-ink)] sm:inline-flex"
            >
              Privacidade
            </a>
            <Link
              href={'/login' as Route}
              className="ml-1 inline-flex h-10 items-center rounded-[var(--radius-btn)] px-3 t-body-s font-medium text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-ink)]"
            >
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1120px] px-5 pt-12 pb-20 sm:px-8 sm:pt-20 sm:pb-28 lg:pt-28 lg:pb-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="lume-rise lume-rise-1 mb-6 inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-2.5 pr-3.5 t-eyebrow text-[var(--color-ink-2)]">
              <span className="lume-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              <span>relatório mensal · gratuito</span>
            </div>

            <h1
              className="lume-rise lume-rise-2 t-display-l text-[var(--color-ink)]"
              style={{ textWrap: 'balance' }}
            >
              A{' '}
              <span className="relative inline-block whitespace-nowrap rounded-[5px] bg-[var(--color-accent)] px-[8px] py-[2px] text-[var(--color-accent-deep)]">
                clareza
              </span>{' '}
              que faltava nas suas contas do mês.
            </h1>

            <p className="lume-rise lume-rise-3 mt-6 max-w-[36ch] t-body-l text-[var(--color-ink-2)]">
              Sobe seu extrato. A Lume lê, organiza e devolve um diagnóstico mensal em PDF. Sem
              cadastro complexo, sem armazenar dado financeiro.
            </p>

            <div className="lume-rise lume-rise-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link href={'/upload' as Route} className="inline-flex">
                <Button trailing={<ArrowRight size={16} strokeWidth={2.4} />}>
                  Gerar minha análise
                </Button>
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex h-[52px] items-center justify-center rounded-[var(--radius-btn)] px-2 t-body font-semibold text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-ink)]"
              >
                Ver como funciona
              </a>
            </div>

            <p className="lume-rise lume-rise-5 mt-5 t-caption">
              <span className="font-mono">~30s</span> a <span className="font-mono">~1min30</span>
              <span className="mx-2 text-[var(--color-ink-3)]/50">·</span>
              PDF chega no seu email
            </p>
          </div>

          <aside className="lume-rise lume-rise-5 lg:col-span-5">
            <div className="rounded-[var(--radius-sheet)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sheet)] sm:p-7">
              <div className="flex items-center justify-between">
                <span className="t-eyebrow">amostra · pág 01</span>
                <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] px-2.5 py-1 t-eyebrow text-[var(--color-accent-deep)]">
                  pronto
                </span>
              </div>

              <div className="mt-5">
                <p className="t-eyebrow text-[var(--color-ink-3)]">
                  resumo do período · abr/2026
                </p>
                <p className="mt-2 t-h2 text-[var(--color-ink)]" style={{ textWrap: 'balance' }}>
                  Você gastou <span className="font-mono tabular text-[var(--color-ink)]">R$ 8.412</span> em abril, 9% acima de março.
                </p>
              </div>

              <ul className="mt-5 flex flex-col gap-3 border-t border-[var(--color-border)] pt-4">
                <SampleRow label="mercado" pct="22%" trend="+6%" />
                <SampleRow label="restaurante" pct="14%" trend="+11%" />
                <SampleRow label="transporte" pct="9%" trend="−3%" />
                <SampleRow label="assinaturas" pct="7%" trend="0%" muted />
              </ul>

              <p className="mt-4 t-caption">
                3 categorias respondem por <span className="font-mono">45%</span> do mês.
              </p>
            </div>

            <div className="mt-3 px-2 t-caption">
              amostra ilustrativa · seu relatório usa seus números reais
            </div>
          </aside>
        </div>

        <div className="lume-rise lume-rise-5 mt-16 sm:mt-24">
          <BancosRow />
        </div>

        <div id="hero-sentinel" aria-hidden="true" className="h-px w-full" />
      </div>
    </section>
  );
}

function SampleRow({
  label,
  pct,
  trend,
  muted,
}: {
  label: string;
  pct: string;
  trend: string;
  muted?: boolean;
}) {
  const trendColor = trend.startsWith('+')
    ? 'text-[var(--color-ink)]'
    : trend.startsWith('−')
      ? 'text-[var(--color-ink-2)]'
      : 'text-[var(--color-ink-3)]';
  return (
    <li className="grid grid-cols-[1fr_auto_auto] items-baseline gap-3 t-body-s">
      <span className={muted ? 'text-[var(--color-ink-3)]' : 'text-[var(--color-ink)]'}>
        {label}
      </span>
      <span className="font-mono tabular text-[var(--color-ink-2)]">{pct}</span>
      <span className={`font-mono tabular text-[12px] ${trendColor}`}>{trend}</span>
    </li>
  );
}
