'use client';
import * as RA from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { copy } from '../../lib/copy.js';

const banks = [
  {
    value: 'itau',
    title: 'Itaú',
    content:
      'No app: Cartões ou Conta corrente → Extrato → escolha o período → Compartilhar → Salvar PDF → envie pra você mesmo.',
  },
  {
    value: 'nubank',
    title: 'Nubank',
    content:
      'No app: toque na conta ou cartão → Histórico → ícone de papel no canto → Exportar → escolha mês → PDF.',
  },
  {
    value: 'inter',
    title: 'Inter',
    content: 'Menu → Extrato → Filtrar mês → Exportar PDF.',
  },
  {
    value: 'bb',
    title: 'Banco do Brasil',
    content: 'Menu → Conta → Extrato → mudar período → Compartilhar → PDF.',
  },
  {
    value: 'bradesco',
    title: 'Bradesco',
    content: 'No app, Conta corrente → Extrato → 3 pontos → Salvar como PDF.',
  },
  {
    value: 'santander',
    title: 'Santander',
    content: 'Conta corrente → Extrato → ícone de download → escolher PDF.',
  },
];

export function BankInstructions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 border-y border-[var(--color-border)] py-4 t-body text-[var(--color-ink)] transition-colors hover:text-[var(--color-ink-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
      >
        <span className="text-left">
          <span className="t-eyebrow mr-2.5 text-[var(--color-ink-3)]">guia</span>
          {copy.upload.bankInstructionsTitle}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className={`shrink-0 text-[var(--color-ink-3)] transition-transform duration-[280ms] ease-[var(--ease-out-expo)] ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open ? (
        <div className="mt-2">
          <RA.Root
            type="single"
            collapsible
            className="divide-y divide-[var(--color-border)] border-b border-[var(--color-border)]"
          >
            {banks.map((b) => (
              <RA.Item key={b.value} value={b.value}>
                <RA.Header>
                  <RA.Trigger className="group flex w-full items-center justify-between gap-3 py-3.5 text-left t-body text-[var(--color-ink)] transition-colors hover:text-[var(--color-ink-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="font-mono tabular text-[11px] text-[var(--color-ink-3)]"
                      >
                        {b.value.padEnd(9, ' ')}
                      </span>
                      <span className="font-medium">{b.title}</span>
                    </span>
                    <ChevronDown
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="shrink-0 text-[var(--color-ink-3)] transition-transform duration-[280ms] ease-[var(--ease-out-expo)] group-data-[state=open]:rotate-180"
                    />
                  </RA.Trigger>
                </RA.Header>
                <RA.Content className="overflow-hidden t-body-s text-[var(--color-ink-2)] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <p className="pb-4 pl-[calc(11px*9+0.75rem)]">{b.content}</p>
                </RA.Content>
              </RA.Item>
            ))}
          </RA.Root>
        </div>
      ) : null}
    </div>
  );
}
